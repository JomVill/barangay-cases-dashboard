import React from "react";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/Dashboard/StatCard";
import RecentCases from "@/components/Dashboard/RecentCases";
import CaseChart from "@/components/Dashboard/CaseChart";
import { FileText, Users, AlertCircle, CheckCircle } from "lucide-react";
import { useCases } from '@/context/CaseContext';
import Footer from "@/components/Footer";

const Index = () => {
  const { cases } = useCases();

  // Calculate statistics dynamically
  const stats = {
    total: cases.length,
    byStatus: {
      pending: cases.filter(caseItem => caseItem.status === 'pending').length,
      ongoing: cases.filter(caseItem => caseItem.status === 'ongoing').length,
      resolved: cases.filter(caseItem => caseItem.status === 'resolved').length,
      dismissed: cases.filter(caseItem => caseItem.status === 'dismissed').length
    }
  };

  // Calculate success rate
  const totalClosedCases = stats.byStatus.resolved + stats.byStatus.dismissed;
  const successRate = totalClosedCases > 0 
    ? Math.round((stats.byStatus.resolved / totalClosedCases) * 100)
    : 0;

  // Calculate resolved cases trend
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of current and previous month
  const currentMonthStart = new Date(currentYear, currentMonth, 1);
  const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);

  // Count resolved cases for current and previous month
  const currentMonthResolved = cases.filter(caseItem => 
    caseItem.status === 'resolved' && 
    caseItem.resolvedDate && // Check if resolvedDate exists
    new Date(caseItem.resolvedDate) >= currentMonthStart &&
    new Date(caseItem.resolvedDate) <= currentDate // Only count up to current date
  ).length;

  const previousMonthResolved = cases.filter(caseItem => 
    caseItem.status === 'resolved' && 
    caseItem.resolvedDate && // Check if resolvedDate exists
    new Date(caseItem.resolvedDate) >= previousMonthStart && 
    new Date(caseItem.resolvedDate) < currentMonthStart
  ).length;

  // Calculate percentage change with better handling
  let resolvedTrend = 0;
  if (previousMonthResolved === 0 && currentMonthResolved === 0) {
    resolvedTrend = 0; // No change if both months have 0
  } else if (previousMonthResolved === 0) {
    resolvedTrend = currentMonthResolved > 0 ? 100 : 0; // Show 100% only if we have cases this month
  } else {
    resolvedTrend = Math.round(((currentMonthResolved - previousMonthResolved) / previousMonthResolved) * 100);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome to your Barangay Case Management System
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              title="Total Cases"
              value={stats.total}
              icon={<FileText />}
              description="All time cases"
            />
            <StatCard
              title="Pending"
              value={stats.byStatus.pending}
              icon={<AlertCircle />}
              description="Awaiting action"
            />
            <StatCard
              title="Ongoing"
              value={stats.byStatus.ongoing}
              icon={<Users />}
              description="Currently being processed"
            />
            <StatCard
              title="Resolved"
              value={stats.byStatus.resolved}
              icon={<CheckCircle />}
              description="Successfully closed cases"
              trend={{ 
                value: successRate,
                isPositive: true // Success rate is always shown as positive
              }}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <CaseChart />
            </div>
            <div className="md:col-span-1">
              <RecentCases />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
