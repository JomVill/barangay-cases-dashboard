
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import CaseImport from "@/components/Cases/CaseImport";
import CaseTable from "@/components/Cases/CaseTable";
import NewCaseForm from "@/components/Cases/NewCaseForm";
import { sampleCases, CaseStatus, CaseType, Case } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Cases = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [cases, setCases] = useState<Case[]>(sampleCases);
  const [isNewCaseDialogOpen, setIsNewCaseDialogOpen] = useState(false);

  const filteredCases = cases.filter((caseItem) => {
    const matchesStatus = statusFilter === "all" || caseItem.status === statusFilter;
    const matchesType = typeFilter === "all" || caseItem.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const caseTypes: CaseType[] = [
    "dispute", 
    "domestic", 
    "property", 
    "noise", 
    "theft", 
    "vandalism", 
    "harassment", 
    "other"
  ];
  
  const caseStatuses: CaseStatus[] = [
    "pending", 
    "ongoing", 
    "resolved", 
    "dismissed"
  ];

  const handleDeleteCase = (id: string) => {
    setCases(cases.filter(caseItem => caseItem.id !== id));
  };

  const handleUpdateStatus = (id: string, status: CaseStatus) => {
    setCases(cases.map(caseItem => 
      caseItem.id === id 
        ? { 
            ...caseItem, 
            status, 
            updatedAt: new Date().toISOString().split('T')[0],
            ...(status === 'resolved' ? { resolvedDate: new Date().toISOString().split('T')[0] } : {})
          } 
        : caseItem
    ));
  };

  const handleSaveNewCase = (newCaseData: Omit<Case, "id" | "updatedAt">) => {
    const lastId = cases.length > 0 
      ? parseInt(cases[cases.length - 1].id.split('-')[2]) 
      : 0;
    
    const newCase: Case = {
      ...newCaseData,
      id: `CASE-${new Date().getFullYear()}-${String(lastId + 1).padStart(3, '0')}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setCases([...cases, newCase]);
    setIsNewCaseDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track all cases in your barangay
              </p>
            </div>
            <Button 
              className="self-start md:self-auto"
              onClick={() => setIsNewCaseDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Case
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <CaseImport />
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="bg-card p-4 rounded-lg border shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="status-filter">Filter by Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger id="status-filter">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {caseStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type-filter">Filter by Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger id="type-filter">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {caseTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <CaseTable 
                data={filteredCases} 
                onDeleteCase={handleDeleteCase}
                onUpdateStatus={handleUpdateStatus}
              />
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isNewCaseDialogOpen} onOpenChange={setIsNewCaseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Case</DialogTitle>
          </DialogHeader>
          <NewCaseForm 
            onSaveCase={handleSaveNewCase} 
            onCancel={() => setIsNewCaseDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cases;
