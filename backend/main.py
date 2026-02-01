"""
AGRITECH AI PLATFORM - FASTAPI BACKEND
Main API Server

This is the main FastAPI application file.
Copy this entire backend folder to your local machine and run:

    pip install -r requirements.txt
    uvicorn main:app --reload

The server will start at http://localhost:8000
API documentation available at http://localhost:8000/docs

ARCHITECTURE:
- FastAPI for REST APIs
- SQLAlchemy for database ORM
- scikit-learn/XGBoost for ML models
- Google Gemini for GenAI
- CORS enabled for frontend integration
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn

from database import get_db, engine, Base
from models import crop_models, price_models, advisory_models
from routes import crop_routes, price_routes, advisory_routes, government_routes

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="AgriTech AI Platform API",
    description="AI-driven agriculture platform with ML and GenAI capabilities",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration - Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "AgriTech AI Platform API",
        "version": "1.0.0",
        "status": "running",
        "modules": [
            "Crop Recommendation System",
            "Price Prediction System",
            "Farmer Advisory (Gemini AI)",
            "Government Analytics Dashboard"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

# Include routers for each module
app.include_router(crop_routes.router, prefix="/api/crops", tags=["Crop Recommendation"])
app.include_router(price_routes.router, prefix="/api/prices", tags=["Price Prediction"])
app.include_router(advisory_routes.router, prefix="/api/advisory", tags=["Farmer Advisory"])
app.include_router(government_routes.router, prefix="/api/government", tags=["Government Dashboard"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
