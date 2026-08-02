from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.models.source import Source
from app.models.user import User

router = APIRouter()

@router.get("/")
def get_sources(db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_user)):
    return db.query(Source).all()

@router.post("/")
def create_source(source_in: dict, db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_user)):
    source = Source(
        name=source_in["name"],
        type=source_in["type"],
        url=source_in["url"]
    )
    db.add(source)
    db.commit()
    db.refresh(source)
    return source

@router.put("/{source_id}/toggle")
def toggle_source(source_id: int, db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_user)):
    source = db.query(Source).filter(Source.id == source_id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    
    source.status = "Paused" if source.status == "Active" else "Active"
    db.commit()
    db.refresh(source)
    return source

@router.delete("/{source_id}")
def delete_source(source_id: int, db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_user)):
    source = db.query(Source).filter(Source.id == source_id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    
    db.delete(source)
    db.commit()
    return {"message": "Source deleted successfully"}
