/**
 * PRICE PREDICTION PAGE
 * Commodity price forecasting using time series ML
 * 
 * Features:
 * - Historical price charts
 * - 30-day price forecasts
 * - Confidence intervals
 * - Market recommendations
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { TrendingUp, TrendingDown, Minus, Loader2, BarChart3, Info } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { predictPrice, getHistoricalPrices } from "@/app/utils/api";
import { toast } from "sonner";

const PricePrediction = () => {
  const [loading, setLoading] = useState(false);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [commodity, setCommodity] = useState("Rice");
  const [forecastDays, setForecastDays] = useState("30");
  const [prediction, setPrediction] = useState<any>(null);
  const [historical, setHistorical] = useState<any>(null);

  const commodities = ["Rice", "Wheat", "Maize", "Cotton", "Onion", "Tomato", "Potato"];

  // Load historical data when commodity changes
  useEffect(() => {
    loadHistoricalData();
  }, [commodity]);

  const loadHistoricalData = async () => {
    setHistoricalLoading(true);
    try {
      const data = await getHistoricalPrices(commodity, 90);
      setHistorical(data);
    } catch (error) {
      console.error("Failed to load historical data:", error);
    } finally {
      setHistoricalLoading(false);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await predictPrice({
        commodity_name: commodity,
        forecast_days: parseInt(forecastDays)
      });
      setPrediction(response);
      toast.success("Price forecast generated successfully!");
    } catch (error) {
      toast.error("Failed to generate forecast. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "increasing") return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (trend === "decreasing") return <TrendingDown className="h-5 w-5 text-red-600" />;
    return <Minus className="h-5 w-5 text-gray-600" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === "increasing") return "bg-green-100 text-green-800 border-green-300";
    if (trend === "decreasing") return "bg-red-100 text-red-800 border-red-300";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-block rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 p-3 mb-2">
          <TrendingUp className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Commodity Price Prediction</h1>
        <p className="text-gray-600">AI-powered price forecasting using XGBoost time series analysis</p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast Parameters</CardTitle>
          <CardDescription>Select commodity and forecast period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="commodity">Commodity</Label>
              <Select value={commodity} onValueChange={setCommodity}>
                <SelectTrigger id="commodity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {commodities.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">Forecast Period</Label>
              <Select value={forecastDays} onValueChange={setForecastDays}>
                <SelectTrigger id="days">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="15">15 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handlePredict} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Forecasting...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Forecast
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historical Prices Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Prices (Last 90 Days)</CardTitle>
          <CardDescription>Past price trends for {commodity}</CardDescription>
        </CardHeader>
        <CardContent>
          {historicalLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : historical ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historical.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Price (₹/quintal)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: any) => [`₹${value.toFixed(2)}`, 'Price']}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  name="Historical Price"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <Info className="h-12 w-12 mb-2 opacity-50" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {prediction && (
        <>
          {/* Summary */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600 mb-1">Current Price</div>
                <div className="text-2xl font-bold">₹{prediction.current_price}</div>
                <div className="text-xs text-gray-500">per quintal</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600 mb-1">Forecast Price</div>
                <div className="text-2xl font-bold">
                  ₹{prediction.forecasts[prediction.forecasts.length - 1].predicted_price}
                </div>
                <div className="text-xs text-gray-500">in {forecastDays} days</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600 mb-1">Price Change</div>
                <div className={`text-2xl font-bold ${prediction.price_change_percentage > 0 ? 'text-green-600' : prediction.price_change_percentage < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {prediction.price_change_percentage > 0 ? '+' : ''}{prediction.price_change_percentage.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500">expected change</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600 mb-1">Model Accuracy</div>
                <div className="text-2xl font-bold text-blue-600">
                  {(prediction.model_accuracy * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">confidence level</div>
              </CardContent>
            </Card>
          </div>

          {/* Trend & Recommendation */}
          <Card className={`border-2 ${getTrendColor(prediction.trend)}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getTrendIcon(prediction.trend)}
                Market Trend: {prediction.trend.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-base">
                  <strong>Recommendation:</strong> {prediction.recommendation}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Forecast Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Price Forecast with Confidence Intervals</CardTitle>
              <CardDescription>
                Predicted prices for the next {forecastDays} days with uncertainty bounds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={prediction.forecasts}>
                  <defs>
                    <linearGradient id="colorUpper" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Price (₹/quintal)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      const labels: Record<string, string> = {
                        predicted_price: 'Predicted',
                        upper_bound: 'Upper Bound',
                        lower_bound: 'Lower Bound'
                      };
                      return [`₹${value.toFixed(2)}`, labels[name] || name];
                    }}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="upper_bound" 
                    stackId="1"
                    stroke="#93c5fd" 
                    fill="url(#colorUpper)"
                    fillOpacity={0.3}
                    name="Upper Bound"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lower_bound" 
                    stackId="1"
                    stroke="#93c5fd" 
                    fill="#ffffff"
                    name="Lower Bound"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted_price" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    name="Predicted Price"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Forecast Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Forecast</CardTitle>
              <CardDescription>Day-by-day price predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white border-b">
                    <tr className="text-left">
                      <th className="p-2">Date</th>
                      <th className="p-2">Predicted Price</th>
                      <th className="p-2">Lower Bound</th>
                      <th className="p-2">Upper Bound</th>
                      <th className="p-2">Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prediction.forecasts.map((forecast: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-2">{new Date(forecast.date).toLocaleDateString()}</td>
                        <td className="p-2 font-semibold">₹{forecast.predicted_price}</td>
                        <td className="p-2 text-gray-600">₹{forecast.lower_bound}</td>
                        <td className="p-2 text-gray-600">₹{forecast.upper_bound}</td>
                        <td className="p-2">
                          <Badge variant="secondary">
                            ±₹{Math.round((forecast.upper_bound - forecast.lower_bound) / 2)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!prediction && !loading && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center text-gray-500">
            <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a commodity and click "Generate Forecast" to see price predictions</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PricePrediction;
