# 📡 AGRITECH AI PLATFORM - API CONTRACT

Complete API specification for all endpoints.

---

## Base URL

**Development**: `http://localhost:8000/api`  
**Production**: `https://your-domain.com/api`

---

## Authentication

Currently no authentication required for demo.  
For production, implement JWT tokens:

```
Headers:
  Authorization: Bearer <token>
```

---

## 1. CROP RECOMMENDATION API

### POST /crops/recommend

Get ML-powered crop recommendations based on soil and climate data.

**Request Body**:
```json
{
  "nitrogen": 90.0,          // Required: 0-150 kg/ha
  "phosphorus": 42.0,        // Required: 0-150 kg/ha
  "potassium": 43.0,         // Required: 0-250 kg/ha
  "temperature": 28.0,       // Required: 0-50 °C
  "humidity": 80.0,          // Required: 0-100 %
  "ph": 6.5,                 // Required: 0-14
  "rainfall": 200.0,         // Required: 0-500 mm
  "soil_type": "loamy",      // Optional: string
  "state": "punjab",         // Optional: string
  "farmer_id": "F12345"      // Optional: string
}
```

**Response** (200 OK):
```json
{
  "recommended_crop": "Rice",
  "confidence_score": 0.89,
  "alternative_crops": [
    {
      "crop": "Wheat",
      "confidence": 0.75,
      "reason": "Good alternative for winter season"
    },
    {
      "crop": "Maize",
      "confidence": 0.68,
      "reason": "Suitable for similar soil conditions"
    }
  ],
  "reasoning": "Based on soil parameters (N:90, P:42, K:43, pH:6.5) and climate conditions (Temp:28°C, Humidity:80%, Rainfall:200mm), Rice is recommended as it thrives in these conditions.",
  "ideal_conditions": "High rainfall, warm temperature, pH 5.5-7.0",
  "expected_yield": "4-6 tons/hectare",
  "market_potential": "High demand, stable prices"
}
```

**Error Responses**:
- `400`: Invalid input parameters
- `500`: ML model prediction failed

---

### GET /crops/database

Get information about available crops.

**Query Parameters**:
- `crop_type` (optional): Filter by type (cereal, vegetable, fruit)

**Response** (200 OK):
```json
{
  "crops": [
    {
      "id": 1,
      "crop_name": "Rice",
      "crop_type": "cereal",
      "ideal_n_min": 80,
      "ideal_n_max": 100,
      "growing_season": "Kharif",
      "duration_days": 120,
      "market_price_avg": 2800
    }
  ],
  "total": 15
}
```

---

### GET /crops/history/{farmer_id}

Get farmer's recommendation history.

**Path Parameters**:
- `farmer_id`: Farmer identifier

**Query Parameters**:
- `limit` (optional): Number of records (default: 10)

**Response** (200 OK):
```json
{
  "recommendations": [
    {
      "id": 1,
      "nitrogen": 90,
      "phosphorus": 42,
      "recommended_crop": "Rice",
      "confidence_score": 0.89,
      "created_at": "2026-02-01T10:30:00Z"
    }
  ],
  "count": 5
}
```

---

## 2. PRICE PREDICTION API

### POST /prices/predict

Forecast commodity prices using time series ML.

**Request Body**:
```json
{
  "commodity_name": "Rice",     // Required: commodity name
  "forecast_days": 30,          // Required: 1-365 days
  "state": "Punjab",            // Optional: state name
  "market": "Delhi"             // Optional: market name
}
```

**Response** (200 OK):
```json
{
  "commodity_name": "Rice",
  "current_price": 2800.0,
  "forecasts": [
    {
      "date": "2026-02-02",
      "predicted_price": 2820.0,
      "lower_bound": 2538.0,
      "upper_bound": 3102.0
    },
    {
      "date": "2026-02-03",
      "predicted_price": 2835.0,
      "lower_bound": 2551.5,
      "upper_bound": 3118.5
    }
  ],
  "trend": "increasing",
  "price_change_percentage": 5.2,
  "recommendation": "Consider selling - prices expected to rise",
  "model_accuracy": 0.85
}
```

**Error Responses**:
- `404`: No historical data for commodity
- `500`: Prediction model failed

---

### GET /prices/historical/{commodity}

Get historical price data.

