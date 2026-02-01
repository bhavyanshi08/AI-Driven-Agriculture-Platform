# 🚀 AGRITECH AI PLATFORM - QUICK START GUIDE

## ⚡ Get Started in 5 Minutes

### What You Have Right Now

✅ **Frontend**: Fully functional React app (running in this environment)  
✅ **Backend Files**: Complete FastAPI backend (ready to download)  
✅ **ML Models**: Crop recommendation & price prediction code  
✅ **AI Integration**: Gemini chatbot implementation  
✅ **Sample Data**: Training datasets included  

---

## 🎯 Quick Demo (No Setup Required!)

The frontend is **already running** with mock data. Just explore:

1. **Home Page** - Platform overview
2. **Crop Recommendation** - Fill the form and get ML predictions
3. **Price Prediction** - Select commodity and generate forecasts
4. **AI Advisory** - Chat with the multilingual AI assistant
5. **Government Dashboard** - View analytics and insights

All modules work with realistic mock data!

---

## 🔧 Running the Full Stack Locally

### Step 1: Download Backend Files

All backend files are in the `/backend` folder:
```
/backend
├── main.py              ← Main FastAPI server
├── requirements.txt     ← Python dependencies
├── .env.example         ← Environment template
├── database.py          ← Database setup
├── models/              ← Database models
├── routes/              ← API endpoints
├── ml/                  ← ML models
├── ai/                  ← Gemini AI
└── data/                ← Sample datasets
```

### Step 2: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Installation time**: ~2 minutes

### Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_key_from_makersuite
```

Get free API key: https://makersuite.google.com/app/apikey

### Step 4: Start Backend Server

```bash
uvicorn main:app --reload
```

Server starts at: `http://localhost:8000`  
API docs at: `http://localhost:8000/docs`

### Step 5: Connect Frontend to Backend

In `/src/app/utils/api.ts`, change:
```typescript
const USE_MOCK_DATA = false;  // Change from true to false
```

That's it! Full stack is running.

---

## 🧪 Testing the API

### Test Crop Recommendation
```bash
curl -X POST "http://localhost:8000/api/crops/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 90,
    "phosphorus": 42,
    "potassium": 43,
    "temperature": 28,
    "humidity": 80,
    "ph": 6.5,
    "rainfall": 200
  }'
```

### Test Price Prediction
```bash
curl -X POST "http://localhost:8000/api/prices/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "commodity_name": "Rice",
    "forecast_days": 30
  }'
```

### Test AI Chat
```bash
# Create session
curl -X POST "http://localhost:8000/api/advisory/session" \
  -H "Content-Type: application/json" \
  -d '{"language": "en"}'

# Send message (use session_id from above)
curl -X POST "http://localhost:8000/api/advisory/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "your-session-id",
    "message": "How to control pests?",
    "language": "en"
  }'
```

---

## 📊 Sample API Responses

### Crop Recommendation Response
```json
{
  "recommended_crop": "Rice",
  "confidence_score": 0.89,
  "alternative_crops": [
    {"crop": "Wheat", "confidence": 0.75},
    {"crop": "Maize", "confidence": 0.68}
  ],
  "reasoning": "Based on high rainfall and warm temperature...",
  "ideal_conditions": "High rainfall, warm temp, pH 5.5-7.0",
  "expected_yield": "4-6 tons/hectare",
  "market_potential": "High demand, stable prices"
}
```

### Price Prediction Response
```json
{
  "commodity_name": "Rice",
  "current_price": 2800,
  "forecasts": [
    {
      "date": "2026-02-02",
      "predicted_price": 2820,
      "lower_bound": 2538,
      "upper_bound": 3102
    }
  ],
  "trend": "increasing",
  "price_change_percentage": 5.2,
  "recommendation": "Consider selling - prices expected to rise"
}
```

---

## 🗄️ Database Options

### Option 1: SQLite (Easiest - Default)
No setup needed! Database file created automatically.

```
DATABASE_URL=sqlite:///./agritech.db
```

### Option 2: PostgreSQL (Production)
```bash
# Install PostgreSQL
# Create database
createdb agritech_db

# Update .env
DATABASE_URL=postgresql://user:pass@localhost:5432/agritech_db
```

Tables are created automatically when you start the server.

---

## 🔑 Getting API Keys

### Google Gemini API (Required for AI Chat)

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Add to `.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

**Note**: Free tier includes generous quotas for development.

---

## 🎨 Customizing the Platform

### Change Mock Data Toggle
File: `/src/app/utils/api.ts`
```typescript
const USE_MOCK_DATA = true;  // false to use real backend
```

### Modify Crop List
File: `/src/app/pages/CropRecommendation.tsx`
```typescript
const crops = ["Rice", "Wheat", "Cotton", ...];
```

### Add More Languages
File: `/backend/ai/gemini_advisor.py`
```python
languages = {
    "en": "English",
    "hi": "Hindi",
    # Add more...
}
```

### Customize Colors
File: `/src/styles/theme.css`
Modify CSS variables for theming.

---

## 📈 Training Your Own ML Models

### Crop Recommendation Model
```bash
cd backend

