import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any
import datetime

def scrape_rss_feed(url: str) -> List[Dict[str, Any]]:
    """
    Fetches an RSS feed and parses its items.
    """
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, features="xml")
        items = soup.findAll('item')
        
        results = []
        for item in items:
            title = item.find('title').text if item.find('title') else 'No Title'
            link = item.find('link').text if item.find('link') else url
            description = item.find('description').text if item.find('description') else ''
            
            # Simple heuristic for type
            opp_type = "Job" if "job" in title.lower() or "hiring" in title.lower() else "Article"
            
            results.append({
                "title": title,
                "organization": "Extracted via RSS", # Will be enhanced in Phase 4 (AI Engine)
                "type": opp_type,
                "priority": "Medium",
                "deadline": "N/A",
                "source_name": url,
                "summary": description[:500], # Store first 500 chars as raw summary
                "url": link,
                "date_added": datetime.datetime.utcnow().isoformat()
            })
            
        return results
    except Exception as e:
        print(f"Error scraping RSS {url}: {str(e)}")
        return []

def scrape_html_page(url: str, container_selector: str = None) -> List[Dict[str, Any]]:
    """
    Fetches a generic HTML page and tries to extract opportunity data.
    If container_selector is provided, it extracts text from that area.
    Otherwise, it fetches all paragraphs.
    """
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # This is a very generic fallback scraper.
        # In production, specific parsers for Greenhouse, Lever, Workday are used.
        content = soup.find(container_selector).text if container_selector and soup.find(container_selector) else soup.text
        
        # We will just return the raw text block, Phase 4 AI Engine will extract structured data from it.
        return [{
            "title": soup.title.text if soup.title else 'Extracted Web Page',
            "organization": "Unknown",
            "type": "Uncategorized",
            "priority": "Low",
            "deadline": "N/A",
            "source_name": url,
            "summary": content[:1000], # Send raw text to AI later
            "url": url,
            "date_added": datetime.datetime.utcnow().isoformat()
        }]
    except Exception as e:
        print(f"Error scraping HTML {url}: {str(e)}")
        return []
