/**
 * CROP RECOMMENDATION PAGE
 * ML-powered crop recommendation system
 * 
 * Features:
 * - Input form for soil and climate parameters
 * - Real-time ML predictions
 * - Confidence scores and alternatives
 * - Ideal growing conditions
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Badge } from "@/app/components/ui/badge";
import { Sprout, Loader2, CheckCircle, TrendingUp, Info } from "lucide-react";
import { recommendCrop } from "@/app/utils/api";
import { toast } from "sonner";

const CropRecommendation = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    nitrogen: "90",
    phosphorus: "42",
    potassium: "43",
    temperature: "28",
    humidity: "80",
    ph: "6.5",
    rainfall: "200",
    soil_type: "loamy",
    state: "punjab"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await recommendCrop({
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall),
        soil_type: formData.soil_type,
        state: formData.state
      });

      setResult(response);
      toast.success("Crop recommendation generated successfully!");
    } catch (error) {
      toast.error("Failed to get recommendation. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const soilTypes = ["loamy", "sandy", "clayey", "red", "black", "alluvial"];
  const states = [
    "punjab", "haryana", "uttar pradesh", "bihar", "west bengal",
    "maharashtra", "karnataka", "tamil nadu", "andhra pradesh", "telangana"
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-block rounded-full bg-gradient-to-br from-green-500 to-emerald-600 p-3 mb-2">
          <Sprout className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Crop Recommendation System</h1>
        <p className="text-gray-600">ML-powered crop suggestions based on soil and climate parameters</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Field Parameters</CardTitle>
            <CardDescription>
              Provide soil nutrient levels and environmental conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Soil Nutrients */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-700">Soil Nutrients (kg/ha)</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nitrogen">Nitrogen (N)</Label>
                    <Input
                      id="nitrogen"
                      type="number"
                      step="0.1"
                      min="0"
                      max="150"
                      value={formData.nitrogen}
                      onChange={(e) => handleInputChange("nitrogen", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phosphorus">Phosphorus (P)</Label>
                    <Input
                      id="phosphorus"
                      type="number"
                      step="0.1"
                      min="0"
                      max="150"
                      value={formData.phosphorus}
                      onChange={(e) => handleInputChange("phosphorus", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="potassium">Potassium (K)</Label>
                    <Input
                      id="potassium"
                      type="number"
                      step="0.1"
                      min="0"
                      max="250"
                      value={formData.potassium}
                      onChange={(e) => handleInputChange("potassium", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ph">Soil pH</Label>
                  <Input
                    id="ph"
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={formData.ph}
                    onChange={(e) => handleInputChange("ph", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Climate Conditions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-700">Climate Conditions</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="50"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange("temperature", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="humidity">Humidity (%)</Label>
                    <Input
                      id="humidity"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.humidity}
                      onChange={(e) => handleInputChange("humidity", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rainfall">Rainfall (mm)</Label>
                  <Input
                    id="rainfall"
                    type="number"
                    step="0.1"
                    min="0"
                    max="500"
                    value={formData.rainfall}
                    onChange={(e) => handleInputChange("rainfall", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-700">Location Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="soil_type">Soil Type</Label>
                    <Select value={formData.soil_type} onValueChange={(v) => handleInputChange("soil_type", v)}>
                      <SelectTrigger id="soil_type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {soilTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={formData.state} onValueChange={(v) => handleInputChange("state", v)}>
                      <SelectTrigger id="state">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map(state => (
                          <SelectItem key={state} value={state}>
                            {state.charAt(0).toUpperCase() + state.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sprout className="mr-2 h-4 w-4" />
                    Get Recommendation
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {!result && !loading && (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center text-gray-500">
                <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Fill in the form and click "Get Recommendation" to see ML-powered crop suggestions</p>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card>
              <CardContent className="pt-6 text-center">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-green-600" />
                <p className="text-gray-600">Running ML model...</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {/* Main Recommendation */}
              <Card className="border-green-500 border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      Recommended Crop
                    </CardTitle>
                    <Badge className="text-lg px-3 py-1">
                      {(result.confidence_score * 100).toFixed(1)}% Confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-green-600">
                    {result.recommended_crop}
                  </div>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {result.reasoning}
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Ideal Conditions</h4>
                      <p className="text-sm">{result.ideal_conditions}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Expected Yield</h4>
                      <p className="text-sm">{result.expected_yield}</p>
                    </div>
                    <div className="col-span-2">
                      <h4 className="font-semibold text-sm text-gray-600 mb-1">Market Potential</h4>
                      <p className="text-sm">{result.market_potential}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Crops */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Alternative Crops
                  </CardTitle>
                  <CardDescription>Other suitable crops for your conditions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.alternative_crops.map((alt: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{alt.crop}</div>
                        <div className="text-sm text-gray-600">{alt.reason}</div>
                      </div>
                      <Badge variant="secondary">
                        {(alt.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;
