"""
GOVERNMENT ANALYTICS DASHBOARD - API ROUTES
FastAPI endpoints for government intervention and analytics

Endpoints:
- GET /api/government/analytics - Overall agriculture analytics
- GET /api/government/regions - Regional analysis
- GET /api/government/alerts - Critical alerts and interventions needed
- POST /api/government/intervention - Record intervention action
- GET /api/government/trends - Trend analysis
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime, timedelta
from sqlalchemy import func

from database import get_db
from models.crop_models import CropRecommendation
from models.price_models import CommodityPrice, MarketTrend
from models.advisory_models import FarmerQuery

router = APIRouter()

class InterventionRequest(BaseModel):
    """Government intervention record"""
    region: str
    intervention_type: str
    description: str
    budget_allocated: float
    crops_affected: List[str]

@router.get("/analytics")
async def get_analytics(db: Session = Depends(get_db)):
    """
    Get comprehensive agriculture analytics
    - Total farmers using platform
    - Crop recommendations statistics
    - Price trends
    - Common farmer queries
    """
    try:
        # Get date range
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        # Total farmers
        total_farmers = db.query(func.count(func.distinct(CropRecommendation.farmer_id))).scalar()
        
        # Crop recommendations
        total_recommendations = db.query(func.count(CropRecommendation.id)).scalar()
        recent_recommendations = db.query(func.count(CropRecommendation.id))\
            .filter(CropRecommendation.created_at >= thirty_days_ago)\
            .scalar()
        
        # Top recommended crops
        top_crops = db.query(
            CropRecommendation.recommended_crop,
            func.count(CropRecommendation.id).label('count')
        ).group_by(CropRecommendation.recommended_crop)\
         .order_by(func.count(CropRecommendation.id).desc())\
         .limit(10)\
         .all()
        
        # Price volatility analysis
        price_data = db.query(CommodityPrice)\
            .filter(CommodityPrice.date >= thirty_days_ago.date())\
            .all()
        
        # Farmer queries analysis
        total_queries = db.query(func.count(FarmerQuery.id)).scalar()
        query_categories = db.query(
            FarmerQuery.query_category,
            func.count(FarmerQuery.id).label('count')
        ).group_by(FarmerQuery.query_category)\
         .order_by(func.count(FarmerQuery.id).desc())\
         .limit(10)\
         .all()
        
        # Regional distribution
        regional_data = db.query(
            CropRecommendation.state,
            func.count(CropRecommendation.id).label('count')
        ).filter(CropRecommendation.state.isnot(None))\
         .group_by(CropRecommendation.state)\
         .order_by(func.count(CropRecommendation.id).desc())\
         .limit(15)\
         .all()
        
        return {
            "overview": {
                "total_farmers": total_farmers or 0,
                "total_recommendations": total_recommendations or 0,
                "recent_recommendations": recent_recommendations or 0,
                "total_queries": total_queries or 0,
                "platform_adoption_rate": "87.5%"  # Mock data
            },
            "top_crops": [{"crop": crop, "count": count} for crop, count in top_crops],
            "query_categories": [{"category": cat or "general", "count": count} for cat, count in query_categories],
            "regional_distribution": [{"state": state or "Unknown", "count": count} for state, count in regional_data],
            "price_volatility": {
                "high_volatility_commodities": ["Onion", "Tomato", "Potato"],
                "stable_commodities": ["Rice", "Wheat", "Maize"]
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics failed: {str(e)}")

@router.get("/regions")
async def get_regional_analysis(
    state: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get detailed regional analysis"""
    query = db.query(CropRecommendation)
    
    if state:
        query = query.filter(CropRecommendation.state == state)
    
    recommendations = query.all()
    
    if not recommendations:
        return {
            "state": state,
            "data": [],
            "message": "No data available for this region"
        }
    
    # Aggregate data
    crop_distribution = {}
    soil_health = {"avg_n": 0, "avg_p": 0, "avg_k": 0, "avg_ph": 0}
    
    for rec in recommendations:
        crop = rec.recommended_crop
        crop_distribution[crop] = crop_distribution.get(crop, 0) + 1
        
        soil_health["avg_n"] += rec.nitrogen
        soil_health["avg_p"] += rec.phosphorus
        soil_health["avg_k"] += rec.potassium
        soil_health["avg_ph"] += rec.ph
    
    count = len(recommendations)
    for key in soil_health:
        soil_health[key] = round(soil_health[key] / count, 2)
    
    return {
        "state": state,
        "total_farmers": count,
        "crop_distribution": crop_distribution,
        "soil_health_average": soil_health,
        "recommendations": "Focus on soil enrichment programs"
    }

@router.get("/alerts")
async def get_critical_alerts(db: Session = Depends(get_db)):
    """Get critical alerts requiring government intervention"""
    alerts = [
        {
            "id": 1,
            "severity": "high",
            "type": "price_volatility",
            "commodity": "Onion",
            "message": "Onion prices increased by 45% in last 7 days",
            "affected_regions": ["Maharashtra", "Karnataka"],
            "recommendation": "Consider price stabilization measures",
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "id": 2,
            "severity": "medium",
            "type": "pest_outbreak",
            "commodity": "Cotton",
            "message": "High volume of pest control queries from Punjab",
            "affected_regions": ["Punjab", "Haryana"],
            "recommendation": "Deploy agricultural extension services",
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "id": 3,
            "severity": "high",
            "type": "soil_health",
            "message": "Low nitrogen levels detected in 60% of samples from Gujarat",
            "affected_regions": ["Gujarat"],
            "recommendation": "Subsidize nitrogen fertilizers",
            "created_at": datetime.utcnow().isoformat()
        }
    ]
    
    return {"alerts": alerts, "count": len(alerts)}

@router.post("/intervention")
async def record_intervention(
    request: InterventionRequest,
    db: Session = Depends(get_db)
):
    """Record government intervention action"""
    # In production, this would store in a separate InterventionLog table
    return {
        "status": "success",
        "message": "Intervention recorded successfully",
        "intervention_id": f"INT_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        "data": request.dict()
    }

@router.get("/trends")
async def get_trends(
    metric: str = "crop_adoption",
    period: str = "monthly",
    db: Session = Depends(get_db)
):
    """Get trend analysis for various metrics"""
    # Mock trend data
    trends = {
        "crop_adoption": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            "data": [120, 145, 168, 192, 210, 245],
            "growth_rate": "+15.2%"
        },
        "platform_usage": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            "data": [850, 920, 1050, 1180, 1320, 1500],
            "growth_rate": "+12.8%"
        },
        "farmer_satisfaction": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            "data": [78, 81, 83, 85, 87, 89],
            "growth_rate": "+2.3%"
        }
    }
    
    return {
        "metric": metric,
        "period": period,
        "trend": trends.get(metric, trends["crop_adoption"])
    }
