
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getCaseStats, getMonthName } from "@/lib/sample-data";

const CaseChart = () => {
  const { monthlyFiled, monthlyResolved } = getCaseStats();
  
  // Format data for chart
  const data = monthlyFiled.map((count, index) => ({
    name: getMonthName(index).slice(0, 3),
    filed: count,
    resolved: monthlyResolved[index]
  }));

  return (
    <Card className="hover-card-effect h-96">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Case Trends</CardTitle>
        <CardDescription>
          Monthly case filing and resolution rates
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "none"
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Bar dataKey="filed" name="Filed Cases" fill="#8884d8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="resolved" name="Resolved Cases" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CaseChart;
