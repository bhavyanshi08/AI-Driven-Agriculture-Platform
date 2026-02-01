/**
 * AGRITECH AI PLATFORM - MAIN APPLICATION
 * 
 * Entry point for the AI-driven agriculture platform.
 * Uses React Router for navigation between modules.
 * 
 * Modules:
 * 1. Crop Recommendation System - ML-based crop suggestions
 * 2. Commodity Price Prediction - Time series forecasting
 * 3. Multilingual Farmer Advisory - Gemini AI chatbot
 * 4. Government Analytics Dashboard - Intervention tools
 */

import { RouterProvider } from "react-router";
import { router } from "@/app/routes";
import { Toaster } from "@/app/components/ui/sonner";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}
