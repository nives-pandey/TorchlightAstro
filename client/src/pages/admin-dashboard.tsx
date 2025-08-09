import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, MapPin, BarChart3, Calendar, Sparkles, Globe, Clock, TrendingUp } from "lucide-react";
import EnhancedAdminDashboard from "@/components/enhanced-admin-dashboard";

interface AdminStats {
  totalUsers: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalCharts: number;
  chartsThisWeek: number;
  topCities: Array<{ city: string; count: number; country: string }>;
  systemPopularity: Array<{ system: string; count: number; percentage: number }>;
  dailyGrowth: Array<{ date: string; users: number; charts: number }>;
  peakUsageTimes: Array<{ hour: number; activity: number }>;
}

const COLORS = ['hsl(44, 45%, 65%)', 'hsl(180, 25%, 55%)', 'hsl(30, 5%, 66%)', 'hsl(60, 10%, 96%)', 'hsl(30, 8%, 18%)', 'hsl(44, 45%, 65%)'];

export default function AdminDashboard() {
  // Use the new enhanced admin dashboard with timezone analytics
  return <EnhancedAdminDashboard />;
}

function LegacyAdminDashboard() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/analytics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{background: 'var(--cosmic-gradient-1)'}}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{background: 'var(--cosmic-gradient-1)'}}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-yellow-600" />
            Torchlight Admin Dashboard
          </h1>
          <p className="text-gray-300">Real-time analytics and user insights</p>
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
            <Clock className="h-4 w-4" />
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="sanctuary-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{stats?.newUsersThisWeek} this week
              </p>
            </CardContent>
          </Card>

          <Card className="sanctuary-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Charts Generated</CardTitle>
              <Sparkles className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalCharts.toLocaleString()}</div>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{stats?.chartsThisWeek} this week
              </p>
            </CardContent>
          </Card>

          <Card className="sanctuary-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">New Users (Month)</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.newUsersThisMonth.toLocaleString()}</div>
              <p className="text-xs text-gray-400">Monthly growth</p>
            </CardContent>
          </Card>

          <Card className="sanctuary-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Countries</CardTitle>
              <Globe className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {new Set(stats?.topCities.map(c => c.country)).size}
              </div>
              <p className="text-xs text-gray-400">Geographic reach</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Cities */}
          <Card className="sanctuary-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-yellow-600" />
                Top Cities
              </CardTitle>
              <CardDescription className="text-gray-400">
                Most popular birth locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.topCities.slice(0, 8).map((city, index) => (
                  <div key={city.city} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="text-white font-medium">{city.city}</div>
                        <div className="text-gray-400 text-sm">{city.country}</div>
                      </div>
                    </div>
                    <div className="text-yellow-600 font-semibold">{city.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Popularity */}
          <Card className="sanctuary-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-yellow-600" />
                System Popularity
              </CardTitle>
              <CardDescription className="text-gray-400">
                Most requested astrology systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats?.systemPopularity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ system, percentage }) => `${system} ${percentage}%`}
                    outerRadius={80}
                    fill="hsl(44, 45%, 65%)"
                    dataKey="count"
                  >
                    {stats?.systemPopularity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Growth Chart */}
        <Card className="sanctuary-card mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              User Growth Trend
            </CardTitle>
            <CardDescription className="text-gray-400">
              Daily user registrations and chart generations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.dailyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 8%, 18%)" />
                <XAxis dataKey="date" stroke="hsl(30, 5%, 66%)" />
                <YAxis stroke="hsl(30, 5%, 66%)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(30, 8%, 18%)', 
                    border: '1px solid hsl(30, 5%, 66%)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="hsl(44, 45%, 65%)" 
                  strokeWidth={2}
                  name="New Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="charts" 
                  stroke="hsl(180, 25%, 55%)" 
                  strokeWidth={2}
                  name="Charts Created"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Access Instructions */}
        <Card className="sanctuary-card border-yellow-600/30">
          <CardHeader>
            <CardTitle className="text-yellow-600 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              How to Access This Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="space-y-3">
              <p><strong className="text-white">URL:</strong> https://your-torchlight-app.replit.app/admin</p>
              <p><strong className="text-white">Auto-refresh:</strong> Updates every 30 seconds</p>
              <p><strong className="text-white">Mobile-friendly:</strong> Responsive design works on all devices</p>
              <p><strong className="text-white">Real-time data:</strong> All metrics are live from your PostgreSQL database</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}