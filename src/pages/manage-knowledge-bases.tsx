"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Upload, Edit, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import {
  deleteKnowledge,
  getKnowledgeList,
  updateKnowledge,
  type KnowledgeDto,
} from "@/utils/api/knowledge-base-api";
import KnowledgeBasePage from "./knowledge-base";
import { type ChatbotDto, getChatbots } from "@/utils/api/chatbot-api";

// Move constants outside component
const ALLOWED_FILE_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const validateWordDocument = (file: File): boolean => {
  return ALLOWED_FILE_TYPES.includes(file.type);
};

const ManageKnowledgeBasesPage: React.FC = () => {
  const { data, isLoading, error, mutate } = useSWR(
    "knowledge-list",
    getKnowledgeList
  );
  const { data: dataChatbots } = useSWR<ChatbotDto[]>("chatbots", getChatbots);

  const [editingKB, setEditingKB] = useState<KnowledgeDto | null>(null);
  const [editName, setEditName] = useState("");
  const [editDocument, setEditDocument] = useState<File | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Memoize chatbots transformation
  const chatbots = useMemo(
    () =>
      (dataChatbots ?? []).map((dto) => ({
        id: dto._id,
        name: dto.title,
      })),
    [dataChatbots]
  );

  const handleEdit = useCallback((kb: KnowledgeDto) => {
    setEditingKB(kb);
    setEditName(kb.title);
    setEditDocument(null);
    setIsEditDialogOpen(true);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editName.trim() || !editingKB?._id) {
      toast.error("Validation Error", {
        description: "Knowledge base name cannot be empty",
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateKnowledge(editingKB._id, {
        title: editName,
        file: editDocument,
      });
      toast.success("Success", {
        description: "Knowledge base updated successfully",
      });
      setIsEditDialogOpen(false);
      setEditingKB(null);
      setEditDocument(null);
      await mutate();
    } catch (e) {
      toast.error("Update failed", {
        description: (e as Error)?.message || "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [editName, editingKB, editDocument, mutate]);

  const handleDocumentUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!validateWordDocument(file)) {
        toast.error("Invalid File", {
          description: "Please upload a Word document (.doc or .docx)",
        });
        return;
      }
      setEditDocument(file);
    },
    []
  );

  const handleChatbotAssign = useCallback(
    async (kbId: string, chatbotId: string) => {
      try {
        await updateKnowledge(kbId, { chatbotId });
        toast.success("Success", {
          description: "Chatbot assigned to knowledge base",
        });
        await mutate();
      } catch (e) {
        toast.error("Assignment failed", {
          description: (e as Error)?.message || "Please try again.",
        });
      }
    },
    [mutate]
  );

  const handleDelete = useCallback(
    async (kbId: string) => {
      const ok = window.confirm(
        "Are you sure you want to delete this knowledge base?"
      );
      if (!ok) return;

      try {
        await deleteKnowledge(kbId);
        toast.success("Deleted", { description: "Knowledge base deleted." });
        await mutate();
      } catch (e) {
        toast.error("Delete failed", {
          description: (e as Error)?.message || "Please try again.",
        });
      }
    },
    [mutate]
  );

  const handleAddDialogClose = useCallback(() => setIsAddOpen(false), []);

  const handleKnowledgeCreated = useCallback(async () => {
    setIsAddOpen(false);
    await mutate();
  }, [mutate]);

  return (
    <div className="space-y-6 ml-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mt-5">
            Manage Knowledge Bases
          </h1>
          <p className="text-muted-foreground mt-2">
            Edit knowledge bases and assign them to chatbots
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="mb-6 gap-2 mr-7 bg-[#03a84e] hover:bg-[#028a41] transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add New Knowledge Base
            </Button>
          </DialogTrigger>
          <DialogContent
            style={{ width: "80vw", maxWidth: "none", maxHeight: "100vh" }}
            className="overflow-hidden flex flex-col p-0"
          >
            <DialogHeader className="px-6 pt-5 pb-4 border-b">
              <DialogTitle className="text-2xl font-semibold mb-0 pb-0">
                Add New Knowledge Base
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0 pt-0">
                Upload documents to train your chatbot
              </p>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <KnowledgeBasePage onCreated={handleKnowledgeCreated} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <p className="text-muted-foreground">Loading knowledge bases...</p>
      )}
      {error && (
        <p className="text-destructive">Failed to load knowledge bases.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data || []).map((kb) => (
          <Card key={kb._id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {kb.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{kb.originalFileName || "—"}</span>
                    </div>
                    {kb.createdAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Created: {new Date(kb.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 max-w-xs">
                      <Label className="text-xs text-muted-foreground mb-2 block">
                        Assigned Chatbot
                      </Label>
                      <Select
                        value={kb.chatbotId || ""}
                        onValueChange={(value) =>
                          handleChatbotAssign(kb._id, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select chatbot" />
                        </SelectTrigger>
                        <SelectContent>
                          {chatbots.map((chatbot) => (
                            <SelectItem key={chatbot.id} value={chatbot.id}>
                              {chatbot.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(kb)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(kb._id)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Knowledge Base</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Knowledge Base Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter knowledge base name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-document">Re-upload Document</Label>
              <Input
                id="edit-document"
                type="file"
                accept=".doc,.docx"
                onChange={handleDocumentUpload}
                className="cursor-pointer"
              />
              {editDocument && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm">{editDocument.name}</span>
                </div>
              )}
              {!editDocument && editingKB && (
                <p className="text-xs text-muted-foreground">
                  Current: {editingKB.originalFileName || "—"}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleAddDialogClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="bg-[#03a84e] hover:bg-[#028a41] disabled:opacity-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageKnowledgeBasesPage;
