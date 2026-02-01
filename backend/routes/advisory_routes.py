"""
FARMER ADVISORY SYSTEM - API ROUTES
FastAPI endpoints for multilingual AI chatbot using Gemini

Endpoints:
- POST /api/advisory/chat - Send message and get AI response
- POST /api/advisory/session - Create new chat session
- GET /api/advisory/session/{session_id} - Get session history
- GET /api/advisory/languages - Get supported languages
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

from database import get_db
from models.advisory_models import ChatSession, ChatMessage, FarmerQuery
from ai.gemini_advisor import GeminiAdvisor

router = APIRouter()

# Initialize Gemini AI advisor
gemini_advisor = GeminiAdvisor()

# Request/Response schemas
class ChatRequest(BaseModel):
    """Chat message request"""
    session_id: str
    message: str
    language: str = Field("en", description="Language code (en, hi, ta, te, mr, etc.)")

class ChatResponse(BaseModel):
    """Chat message response"""
    session_id: str
    message: str
    response: str
    language: str
    timestamp: datetime
    suggestions: List[str]

class SessionCreateRequest(BaseModel):
    """Create new chat session"""
    farmer_id: Optional[str] = None
    language: str = "en"
    location: Optional[str] = None
    crop_interest: Optional[str] = None
    farm_size: Optional[float] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Send message to AI advisor and get response
    Uses Google Gemini for multilingual agricultural advice
    """
    try:
        # Verify session exists
        session = db.query(ChatSession)\
            .filter(ChatSession.session_id == request.session_id)\
            .first()
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Get chat history for context
        history = db.query(ChatMessage)\
            .filter(ChatMessage.session_id == request.session_id)\
            .order_by(ChatMessage.timestamp)\
            .limit(10)\
            .all()
        
        # Generate AI response using Gemini
        ai_response = await gemini_advisor.generate_response(
            message=request.message,
            language=request.language,
            history=history,
            context={
                "location": session.farmer_location,
                "crop_interest": session.crop_interest
            }
        )
        
        # Store user message
        user_message = ChatMessage(
            session_id=request.session_id,
            role="user",
            content=request.message,
            original_language=request.language,
            timestamp=datetime.utcnow()
        )
        db.add(user_message)
        
        # Store AI response
        ai_message = ChatMessage(
            session_id=request.session_id,
            role="assistant",
            content=ai_response["response"],
            original_language=request.language,
            tokens_used=ai_response.get("tokens_used", 0),
            response_time_ms=ai_response.get("response_time_ms", 0),
            timestamp=datetime.utcnow()
        )
        db.add(ai_message)
        
        # Update session activity
        session.last_activity = datetime.utcnow()
        
        # Log query for analytics
        query_log = FarmerQuery(
            farmer_id=session.farmer_id,
            query_text=request.message,
            query_category=ai_response.get("category", "general"),
            language=request.language,
            response_generated=True,
            location=session.farmer_location
        )
        db.add(query_log)
        
        db.commit()
        
        return ChatResponse(
            session_id=request.session_id,
            message=request.message,
            response=ai_response["response"],
            language=request.language,
            timestamp=datetime.utcnow(),
            suggestions=ai_response.get("suggestions", [])
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/session")
async def create_session(
    request: SessionCreateRequest,
    db: Session = Depends(get_db)
):
    """Create new chat session"""
    session_id = str(uuid.uuid4())
    
    session = ChatSession(
        session_id=session_id,
        farmer_id=request.farmer_id or f"farmer_{uuid.uuid4().hex[:8]}",
        language=request.language,
        farmer_location=request.location,
        crop_interest=request.crop_interest,
        farm_size=request.farm_size
    )
    
    db.add(session)
    db.commit()
    
    return {
        "session_id": session_id,
        "farmer_id": session.farmer_id,
        "language": request.language,
        "created_at": session.started_at
    }

@router.get("/session/{session_id}")
async def get_session_history(
    session_id: str,
    db: Session = Depends(get_db)
):
    """Get chat session history"""
    session = db.query(ChatSession)\
        .filter(ChatSession.session_id == session_id)\
        .first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    messages = db.query(ChatMessage)\
        .filter(ChatMessage.session_id == session_id)\
        .order_by(ChatMessage.timestamp)\
        .all()
    
    return {
        "session": session,
        "messages": messages,
        "message_count": len(messages)
    }

@router.get("/languages")
async def get_supported_languages():
    """Get list of supported languages"""
    return {
        "languages": [
            {"code": "en", "name": "English"},
            {"code": "hi", "name": "Hindi (हिंदी)"},
            {"code": "ta", "name": "Tamil (தமிழ்)"},
            {"code": "te", "name": "Telugu (తెలుగు)"},
            {"code": "mr", "name": "Marathi (मराठी)"},
            {"code": "bn", "name": "Bengali (বাংলা)"},
            {"code": "gu", "name": "Gujarati (ગુજરાતી)"},
            {"code": "kn", "name": "Kannada (ಕನ್ನಡ)"},
            {"code": "pa", "name": "Punjabi (ਪੰਜਾਬੀ)"},
        ]
    }
