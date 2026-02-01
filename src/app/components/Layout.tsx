/**
 * MAIN LAYOUT COMPONENT
 * 
 * Provides consistent navigation and layout structure
 * across all pages of the platform.
 */

import { Outlet, Link, useLocation } from "react-router";
import { Sprout, TrendingUp, MessageSquare, BarChart3, Menu } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Sprout },
    { path: "/crop-recommendation", label: "Crop Recommendation", icon: Sprout },
    { path: "/price-prediction", label: "Price Prediction", icon: TrendingUp },
    { path: "/farmer-advisory", label: "AI Advisory", icon: MessageSquare },
    { path: "/government-dashboard", label: "Gov Dashboard", icon: BarChart3 },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-2">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">AgriTech AI</h1>
                <p className="text-xs text-gray-500">Smart Farming Platform</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.slice(1).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button variant={isActive ? "default" : "ghost"} className="gap-2">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-2 mt-8">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2026 AgriTech AI Platform - Empowering Farmers with AI & ML</p>
          <p className="text-xs mt-1">Built with React, FastAPI, scikit-learn & Gemini AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
