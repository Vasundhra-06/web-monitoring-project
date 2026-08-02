from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum

class SourceType(str, enum.Enum):
    WEBSITE = "Website"
    TELEGRAM = "Telegram"
    RSS = "RSS"
    NEWS = "News"
    GITHUB = "GitHub"
    YOUTUBE = "YouTube"
    CUSTOM_API = "Custom API"

class SourceStatus(str, enum.Enum):
    ACTIVE = "Active"
    PAUSED = "Paused"
    ERROR = "Error"

class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    type = Column(String, nullable=False)
    url = Column(String, nullable=False)
    status = Column(String, default=SourceStatus.ACTIVE.value)
    last_scan = Column(DateTime(timezone=True), nullable=True)
    updates_today = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
