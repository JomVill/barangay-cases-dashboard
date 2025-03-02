import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CaseStatus, CaseType } from "@/lib/sample-data";
import { useCases } from '@/context/CaseContext';
import { toast } from "sonner";
import { Case } from "@/lib/sample-data";

const CaseImport = () => {
  const { cases, setCases } = useCases();
  const [isDragging, setIsDragging] = useState(false);
  
  // Manual case form state
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [caseType, setCaseType] = useState<CaseType>("dispute");
  const [customCaseType, setCustomCaseType] = useState("");
  const [caseStatus, setCaseStatus] = useState<CaseStatus>("pending");
  const [complainant, setComplainant] = useState("");
  const [respondent, setRespondent] = useState("");

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      handleFile(file);
    } else {
      toast.error("Please upload a CSV file", {
        dismissible: true,
        duration: 4000
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      handleFile(file);
    } else {
      toast.error("Please upload a CSV file", {
        dismissible: true,
        duration: 4000
      });
    }
  };

  const handleFileRead = (content: string) => {
    try {
      // Split content into lines and remove empty lines
      const lines = content.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());

      // Parse CSV rows into cases
      const newCases: Case[] = lines.slice(1).map(line => {
        // Split by comma but respect quotes
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
          ?.map(v => v.replace(/^"|"$/g, '').trim()) || [];

        // Validate case type and status
        const type = values[headers.indexOf("Type")] as CaseType;
        const status = values[headers.indexOf("Status")] as CaseStatus;

        return {
          id: values[headers.indexOf("Case ID")],
          title: values[headers.indexOf("Title")],
          description: values[headers.indexOf("Description")],
          type: type,
          status: status,
          complainant: values[headers.indexOf("Complainant")],
          respondent: values[headers.indexOf("Respondent")],
          filedDate: values[headers.indexOf("Filed Date")],
          resolvedDate: values[headers.indexOf("Resolved Date")] || null,
          updatedAt: values[headers.indexOf("Updated At")],
          tags: [type] // Add default tag based on type
        };
      });

      // Update cases in context and local storage
      const updatedCases = [...cases, ...newCases];
      setCases(updatedCases);
      localStorage.setItem('barangayCases', JSON.stringify(updatedCases));
      
      toast.success(`Successfully imported ${newCases.length} cases`, {
        dismissible: true,
        duration: 3000
      });
    } catch (error) {
      console.error('Import error:', error);
      toast.error("Error importing cases. Please check the file format.", {
        dismissible: true,
        duration: 4000
      });
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      handleFileRead(content);
    };
    reader.readAsText(file);
  };

  const handleManualImport = () => {
    // Validate form
    if (!caseTitle || !complainant || !respondent) {
      toast.error("Please fill in all required fields", {
        dismissible: true,
        duration: 4000
      });
      return;
    }
    
    // Validate custom case type if "other" is selected
    if (caseType === "other" && !customCaseType.trim()) {
      toast.error("Please specify the custom case type", {
        dismissible: true,
        duration: 4000
      });
      return;
    }

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Get type prefix based on case type
    const getTypePrefix = (type: CaseType): string => {
      const prefixMap: Record<CaseType, string> = {
        dispute: "DS",
        domestic: "DM",
        property: "PR",
        noise: "NO",
        theft: "TH",
        vandalism: "VD",
        harassment: "HR",
        other: "OT"
      };
      return prefixMap[type];
    };

    // Find the highest case number for the current type and year
    const typePrefix = getTypePrefix(caseType);
    const regex = new RegExp(`^${typePrefix}-${currentYear}-(\\d{3})$`);
    
    const existingNumbers = cases
      .map(c => {
        const match = c.id.match(regex);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => n > 0);

    const nextNumber = existingNumbers.length > 0 
      ? Math.max(...existingNumbers) + 1 
      : 1;

    // Create new case
    const newCase: Case = {
      id: `${typePrefix}-${currentYear}-${String(nextNumber).padStart(3, '0')}`,
      title: caseTitle,
      description: caseDescription || "No description provided",
      type: caseType === "other" ? customCaseType : caseType,
      status: caseStatus,
      complainant,
      respondent,
      filedDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      tags: [caseType]
    };

    // Update cases
    const updatedCases = [...cases, newCase];
    setCases(updatedCases);
    localStorage.setItem('barangayCases', JSON.stringify(updatedCases));
    
    toast.success("Case created successfully", {
      dismissible: true,
      duration: 3000
    });
    
    // Reset form
    setCaseTitle("");
    setCaseDescription("");
    setCaseType("dispute");
    setCustomCaseType("");
    setCaseStatus("pending");
    setComplainant("");
    setRespondent("");
  };

  const caseTypes: CaseType[] = ["dispute", "domestic", "property", "noise", "theft", "vandalism", "harassment", "other"];
  const caseStatuses: CaseStatus[] = ["pending", "ongoing", "resolved", "dismissed"];

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-2 space-y-0">
        <CardTitle className="text-base">Import Cases</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Tabs defaultValue="csv" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-7">
            <TabsTrigger value="csv" className="text-xs">CSV Import</TabsTrigger>
            <TabsTrigger value="manual" className="text-xs">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="csv" className="mt-2">
            <div
              className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors
                ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
                hover:border-primary hover:bg-primary/5`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Drop CSV file here, or click to browse
              </p>
              <input
                id="file-input"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
          </TabsContent>

          <TabsContent value="manual" className="mt-2">
            <div className="space-y-2">
              <div>
                <Label htmlFor="case-title" className="text-xs">Title <span className="text-destructive">*</span></Label>
                <Input 
                  id="case-title"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="Enter case title"
                  className="h-7 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="case-type" className="text-xs">Type <span className="text-destructive">*</span></Label>
                  <Select value={caseType} onValueChange={setCaseType}>
                    <SelectTrigger id="case-type" className="h-7 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {caseTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-xs">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="case-status" className="text-xs">Status</Label>
                  <Select value={caseStatus} onValueChange={setCaseStatus}>
                    <SelectTrigger id="case-status" className="h-7 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {caseStatuses.map((status) => (
                        <SelectItem key={status} value={status} className="text-xs">
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="complainant" className="text-xs">Complainant <span className="text-destructive">*</span></Label>
                  <Input 
                    id="complainant"
                    value={complainant}
                    onChange={(e) => setComplainant(e.target.value)}
                    placeholder="Name of complainant"
                    className="h-7 text-xs mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="respondent" className="text-xs">Respondent <span className="text-destructive">*</span></Label>
                  <Input 
                    id="respondent"
                    value={respondent}
                    onChange={(e) => setRespondent(e.target.value)}
                    placeholder="Name of respondent"
                    className="h-7 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="case-description" className="text-xs">Description</Label>
                <Input 
                  id="case-description"
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  placeholder="Brief description"
                  className="h-7 text-xs mt-1"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button 
                  onClick={handleManualImport}
                  size="sm"
                  className="h-7 text-xs px-3"
                >
                  Create Case
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CaseImport;
