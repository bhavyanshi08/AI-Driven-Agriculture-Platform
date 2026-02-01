"""
CROP RECOMMENDATION SYSTEM - DATABASE MODELS
SQLAlchemy models for crop recommendation data
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from datetime import datetime
from database import Base

class CropRecommendation(Base):
    """
    Store crop recommendation requests and results
    """
    __tablename__ = "crop_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(String, index=True)
    
    # Input parameters
    nitrogen = Column(Float)
    phosphorus = Column(Float)
    potassium = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    ph = Column(Float)
    rainfall = Column(Float)
    soil_type = Column(String)
    state = Column(String)
    
    # Prediction results
    recommended_crop = Column(String)
    confidence_score = Column(Float)
    alternative_crops = Column(JSON)  # Store as JSON array
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    model_version = Column(String, default="1.0")

class CropDatabase(Base):
    """
    Reference data for supported crops
    """
    __tablename__ = "crop_database"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String, unique=True, index=True)
    crop_type = Column(String)  # cereal, vegetable, fruit, etc.
    
    # Ideal growing conditions
    ideal_n_min = Column(Float)
    ideal_n_max = Column(Float)
    ideal_p_min = Column(Float)
    ideal_p_max = Column(Float)
    ideal_k_min = Column(Float)
    ideal_k_max = Column(Float)
    ideal_temp_min = Column(Float)
    ideal_temp_max = Column(Float)
    ideal_humidity_min = Column(Float)
    ideal_humidity_max = Column(Float)
    ideal_ph_min = Column(Float)
    ideal_ph_max = Column(Float)
    ideal_rainfall_min = Column(Float)
    ideal_rainfall_max = Column(Float)
    
    growing_season = Column(String)
    duration_days = Column(Integer)
    market_price_avg = Column(Float)
    description = Column(String)
