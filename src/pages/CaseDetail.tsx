
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCaseById } from "@/lib/sample-data";
import { format } from "date-fns";
import { ArrowLeft, Clock, User } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  ongoing: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  resolved: "bg-green-100 text-green-800 hover:bg-green-200",
  dismissed: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseData = getCaseById(id || "");

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
    <div className="min-h-screen flex flex-col bg-background page-transition">
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

        <div className="grid gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {caseData.title}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className={statusColors[caseData.status]}
                  >
                    {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Filed on {format(new Date(caseData.filedDate), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground mt-1">{caseData.description}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Complainant</h3>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    {caseData.complainant}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Respondent</h3>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    {caseData.respondent}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Case Type</h3>
                  <p className="text-muted-foreground mt-1">
                    {caseData.type.charAt(0).toUpperCase() + caseData.type.slice(1)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Last Updated</h3>
                  <p className="text-muted-foreground mt-1">
                    {format(new Date(caseData.updatedAt), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              {caseData.resolvedDate && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium">Resolution Date</h3>
                    <p className="text-muted-foreground mt-1">
                      {format(new Date(caseData.resolvedDate), "MMMM d, yyyy")}
                    </p>
                  </div>
                </>
              )}
              
              {caseData.tags && caseData.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {caseData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CaseDetail;
