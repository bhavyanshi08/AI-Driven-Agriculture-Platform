/**
 * GOVERNMENT ANALYTICS DASHBOARD
 * Analytics and intervention tools for policymakers
 * 
 * Features:
 * - Overall platform analytics
 * - Regional distribution analysis
 * - Critical alerts system
 * - Trend visualizations
 * - Query category insights
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { BarChart3, Users, TrendingUp, AlertTriangle, MapPin, Loader2, RefreshCw, Info } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getGovernmentAnalytics, getCriticalAlerts } from "@/app/utils/api";
import { toast } from "sonner";

const GovernmentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsData, alertsData] = await Promise.all([
        getGovernmentAnalytics(),
        getCriticalAlerts()
      ]);
      setAnalytics(analyticsData);
      setAlerts(alertsData);
    } catch (error) {
      toast.error("Failed to load analytics data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-300";
      case "medium": return "bg-orange-100 text-orange-800 border-orange-300";
      case "low": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-gradient-to-br from-orange-500 to-red-600 p-3">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Government Analytics Dashboard</h1>
              <p className="text-gray-600">Real-time insights for agricultural policy and intervention</p>
            </div>
          </div>
        </div>
        <Button onClick={loadData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Overview Stats */}
      {analytics && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <div className="text-3xl font-bold">{analytics.overview.total_farmers.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Farmers</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                <div className="text-3xl font-bold">{analytics.overview.total_recommendations.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Recommendations</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                <div className="text-3xl font-bold">{analytics.overview.recent_recommendations.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Last 30 Days</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
                <div className="text-3xl font-bold">{analytics.overview.total_queries.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Farmer Queries</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600 mb-1">Adoption Rate</div>
                <div className="text-3xl font-bold text-green-600">{analytics.overview.platform_adoption_rate}</div>
                <div className="text-xs text-gray-500">Platform usage</div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts */}
          {alerts && alerts.alerts.length > 0 && (
            <Card className="border-red-300 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-6 w-6" />
                  Critical Alerts Requiring Intervention
                </CardTitle>
                <CardDescription>
                  Urgent situations that need government attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.alerts.map((alert: any) => (
                  <Alert key={alert.id} className={`${getSeverityColor(alert.severity)} border-2`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="flex items-center justify-between">
                      <span>{alert.message}</span>
                      <Badge variant="outline" className="ml-2">
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="space-y-2 mt-2">
                      <div className="flex gap-4 text-sm">
                        <span><strong>Type:</strong> {alert.type}</span>
                        {alert.commodity && <span><strong>Commodity:</strong> {alert.commodity}</span>}
                      </div>
                      <div className="text-sm">
                        <strong>Affected Regions:</strong> {alert.affected_regions.join(", ")}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Info className="h-4 w-4" />
                        <span className="text-sm"><strong>Recommendation:</strong> {alert.recommendation}</span>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Analytics Tabs */}
          <Tabs defaultValue="crops" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="crops">Crop Distribution</TabsTrigger>
              <TabsTrigger value="queries">Farmer Queries</TabsTrigger>
              <TabsTrigger value="regions">Regional Analysis</TabsTrigger>
            </TabsList>

            {/* Crop Distribution */}
            <TabsContent value="crops" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Recommended Crops</CardTitle>
                    <CardDescription>Most popular crop recommendations by ML system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.top_crops}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="crop" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Crop Distribution</CardTitle>
                    <CardDescription>Percentage breakdown of recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analytics.top_crops}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ crop, percent }: any) => `${crop} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {analytics.top_crops.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Farmer Queries */}
            <TabsContent value="queries" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Query Categories</CardTitle>
                    <CardDescription>Types of questions farmers are asking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.query_categories} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fontSize: 12 }} />
                        <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} width={100} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Query Insights</CardTitle>
                    <CardDescription>Analysis of farmer concerns and needs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analytics.query_categories.slice(0, 5).map((cat: any, idx: number) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{cat.category.replace('_', ' ')}</span>
                          <Badge>{cat.count} queries</Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{
                              width: `${(cat.count / analytics.query_categories[0].count) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        High volume of pest control queries suggests need for agricultural extension services in affected regions.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Regional Analysis */}
            <TabsContent value="regions" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Regional Distribution</CardTitle>
                    <CardDescription>Platform usage by state</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.regional_distribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="state" tick={{ fontSize: 11, angle: -45 }} height={80} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top States by Usage</CardTitle>
                    <CardDescription>Farmer engagement across regions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.regional_distribution.slice(0, 10).map((region: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-700">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {region.state}
                              </span>
                              <span className="text-sm text-gray-600">{region.count} farmers</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full"
                                style={{
                                  width: `${(region.count / analytics.regional_distribution[0].count) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Items */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle>Recommended Government Interventions</CardTitle>
              <CardDescription>Data-driven policy suggestions based on platform analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertTitle>Fertilizer Subsidy Program</AlertTitle>
                <AlertDescription>
                  High volume of fertilizer-related queries suggests farmers need guidance on optimal nutrient management. 
                  Consider expanding agricultural extension services and subsidy programs.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <MapPin className="h-4 w-4" />
                <AlertTitle>Regional Focus Areas</AlertTitle>
                <AlertDescription>
                  Punjab, Uttar Pradesh, and Maharashtra show highest platform engagement. 
                  These states are prime candidates for pilot programs and targeted interventions.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Pest Control Support</AlertTitle>
                <AlertDescription>
                  Pest control is the #1 query category. Deploy mobile agricultural clinics and 
                  distribute information on integrated pest management techniques.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default GovernmentDashboard;