# Prepare your data (CSV format)
# Columns: N, P, K, temperature, humidity, ph, rainfall, label

python -c "
from ml.crop_predictor import CropPredictor
predictor = CropPredictor()
predictor.train('data/crop_data.csv')
"
```

### Price Prediction Model
```bash
# Prepare historical price data
# Columns: date, commodity_name, price, market, state

python -c "
from ml.price_predictor import PricePredictor
predictor = PricePredictor()
predictor.train('data/price_data.csv')
"
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check if port 8000 is free
lsof -i :8000  # On Unix
netstat -ano | findstr :8000  # On Windows
```

### Frontend can't connect to backend
1. Ensure backend is running at `http://localhost:8000`
2. Check `USE_MOCK_DATA = false` in `/src/app/utils/api.ts`
3. Check CORS settings in `backend/main.py`
4. Verify no firewall blocking

### Gemini API errors
- Check API key is correct in `.env`
- Verify internet connection
- Check API quota limits
- Ensure `.env` file is in backend folder

### Database errors
```bash
# Delete and recreate database
rm agritech.db
python main.py
```

---

## 📝 Project Structure Cheat Sheet

```
Frontend (React)
├── src/app/pages/          ← Page components
├── src/app/components/     ← Reusable components  
├── src/app/utils/api.ts    ← API client
└── src/app/routes.tsx      ← Route config

Backend (FastAPI)
├── main.py                 ← Server entry point
├── routes/                 ← API endpoints
├── models/                 ← Database schemas
├── ml/                     ← ML model code
└── ai/                     ← Gemini integration
```

---

## 🚀 Deployment Checklist

### Frontend
- [ ] Build: `npm run build`
- [ ] Set `VITE_API_URL` to production API URL
- [ ] Deploy to Vercel/Netlify
- [ ] Test all routes work

### Backend
- [ ] Set `DEBUG=False` in production
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set strong `SECRET_KEY`
- [ ] Configure CORS for production domain
- [ ] Deploy to Railway/Heroku/AWS
- [ ] Set up SSL certificate
- [ ] Configure environment variables

### Database
- [ ] Run migrations
- [ ] Set up backups
- [ ] Configure connection pooling
- [ ] Add indexes for performance

---

## 🎓 Learning Resources

### FastAPI
- Official Docs: https://fastapi.tiangolo.com/
- Tutorial: Follow the User Guide

### React + TypeScript
- React Docs: https://react.dev/
- TypeScript Handbook: https://www.typescriptlang.org/docs/

### Machine Learning
- scikit-learn: https://scikit-learn.org/stable/
- XGBoost: https://xgboost.readthedocs.io/

### Gemini AI
- Google AI: https://ai.google.dev/

---

## 💡 Pro Tips

1. **Use API docs**: Visit `http://localhost:8000/docs` for interactive API testing
2. **Check logs**: Backend logs show detailed error messages
3. **Mock data**: Great for frontend development without backend
4. **Sample data**: Use provided CSV files as templates for your data
5. **Version control**: Commit `.env.example`, never commit `.env`

---

## 🏆 For Hackathon Presentation

### Key Demo Points
1. Show live crop recommendation with form inputs
2. Demonstrate price forecasting with charts
3. Chat with AI in different languages
4. Show government dashboard analytics
5. Explain the ML models used

### Talking Points
- **Problem**: 120M farmers need better tech access
- **Solution**: AI-powered platform with 4 modules
- **Impact**: Data-driven decisions, multilingual access
- **Tech**: Production-ready full-stack with ML & GenAI
- **Scalability**: Designed for millions of users

### Architecture Diagram
Show the system architecture from PROJECT_DOCUMENTATION.md

---

## ❓ FAQ

**Q: Do I need Gemini API for demo?**  
A: No, frontend works with mock data. Gemini only needed for real AI responses.

**Q: Can I use SQLite in production?**  
A: For small scale yes, but PostgreSQL recommended for production.

**Q: How to add more crops?**  
A: Add training data to `crop_data.csv` and retrain model.

**Q: Is the code production-ready?**  
A: Yes! Includes error handling, validation, documentation, and scalable architecture.

**Q: Can I modify the ML models?**  
A: Absolutely! Model code is in `/backend/ml/` - customize as needed.

---

## 🎉 You're Ready!

You now have:
✅ Complete understanding of the platform  
✅ Working frontend with mock data  
✅ Backend code ready to run  
✅ ML models ready to train  
✅ Deployment knowledge  

**Next Steps**:
1. Explore the frontend modules
2. Start the backend server
3. Connect them together
4. Customize for your needs
5. Deploy to production!

**Need Help?** Check the full documentation in `PROJECT_DOCUMENTATION.md`

---

**Happy Coding! 🚀🌾**
