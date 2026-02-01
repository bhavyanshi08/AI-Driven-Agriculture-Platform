"""
FARMER ADVISORY SYSTEM - DATABASE MODELS
SQLAlchemy models for AI advisory chatbot
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from datetime import datetime
from database import Base

class ChatSession(Base):
    """
    Store chat sessions with farmers
    """
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    farmer_id = Column(String, index=True)
    language = Column(String, default="en")  # en, hi, ta, te, mr, etc.
    
    started_at = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Context
    farmer_location = Column(String)
    crop_interest = Column(String)
    farm_size = Column(Float)

class ChatMessage(Base):
    """
    Store individual chat messages
    """
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    
    # Message content
    role = Column(String)  # user, assistant, system
    content = Column(Text)
    original_language = Column(String)
    translated_content = Column(Text)
    
    # Metadata
    timestamp = Column(DateTime, default=datetime.utcnow)
    tokens_used = Column(Integer)
    response_time_ms = Column(Integer)
    
class FarmerQuery(Base):
    """
    Aggregate farmer queries for analytics
    """
    __tablename__ = "farmer_queries"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(String, index=True)
    query_text = Column(Text)
    query_category = Column(String)  # pest_control, fertilizer, weather, market, etc.
    language = Column(String)
    
    # Response info
    response_generated = Column(Boolean)
    satisfaction_score = Column(Integer)  # 1-5 rating
    
    created_at = Column(DateTime, default=datetime.utcnow)
    location = Column(String)
