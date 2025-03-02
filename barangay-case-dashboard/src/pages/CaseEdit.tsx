import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useCases } from '@/context/CaseContext';
import { toast } from "sonner";
import { CaseType, CaseStatus } from "@/lib/sample-data";
import Footer from "@/components/Footer";

const CaseEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cases, setCases } = useCases();
  const caseData = cases.find(c => c.id === id);

  const [title, setTitle] = useState(caseData?.title || "");
  const [description, setDescription] = useState(caseData?.description || "");
  const [type, setType] = useState<CaseType>(caseData?.type || "dispute");
  const [status, setStatus] = useState<CaseStatus>(caseData?.status || "pending");
  const [complainant, setComplainant] = useState(caseData?.complainant || "");
  const [respondent, setRespondent] = useState(caseData?.respondent || "");

  useEffect(() => {
    if (!caseData) {
      navigate("/cases");
      toast.error("Case not found", {
        dismissible: true,
        duration: 4000
      });
    }
  }, [caseData, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!caseData) return;

    const updatedCase = {
      ...caseData,
      title,
      description,
      type,
      status,
      complainant,
      respondent,
      updatedAt: new Date().toISOString().split('T')[0],
      ...(status === 'resolved' && !caseData.resolvedDate && {
        resolvedDate: new Date().toISOString().split('T')[0]
      })
    };

    setCases(cases.map(c => c.id === id ? updatedCase : c));
    toast.success("Case updated successfully", {
      dismissible: true,
      duration: 3000
    });
    navigate(`/cases/${id}`);
  };

  if (!caseData) return null;

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

        <Card>
          <CardHeader>
            <CardTitle>Edit Case</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complainant">Complainant</Label>
                  <Input
                    id="complainant"
                    value={complainant}
                    onChange={(e) => setComplainant(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respondent">Respondent</Label>
                  <Input
                    id="respondent"
                    value={respondent}
                    onChange={(e) => setRespondent(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Case Type</Label>
                  <Select value={type} onValueChange={(value: CaseType) => setType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dispute">Dispute</SelectItem>
                      <SelectItem value="domestic">Domestic</SelectItem>
                      <SelectItem value="property">Property</SelectItem>
                      <SelectItem value="noise">Noise</SelectItem>
                      <SelectItem value="theft">Theft</SelectItem>
                      <SelectItem value="vandalism">Vandalism</SelectItem>
                      <SelectItem value="harassment">Harassment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value: CaseStatus) => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CaseEdit; 