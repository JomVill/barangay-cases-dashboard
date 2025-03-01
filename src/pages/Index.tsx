
import React from "react";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/Dashboard/StatCard";
import RecentCases from "@/components/Dashboard/RecentCases";
import CaseChart from "@/components/Dashboard/CaseChart";
import { getCaseStats } from "@/lib/sample-data";
import { FileText, Users, AlertCircle, CheckCircle } from "lucide-react";

const Index = () => {
  const stats = getCaseStats();

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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Cases"
              value={stats.total}
              icon={<FileText />}
              description="All cases in the system"
            />
            <StatCard
              title="Pending"
              value={stats.byStatus.pending}
              icon={<AlertCircle />}
              description="Awaiting initial action"
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
              trend={{ value: 12, isPositive: true }}
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
    </div>
  );
};

export default Index;
