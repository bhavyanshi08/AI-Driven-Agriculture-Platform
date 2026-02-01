/**
 * API UTILITY - Mock Data and API Calls
 * 
 * This file provides mock data for demo purposes.
 * When backend is running, replace mock functions with real API calls.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const USE_MOCK_DATA = true; // Set to false when backend is running

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== CROP RECOMMENDATION ====================

export const recommendCrop = async (data: {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  soil_type?: string;
  state?: string;
}) => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      recommended_crop: "Rice",
      confidence_score: 0.89,
      alternative_crops: [
        { crop: "Wheat", confidence: 0.75, reason: "Good alternative for winter season" },
        { crop: "Maize", confidence: 0.68, reason: "Suitable for similar soil conditions" },
        { crop: "Cotton", confidence: 0.62, reason: "High market value option" }
      ],
      reasoning: `Based on soil parameters (N:${data.nitrogen}, P:${data.phosphorus}, K:${data.potassium}, pH:${data.ph}) and climate conditions (Temp:${data.temperature}°C, Humidity:${data.humidity}%, Rainfall:${data.rainfall}mm), Rice is recommended as it thrives in these conditions.`,
      ideal_conditions: "High rainfall, warm temperature, pH 5.5-7.0",
      expected_yield: "4-6 tons/hectare",
      market_potential: "High demand, stable prices"
    };
  }
  
  const response = await api.post('/crops/recommend', data);
  return response.data;
};

// ==================== PRICE PREDICTION ====================

export const predictPrice = async (data: {
  commodity_name: string;
  forecast_days: number;
  state?: string;
}) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const basePrice = {
      "Rice": 2800,
      "Wheat": 2100,
      "Maize": 1800,
      "Cotton": 5500,
      "Onion": 2000,
      "Tomato": 1500,
      "Potato": 1200
    }[data.commodity_name] || 2000;
    
    const forecasts = [];
    const trend = Math.random() > 0.5 ? 1 : -1;
    
    for (let i = 1; i <= data.forecast_days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const predicted_price = basePrice + (trend * i * 5) + (Math.random() - 0.5) * 100;
      forecasts.push({
        date: date.toISOString().split('T')[0],
        predicted_price: Math.round(predicted_price),
        lower_bound: Math.round(predicted_price * 0.9),
        upper_bound: Math.round(predicted_price * 1.1)
      });
    }
    
    const price_change = ((forecasts[forecasts.length - 1].predicted_price - basePrice) / basePrice) * 100;
    
    return {
      commodity_name: data.commodity_name,
      current_price: basePrice,
      forecasts,
      trend: price_change > 5 ? "increasing" : price_change < -5 ? "decreasing" : "stable",
      price_change_percentage: price_change,
      recommendation: price_change > 5 ? "Consider selling - prices expected to rise" : 
                      price_change < -5 ? "Hold inventory - prices expected to fall" : 
                      "Stable market - normal trading conditions",
      model_accuracy: 0.85
    };
  }
  
  const response = await api.post('/prices/predict', data);
  return response.data;
};

export const getHistoricalPrices = async (commodity: string, days: number = 90) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const basePrice = {
      "Rice": 2800,
      "Wheat": 2100,
      "Maize": 1800,
      "Cotton": 5500,
      "Onion": 2000,
      "Tomato": 1500,
      "Potato": 1200
    }[commodity] || 2000;
    
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        price: basePrice + (Math.random() - 0.5) * 200,
        arrival_quantity: 1000 + Math.random() * 500
      });
    }
    
    return { commodity, data, count: data.length };
  }
  
  const response = await api.get(`/prices/historical/${commodity}`, { params: { days } });
  return response.data;
};

// ==================== FARMER ADVISORY ====================

export const createChatSession = async (data: {
  language: string;
  location?: string;
  crop_interest?: string;
}) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      session_id: `session_${Date.now()}`,
      farmer_id: `farmer_${Math.random().toString(36).substr(2, 9)}`,
      language: data.language,
      created_at: new Date().toISOString()
    };
  }
  
  const response = await api.post('/advisory/session', data);
  return response.data;
};

export const sendChatMessage = async (data: {
  session_id: string;
  message: string;
  language: string;
}) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const responses: Record<string, string> = {
      "pest": "For pest control, I recommend using neem oil spray as a natural solution. Mix 5ml neem oil with 1 liter of water and spray on affected plants early morning or evening. For severe infestations, you can use approved pesticides like Imidacloprid. Always follow safety guidelines.",
      "fertilizer": "Based on your soil conditions, I recommend balanced NPK fertilizer application. For most crops, apply 120 kg Nitrogen, 60 kg Phosphorus, and 40 kg Potassium per hectare. Split nitrogen application into 3 doses: at sowing, 30 days, and 60 days.",
      "weather": "Weather plays a crucial role in farming. For the upcoming monsoon season, ensure proper drainage in your fields. If rainfall is predicted to be heavy, delay sowing of crops that are sensitive to waterlogging.",
      "price": "Current market prices show good demand for your crop. I recommend selling through government mandis or e-NAM portal for better price realization. Check minimum support price (MSP) before selling.",
      "default": "I'm here to help you with all your farming questions. I can provide advice on crop selection, pest management, fertilizer use, market prices, weather impacts, and government schemes. Feel free to ask me anything!"
    };
    
    const message = data.message.toLowerCase();
    let response = responses.default;
    
    if (message.includes('pest') || message.includes('insect')) response = responses.pest;
    else if (message.includes('fertilizer') || message.includes('nutrient')) response = responses.fertilizer;
    else if (message.includes('weather') || message.includes('rain')) response = responses.weather;
    else if (message.includes('price') || message.includes('market')) response = responses.price;
    
    return {
      session_id: data.session_id,
      message: data.message,
      response,
      language: data.language,
      timestamp: new Date().toISOString(),
      suggestions: [
        "What organic pest control methods are available?",
        "How can I improve soil health?",
        "What are the current market prices?"
      ]
    };
  }
  
  const response = await api.post('/advisory/chat', data);
  return response.data;
};

export const getSupportedLanguages = async () => {
  if (USE_MOCK_DATA) {
    return {
      languages: [
        { code: "en", name: "English" },
        { code: "hi", name: "Hindi (हिंदी)" },
        { code: "ta", name: "Tamil (தமிழ்)" },
        { code: "te", name: "Telugu (తెలుగు)" },
        { code: "mr", name: "Marathi (मराठी)" },
        { code: "bn", name: "Bengali (বাংলা)" },
        { code: "gu", name: "Gujarati (ગુજરાતી)" },
        { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
        { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
      ]
    };
  }
  
  const response = await api.get('/advisory/languages');
  return response.data;
};

// ==================== GOVERNMENT ANALYTICS ====================

export const getGovernmentAnalytics = async () => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      overview: {
        total_farmers: 12450,
        total_recommendations: 18230,
        recent_recommendations: 4560,
        total_queries: 28900,
        platform_adoption_rate: "87.5%"
      },
      top_crops: [
        { crop: "Rice", count: 4500 },
        { crop: "Wheat", count: 3800 },
        { crop: "Cotton", count: 2900 },
        { crop: "Maize", count: 2400 },
        { crop: "Sugarcane", count: 1800 }
      ],
      query_categories: [
        { category: "pest_control", count: 8900 },
        { category: "fertilizer", count: 7200 },
        { category: "market", count: 5400 },
        { category: "weather", count: 4100 },
        { category: "cultivation", count: 3300 }
      ],
      regional_distribution: [
        { state: "Punjab", count: 2800 },
        { state: "Uttar Pradesh", count: 2400 },
        { state: "Maharashtra", count: 2100 },
        { state: "Karnataka", count: 1800 },
        { state: "Tamil Nadu", count: 1500 }
      ]
    };
  }
  
  const response = await api.get('/government/analytics');
  return response.data;
};

export const getCriticalAlerts = async () => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      alerts: [
        {
          id: 1,
          severity: "high",
          type: "price_volatility",
          commodity: "Onion",
          message: "Onion prices increased by 45% in last 7 days",
          affected_regions: ["Maharashtra", "Karnataka"],
          recommendation: "Consider price stabilization measures",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          severity: "medium",
          type: "pest_outbreak",
          commodity: "Cotton",
          message: "High volume of pest control queries from Punjab",
          affected_regions: ["Punjab", "Haryana"],
          recommendation: "Deploy agricultural extension services",
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          severity: "high",
          type: "soil_health",
          message: "Low nitrogen levels detected in 60% of samples from Gujarat",
          affected_regions: ["Gujarat"],
          recommendation: "Subsidize nitrogen fertilizers",
          created_at: new Date().toISOString()
        }
      ],
      count: 3
    };
  }
  
  const response = await api.get('/government/alerts');
  return response.data;
};

export default api;
