from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from app.database import Base

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    organization = Column(String, index=True)
    type = Column(String) # Job, Internship, Event, etc.
    priority = Column(String) # High, Medium, Low
    deadline = Column(String) 
    source_name = Column(String)
    summary = Column(Text)
    url = Column(String)
    saved = Column(Boolean, default=False)
    read = Column(Boolean, default=False)
    date_added = Column(DateTime(timezone=True), server_default=func.now())
