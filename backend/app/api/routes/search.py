from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.api import deps
from app.models.opportunity import Opportunity
from app.models.user import User

router = APIRouter()

@router.get("/")
def search_opportunities(q: str = "", db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_user)):
    if not q:
        return []
    
    search_query = f"%{q}%"
    results = db.query(Opportunity).filter(
        or_(
            Opportunity.title.ilike(search_query),
            Opportunity.summary.ilike(search_query),
            Opportunity.organization.ilike(search_query)
        )
    ).order_by(Opportunity.date_added.desc()).limit(100).all()
    
    return results
