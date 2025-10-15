"use client";

import type React from "react";
import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Edit, Plus, Save, Trash2 } from "lucide-react";

import ChatbotEmbedCode from "@/components/chatbot/chatbot-embed-code";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteChatbot,
  getChatbots,
  updateChatbot,
  type ChatbotDto,
} from "@/utils/api/chatbot-api";
import ChatbotConfigurationPage from "./chatbots";

export interface ChatbotCardData {
  id: string;
  name: string;
  subTitle: string;
  firstMessage?: string;
  color: string;
  imagePath: string | null;
  knowledgeBase: string | null;
}

interface EditState {
  bot: ChatbotCardData;
  name: string;
  subtitle: string;
  firstMessage: string;
  color: string;
  image: string | null;
  file: File | null;
}

const mapDtoToCard = (dto: ChatbotDto): ChatbotCardData => ({
  id: dto._id,
  name: dto.title,
  subTitle: dto.subTitle ?? "",
  firstMessage: dto.firstMessage,
  color: dto.colorCode ?? "#10b981",
  imagePath: dto.imagePath ?? null,
  knowledgeBase: null,
});

const fetcher = async () => getChatbots();

const ManageChatbotsPage: React.FC = () => {
  const { data, isLoading, error, mutate } = useSWR<ChatbotDto[]>(
    "chatbots",
    fetcher,
    { revalidateOnFocus: false }
  );

  const chatbots: ChatbotCardData[] = (data ?? []).map(mapDtoToCard);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleEdit = useCallback((bot: ChatbotCardData) => {
    setEditState({
      bot,
      name: bot.name,
      subtitle: bot.subTitle,
      firstMessage: bot.firstMessage || "",
      color: bot.color,
      image: bot.imagePath || null,
      file: null,
    });
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editState) return;

    try {
      await updateChatbot(editState.bot.id, {
        title: editState.name,
        subTitle: editState.subtitle,
        firstMessage: editState.firstMessage,
        colorCode: editState.color,
        file: editState.file ?? undefined,
      });
      toast.success("Chatbot Updated", {
        description: "Your changes have been saved successfully.",
      });
      setEditState(null);
      await mutate();
    } catch (err: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any) {
      toast.error("Failed to update chatbot", {
        description: err?.message ?? "Please try again.",
      });
    }
  }, [editState, mutate]);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditState((prev) =>
            prev ? { ...prev, file, image: reader.result as string } : null
          );
        };
        reader.readAsDataURL(file);
      } else {
        setEditState((prev) =>
          prev ? { ...prev, file: null, image: null } : null
        );
      }
    },
    []
  );

  const handleDelete = useCallback(
    async (id: string, name: string) => {
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
    },
    [mutate]
  );

  const handleCloseEdit = useCallback(() => setEditState(null), []);

  const handleAddCreated = useCallback(async () => {
    setIsAddOpen(false);
    await mutate();
  }, [mutate]);

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
              <ChatbotConfigurationPage onCreated={handleAddCreated} />
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
          Failed to load chatbots. Please check API configuration.
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
                  <img
                    src="/assets/chat-white.png"
                    alt={bot.name}
                    className="w-8 h-8 object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{bot.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {bot.color}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(bot)}
                  aria-label={`Edit ${bot.name}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>

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
                <ChatbotEmbedCode chatbotId={bot.id} kbId={bot.knowledgeBase} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {editState && (
        <Dialog open={!!editState} onOpenChange={handleCloseEdit}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Chatbot</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Chatbot Title</Label>
                <Input
                  id="edit-title"
                  value={editState.name}
                  onChange={(e) =>
                    setEditState({ ...editState, name: e.target.value })
                  }
                  placeholder="Enter chatbot title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-subtitle">Subtitle</Label>
                <Input
                  id="edit-subtitle"
                  value={editState.subtitle}
                  onChange={(e) =>
                    setEditState({ ...editState, subtitle: e.target.value })
                  }
                  placeholder="Enter chatbot subtitle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-first-message">First Message</Label>
                <Textarea
                  id="edit-first-message"
                  value={editState.firstMessage}
                  onChange={(e) =>
                    setEditState({ ...editState, firstMessage: e.target.value })
                  }
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
                    value={editState.color}
                    onChange={(e) =>
                      setEditState({ ...editState, color: e.target.value })
                    }
                    className="w-20 h-12 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={editState.color}
                    onChange={(e) =>
                      setEditState({ ...editState, color: e.target.value })
                    }
                    placeholder="#10b981"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">Chatbot Image</Label>
                <div className="flex gap-3 items-start">
                  {editState.image && (
                    <div className="w-16 h-16 rounded-lg border-2 border-border overflow-hidden flex-shrink-0">
                      <img
                        src={editState.image}
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
                  className="flex-1 gap-2 bg-[#03a84e] hover:bg-[#028a41]"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ManageChatbotsPage;
