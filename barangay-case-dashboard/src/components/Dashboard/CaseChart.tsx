import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCases } from '@/context/CaseContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CaseStatus } from '@/lib/sample-data';

const CaseChart = () => {
  const { cases } = useCases();
  const [timeRange, setTimeRange] = useState<string>("30days");
  
  // Get current date for filtering
  const currentDate = new Date();
  
  // Determine start date based on selected time range
  let startDate = new Date();
  if (timeRange === "7days") {
    startDate.setDate(currentDate.getDate() - 7);
  } else if (timeRange === "30days") {
    startDate.setDate(currentDate.getDate() - 30);
  } else if (timeRange === "monthly") {
    // Current month only
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  } else if (timeRange === "6months") {
    startDate.setMonth(currentDate.getMonth() - 6);
  } else if (timeRange === "yearly") {
    startDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
  }
  
  // Filter cases based on time range
  const filteredCases = cases.filter(caseItem => {
    const filedDate = new Date(caseItem.filedDate);
    return filedDate >= startDate && filedDate <= currentDate;
  });
  
  // Prepare data for chart
  const prepareChartData = () => {
    const data: Record<string, any>[] = [];
    
    // Determine date format and grouping based on time range
    let dateFormat: Intl.DateTimeFormatOptions;
    let groupByDay = true;
    
    if (timeRange === "7days" || timeRange === "30days" || timeRange === "monthly") {
      dateFormat = timeRange === "monthly" ? { day: 'numeric' } : { month: 'short', day: 'numeric' };
      groupByDay = true;
    } else {
      dateFormat = timeRange === "yearly" ? { month: 'short' } : { month: 'short', year: 'numeric' };
      groupByDay = false;
    }
    
    // Create a map to store counts by date and status
    const countsByDateAndStatus: Record<string, Record<CaseStatus, number>> = {};
    
    // Initialize with all dates in the range
    let currentDatePointer = new Date(startDate);
    while (currentDatePointer <= currentDate) {
      let dateKey: string;
      
      if (groupByDay) {
        dateKey = `${currentDatePointer.getMonth() + 1}-${currentDatePointer.getDate()}-${currentDatePointer.getFullYear()}`;
        // Increment by day
        currentDatePointer.setDate(currentDatePointer.getDate() + 1);
      } else {
        dateKey = `${currentDatePointer.getMonth() + 1}-${currentDatePointer.getFullYear()}`;
        // Increment by month
        currentDatePointer.setMonth(currentDatePointer.getMonth() + 1);
      }
      
      countsByDateAndStatus[dateKey] = {
        pending: 0,
        ongoing: 0,
        resolved: 0,
        dismissed: 0
      };
    }
    
    // Count cases by date and status
    filteredCases.forEach(caseItem => {
      const filedDate = new Date(caseItem.filedDate);
      let dateKey: string;
      
      if (groupByDay) {
        dateKey = `${filedDate.getMonth() + 1}-${filedDate.getDate()}-${filedDate.getFullYear()}`;
      } else {
        dateKey = `${filedDate.getMonth() + 1}-${filedDate.getFullYear()}`;
      }
      
      if (countsByDateAndStatus[dateKey]) {
        countsByDateAndStatus[dateKey][caseItem.status]++;
      }
    });
    
    // Convert to array for chart
    Object.entries(countsByDateAndStatus).forEach(([dateKey, counts]) => {
      let date: Date;
      
      if (groupByDay) {
        const [month, day, year] = dateKey.split('-').map(Number);
        date = new Date(year, month - 1, day);
      } else {
        const [month, year] = dateKey.split('-').map(Number);
        date = new Date(year, month - 1, 1);
      }
      
      const formattedDate = date.toLocaleDateString('en-US', dateFormat);
      
      data.push({
        date: formattedDate,
        pending: counts.pending,
        ongoing: counts.ongoing,
        resolved: counts.resolved,
        dismissed: counts.dismissed,
        total: counts.pending + counts.ongoing + counts.resolved + counts.dismissed
      });
    });
    
    // Sort by date
    data.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    
    return data;
  };
  
  const chartData = prepareChartData();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Case Trends</CardTitle>
          <CardDescription>Number of cases filed over time</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="monthly">This Month</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="yearly">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" />
              <Bar dataKey="ongoing" name="Ongoing" fill="#3b82f6" />
              <Bar dataKey="resolved" name="Resolved" fill="#10b981" />
              <Bar dataKey="dismissed" name="Dismissed" fill="#6b7280" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseChart;
