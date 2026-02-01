/**
 * FARMER ADVISORY PAGE
 * Multilingual AI chatbot powered by Gemini
 * 
 * Features:
 * - Real-time chat with Gemini AI
 * - 9 regional language support
 * - Context-aware responses
 * - Conversation history
 * - Quick suggestion buttons
 */

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { MessageSquare, Send, Loader2, User, Bot, Globe, Sparkles } from "lucide-react";
import { createChatSession, sendChatMessage, getSupportedLanguages } from "@/app/utils/api";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const FarmerAdvisory = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [languages, setLanguages] = useState<Array<{ code: string; name: string }>>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeChat();
    loadLanguages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadLanguages = async () => {
    try {
      const data = await getSupportedLanguages();
      setLanguages(data.languages);
    } catch (error) {
      console.error("Failed to load languages:", error);
    }
  };

  const initializeChat = async () => {
    try {
      const session = await createChatSession({
        language: "en"
      });
      setSessionId(session.session_id);
      
      // Add welcome message
      setMessages([{
        role: "assistant",
        content: "Hello! I'm your AI farming advisor. I can help you with crop cultivation, pest control, fertilizer recommendations, market prices, weather advice, and government schemes. How can I assist you today?",
        timestamp: new Date()
      }]);
      
      setSuggestions([
        "What fertilizer should I use for rice?",
        "How to control pests naturally?",
        "What are current market prices?",
        "Tell me about government schemes for farmers"
      ]);
    } catch (error) {
      toast.error("Failed to initialize chat session");
      console.error(error);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text || !sessionId) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await sendChatMessage({
        session_id: sessionId,
        message: text,
        language
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.response,
        timestamp: new Date(response.timestamp)
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-block rounded-full bg-gradient-to-br from-purple-500 to-pink-600 p-3 mb-2">
          <MessageSquare className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold">AI Farmer Advisory</h1>
        <p className="text-gray-600">Multilingual chatbot powered by Google Gemini AI</p>
        
        <div className="flex items-center justify-center gap-2 text-sm">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Gemini Pro
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Globe className="h-3 w-3" />
            9 Languages
          </Badge>
        </div>
      </div>

      {/* Language Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Language / भाषा / மொழி</CardTitle>
          <CardDescription>Select your preferred language for conversation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="language" className="min-w-fit">Chat Language:</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            Chat with AI Advisor
          </CardTitle>
        </CardHeader>

        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-600 p-2 h-fit">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-green-100 text-green-900"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="rounded-full bg-green-600 p-2 h-fit">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-600 p-2 h-fit">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        {suggestions.length > 0 && !loading && (
          <div className="border-t p-3 bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
            <div className="flex gap-2 flex-wrap">
              {suggestions.map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <CardContent className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your question here..."
              disabled={loading || !sessionId}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !inputMessage.trim() || !sessionId}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Topics I Can Help With</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Crop cultivation advice</li>
              <li>• Pest and disease control</li>
              <li>• Fertilizer recommendations</li>
              <li>• Weather-based guidance</li>
              <li>• Market price information</li>
              <li>• Government schemes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Supported Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• English</li>
              <li>• हिंदी (Hindi)</li>
              <li>• தமிழ் (Tamil)</li>
              <li>• తెలుగు (Telugu)</li>
              <li>• मराठी (Marathi)</li>
              <li>• And 4 more...</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Google Gemini Pro</li>
              <li>• Context-aware responses</li>
              <li>• Natural language processing</li>
              <li>• Multilingual support</li>
              <li>• Agricultural knowledge base</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerAdvisory;
