from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.opportunity import Opportunity
from app.models.user import User

router = APIRouter()

@router.get("/")
def get_opportunities(db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_user)):
    return db.query(Opportunity).order_by(Opportunity.date_added.desc()).all()

@router.put("/{opp_id}/save")
def toggle_save(opp_id: int, db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_user)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    opp.saved = not opp.saved
    db.commit()
    db.refresh(opp)
    return opp
