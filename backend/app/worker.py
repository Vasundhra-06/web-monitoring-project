import time
from celery import Celery
from app.core.config import settings
from app.database import SessionLocal
from app.models.opportunity import Opportunity
from app.models.source import Source
from app.scrapers.web import scrape_rss_feed, scrape_html_page

from celery.schedules import crontab
from app.models.notification import Notification

celery_app = Celery(
    "worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

# Setup Celery Beat Schedule
celery_app.conf.beat_schedule = {
    "run-scrapers-every-15-mins": {
        "task": "app.worker.trigger_all_scrapers",
        "schedule": crontab(minute="*/15"),
    }
}
celery_app.conf.timezone = 'UTC'

@celery_app.task
def trigger_all_scrapers():
    """Finds all active sources and queues a scrape task for each."""
    db = SessionLocal()
    try:
        active_sources = db.query(Source).filter(Source.status == "Active").all()
        for source in active_sources:
            fetch_source_task.delay(source.id)
        return {"status": "success", "queued": len(active_sources)}
    finally:
        db.close()

@celery_app.task(acks_late=True)
def test_task(word: str) -> str:
    print(f"Executing background task for: {word}")
    time.sleep(2)
    return f"Processed: {word}"

@celery_app.task
def fetch_source_task(source_id: int):
    """
    Background task to fetch and parse a source, then store opportunities in DB.
    """
    db = SessionLocal()
    try:
        source = db.query(Source).filter(Source.id == source_id).first()
        if not source or source.status != "Active":
            return {"status": "skipped", "reason": "Inactive or not found"}

        print(f"Starting scrape for source: {source.name} ({source.url})")
        
        extracted = []
        if source.type.lower() == "rss":
            extracted = scrape_rss_feed(source.url)
        elif source.type.lower() == "telegram":
            from app.scrapers.telegram import scrape_telegram_channel
            extracted = scrape_telegram_channel(source.url)
        else:
            extracted = scrape_html_page(source.url)
            
        # Process and Save to database
        new_opps = 0
        from app.core.ai import extract_opportunity_data
        
        for raw_data in extracted:
            # Pass raw text through the AI Engine
            # We combine the title and summary for the AI to process
            ai_text_input = f"Title: {raw_data['title']}\n\nContent: {raw_data['summary']}"
            processed_data = extract_opportunity_data(ai_text_input)
            
            # Check for duplicates based on URL
            exists = db.query(Opportunity).filter(Opportunity.url == raw_data["url"]).first()
            if not exists:
                priority = processed_data.get("priority", "Low")
                title = processed_data.get("title", raw_data["title"])
                
                opp = Opportunity(
                    title=title,
                    organization=processed_data.get("organization", "Unknown"),
                    type=processed_data.get("type", "Other"),
                    priority=priority,
                    deadline=processed_data.get("deadline", "N/A"),
                    source_name=source.name,
                    summary=processed_data.get("summary", raw_data["summary"][:500]),
                    url=raw_data["url"]
                )
                db.add(opp)
                new_opps += 1
                
                # Notification Engine: Trigger alert for all new opportunities
                notif = Notification(
                    title=f"New Opportunity: {title}",
                    message=f"New {priority.lower()} priority opportunity detected from {source.name}.",
                    priority=priority
                )
                db.add(notif)
                
        # Update source metadata
        source.updates_today += new_opps
        from sqlalchemy.sql import func
        source.last_scan = func.now()
        
        db.commit()
        return {"status": "success", "found_items": len(extracted), "new_items": new_opps}
        
    except Exception as e:
        print(f"Failed task for source {source_id}: {str(e)}")
        if source:
            source.status = "Error"
            db.commit()
        return {"status": "error", "error": str(e)}
    finally:
        db.close()

