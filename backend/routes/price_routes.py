"""
PRICE PREDICTION SYSTEM - API ROUTES
FastAPI endpoints for commodity price prediction

Endpoints:
- POST /api/prices/predict - Get price predictions
- GET /api/prices/historical/{commodity} - Get historical price data
- GET /api/prices/trends - Get market trends
- GET /api/prices/commodities - List all commodities
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timedelta, date

from database import get_db
from models.price_models import CommodityPrice, PricePrediction, MarketTrend
from ml.price_predictor import PricePredictor

router = APIRouter()

# Initialize ML model
price_predictor = PricePredictor()

# Request/Response schemas
class PricePredictionRequest(BaseModel):
    """Input for price prediction"""
    commodity_name: str = Field(..., description="Commodity name")
    forecast_days: int = Field(30, ge=1, le=365, description="Days to forecast")
    state: Optional[str] = Field(None, description="State/Region")
    market: Optional[str] = Field(None, description="Market name")

class PriceForecast(BaseModel):
    """Price forecast for a specific date"""
    date: str
    predicted_price: float
    lower_bound: float
    upper_bound: float

class PricePredictionResponse(BaseModel):
    """Price prediction results"""
    commodity_name: str
    current_price: float
    forecasts: List[PriceForecast]
    trend: str
    price_change_percentage: float
    recommendation: str
    model_accuracy: float

@router.post("/predict", response_model=PricePredictionResponse)
async def predict_prices(
    request: PricePredictionRequest,
    db: Session = Depends(get_db)
):
    """
    Predict commodity prices using time series forecasting
    Uses XGBoost with historical price data and seasonal patterns
    """
    try:
        # Get historical data
        historical_data = db.query(CommodityPrice)\
            .filter(CommodityPrice.commodity_name == request.commodity_name)\
            .order_by(CommodityPrice.date.desc())\
            .limit(365)\
            .all()
        
        if not historical_data:
            raise HTTPException(status_code=404, detail="No historical data found for commodity")
        
        # Generate predictions
        predictions = price_predictor.predict(
            commodity=request.commodity_name,
            historical_data=historical_data,
            forecast_days=request.forecast_days
        )
        
        # Store predictions in database
        for pred in predictions["forecasts"]:
            prediction_record = PricePrediction(
                commodity_name=request.commodity_name,
                prediction_date=datetime.strptime(pred["date"], "%Y-%m-%d").date(),
                predicted_price=pred["predicted_price"],
                confidence_interval_lower=pred["lower_bound"],
                confidence_interval_upper=pred["upper_bound"],
                model_type="xgboost",
                model_version="1.0",
                forecast_horizon_days=request.forecast_days
            )
            db.add(prediction_record)
        db.commit()
        
        return PricePredictionResponse(**predictions)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.get("/historical/{commodity}")
async def get_historical_prices(
    commodity: str,
    days: int = Query(90, ge=1, le=730),
    db: Session = Depends(get_db)
):
    """Get historical price data for a commodity"""
    cutoff_date = datetime.now().date() - timedelta(days=days)
    
    prices = db.query(CommodityPrice)\
        .filter(
            CommodityPrice.commodity_name == commodity,
            CommodityPrice.date >= cutoff_date
        )\
        .order_by(CommodityPrice.date)\
        .all()
    
    return {
        "commodity": commodity,
        "data": prices,
        "count": len(prices)
    }

@router.get("/trends")
async def get_market_trends(
    commodity: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get market trends and insights"""
    query = db.query(MarketTrend)
    if commodity:
        query = query.filter(MarketTrend.commodity_name == commodity)
    
    trends = query.order_by(MarketTrend.year.desc(), MarketTrend.month.desc()).limit(50).all()
    
    return {"trends": trends, "count": len(trends)}

@router.get("/commodities")
async def list_commodities(db: Session = Depends(get_db)):
    """List all available commodities"""
    commodities = db.query(CommodityPrice.commodity_name)\
        .distinct()\
        .all()
    
    commodity_list = [c[0] for c in commodities]
    
    return {"commodities": commodity_list, "count": len(commodity_list)}
