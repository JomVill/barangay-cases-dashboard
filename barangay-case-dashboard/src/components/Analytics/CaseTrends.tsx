import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useCases } from "@/context/CaseContext";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CaseTrends = () => {
  const { cases } = useCases();

  // Group cases by month
  const monthlyData = cases.reduce((acc, caseItem) => {
    const filedMonth = new Date(caseItem.filedDate).toLocaleString('default', { month: 'short' });
    const resolvedMonth = caseItem.resolvedDate 
      ? new Date(caseItem.resolvedDate).toLocaleString('default', { month: 'short' })
      : null;

    // Count filed cases
    acc[filedMonth] = acc[filedMonth] || { filed: 0, resolved: 0 };
    acc[filedMonth].filed++;

    // Count resolved cases
    if (resolvedMonth) {
      acc[resolvedMonth] = acc[resolvedMonth] || { filed: 0, resolved: 0 };
      acc[resolvedMonth].resolved++;
    }

    return acc;
  }, {});

  // Sort months chronologically
  const months = Object.keys(monthlyData).sort((a, b) => {
    return new Date(Date.parse(`${a} 1, 2024`)) - new Date(Date.parse(`${b} 1, 2024`));
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Filed Cases',
        data: months.map(month => monthlyData[month].filed),
        backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Resolved Cases',
        data: months.map(month => monthlyData[month].resolved),
        backgroundColor: 'rgba(34, 197, 94, 0.5)', // Green
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Monthly Case Filing and Resolution Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseTrends; 