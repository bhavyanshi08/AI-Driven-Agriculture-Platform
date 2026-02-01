"""
CROP RECOMMENDATION SYSTEM - API ROUTES
FastAPI endpoints for crop recommendation

Endpoints:
- POST /api/crops/recommend - Get crop recommendations
- GET /api/crops/database - Get crop information database
- GET /api/crops/history/{farmer_id} - Get farmer's recommendation history
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

from database import get_db
from models.crop_models import CropRecommendation, CropDatabase
from ml.crop_predictor import CropPredictor

router = APIRouter()

# Initialize ML model (load pre-trained model)
crop_predictor = CropPredictor()

# Request/Response schemas
class CropRecommendationRequest(BaseModel):
    """Input parameters for crop recommendation"""
    nitrogen: float = Field(..., ge=0, le=150, description="Nitrogen content (kg/ha)")
    phosphorus: float = Field(..., ge=0, le=150, description="Phosphorus content (kg/ha)")
    potassium: float = Field(..., ge=0, le=250, description="Potassium content (kg/ha)")
    temperature: float = Field(..., ge=0, le=50, description="Temperature (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Humidity (%)")
    ph: float = Field(..., ge=0, le=14, description="Soil pH")
    rainfall: float = Field(..., ge=0, le=500, description="Rainfall (mm)")
    soil_type: Optional[str] = Field(None, description="Soil type")
    state: Optional[str] = Field(None, description="State/Region")
    farmer_id: Optional[str] = Field(None, description="Farmer ID")

class CropRecommendationResponse(BaseModel):
    """Crop recommendation results"""
    recommended_crop: str
    confidence_score: float
    alternative_crops: List[dict]
    reasoning: str
    ideal_conditions: dict
    expected_yield: str
    market_potential: str

@router.post("/recommend", response_model=CropRecommendationResponse)
async def recommend_crop(
    request: CropRecommendationRequest,
    db: Session = Depends(get_db)
):
    """
    Get crop recommendation based on soil and climate parameters
    Uses trained ML model (Random Forest / XGBoost)
    """
    try:
        # Prepare features for ML model
        features = [
            request.nitrogen,
            request.phosphorus,
            request.potassium,
            request.temperature,
            request.humidity,
            request.ph,
            request.rainfall
        ]
        
        # Get prediction from ML model
        prediction = crop_predictor.predict(features)
        
        # Store in database
        recommendation = CropRecommendation(
            farmer_id=request.farmer_id or "anonymous",
            nitrogen=request.nitrogen,
            phosphorus=request.phosphorus,
            potassium=request.potassium,
            temperature=request.temperature,
            humidity=request.humidity,
            ph=request.ph,
            rainfall=request.rainfall,
            soil_type=request.soil_type,
            state=request.state,
            recommended_crop=prediction["crop"],
            confidence_score=prediction["confidence"],
            alternative_crops=prediction["alternatives"]
        )
        db.add(recommendation)
        db.commit()
        
        return CropRecommendationResponse(
            recommended_crop=prediction["crop"],
            confidence_score=prediction["confidence"],
            alternative_crops=prediction["alternatives"],
            reasoning=prediction["reasoning"],
            ideal_conditions=prediction["ideal_conditions"],
            expected_yield=prediction["expected_yield"],
            market_potential=prediction["market_potential"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.get("/database")
async def get_crop_database(
    crop_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get crop information database"""
    query = db.query(CropDatabase)
    if crop_type:
        query = query.filter(CropDatabase.crop_type == crop_type)
    crops = query.all()
    return {"crops": crops, "total": len(crops)}

@router.get("/history/{farmer_id}")
async def get_farmer_history(
    farmer_id: str,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get farmer's recommendation history"""
    recommendations = db.query(CropRecommendation)\
        .filter(CropRecommendation.farmer_id == farmer_id)\
        .order_by(CropRecommendation.created_at.desc())\
        .limit(limit)\
        .all()
    return {"recommendations": recommendations, "count": len(recommendations)}
