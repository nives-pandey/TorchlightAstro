import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from "recharts";
import { 
  Clock, 
  Globe, 
  MapPin, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Target,
  Calendar,
  Database,
  Settings,
  BarChart3,
  PieChart as PieChartIcon,
  Globe2,
  Clock4
} from "lucide-react";
import { timezoneAnalytics } from "@/lib/timezone-analytics";

export default function EnhancedAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState({
    usageStats: [],
    qualityMetrics: null,
    geographicData: [],
    dstAnalytics: null,
    autoDetectionMetrics: null
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    // In real implementation, this would fetch from backend
    const mockData = {
      usageStats: [
        { timezoneId: "America/New_York", displayName: "Eastern Time", usageCount: 1250, successRate: 0.94, avgConfidenceScore: 0.91, dstCorrections: 45, region: "North America" },
        { timezoneId: "Europe/London", displayName: "Greenwich Mean Time", usageCount: 890, successRate: 0.96, avgConfidenceScore: 0.93, dstCorrections: 32, region: "Europe" },
        { timezoneId: "Asia/Kolkata", displayName: "India Standard Time", usageCount: 756, successRate: 0.98, avgConfidenceScore: 0.95, dstCorrections: 0, region: "Asia" },
        { timezoneId: "America/Los_Angeles", displayName: "Pacific Time", usageCount: 634, successRate: 0.92, avgConfidenceScore: 0.89, dstCorrections: 28, region: "North America" },
        { timezoneId: "Australia/Sydney", displayName: "Australian Eastern Time", usageCount: 423, successRate: 0.97, avgConfidenceScore: 0.94, dstCorrections: 18, region: "Oceania" }
      ],
      qualityMetrics: {
        totalEntries: 4250,
        exactTimes: 2890,
        roundedTimes: 1180,
        unknownTimes: 180,
        qualityScores: {
          'A+': 1250,
          'A': 1640,
          'B+': 980,
          'B': 380,
          'C+': 180,
          'C': 120,
          'D': 30
        },
        impactAnalysis: {
          risingSignChanges: 89,
          houseShifts: 156,
          aspectDifferences: 234
        }
      },
      geographicData: [
        { continent: "North America", country: "United States", city: "New York", coordinates: { lat: 40.7128, lng: -74.0060 }, userCount: 456, timezones: ["America/New_York"] },
        { continent: "Europe", country: "United Kingdom", city: "London", coordinates: { lat: 51.5074, lng: -0.1278 }, userCount: 398, timezones: ["Europe/London"] },
        { continent: "Asia", country: "India", city: "Mumbai", coordinates: { lat: 19.0760, lng: 72.8777 }, userCount: 342, timezones: ["Asia/Kolkata"] },
        { continent: "North America", country: "United States", city: "Los Angeles", coordinates: { lat: 34.0522, lng: -118.2437 }, userCount: 289, timezones: ["America/Los_Angeles"] },
        { continent: "Oceania", country: "Australia", city: "Sydney", coordinates: { lat: -33.8688, lng: 151.2093 }, userCount: 234, timezones: ["Australia/Sydney"] }
      ],
      dstAnalytics: {
        totalCorrections: 423,
        affectedYears: [2020, 2021, 2022, 2023, 2024],
        mostCommonAdjustments: [
          { offset: 3600000, count: 256 }, // +1 hour
          { offset: -3600000, count: 167 } // -1 hour
        ],
        userNotifications: 398,
        accuracyImprovement: 0.87
      },
      autoDetectionMetrics: {
        totalAttempts: 3890,
        successfulDetections: 3456,
        failedDetections: 234,
        ambiguousMatches: 200,
        manualOverrides: 156,
        confidenceDistribution: [
          { range: "90-100%", count: 2890 },
          { range: "80-89%", count: 566 },
          { range: "70-79%", count: 234 },
          { range: "60-69%", count: 120 },
          { range: "50-59%", count: 56 },
          { range: "Below 50%", count: 24 }
        ]
      }
    };
    setAnalyticsData(mockData);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <div className="min-h-screen bg-cosmic-gradient p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Advanced Timezone Analytics
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-xl text-gray-300">
              Real-time monitoring and quality control for timezone accuracy
            </p>
            <div className="flex gap-2">
              {["24h", "7d", "30d", "90d"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={timeRange === range ? "cosmic-button" : ""}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cosmic-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Timezone Entries</CardTitle>
              <Globe className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">4,250</div>
              <p className="text-xs text-gray-400">+12% from last period</p>
            </CardContent>
          </Card>

          <Card className="cosmic-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Auto-Detection Success</CardTitle>
              <Target className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">94.8%</div>
              <p className="text-xs text-gray-400">+2.3% improvement</p>
            </CardContent>
          </Card>

          <Card className="cosmic-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">DST Corrections</CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">423</div>
              <p className="text-xs text-gray-400">Historical accuracy: 87%</p>
            </CardContent>
          </Card>

          <Card className="cosmic-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Quality Score A+/A</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">68%</div>
              <p className="text-xs text-gray-400">High-quality birth data</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="quality" className="data-[state=active]:bg-purple-600">
              <Activity className="h-4 w-4 mr-2" />
              Data Quality
            </TabsTrigger>
            <TabsTrigger value="geographic" className="data-[state=active]:bg-purple-600">
              <Globe2 className="h-4 w-4 mr-2" />
              Geographic
            </TabsTrigger>
            <TabsTrigger value="dst" className="data-[state=active]:bg-purple-600">
              <Clock4 className="h-4 w-4 mr-2" />
              DST Analysis
            </TabsTrigger>
            <TabsTrigger value="detection" className="data-[state=active]:bg-purple-600">
              <Settings className="h-4 w-4 mr-2" />
              Auto-Detection
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Timezone Usage Chart */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-purple-400">Top Timezone Usage</CardTitle>
                  <CardDescription>Most frequently selected timezones</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.usageStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="displayName" 
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                      />
                      <Bar dataKey="usageCount" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Success Rate by Region */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-green-400">Success Rates by Region</CardTitle>
                  <CardDescription>Auto-detection accuracy by geographic region</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData.usageStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="region" tick={{ fill: '#9CA3AF' }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} domain={[0.8, 1]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                        formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Success Rate']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="successRate" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats Table */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="text-yellow-400">Detailed Timezone Statistics</CardTitle>
                <CardDescription>Comprehensive usage and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2 text-gray-300">Timezone</th>
                        <th className="text-left p-2 text-gray-300">Usage Count</th>
                        <th className="text-left p-2 text-gray-300">Success Rate</th>
                        <th className="text-left p-2 text-gray-300">Avg Confidence</th>
                        <th className="text-left p-2 text-gray-300">DST Corrections</th>
                        <th className="text-left p-2 text-gray-300">Region</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.usageStats.map((stat, index) => (
                        <tr key={index} className="border-b border-gray-800 hover:bg-slate-800/30">
                          <td className="p-2 text-white font-medium">{stat.displayName}</td>
                          <td className="p-2 text-gray-300">{stat.usageCount.toLocaleString()}</td>
                          <td className="p-2">
                            <div className="flex items-center">
                              <div className="w-12 mr-2">
                                <Progress value={stat.successRate * 100} className="h-2" />
                              </div>
                              <span className="text-gray-300">{(stat.successRate * 100).toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="p-2 text-gray-300">{(stat.avgConfidenceScore * 100).toFixed(1)}%</td>
                          <td className="p-2 text-gray-300">{stat.dstCorrections}</td>
                          <td className="p-2">
                            <Badge variant="secondary" className="text-xs">
                              {stat.region}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Quality Tab */}
          <TabsContent value="quality" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quality Score Distribution */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-blue-400">Birth Time Quality Distribution</CardTitle>
                  <CardDescription>Classification of birth time accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(analyticsData.qualityMetrics?.qualityScores || {}).map(([grade, count]) => ({
                          name: grade,
                          value: count,
                          percentage: ((count / (analyticsData.qualityMetrics?.totalEntries || 1)) * 100).toFixed(1)
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(analyticsData.qualityMetrics?.qualityScores || {}).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Time Precision Analysis */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="text-orange-400">Time Precision Impact</CardTitle>
                  <CardDescription>How time accuracy affects astrological calculations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Rising Sign Changes</span>
                      <div className="flex items-center">
                        <Progress value={(89 / 4250) * 100} className="w-20 mr-2 h-2" />
                        <span className="text-white font-medium">89 cases</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">House Shifts</span>
                      <div className="flex items-center">
                        <Progress value={(156 / 4250) * 100} className="w-20 mr-2 h-2" />
                        <span className="text-white font-medium">156 cases</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Aspect Differences</span>
                      <div className="flex items-center">
                        <Progress value={(234 / 4250) * 100} className="w-20 mr-2 h-2" />
                        <span className="text-white font-medium">234 cases</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center text-yellow-400 text-sm font-medium mb-2">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Quality Insights
                    </div>
                    <ul className="text-xs text-yellow-300 space-y-1">
                      <li>• {((analyticsData.qualityMetrics?.exactTimes || 0) / (analyticsData.qualityMetrics?.totalEntries || 1) * 100).toFixed(1)}% of users provide exact birth times</li>
                      <li>• {((analyticsData.qualityMetrics?.roundedTimes || 0) / (analyticsData.qualityMetrics?.totalEntries || 1) * 100).toFixed(1)}% provide rounded times (potential accuracy issues)</li>
                      <li>• Time precision affects {((89 + 156 + 234) / (analyticsData.qualityMetrics?.totalEntries || 1) * 100).toFixed(1)}% of charts significantly</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quality Recommendations */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="text-purple-400">Data Quality Recommendations</CardTitle>
                <CardDescription>Actions to improve birth time accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-400 mb-3" />
                    <h4 className="font-semibold text-white mb-2">High Quality Data</h4>
                    <p className="text-sm text-gray-300">68% of entries are Grade A or A+</p>
                    <p className="text-xs text-green-400 mt-2">Above industry standard of 60%</p>
                  </div>
                  
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-yellow-400 mb-3" />
                    <h4 className="font-semibold text-white mb-2">Needs Attention</h4>
                    <p className="text-sm text-gray-300">28% have rounded times</p>
                    <p className="text-xs text-yellow-400 mt-2">Consider birth certificate helper</p>
                  </div>
                  
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-red-400 mb-3" />
                    <h4 className="font-semibold text-white mb-2">Low Quality</h4>
                    <p className="text-sm text-gray-300">4% unknown or unreliable</p>
                    <p className="text-xs text-red-400 mt-2">Recommend alternative scenarios</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional tabs would be implemented similarly */}
          <TabsContent value="geographic" className="space-y-6">
            <Card className="cosmic-card">
              <CardContent className="p-8 text-center">
                <Globe2 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Geographic Distribution Analysis</h3>
                <p className="text-gray-400">Interactive world map and regional usage patterns</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dst" className="space-y-6">
            <Card className="cosmic-card">
              <CardContent className="p-8 text-center">
                <Clock4 className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">DST Correction Analysis</h3>
                <p className="text-gray-400">Historical daylight saving time adjustments and accuracy metrics</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detection" className="space-y-6">
            <Card className="cosmic-card">
              <CardContent className="p-8 text-center">
                <Settings className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Auto-Detection Performance</h3>
                <p className="text-gray-400">Machine learning model performance and confidence scoring</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}