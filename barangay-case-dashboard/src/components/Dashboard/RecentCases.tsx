import React, { useState } from 'react';
import { useCases } from '@/context/CaseContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Case, CaseStatus } from "@/lib/sample-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit, ChevronRight } from "lucide-react";
import { CaseEditForm } from "@/components/Cases/CaseEditForm";
import { Link } from "react-router-dom";

const statusColors: Record<CaseStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  ongoing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  resolved: "bg-green-100 text-green-800 hover:bg-green-100",
  dismissed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

const RecentCases = () => {
  const { cases } = useCases();
  const [caseToView, setCaseToView] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("details");
  
  // Sort cases by updated date (newest first)
  const recentCases = [...cases]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
    
  const viewedCase = cases.find(c => c.id === caseToView);
  
  const handleCaseClick = (id: string) => {
    setCaseToView(id);
    setActiveTab("details");
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Cases</CardTitle>
          <CardDescription>Latest case updates in your barangay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCases.length > 0 ? (
              recentCases.map((caseItem) => (
                <div 
                  key={caseItem.id} 
                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent any default navigation
                    handleCaseClick(caseItem.id);
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm">{caseItem.title}</h3>
                    <Badge className={statusColors[caseItem.status]}>
                      {caseItem.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {caseItem.complainant} vs. {caseItem.respondent}
                  </div>
                  {caseItem.tags && caseItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {caseItem.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    Updated {format(new Date(caseItem.updatedAt), "MMM d, yyyy")}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No cases found
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Link to="/cases">
            <Button variant="outline" className="w-full flex items-center justify-center">
              Show all cases
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      
      {/* Case view/edit dialog */}
      <Dialog open={!!caseToView} onOpenChange={(open) => !open && setCaseToView(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewedCase?.title || "Case Details"}</DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              {viewedCase && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Case Type</h3>
                      <p className="capitalize">{viewedCase.type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <Badge className={statusColors[viewedCase.status]}>
                        {viewedCase.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p>{viewedCase.description || "No description provided."}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Complainant</h3>
                      <p>{viewedCase.complainant}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Respondent</h3>
                      <p>{viewedCase.respondent}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Filed Date</h3>
                      <p>{format(new Date(viewedCase.filedDate), "MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                      <p>{format(new Date(viewedCase.updatedAt), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  
                  {viewedCase.resolvedDate && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Resolved Date</h3>
                      <p>{format(new Date(viewedCase.resolvedDate), "MMM d, yyyy")}</p>
                    </div>
                  )}
                  
                  {viewedCase.tags && viewedCase.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {viewedCase.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button onClick={() => setActiveTab("edit")}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Case
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="edit">
              {caseToView && (
                <CaseEditForm
                  caseId={caseToView}
                  onSave={() => setCaseToView(null)}
                  onCancel={() => setActiveTab("details")}
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecentCases;