**Path Parameters**:
- `commodity`: Commodity name

**Query Parameters**:
- `days` (optional): Number of days (default: 90, max: 730)

**Response** (200 OK):
```json
{
  "commodity": "Rice",
  "data": [
    {
      "date": "2026-01-01",
      "price": 2800.0,
      "market": "Delhi",
      "state": "Delhi",
      "arrival_quantity": 1500.0,
      "min_price": 2750.0,
      "max_price": 2850.0
    }
  ],
  "count": 90
}
```

---

### GET /prices/trends

Get market trend analysis.

**Query Parameters**:
- `commodity` (optional): Filter by commodity

**Response** (200 OK):
```json
{
  "trends": [
    {
      "commodity_name": "Rice",
      "month": "January",
      "year": 2026,
      "avg_price": 2800.0,
      "price_volatility": 0.05,
      "trend_direction": "stable",
      "seasonal_factor": 1.02
    }
  ],
  "count": 50
}
```

---

### GET /prices/commodities

List all available commodities.

**Response** (200 OK):
```json
{
  "commodities": [
    "Rice",
    "Wheat",
    "Maize",
    "Cotton",
    "Onion",
    "Tomato",
    "Potato"
  ],
  "count": 7
}
```

---

## 3. FARMER ADVISORY API

### POST /advisory/session

Create a new chat session.

**Request Body**:
```json
{
  "farmer_id": "F12345",       // Optional
  "language": "en",            // Required: language code
  "location": "Punjab",        // Optional
  "crop_interest": "Rice",     // Optional
  "farm_size": 5.5             // Optional: in hectares
}
```

**Response** (200 OK):
```json
{
  "session_id": "uuid-string",
  "farmer_id": "F12345",
  "language": "en",
  "created_at": "2026-02-01T10:30:00Z"
}
```

---

### POST /advisory/chat

Send message and get AI response.

**Request Body**:
```json
{
  "session_id": "uuid-string",        // Required
  "message": "How to control pests?", // Required
  "language": "en"                    // Required
}
```

**Response** (200 OK):
```json
{
  "session_id": "uuid-string",
  "message": "How to control pests?",
  "response": "For pest control, I recommend using neem oil spray as a natural solution. Mix 5ml neem oil with 1 liter of water and spray on affected plants early morning or evening. For severe infestations, you can use approved pesticides like Imidacloprid. Always follow safety guidelines.",
  "language": "en",
  "timestamp": "2026-02-01T10:31:00Z",
  "suggestions": [
    "What organic pest control methods are available?",
    "How to identify pest attacks early?",
    "Which pesticides are safe to use?"
  ]
}
```

**Error Responses**:
- `404`: Session not found
- `500`: AI generation failed

---

### GET /advisory/session/{session_id}

Get chat session history.

**Path Parameters**:
- `session_id`: Session identifier

**Response** (200 OK):
```json
{
  "session": {
    "session_id": "uuid-string",
    "farmer_id": "F12345",
    "language": "en",
    "started_at": "2026-02-01T10:30:00Z",
    "last_activity": "2026-02-01T10:35:00Z",
    "is_active": true
  },
  "messages": [
    {
      "role": "user",
      "content": "How to control pests?",
      "timestamp": "2026-02-01T10:31:00Z"
    },
    {
      "role": "assistant",
      "content": "For pest control...",
      "timestamp": "2026-02-01T10:31:05Z"
    }
  ],
  "message_count": 4
}
```

---

### GET /advisory/languages

Get supported languages.

**Response** (200 OK):
```json
{
  "languages": [
    {
      "code": "en",
      "name": "English"
    },
    {
      "code": "hi",
      "name": "Hindi (हिंदी)"
    },
    {
      "code": "ta",
      "name": "Tamil (தமிழ்)"
    },
    {
      "code": "te",
      "name": "Telugu (తెలుగు)"
    },
    {
      "code": "mr",
      "name": "Marathi (मराठी)"
    },
    {
      "code": "bn",
      "name": "Bengali (বাংলা)"
    },
    {
      "code": "gu",
      "name": "Gujarati (ગુજરાતી)"
    },
    {
      "code": "kn",
      "name": "Kannada (ಕನ್ನಡ)"
    },
    {
      "code": "pa",
      "name": "Punjabi (ਪੰਜਾਬੀ)"
    }
  ]
}
```

