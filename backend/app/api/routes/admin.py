from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.opportunity import Opportunity
from app.models.source import Source
from app.models.user import User
from app.worker import trigger_all_scrapers

router = APIRouter()

def get_current_superuser(current_user: User = Depends(deps.get_current_active_user)) -> User:
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="The user doesn't have enough privileges")
    return current_user

@router.get("/stats")
def get_stats(db: Session = Depends(deps.get_db), current_user: User = Depends(get_current_superuser)):
    total_opps = db.query(Opportunity).count()
    active_sources = db.query(Source).filter(Source.status == "Active").count()
    total_sources = db.query(Source).count()
    
    # Calculate opportunities scraped today
    from datetime import datetime, timedelta
    today = datetime.utcnow().date()
    opps_today = db.query(Opportunity).filter(Opportunity.date_added >= today).count()
    
    return {
        "total_opportunities": total_opps,
        "opportunities_today": opps_today,
        "active_sources": active_sources,
        "total_sources": total_sources,
        "system_status": "Healthy"
    }

@router.post("/scrapers/trigger")
def trigger_scrapers(current_user: User = Depends(get_current_superuser)):
    # Triggers the Celery task manually
    task = trigger_all_scrapers.delay()
    return {"status": "success", "task_id": task.id, "message": "Scrapers manually triggered"}
