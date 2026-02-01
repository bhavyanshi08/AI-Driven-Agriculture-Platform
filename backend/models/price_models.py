"""
PRICE PREDICTION SYSTEM - DATABASE MODELS
SQLAlchemy models for commodity price prediction
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Date, JSON
from datetime import datetime
from database import Base

class CommodityPrice(Base):
    """
    Historical commodity price data
    """
    __tablename__ = "commodity_prices"

    id = Column(Integer, primary_key=True, index=True)
    commodity_name = Column(String, index=True)
    date = Column(Date, index=True)
    
    # Price data
    price = Column(Float)  # Price per quintal
    market = Column(String)
    state = Column(String)
    district = Column(String)
    
    # Market indicators
    arrival_quantity = Column(Float)  # Quantity arrived in market (quintals)
    min_price = Column(Float)
    max_price = Column(Float)
    modal_price = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)

class PricePrediction(Base):
    """
    Store price predictions
    """
    __tablename__ = "price_predictions"

    id = Column(Integer, primary_key=True, index=True)
    commodity_name = Column(String, index=True)
    prediction_date = Column(Date)
    
    # Prediction results
    predicted_price = Column(Float)
    confidence_interval_lower = Column(Float)
    confidence_interval_upper = Column(Float)
    
    # Model info
    model_type = Column(String)  # xgboost, random_forest, etc.
    model_version = Column(String)
    features_used = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    forecast_horizon_days = Column(Integer)  # How many days ahead

class MarketTrend(Base):
    """
    Aggregate market trends and insights
    """
    __tablename__ = "market_trends"

    id = Column(Integer, primary_key=True, index=True)
    commodity_name = Column(String, index=True)
    month = Column(String)
    year = Column(Integer)
    
    avg_price = Column(Float)
    price_volatility = Column(Float)
    trend_direction = Column(String)  # increasing, decreasing, stable
    seasonal_factor = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)
