
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCaseStats, getMonthName } from "@/lib/sample-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F", "#FFBB28", "#FF8042"];

const Analytics = () => {
  const { byStatus, byType, monthlyFiled, monthlyResolved } = getCaseStats();

  // Format status data for pie chart
  const statusData = Object.entries(byStatus).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));

  // Format type data for bar chart
  const typeData = Object.entries(byType).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));

  // Format monthly data for line chart
  const monthlyData = monthlyFiled.map((filed, index) => ({
    name: getMonthName(index).slice(0, 3),
    filed,
    resolved: monthlyResolved[index],
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Insightful visualization of case data
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="status">By Status</TabsTrigger>
              <TabsTrigger value="type">By Type</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="hover-card-effect">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Case Status Distribution</CardTitle>
                    <CardDescription>Breakdown of cases by current status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover-card-effect">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Case Type Distribution</CardTitle>
                    <CardDescription>Breakdown of cases by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={typeData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={80} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" barSize={20} radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="hover-card-effect">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Case Filing and Resolution Trends</CardTitle>
                  <CardDescription>Monthly comparison of new and resolved cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="filed" 
                          name="Filed Cases" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="resolved" 
                          name="Resolved Cases" 
                          stroke="#82ca9d" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="status" className="mt-6">
              <Card className="hover-card-effect">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Detailed Case Status Analysis</CardTitle>
                  <CardDescription>Comprehensive breakdown of cases by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          labelLine={true}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="type" className="mt-6">
              <Card className="hover-card-effect">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Case Type Analysis</CardTitle>
                  <CardDescription>Distribution of cases by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={typeData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name="Number of Cases" 
                          fill="#8884d8" 
                          radius={[4, 4, 0, 0]}
                          label={{ position: 'top' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trends" className="mt-6">
              <Card className="hover-card-effect">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Case Trends Over Time</CardTitle>
                  <CardDescription>Monthly tracking of case filing and resolution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="filed" 
                          name="Filed Cases" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="resolved" 
                          name="Resolved Cases" 
                          stroke="#82ca9d" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
