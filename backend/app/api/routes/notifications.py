from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.notification import Notification
from app.models.user import User

router = APIRouter()

@router.get("/")
def get_notifications(db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_user)):
    return db.query(Notification).order_by(Notification.timestamp.desc()).limit(50).all()

@router.put("/{notif_id}/read")
def mark_read(notif_id: int, db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_user)):
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if notif:
        notif.read = True
        db.commit()
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Notification not found")

@router.delete("/clear")
def clear_all_notifications(db: Session = Depends(deps.get_db), current_user: User = Depends(deps.get_current_active_user)):
    db.query(Notification).delete()
    db.commit()
    return {"status": "success"}
