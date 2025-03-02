import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCases } from '@/context/CaseContext';
import { toast } from "sonner";
import { CaseType, CaseStatus, Case } from "@/lib/sample-data";
import { X, Plus } from "lucide-react";

interface CaseEditFormProps {
  caseId: string;
  onSave: () => void;
  onCancel: () => void;
}

export const CaseEditForm = ({ caseId, onSave, onCancel }: CaseEditFormProps) => {
  const { cases, setCases } = useCases();
  const [formData, setFormData] = useState<Omit<Case, 'id'>>({
    title: "",
    description: "",
    type: "dispute",
    status: "pending",
    complainant: "",
    respondent: "",
    filedDate: "",
    resolvedDate: undefined,
    updatedAt: "",
    tags: []
  });
  
  useEffect(() => {
    const caseToEdit = cases.find(c => c.id === caseId);
    if (caseToEdit) {
      setFormData({
        title: caseToEdit.title,
        description: caseToEdit.description,
        type: caseToEdit.type,
        status: caseToEdit.status,
        complainant: caseToEdit.complainant,
        respondent: caseToEdit.respondent,
        filedDate: caseToEdit.filedDate,
        resolvedDate: caseToEdit.resolvedDate,
        updatedAt: caseToEdit.updatedAt,
        tags: caseToEdit.tags || []
      });
    }
  }, [caseId, cases]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.complainant || !formData.respondent || !formData.filedDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Update case
    setCases(prevCases => prevCases.map(c => 
      c.id === caseId 
        ? { 
            ...c, 
            ...formData, 
            updatedAt: new Date().toISOString().split('T')[0],
            // If status is resolved and there's no resolved date, set it to today
            resolvedDate: formData.status === 'resolved' && !formData.resolvedDate 
              ? new Date().toISOString().split('T')[0] 
              : formData.resolvedDate
          } 
        : c
    ));
    
    toast.success("Case updated successfully");
    onSave();
  };
  
  const [tags, setTags] = useState<string[]>(formData.tags || []);
  const [newTag, setNewTag] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      tagInputRef.current?.focus();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (formData && (!formData.title || !formData.complainant)) {
    console.warn('Incomplete case data:', formData);
  }

  if (!formData) {
    toast.error("Case not found");
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Case Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
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
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="complainant">Complainant *</Label>
          <Input
            id="complainant"
            name="complainant"
            value={formData.complainant}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="respondent">Respondent *</Label>
          <Input
            id="respondent"
            name="respondent"
            value={formData.respondent}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="filedDate">Filed Date *</Label>
          <Input
            id="filedDate"
            name="filedDate"
            type="date"
            value={formData.filedDate}
            onChange={handleChange}
            required
          />
        </div>
        
        {formData.status === 'resolved' && (
          <div className="space-y-2">
            <Label htmlFor="resolvedDate">Resolved Date</Label>
            <Input
              id="resolvedDate"
              name="resolvedDate"
              type="date"
              value={formData.resolvedDate || ''}
              onChange={handleChange}
            />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-blue-50">
              {tag}
              <button 
                type="button" 
                onClick={() => handleRemoveTag(tag)}
                className="text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="tags"
            ref={tagInputRef}
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add a tag"
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddTag}
            disabled={!newTag.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Press Enter to add a tag. Case type will be automatically added as a tag.
        </p>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
}; 