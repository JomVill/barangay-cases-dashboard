import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCases } from '@/context/CaseContext';
import { toast } from "sonner";
import { CaseType, CaseStatus } from "@/lib/sample-data";

const CaseNew = () => {
  const navigate = useNavigate();
  const { cases, setCases } = useCases();
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CaseType>("dispute");
  const [status, setStatus] = useState<CaseStatus>("pending");
  const [complainant, setComplainant] = useState("");
  const [respondent, setRespondent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !complainant || !respondent) {
      toast.error("Please fill in all required fields");
      return;
    }

    // ... rest of the case creation logic from CaseImport
    // (including ID generation, case creation, and storage update)

    navigate("/cases");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-6">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => navigate("/cases")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cases
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>New Case</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields similar to CaseImport manual entry */}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CaseNew; 