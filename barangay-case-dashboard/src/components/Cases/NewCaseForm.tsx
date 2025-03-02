import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Case, CaseType } from "@/lib/sample-data";
import { toast } from "sonner";
import { X } from "lucide-react";

interface NewCaseFormProps {
  onSaveCase: (caseData: Omit<Case, "id" | "updatedAt">) => void;
  onCancel: () => void;
}

const NewCaseForm = ({ onSaveCase, onCancel }: NewCaseFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [complainant, setComplainant] = useState("");
  const [respondent, setRespondent] = useState("");
  const [type, setType] = useState<CaseType>("dispute");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const caseTypes: CaseType[] = [
    "dispute",
    "domestic",
    "property",
    "noise",
    "theft",
    "vandalism",
    "harassment",
    "other",
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !complainant || !type) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newCase: Omit<Case, "id" | "updatedAt"> = {
      title,
      description,
      complainant,
      respondent,
      type,
      status: "pending",
      filedDate: new Date().toISOString().split("T")[0],
      tags,
    };

    onSaveCase(newCase);
    toast.success("New case created successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Case Title *</Label>
            <Input
              id="title"
              placeholder="Enter case title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter case description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="complainant">Complainant Name *</Label>
            <Input
              id="complainant"
              placeholder="Enter complainant name"
              value={complainant}
              onChange={(e) => setComplainant(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="respondent">Respondent Name</Label>
            <Input
              id="respondent"
              placeholder="Enter respondent name"
              value={respondent}
              onChange={(e) => setRespondent(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Case Type *</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as CaseType)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select case type" />
            </SelectTrigger>
            <SelectContent>
              {caseTypes.map((caseType) => (
                <SelectItem key={caseType} value={caseType}>
                  {caseType.charAt(0).toUpperCase() + caseType.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex">
            <Input
              id="tags"
              placeholder="Add tags (press Enter)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button type="button" onClick={handleAddTag} className="ml-2">
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Case</Button>
      </div>
    </form>
  );
};

export default NewCaseForm;
