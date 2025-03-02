import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ArrowLeft, Clock, User } from "lucide-react";
import { useCases } from '@/context/CaseContext';

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  ongoing: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  resolved: "bg-green-100 text-green-800 hover:bg-green-200",
  dismissed: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cases } = useCases();
  
  const caseData = cases.find(c => c.id === id);

  if (!caseData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container py-8">
          <Button
            variant="outline"
            size="sm"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <h1 className="text-2xl font-bold mb-2">Case Not Found</h1>
            <p className="text-muted-foreground">
              The case you're looking for doesn't exist or has been removed.
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate("/cases")}
            >
              View All Cases
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => navigate(`/cases/${id}/edit`)}>
            Edit Case
          </Button>
        </div>

        <div className="grid gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{caseData.title}</h1>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className={statusColors[caseData.status]}>
                {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Filed on {format(new Date(caseData.filedDate), "MMMM d, yyyy")}
              </span>
            </div>
            <p className="text-muted-foreground mt-4">{caseData.description}</p>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Case Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Type</h4>
                  <p className="text-muted-foreground">
                    {caseData.type.charAt(0).toUpperCase() + caseData.type.slice(1)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Status</h4>
                  <p className="text-muted-foreground">
                    {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
                  </p>
                </div>
                {caseData.resolvedDate && (
                  <div>
                    <h4 className="font-medium">Resolved Date</h4>
                    <p className="text-muted-foreground">
                      {format(new Date(caseData.resolvedDate), "MMMM d, yyyy")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Involved Parties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-medium">{caseData.complainant}</p>
                    <p className="text-sm text-muted-foreground">Complainant</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-medium">{caseData.respondent}</p>
                    <p className="text-sm text-muted-foreground">Respondent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseDetail;
