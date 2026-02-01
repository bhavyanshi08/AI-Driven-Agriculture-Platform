/**
 * HOME PAGE
 * Landing page with platform overview and features
 */

import { Link } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Sprout, TrendingUp, MessageSquare, BarChart3, Brain, Users, Globe, Shield } from "lucide-react";

const HomePage = () => {
  const features = [
    {
      icon: Sprout,
      title: "Crop Recommendation",
      description: "ML-powered crop suggestions based on soil and climate data",
      link: "/crop-recommendation",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: TrendingUp,
      title: "Price Prediction",
      description: "Forecast commodity prices using time series analysis",
      link: "/price-prediction",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: MessageSquare,
      title: "AI Advisory",
      description: "Multilingual chatbot powered by Gemini AI",
      link: "/farmer-advisory",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: BarChart3,
      title: "Gov Dashboard",
      description: "Analytics and intervention tools for policymakers",
      link: "/government-dashboard",
      color: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { label: "Farmers Served", value: "12,450+", icon: Users },
    { label: "Recommendations", value: "18,230+", icon: Brain },
    { label: "Languages", value: "9", icon: Globe },
    { label: "Accuracy", value: "89%", icon: Shield }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-block">
          <div className="rounded-full bg-gradient-to-br from-green-500 to-emerald-600 p-6 mb-4">
            <Sprout className="h-16 w-16 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          AgriTech AI Platform
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering farmers with AI-driven insights for crop recommendations, 
          price predictions, and multilingual advisory services
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/crop-recommendation">
            <Button size="lg" className="gap-2">
              <Sprout className="h-5 w-5" />
              Get Started
            </Button>
          </Link>
          <Button size="lg" variant="outline" asChild>
            <a href="/backend/README.md" download>
              Download Backend Files
            </a>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6 text-center">
                <Icon className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Platform Modules</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`rounded-lg bg-gradient-to-br ${feature.color} p-3 w-fit mb-2`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full">
                      Explore Module
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>Built with modern, production-ready technologies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Frontend</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• React 18 + TypeScript</li>
                <li>• Tailwind CSS v4</li>
                <li>• React Router</li>
                <li>• Recharts for visualizations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Backend</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• FastAPI (Python)</li>
                <li>• SQLAlchemy ORM</li>
                <li>• PostgreSQL / SQLite</li>
                <li>• RESTful API design</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">AI/ML</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• scikit-learn</li>
                <li>• XGBoost</li>
                <li>• Google Gemini AI</li>
                <li>• Time series forecasting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Section */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-2xl">Real-World Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            This platform addresses critical challenges faced by India's 120+ million farmers:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span><strong>Data-Driven Decisions:</strong> ML models recommend optimal crops based on local conditions</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span><strong>Price Intelligence:</strong> Forecast commodity prices to maximize farmer income</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span><strong>Language Accessibility:</strong> AI advisory in 9 regional languages</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span><strong>Government Support:</strong> Analytics dashboard for targeted interventions</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