---

## 4. GOVERNMENT ANALYTICS API

### GET /government/analytics

Get comprehensive platform analytics.

**Response** (200 OK):
```json
{
  "overview": {
    "total_farmers": 12450,
    "total_recommendations": 18230,
    "recent_recommendations": 4560,
    "total_queries": 28900,
    "platform_adoption_rate": "87.5%"
  },
  "top_crops": [
    {
      "crop": "Rice",
      "count": 4500
    },
    {
      "crop": "Wheat",
      "count": 3800
    }
  ],
  "query_categories": [
    {
      "category": "pest_control",
      "count": 8900
    },
    {
      "category": "fertilizer",
      "count": 7200
    }
  ],
  "regional_distribution": [
    {
      "state": "Punjab",
      "count": 2800
    },
    {
      "state": "Uttar Pradesh",
      "count": 2400
    }
  ],
  "price_volatility": {
    "high_volatility_commodities": ["Onion", "Tomato"],
    "stable_commodities": ["Rice", "Wheat"]
  }
}
```

---

### GET /government/regions

Get regional analysis.

**Query Parameters**:
- `state` (optional): Filter by state

**Response** (200 OK):
```json
{
  "state": "Punjab",
  "total_farmers": 2800,
  "crop_distribution": {
    "Rice": 1200,
    "Wheat": 1000,
    "Cotton": 600
  },
  "soil_health_average": {
    "avg_n": 85.5,
    "avg_p": 45.2,
    "avg_k": 48.7,
    "avg_ph": 6.8
  },
  "recommendations": "Focus on soil enrichment programs"
}
```

---

### GET /government/alerts

Get critical alerts requiring intervention.

**Response** (200 OK):
```json
{
  "alerts": [
    {
      "id": 1,
      "severity": "high",
      "type": "price_volatility",
      "commodity": "Onion",
      "message": "Onion prices increased by 45% in last 7 days",
      "affected_regions": ["Maharashtra", "Karnataka"],
      "recommendation": "Consider price stabilization measures",
      "created_at": "2026-02-01T10:00:00Z"
    }
  ],
  "count": 3
}
```

---

### POST /government/intervention

Record government intervention action.

**Request Body**:
```json
{
  "region": "Maharashtra",
  "intervention_type": "subsidy",
  "description": "Fertilizer subsidy program",
  "budget_allocated": 10000000.0,
  "crops_affected": ["Onion", "Cotton"]
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Intervention recorded successfully",
  "intervention_id": "INT_20260201103000",
  "data": {
    "region": "Maharashtra",
    "intervention_type": "subsidy",
    "budget_allocated": 10000000.0
  }
}
```

---

### GET /government/trends

Get trend analysis.

**Query Parameters**:
- `metric`: Metric to analyze (crop_adoption, platform_usage, farmer_satisfaction)
- `period`: Time period (daily, weekly, monthly)

**Response** (200 OK):
```json
{
  "metric": "crop_adoption",
  "period": "monthly",
  "trend": {
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "data": [120, 145, 168, 192, 210, 245],
    "growth_rate": "+15.2%"
  }
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes**:
- `200`: Success
- `400`: Bad Request (invalid input)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

---

## Rate Limiting

**Development**: No rate limiting  
**Production**: Implement rate limiting per IP/user

Recommended limits:
- Crop recommendation: 100 requests/hour
- Price prediction: 50 requests/hour
- AI chat: 30 messages/minute
- Analytics: 1000 requests/hour

---

## CORS Configuration

**Allowed Origins** (Production):
```
https://your-frontend-domain.com
```

**Allowed Methods**:
```
GET, POST, PUT, DELETE, OPTIONS
```

**Allowed Headers**:
```
Content-Type, Authorization
```

---

## API Versioning

Current version: **v1** (included in base path)

Future versions will use path versioning:
- `/api/v1/crops/recommend`
- `/api/v2/crops/recommend`

---

## Interactive API Documentation

When backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

Both provide:
- Interactive API testing
- Request/response schemas
- Example requests
- Try-it-out functionality

---

## Webhooks (Future Feature)

For production, implement webhooks for:
- Price alerts when thresholds crossed
- Crop disease outbreak notifications
- Government intervention updates

---

**API Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready
