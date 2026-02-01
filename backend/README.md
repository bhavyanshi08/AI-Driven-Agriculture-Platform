# AGRITECH AI PLATFORM - COMPLETE SETUP GUIDE

## 🌾 Welcome to AgriTech AI Platform

A comprehensive AI-driven agriculture platform for crop recommendations, price predictions, multilingual farmer advisory, and government analytics.

---

## 📁 Project Structure

```
agritech-platform/
├── frontend/                  # React + Tailwind (provided in this environment)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # React components
│   │   │   ├── pages/        # Page components
│   │   │   ├── routes.tsx    # Routing configuration
│   │   │   └── App.tsx       # Main app
│   └── package.json
│
├── backend/                   # FastAPI + ML (download these files)
│   ├── main.py               # Main API server
│   ├── database.py           # Database configuration
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment variables template
│   │
│   ├── models/               # SQLAlchemy database models
│   │   ├── crop_models.py
│   │   ├── price_models.py
│   │   └── advisory_models.py
│   │
│   ├── routes/               # API route handlers
│   │   ├── crop_routes.py
│   │   ├── price_routes.py
│   │   ├── advisory_routes.py
│   │   └── government_routes.py
│   │
│   ├── ml/                   # Machine Learning models
│   │   ├── crop_predictor.py    # Crop recommendation ML
│   │   ├── price_predictor.py   # Price prediction ML
│   │   └── models/              # Saved model files
│   │
│   ├── ai/                   # Generative AI
│   │   └── gemini_advisor.py    # Gemini chatbot
│   │
│   └── data/                 # Sample datasets
│       ├── crop_data.csv
│       └── price_data.csv
```

---

## 🚀 Quick Start Guide

### **Step 1: Backend Setup**

1. **Download Backend Files**
   - Copy the entire `/backend` folder from this environment to your local machine

2. **Install Python Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key
   ```

4. **Initialize Database**
   ```bash
   # Database tables will be created automatically on first run
   python main.py
   ```

5. **Start Backend Server**
   ```bash
   uvicorn main:app --reload
   ```
   Server will start at `http://localhost:8000`
   API docs at `http://localhost:8000/docs`

### **Step 2: Frontend Setup**

The frontend is already running in this environment! It will connect to your local backend.

---

## 🔑 API Key Setup

### **Gemini API (Required for AI Advisory)**

1. Visit: https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add to `.env` file:
   ```
   GEMINI_API_KEY=your_actual_key_here
   ```

---

## 📊 Module Details

### **1. Crop Recommendation System**
- **Technology**: Random Forest / XGBoost
- **Input**: Soil NPK, pH, weather data
- **Output**: Crop suggestions with confidence scores
- **API Endpoint**: `POST /api/crops/recommend`

### **2. Commodity Price Prediction**
- **Technology**: XGBoost time series forecasting
- **Input**: Historical prices, seasonality
- **Output**: 30-day price forecasts with confidence intervals
- **API Endpoint**: `POST /api/prices/predict`

### **3. Multilingual Farmer Advisory**
- **Technology**: Google Gemini Pro
- **Languages**: English, Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, Kannada, Punjabi
- **Features**: Context-aware responses, conversation history
- **API Endpoint**: `POST /api/advisory/chat`

### **4. Government Analytics Dashboard**
- **Features**: Regional analysis, trend monitoring, intervention tracking
- **Visualizations**: Charts, maps, alerts
- **API Endpoint**: `GET /api/government/analytics`

---

## 🗄️ Database Setup

### **Development (SQLite)**
Default configuration - no setup required!

### **Production (PostgreSQL)**
```bash
# Install PostgreSQL
# Create database
createdb agritech_db

# Update .env
DATABASE_URL=postgresql://user:password@localhost:5432/agritech_db
```

---

## 🧪 Testing the API

### **Test Crop Recommendation**
```bash
curl -X POST "http://localhost:8000/api/crops/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 90,
    "phosphorus": 42,
    "potassium": 43,
    "temperature": 20.87,
    "humidity": 82.0,
    "ph": 6.5,
    "rainfall": 202.93
  }'
```

### **Test Price Prediction**
```bash
curl -X POST "http://localhost:8000/api/prices/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "commodity_name": "Rice",
    "forecast_days": 30
  }'
```

### **Test AI Advisory**
```bash
# First create a session
curl -X POST "http://localhost:8000/api/advisory/session" \
  -H "Content-Type: application/json" \
  -d '{"language": "en"}'

# Then send a message (use session_id from above)
curl -X POST "http://localhost:8000/api/advisory/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "your-session-id",
    "message": "What fertilizer should I use for rice?",
    "language": "en"
  }'
```

---

## 📚 Sample Data

The platform includes sample datasets in `/backend/data/`:

- **crop_data.csv**: Training data for crop recommendation (50 samples)
- **price_data.csv**: Historical price data for prediction (42 samples)

For production, replace with larger datasets from:
- Kaggle Agricultural Datasets
- AGMARKNET (agmarknet.gov.in)
- Indian Agricultural Research Institute (IARI)

---

## 🎯 For Hackathon Judges

### **Key Highlights**

1. **Complete Full-Stack Solution**
   - Frontend: React + Tailwind CSS
   - Backend: FastAPI + Python
   - Database: PostgreSQL/SQLite
   - ML: scikit-learn + XGBoost
   - GenAI: Google Gemini

2. **Production-Ready Architecture**
   - Modular code structure
   - RESTful API design
   - Database ORM (SQLAlchemy)
   - Error handling & validation
   - API documentation (FastAPI auto-docs)

3. **Real-World Impact**
   - Helps 120M+ Indian farmers
   - Multilingual support (9 languages)
   - Data-driven decision making
   - Government intervention tools

4. **Scalability**
   - Microservices-ready architecture
   - Database indexing for performance
   - Async operations
   - Caching-ready design

### **Innovation Points**

- **Multi-Model ML Pipeline**: Combines classification and time-series forecasting
- **Multilingual AI**: Context-aware GenAI in regional languages
- **Government Integration**: Analytics dashboard for policy decisions
- **End-to-End Solution**: From farmer query to government intervention

---

## 🔧 Troubleshooting

### **Backend won't start**
```bash
# Check Python version (3.8+)
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### **Database errors**
```bash
# Delete existing database and restart
rm agritech.db
python main.py
```

### **Gemini API errors**
- Verify API key is correct
- Check internet connection
- Ensure API quotas are not exceeded

---

## 📞 Support & Documentation

- **API Documentation**: http://localhost:8000/docs (when backend is running)
- **Alternative API Docs**: http://localhost:8000/redoc

---

## 🏆 Future Enhancements

1. **Mobile App**: React Native version
2. **IoT Integration**: Sensor data for real-time monitoring
3. **Blockchain**: Transparent supply chain tracking
4. **Drone Integration**: Aerial crop monitoring
5. **Weather API**: Real-time weather integration
6. **Payment Gateway**: Direct marketplace integration

---

## 📝 License

This project is for educational and hackathon purposes.

---

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Open-source ML community
- Indian farmers for inspiration

---

**Built with ❤️ for Indian Agriculture**
