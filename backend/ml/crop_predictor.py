"""
CROP RECOMMENDATION ML MODEL
Uses Random Forest / XGBoost for crop prediction

Training process:
1. Load training data from CSV
2. Feature engineering
3. Train model with cross-validation
4. Save model using joblib
5. Evaluate performance

For hackathon: Use pre-trained model or train on sample data
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
import joblib
import os
from typing import List, Dict

class CropPredictor:
    def __init__(self, model_path: str = "ml/models/crop_model.pkl"):
        """Initialize crop predictor with pre-trained model"""
        self.model_path = model_path
        self.model = None
        self.label_encoder = None
        self.feature_names = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        
        # Crop knowledge base for recommendations
        self.crop_info = {
            "Rice": {
                "ideal_conditions": "High rainfall, warm temperature, pH 5.5-7.0",
                "expected_yield": "4-6 tons/hectare",
                "market_potential": "High demand, stable prices"
            },
            "Wheat": {
                "ideal_conditions": "Moderate rainfall, cool temperature, pH 6.0-7.5",
                "expected_yield": "3-5 tons/hectare",
                "market_potential": "Very high demand, government procurement"
            },
            "Cotton": {
                "ideal_conditions": "Moderate rainfall, warm temperature, pH 6.5-8.0",
                "expected_yield": "2-3 tons/hectare",
                "market_potential": "High export potential"
            },
            "Maize": {
                "ideal_conditions": "Moderate rainfall, warm temperature, pH 5.5-7.0",
                "expected_yield": "5-7 tons/hectare",
                "market_potential": "Growing demand for feed and food"
            },
            "Sugarcane": {
                "ideal_conditions": "High rainfall, hot temperature, pH 6.5-7.5",
                "expected_yield": "60-80 tons/hectare",
                "market_potential": "High demand for sugar and ethanol"
            }
        }
        
        self.load_model()
    
    def load_model(self):
        """Load pre-trained model or create new one"""
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                self.label_encoder = joblib.load(self.model_path.replace('.pkl', '_encoder.pkl'))
                print("Model loaded successfully")
            except Exception as e:
                print(f"Error loading model: {e}")
                self.create_mock_model()
        else:
            print("No pre-trained model found, creating mock model")
            self.create_mock_model()
    
    def create_mock_model(self):
        """Create a mock model for demo purposes"""
        # Create simple decision rules instead of trained model
        self.model = "mock"
        self.label_encoder = None
    
    def predict(self, features: List[float]) -> Dict:
        """
        Predict crop based on input features
        
        Args:
            features: [N, P, K, temperature, humidity, ph, rainfall]
        
        Returns:
            Dictionary with prediction results
        """
        N, P, K, temp, humidity, ph, rainfall = features
        
        # Rule-based prediction (replace with ML model in production)
        crop = self._rule_based_prediction(N, P, K, temp, humidity, ph, rainfall)
        
        # Get alternatives
        alternatives = self._get_alternatives(crop, features)
        
        # Generate reasoning
        reasoning = self._generate_reasoning(crop, features)
        
        return {
            "crop": crop,
            "confidence": 0.85 + np.random.random() * 0.1,  # Mock confidence
            "alternatives": alternatives,
            "reasoning": reasoning,
            "ideal_conditions": self.crop_info.get(crop, {}).get("ideal_conditions", "N/A"),
            "expected_yield": self.crop_info.get(crop, {}).get("expected_yield", "N/A"),
            "market_potential": self.crop_info.get(crop, {}).get("market_potential", "N/A")
        }
    
    def _rule_based_prediction(self, N, P, K, temp, humidity, ph, rainfall):
        """Simple rule-based crop prediction"""
        # Rice: High rainfall, warm temp
        if rainfall > 200 and temp > 25 and humidity > 70:
            return "Rice"
        
        # Wheat: Moderate rainfall, cool temp
        elif rainfall < 100 and temp < 25 and ph > 6.0:
            return "Wheat"
        
        # Cotton: Moderate rainfall, warm temp, high K
        elif K > 40 and temp > 25 and rainfall > 50:
            return "Cotton"
        
        # Sugarcane: High rainfall, hot temp
        elif rainfall > 150 and temp > 30:
            return "Sugarcane"
        
        # Maize: Default moderate conditions
        else:
            return "Maize"
    
    def _get_alternatives(self, primary_crop: str, features: List[float]) -> List[Dict]:
        """Get alternative crop recommendations"""
        all_crops = ["Rice", "Wheat", "Cotton", "Maize", "Sugarcane", "Potato", "Tomato"]
        alternatives = []
        
        for crop in all_crops:
            if crop != primary_crop:
                alternatives.append({
                    "crop": crop,
                    "confidence": 0.5 + np.random.random() * 0.3,
                    "reason": f"Alternative based on similar conditions"
                })
        
        # Return top 3 alternatives
        alternatives.sort(key=lambda x: x['confidence'], reverse=True)
        return alternatives[:3]
    
    def _generate_reasoning(self, crop: str, features: List[float]) -> str:
        """Generate human-readable reasoning"""
        N, P, K, temp, humidity, ph, rainfall = features
        
        reasoning = f"Based on soil parameters (N:{N}, P:{P}, K:{K}, pH:{ph:.1f}) "
        reasoning += f"and climate conditions (Temp:{temp}°C, Humidity:{humidity}%, Rainfall:{rainfall}mm), "
        reasoning += f"{crop} is recommended as it thrives in these conditions."
        
        return reasoning
    
    def train(self, data_path: str):
        """Train model on crop dataset"""
        # Load data
        df = pd.read_csv(data_path)
        
        # Prepare features and labels
        X = df[self.feature_names]
        y = df['label']
        
        # Encode labels
        self.label_encoder = LabelEncoder()
        y_encoded = self.label_encoder.fit_transform(y)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_encoded, test_size=0.2, random_state=42
        )
        
        # Train Random Forest
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.model.fit(X_train, y_train)
        
        # Evaluate
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        
        print(f"Training accuracy: {train_score:.4f}")
        print(f"Testing accuracy: {test_score:.4f}")
        
        # Save model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.label_encoder, self.model_path.replace('.pkl', '_encoder.pkl'))
        
        return {"train_accuracy": train_score, "test_accuracy": test_score}

# Example usage
if __name__ == "__main__":
    predictor = CropPredictor()
    
    # Test prediction
    test_features = [40, 60, 50, 28, 75, 6.5, 180]  # N, P, K, temp, humidity, ph, rainfall
    result = predictor.predict(test_features)
    
    print(f"\nRecommended Crop: {result['crop']}")
    print(f"Confidence: {result['confidence']:.2%}")
    print(f"Reasoning: {result['reasoning']}")
