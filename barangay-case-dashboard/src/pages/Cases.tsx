import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CaseTable from "@/components/Cases/CaseTable";
import NewCaseForm from "@/components/Cases/NewCaseForm";
import { CaseStatus, CaseType, Case } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, Plus, Upload, ArrowRight } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { useCases } from '@/context/CaseContext';
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import Papa from 'papaparse';
import Footer from "@/components/Footer";

const caseTypePrefixes: Record<CaseType, string> = {
  dispute: "DS",
  domestic: "DM",
  property: "PR",
  noise: "NO",
  theft: "TH",
  vandalism: "VD",
  harassment: "HR",
  other: "OT"
};

// Add interface for column mapping
interface ColumnMapping {
  title: string;
  description: string;
  type: string;
  status: string;
  complainant: string;
  respondent: string;
  filedDate: string;
  resolvedDate: string;
}

const Cases = () => {
  const { cases, setCases } = useCases();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isNewCaseDialogOpen, setIsNewCaseDialogOpen] = useState(false);
  
  // Import state
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Add state for column mapping
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    title: "",
    description: "",
    type: "",
    status: "",
    complainant: "",
    respondent: "",
    filedDate: "",
    resolvedDate: "",
  });
  const [csvData, setCsvData] = useState<any[]>([]);
  const [showMappingDialog, setShowMappingDialog] = useState(false);

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
    setCases(prevCases => prevCases.filter(caseItem => caseItem.id !== id));
  };

  const handleUpdateStatus = (id: string, status: CaseStatus) => {
    setCases(prevCases => prevCases.map(caseItem => 
      caseItem.id === id 
        ? { 
            ...caseItem, 
            status, 
            updatedAt: new Date().toISOString().split('T')[0],
            ...(status === 'resolved' && !caseItem.resolvedDate ? { resolvedDate: new Date().toISOString().split('T')[0] } : {})
          } 
        : caseItem
    ));
  };

  const handleSaveNewCase = (newCaseData: Omit<Case, "id" | "updatedAt">) => {
    const typePrefix = caseTypePrefixes[newCaseData.type];
    const currentYear = new Date().getFullYear();
    
    const typeYearPattern = `${typePrefix}-${currentYear}`;
    const existingCasesOfType = cases
      .filter(c => c.id.startsWith(typeYearPattern))
      .map(c => parseInt(c.id.split('-')[2]));
    
    const nextNumber = existingCasesOfType.length > 0 
      ? Math.max(...existingCasesOfType) + 1 
      : 1;
    
    const newCase: Case = {
      ...newCaseData,
      id: `${typePrefix}-${currentYear}-${String(nextNumber).padStart(3, '0')}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setCases([...cases, newCase]);
    setIsNewCaseDialogOpen(false);
    toast.success("New case created successfully");
  };

  // Modify the export function to handle selected cases
  const handleExport = (selectedIds?: string[]) => {
    // If selectedIds is provided, filter cases to only those selected
    const casesToExport = selectedIds && selectedIds.length > 0
      ? cases.filter(caseItem => selectedIds.includes(caseItem.id))
      : cases;
    
    // Define CSV headers
    const headers = [
      "Case ID",
      "Title",
      "Description",
      "Type",
      "Status",
      "Complainant",
      "Respondent",
      "Filed Date",
      "Resolved Date",
      "Updated At"
    ].join(",");

    // Convert cases to CSV rows
    const csvRows = casesToExport.map(caseItem => {
      return [
        caseItem.id,
        `"${caseItem.title.replace(/"/g, '""')}"`, // Handle quotes in title
        `"${caseItem.description.replace(/"/g, '""')}"`, // Handle quotes in description
        caseItem.type,
        caseItem.status,
        `"${caseItem.complainant.replace(/"/g, '""')}"`,
        `"${caseItem.respondent.replace(/"/g, '""')}"`,
        caseItem.filedDate,
        caseItem.resolvedDate || "",
        caseItem.updatedAt
      ].join(",");
    });

    // Combine headers and rows
    const csvContent = [headers, ...csvRows].join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    // Setup download link
    link.setAttribute("href", url);
    
    const exportLabel = selectedIds 
      ? `${selectedIds.length}_selected_cases_${new Date().toISOString().split('T')[0]}.csv`
      : `all_cases_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute("download", exportLabel);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${casesToExport.length} cases exported successfully`);
  };

  // Replace the handleFileInput function with this simplified version
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple validation
    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    // Show import dialog immediately
    setIsImporting(true);
    setImportProgress(0);
    setImportErrors([]);
    setShowImportDialog(true);

    // Parse CSV directly without mapping
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            setImportErrors(["No data found in CSV file"]);
            setIsImporting(false);
            return;
          }

          const newCases: Case[] = [];
          const errors: string[] = [];
          const today = new Date().toISOString().split('T')[0];
          
          // Process each row
          results.data.forEach((row: any, index: number) => {
            try {
              const rowNumber = index + 2; // +2 because we're 0-indexed and skipped header row
              
              // Required fields validation
              if (!row.Title) {
                errors.push(`Row ${rowNumber}: Missing required field 'Title'`);
                return;
              }
              
              if (!row.Complainant) {
                errors.push(`Row ${rowNumber}: Missing required field 'Complainant'`);
                return;
              }
              
              if (!row.Respondent) {
                errors.push(`Row ${rowNumber}: Missing required field 'Respondent'`);
                return;
              }
              
              // Validate and default type
              const typeValue = row.Type?.toLowerCase();
              const caseType = (typeValue && ["dispute", "domestic", "property", "noise", "theft", "vandalism", "harassment", "other"].includes(typeValue))
                ? typeValue as CaseType
                : "other";
              
              // Validate and default status
              const statusValue = row.Status?.toLowerCase();
              const caseStatus = (statusValue && ["pending", "ongoing", "resolved", "dismissed"].includes(statusValue))
                ? statusValue as CaseStatus
                : "pending";
              
              // Generate Case ID
              const typePrefix = caseTypePrefixes[caseType];
              const currentYear = new Date().getFullYear();
              
              const typeYearPattern = `${typePrefix}-${currentYear}`;
              const existingCasesOfType = [...cases, ...newCases]
                .filter(c => c.id.startsWith(typeYearPattern))
                .map(c => parseInt(c.id.split('-')[2]));
              
              const nextNumber = existingCasesOfType.length > 0 
                ? Math.max(...existingCasesOfType) + 1 
                : 1;
              
              const caseId = `${typePrefix}-${currentYear}-${String(nextNumber).padStart(3, '0')}`;
              
              // Create the new case
              const newCase: Case = {
                id: caseId,
                title: row.Title,
                description: row.Description || "",
                type: caseType,
                status: caseStatus,
                complainant: row.Complainant,
                respondent: row.Respondent,
                filedDate: row.FiledDate || today,
                resolvedDate: caseStatus === 'resolved' ? (row.ResolvedDate || today) : undefined,
                updatedAt: today,
                tags: [caseType]
              };
              
              newCases.push(newCase);
              
              // Update progress
              setImportProgress(Math.round(((index + 1) / results.data.length) * 100));
              
            } catch (error) {
              errors.push(`Row ${index + 2}: ${(error as Error).message}`);
            }
          });
          
          // Update state with errors
          setImportErrors(errors);
          setIsImporting(false);
          
          // If we have cases to add
          if (newCases.length > 0) {
            setCases([...cases, ...newCases]);
            toast.success(`Successfully imported ${newCases.length} cases`);
            
            if (errors.length > 0) {
              toast.warning(`Import completed with ${errors.length} errors`);
            }
          } else if (errors.length > 0) {
            toast.error(`Import failed with ${errors.length} errors`);
          } else {
            toast.error("No valid cases found in the CSV file");
          }
        } catch (error) {
          console.error("Error processing CSV:", error);
          setImportErrors([`Error processing CSV: ${(error as Error).message}`]);
          setIsImporting(false);
        }
      },
      error: (error) => {
        console.error("Papa Parse error:", error);
        setImportErrors([`Error parsing CSV: ${error.message}`]);
        setIsImporting(false);
      }
    });
    
    // Reset the file input
    e.target.value = '';
  };

  // Add this function back to the component
  const handleMappingChange = (field: keyof ColumnMapping, value: string) => {
    setColumnMapping({
      ...columnMapping,
      [field]: value
    });
  };

  // Add this function back to the component
  const processImport = () => {
    // This function is no longer used in our simplified approach,
    // but it's still referenced in the JSX
    setShowMappingDialog(false);
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
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Case
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setIsNewCaseDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Manually
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => document.getElementById('csv-input')?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import from CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <input
                type="file"
                id="csv-input"
                accept=".csv"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
          </div>

          <div className="space-y-4">
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
              onExportCases={(selectedIds) => handleExport(selectedIds)}
            />
          </div>
        </div>
      </main>

      <Footer />

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

      {/* Import Progress Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Importing Cases</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isImporting ? (
              <div className="space-y-2">
                <p>Processing CSV file...</p>
                <Progress value={importProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">{importProgress}% complete</p>
              </div>
            ) : (
              <div className="space-y-4">
                {importErrors.length > 0 ? (
                  <div className="space-y-2">
                    <p className="font-medium text-red-500">
                      Import completed with {importErrors.length} errors:
                    </p>
                    <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-red-50">
                      <ul className="list-disc pl-5 space-y-1">
                        {importErrors.map((error, i) => (
                          <li key={i} className="text-sm text-red-600">{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-green-600">Import completed successfully!</p>
                )}
                <div className="flex justify-end">
                  <Button onClick={() => setShowImportDialog(false)}>Close</Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Column Mapping Dialog - Simplified to avoid errors */}
      <Dialog open={showMappingDialog} onOpenChange={setShowMappingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Map CSV Columns</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>This feature is currently disabled. Using direct import instead.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowMappingDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cases;
