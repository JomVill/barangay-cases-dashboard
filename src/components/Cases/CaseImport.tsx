
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CaseStatus, CaseType } from "@/lib/sample-data";

const CaseImport = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/json" || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a JSON or CSV file",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileImport = () => {
    // Simulate successful import
    toast({
      title: "Import successful",
      description: `Imported ${file?.name} with case data`,
    });
    setFile(null);
  };
  
  const handleManualImport = () => {
    // Validate form
    if (!caseTitle || !complainant || !respondent) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Validate custom case type if "other" is selected
    if (caseType === "other" && !customCaseType.trim()) {
      toast({
        title: "Missing information",
        description: "Please specify the custom case type",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate successful manual case creation
    toast({
      title: "Case created successfully",
      description: `Added new ${caseType === "other" ? customCaseType : caseType} case: ${caseTitle}`,
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
    <Card className="hover-card-effect">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Import Cases</CardTitle>
        <CardDescription>
          Upload a file or manually enter case information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              File Import
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="mt-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                isDragging ? "border-primary bg-primary/5" : "border-muted"
              } transition-colors cursor-pointer`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="mt-2">
                  <p className="text-sm font-medium">
                    {file ? file.name : "Drag and drop or click to upload"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports CSV and JSON formats
                  </p>
                </div>
              </div>
              <Input
                id="file-upload"
                type="file"
                accept=".json,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleFileImport} disabled={!file}>
                Import File
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="mt-4 space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="case-title">Title <span className="text-destructive">*</span></Label>
                <Input 
                  id="case-title" 
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="Case title" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="case-type">Type</Label>
                  <Select value={caseType} onValueChange={(value) => setCaseType(value as CaseType)}>
                    <SelectTrigger id="case-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {caseTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="case-status">Status</Label>
                  <Select value={caseStatus} onValueChange={(value) => setCaseStatus(value as CaseStatus)}>
                    <SelectTrigger id="case-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {caseStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {caseType === "other" && (
                <div className="grid gap-2">
                  <Label htmlFor="custom-case-type">
                    Specify Case Type <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="custom-case-type"
                    value={customCaseType}
                    onChange={(e) => setCustomCaseType(e.target.value)}
                    placeholder="Enter custom case type"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="complainant">Complainant <span className="text-destructive">*</span></Label>
                  <Input 
                    id="complainant" 
                    value={complainant}
                    onChange={(e) => setComplainant(e.target.value)}
                    placeholder="Name of complainant" 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="respondent">Respondent <span className="text-destructive">*</span></Label>
                  <Input 
                    id="respondent" 
                    value={respondent}
                    onChange={(e) => setRespondent(e.target.value)}
                    placeholder="Name of respondent" 
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="case-description">Description</Label>
                <Input 
                  id="case-description" 
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  placeholder="Brief description of the case" 
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleManualImport}>
                Create Case
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CaseImport;
