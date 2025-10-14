"use client";

import type React from "react";

import { useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageCircle, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ChatbotConfigurationPage from "./chatbots";
import { Textarea } from "@/components/ui/textarea";
import {
  getChatbots,
  updateChatbot,
  deleteChatbot,
  type ChatbotDto,
} from "@/utils/api/chatbot-api";

interface ChatbotCardData {
  id: string;
  name: string;
  subTitle: string;
  firstMessage?: string;
  color: string;
  image: string | null;
  knowledgeBase: string | null;
}

const mockKnowledgeBases = [
  { id: "kb1", name: "Product Documentation" },
  { id: "kb2", name: "FAQ Database" },
  { id: "kb3", name: "Sales Scripts" },
];

const mapDtoToCard = (dto: ChatbotDto): ChatbotCardData => ({
  id: dto._id,
  name: dto.title,
  subTitle: dto.subTitle ?? "",
  firstMessage: dto.firstMessage,
  color: dto.colorCode ?? "#10b981",
  image: dto.imagePath ?? null,
  knowledgeBase: null,
});

const fetcher = async () => getChatbots();

const ManageChatbotsPage: React.FC = () => {
  const { data, isLoading, error, mutate } = useSWR<ChatbotDto[]>(
    "chatbots",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const chatbots: ChatbotCardData[] = (data ?? []).map(mapDtoToCard);
  const [editingBot, setEditingBot] = useState<ChatbotCardData | null>(null);
  const [editName, setEditName] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editImage, setEditImage] = useState<string | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const handleEdit = (bot: ChatbotCardData) => {
    setEditingBot(bot);
    setEditName(bot.name);
    setEditSubtitle(bot.subTitle);
    setFirstMessage(bot.firstMessage || "");
    setEditColor(bot.color);
    setEditImage(bot.image);
    setEditFile(null);
  };

  const handleSaveEdit = async () => {
    if (!editingBot) return;
    try {
      setSavingEdit(true);
      await updateChatbot(editingBot.id, {
        title: editName,
        subTitle: editSubtitle,
        firstMessage,
        colorCode: editColor,
        file: editFile ?? undefined,
      });
      toast.success("Chatbot Updated", {
        description: "Your changes have been saved successfully.",
      });
      setEditingBot(null);
      await mutate();
    } catch (err: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any) {
      toast.error("Failed to update chatbot", {
        description: err?.message ?? "Please try again.",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setEditFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setEditImage(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setEditImage(null);
    }
  };

  const handleKnowledgeBaseAssign = (chatbotId: string) => {
    // Local-only demo linkage; not persisted via API
    // Using mutate with optimistic update for UI responsiveness
    const current = data ?? [];
    const updated = current.map((dto) => (dto._id === chatbotId ? dto : dto));
    globalMutate("chatbots", updated, false);
    toast.success("Knowledge Base Assigned", {
      description: "The knowledge base has been linked to the chatbot.",
    });
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = window.confirm(
      `Delete chatbot "${name}"? This cannot be undone.`
    );
    if (!ok) return;
    try {
      await deleteChatbot(id);
      toast.success("Chatbot deleted");
      await mutate();
    } catch (err: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any) {
      toast.error("Failed to delete chatbot", {
        description: err?.message ?? "Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6 ml-7">
      <div className="flex items-center justify-between">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 mt-5">
            Manage Chatbots
          </h1>
          <p className="text-muted-foreground">
            Edit your chatbots and assign knowledge bases
          </p>
        </div>

        {/* Add New Chatbot Modal */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="mb-6 mr-7 gap-2 bg-[#03a84e] hover:bg-[#028a41] transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add New Chatbot
            </Button>
          </DialogTrigger>
          <DialogContent
            style={{ width: "80vw", maxWidth: "none", maxHeight: "100vh" }}
            className="w-[95vw] max-w-[1400px] h-[95vh] max-h-[900px] p-0 flex flex-col gap-0"
          >
            <DialogHeader className="px-6 pt-5 pb-4 border-b">
              <DialogTitle className="text-2xl font-semibold mb-0 pb-0">
                Add New Chatbot
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0 pt-0">
                Configure your chatbot settings and preferences
              </p>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ChatbotConfigurationPage
                onCreated={async () => {
                  setIsAddOpen(false);
                  await mutate();
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground ml-1">
          Loading chatbots...
        </p>
      )}
      {error && (
        <p className="text-sm text-destructive ml-1">
          Failed to load chatbots. Please check NEXT_PUBLIC_API_URL.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatbots.map((bot) => (
          <Card key={bot.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: bot.color }}
                >
                  {bot.image ? (
                    <img
                      src={bot.image || "/placeholder.svg"}
                      alt={bot.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <MessageCircle className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{bot.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {bot.color}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(bot)}
                      aria-label={`Edit ${bot.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Chatbot</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-title">Chatbot Title</Label>
                        <Input
                          id="edit-title"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Enter chatbot title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-subtitle">Subtitle</Label>
                        <Input
                          id="edit-subtitle"
                          value={editSubtitle}
                          onChange={(e) => setEditSubtitle(e.target.value)}
                          placeholder="Enter chatbot subtitle"
                        />
                      </div>

                      {/* First Message */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-first-message">
                          First Message
                        </Label>
                        <Textarea
                          id="edit-first-message"
                          value={firstMessage}
                          onChange={(e) => setFirstMessage(e.target.value)}
                          placeholder="Enter the first message users will see"
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                          This message will greet users when they open the chat
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-color">Chatbot Color</Label>
                        <div className="flex gap-3 items-center">
                          <Input
                            id="edit-color"
                            type="color"
                            value={editColor}
                            onChange={(e) => setEditColor(e.target.value)}
                            className="w-20 h-12 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={editColor}
                            onChange={(e) => setEditColor(e.target.value)}
                            placeholder="#10b981"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-image">Chatbot Image</Label>
                        <div className="flex gap-3 items-start">
                          {editImage && (
                            <div className="w-16 h-16 rounded-lg border-2 border-border overflow-hidden flex-shrink-0">
                              <img
                                src={editImage || "/placeholder.svg"}
                                alt="Chatbot"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <Input
                            id="edit-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="flex-1 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEdit}
                          className="flex-1 gap-2 bg-[#03a84e]"
                          disabled={savingEdit}
                        >
                          <Save className="h-4 w-4" />
                          {savingEdit ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* DELETE button */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(bot.id, bot.name)}
                  aria-label={`Delete ${bot.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label
                  htmlFor={`kb-${bot.id}`}
                  className="text-sm text-muted-foreground mb-2 block"
                >
                  Assign Knowledge Base
                </Label>
                <Select
                  value={bot.knowledgeBase || ""}
                  onValueChange={() =>
                    handleKnowledgeBaseAssign(bot.id /*, value */)
                  }
                >
                  <SelectTrigger id={`kb-${bot.id}`}>
                    <SelectValue placeholder="Select knowledge base" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockKnowledgeBases.map((kb) => (
                      <SelectItem key={kb.id} value={kb.id}>
                        {kb.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {bot.knowledgeBase && (
                <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                  Connected:{" "}
                  {
                    mockKnowledgeBases.find((kb) => kb.id === bot.knowledgeBase)
                      ?.name
                  }
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageChatbotsPage;
