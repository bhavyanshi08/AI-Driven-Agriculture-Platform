/**
 * AGRITECH AI PLATFORM - ROUTING CONFIGURATION
 * 
 * Main routing configuration for the agriculture AI platform.
 * Implements React Router Data Mode for efficient navigation.
 * 
 * Routes:
 * - / : Landing page with platform overview
 * - /crop-recommendation : ML-powered crop recommendation system
 * - /price-prediction : Commodity price forecasting
 * - /farmer-advisory : Multilingual AI chat assistant
 * - /government-dashboard : Analytics and intervention tools
 */

import { createBrowserRouter } from "react-router";
import Layout from "@/app/components/Layout";
import HomePage from "@/app/pages/HomePage";
import CropRecommendation from "@/app/pages/CropRecommendation";
import PricePrediction from "@/app/pages/PricePrediction";
import FarmerAdvisory from "@/app/pages/FarmerAdvisory";
import GovernmentDashboard from "@/app/pages/GovernmentDashboard";
import NotFound from "@/app/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "crop-recommendation", Component: CropRecommendation },
      { path: "price-prediction", Component: PricePrediction },
      { path: "farmer-advisory", Component: FarmerAdvisory },
      { path: "government-dashboard", Component: GovernmentDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
