"""
GEMINI AI ADVISOR - Multilingual Farmer Assistant
Uses Google Gemini API for natural language responses

Setup:
1. Get API key from https://makersuite.google.com/app/apikey
2. Set environment variable: GEMINI_API_KEY=your_key_here
3. Or add to .env file

Features:
- Multilingual support (English, Hindi, Tamil, Telugu, etc.)
- Context-aware responses
- Agricultural knowledge base
- Pest control advice
- Weather-based recommendations
"""

import os
from typing import List, Dict, Optional
import asyncio
from datetime import datetime

# For production, install and uncomment:
# import google.generativeai as genai

class GeminiAdvisor:
    def __init__(self):
        """Initialize Gemini AI advisor"""
        self.api_key = os.getenv("GEMINI_API_KEY", "YOUR_API_KEY_HERE")
        self.model_name = "gemini-pro"
        self.model = None
        
        # System prompt for agricultural context
        self.system_prompt = """You are an expert agricultural advisor helping farmers in India. 
        You have deep knowledge of:
        - Crop cultivation practices
        - Pest and disease management
        - Soil health and fertilization
        - Weather impacts on farming
        - Market prices and selling strategies
        - Government schemes for farmers
        - Organic farming methods
        
        Provide practical, actionable advice in simple language.
        Be empathetic and encouraging. Consider regional variations in India.
        If asked in a regional language, respond in that language.
        """
        
        self.initialize_model()
    
    def initialize_model(self):
        """Initialize Gemini model"""
        # In production, uncomment:
        # genai.configure(api_key=self.api_key)
        # self.model = genai.GenerativeModel(self.model_name)
        
        print("Gemini AI Advisor initialized (using mock mode)")
        self.model = "mock"
    
    async def generate_response(
        self,
        message: str,
        language: str,
        history: List,
        context: Dict
    ) -> Dict:
        """
        Generate AI response using Gemini
        
        Args:
            message: User's question
            language: Language code
            history: Previous chat messages
            context: Additional context (location, crops, etc.)
        
        Returns:
            Dictionary with response and metadata
        """
        start_time = datetime.now()
        
        # Build conversation context
        conversation_history = self._build_conversation_history(history)
        context_str = self._build_context_string(context)
        
        # Full prompt
        full_prompt = f"""{self.system_prompt}
        
Context: {context_str}

Previous conversation:
{conversation_history}

User question: {message}

Respond in {self._get_language_name(language)} language.
"""
        
        # Generate response
        if self.model == "mock":
            response_text = self._generate_mock_response(message, language)
        else:
            # In production, uncomment:
            # response = self.model.generate_content(full_prompt)
            # response_text = response.text
            response_text = self._generate_mock_response(message, language)
        
        # Calculate response time
        end_time = datetime.now()
        response_time_ms = int((end_time - start_time).total_seconds() * 1000)
        
        # Categorize query
        category = self._categorize_query(message)
        
        # Generate follow-up suggestions
        suggestions = self._generate_suggestions(category, language)
        
        return {
            "response": response_text,
            "category": category,
            "tokens_used": len(message.split()) + len(response_text.split()),
            "response_time_ms": response_time_ms,
            "suggestions": suggestions
        }
    
    def _build_conversation_history(self, history: List) -> str:
        """Build conversation history string"""
        if not history:
            return "No previous conversation"
        
        history_str = ""
        for msg in history[-5:]:  # Last 5 messages
            role = "Farmer" if msg.role == "user" else "Advisor"
            history_str += f"{role}: {msg.content}\n"
        
        return history_str
    
    def _build_context_string(self, context: Dict) -> str:
        """Build context string"""
        parts = []
        if context.get("location"):
            parts.append(f"Location: {context['location']}")
        if context.get("crop_interest"):
            parts.append(f"Interested in: {context['crop_interest']}")
        
        return ", ".join(parts) if parts else "No additional context"
    
    def _get_language_name(self, code: str) -> str:
        """Get language name from code"""
        languages = {
            "en": "English",
            "hi": "Hindi",
            "ta": "Tamil",
            "te": "Telugu",
            "mr": "Marathi",
            "bn": "Bengali",
            "gu": "Gujarati",
            "kn": "Kannada",
            "pa": "Punjabi"
        }
        return languages.get(code, "English")
    
    def _categorize_query(self, message: str) -> str:
        """Categorize the farmer's query"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['pest', 'insect', 'disease', 'bug']):
            return "pest_control"
        elif any(word in message_lower for word in ['fertilizer', 'nutrient', 'npk', 'soil']):
            return "fertilizer"
        elif any(word in message_lower for word in ['weather', 'rain', 'temperature', 'climate']):
            return "weather"
        elif any(word in message_lower for word in ['price', 'market', 'sell', 'mandi']):
            return "market"
        elif any(word in message_lower for word in ['loan', 'scheme', 'subsidy', 'government']):
            return "government_schemes"
        elif any(word in message_lower for word in ['seed', 'variety', 'plant', 'grow']):
            return "cultivation"
        else:
            return "general"
    
    def _generate_mock_response(self, message: str, language: str) -> str:
        """Generate mock response for demo"""
        category = self._categorize_query(message)
        
        responses = {
            "pest_control": {
                "en": "For pest control, I recommend using neem oil spray as a natural solution. Mix 5ml neem oil with 1 liter of water and spray on affected plants early morning or evening. For severe infestations, you can use approved pesticides like Imidacloprid. Always follow safety guidelines and wear protective equipment. Monitor your crops regularly to catch infestations early.",
                "hi": "कीट नियंत्रण के लिए, मैं प्राकृतिक समाधान के रूप में नीम के तेल के स्प्रे का उपयोग करने की सलाह देता हूं। 5 मिली नीम का तेल 1 लीटर पानी में मिलाएं और प्रभावित पौधों पर सुबह या शाम को स्प्रे करें। गंभीर संक्रमण के लिए, आप Imidacloprid जैसे अनुमोदित कीटनाशकों का उपयोग कर सकते हैं।"
            },
            "fertilizer": {
                "en": "Based on your soil conditions, I recommend balanced NPK fertilizer application. For most crops, apply 120 kg Nitrogen, 60 kg Phosphorus, and 40 kg Potassium per hectare. Split nitrogen application into 3 doses: at sowing, 30 days, and 60 days. Also consider adding organic matter like compost to improve soil health long-term.",
                "hi": "आपकी मिट्टी की स्थिति के आधार पर, मैं संतुलित NPK उर्वरक अनुप्रयोग की सिफारिश करता हूं। अधिकांश फसलों के लिए, प्रति हेक्टेयर 120 किलो नाइट्रोजन, 60 किलो फास्फोरस, और 40 किलो पोटेशियम डालें।"
            },
            "weather": {
                "en": "Weather plays a crucial role in farming. For the upcoming monsoon season, ensure proper drainage in your fields. If rainfall is predicted to be heavy, delay sowing of crops that are sensitive to waterlogging. For crops already in field, ensure adequate spacing for air circulation to prevent fungal diseases.",
                "hi": "मौसम खेती में महत्वपूर्ण भूमिका निभाता है। आने वाले मानसून के मौसम के लिए, अपने खेतों में उचित जल निकासी सुनिश्चित करें।"
            },
            "market": {
                "en": "Current market prices show good demand for your crop. I recommend selling through government mandis or e-NAM portal for better price realization. Check minimum support price (MSP) before selling. If prices are currently low, consider storing your produce using warehouse receipt system.",
                "hi": "वर्तमान बाजार मूल्य आपकी फसल की अच्छी मांग दिखाते हैं। मैं बेहतर मूल्य प्राप्ति के लिए सरकारी मंडियों या e-NAM पोर्टल के माध्यम से बेचने की सिफारिश करता हूं।"
            },
            "general": {
                "en": "I'm here to help you with all your farming questions. I can provide advice on crop selection, pest management, fertilizer use, market prices, weather impacts, and government schemes. Feel free to ask me anything about farming and agriculture. Let's work together to improve your farm productivity and income.",
                "hi": "मैं आपके सभी कृषि प्रश्नों में मदद करने के लिए यहां हूं। मैं फसल चयन, कीट प्रबंधन, उर्वरक उपयोग, बाजार मूल्य, मौसम प्रभाव और सरकारी योजनाओं पर सलाह दे सकता हूं।"
            }
        }
        
        # Get response for category and language
        category_responses = responses.get(category, responses["general"])
        response = category_responses.get(language, category_responses["en"])
        
        return response
    
    def _generate_suggestions(self, category: str, language: str) -> List[str]:
        """Generate follow-up suggestions"""
        suggestions_map = {
            "pest_control": [
                "What organic pest control methods are available?",
                "How to identify pest attacks early?",
                "Which pesticides are safe to use?"
            ],
            "fertilizer": [
                "What is the best fertilizer for my soil type?",
                "How often should I apply fertilizer?",
                "Can I use organic fertilizers?"
            ],
            "market": [
                "What is today's market price?",
                "Where can I sell for best price?",
                "Should I sell now or wait?"
            ],
            "general": [
                "Tell me about crop recommendations",
                "How can I improve soil health?",
                "What government schemes are available?"
            ]
        }
        
        return suggestions_map.get(category, suggestions_map["general"])

# Example usage
if __name__ == "__main__":
    advisor = GeminiAdvisor()
    
    async def test():
        response = await advisor.generate_response(
            message="What fertilizer should I use for rice crop?",
            language="en",
            history=[],
            context={"location": "Punjab", "crop_interest": "Rice"}
        )
        
        print(f"Response: {response['response']}")
        print(f"Category: {response['category']}")
        print(f"Suggestions: {response['suggestions']}")
    
    asyncio.run(test())
