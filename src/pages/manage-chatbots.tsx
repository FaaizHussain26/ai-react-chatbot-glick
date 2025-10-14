import { useState } from "react";
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
import { MessageCircle, Pencil, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import ChatbotConfigurationPage from "./chatbots";

interface Chatbot {
  id: string;
  name: string;
  color: string;
  image: string | null;
  knowledgeBase: string | null;
}

// Mock data
const mockChatbots: Chatbot[] = [
  {
    id: "1",
    name: "Support Bot",
    color: "#10b981",
    image: null,
    knowledgeBase: null,
  },
  {
    id: "2",
    name: "Sales Bot",
    color: "#3b82f6",
    image: null,
    knowledgeBase: null,
  },
];

const mockKnowledgeBases = [
  { id: "kb1", name: "Product Documentation" },
  { id: "kb2", name: "FAQ Database" },
  { id: "kb3", name: "Sales Scripts" },
];

const ManageChatbotsPage: React.FC = () => {
  const [chatbots, setChatbots] = useState<Chatbot[]>(mockChatbots);
  const [editingBot, setEditingBot] = useState<Chatbot | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editImage, setEditImage] = useState<string | null>(null);

  const handleEdit = (bot: Chatbot) => {
    setEditingBot(bot);
    setEditName(bot.name);
    setEditColor(bot.color);
    setEditImage(bot.image);
  };

  const handleSaveEdit = () => {
    if (!editingBot) return;

    setChatbots(
      chatbots.map((bot) =>
        bot.id === editingBot.id
          ? { ...bot, name: editName, color: editColor, image: editImage }
          : bot
      )
    );

    toast.success("Chatbot Updated", {
      description: "Your changes have been saved successfully.",
    });

    setEditingBot(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKnowledgeBaseAssign = (chatbotId: string, kbId: string) => {
    setChatbots(
      chatbots.map((bot) =>
        bot.id === chatbotId ? { ...bot, knowledgeBase: kbId } : bot
      )
    );

    toast.success("Knowledge Base Assigned", {
      description: "The knowledge base has been linked to the chatbot.",
    });
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
        <Dialog>
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
            className="overflow-hidden flex flex-col p-0"
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
              <ChatbotConfigurationPage />
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                      src={bot.image}
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

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(bot)}
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
                      <Label htmlFor="edit-name">Chatbot Title</Label>
                      <Input
                        id="edit-title"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter chatbot title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Subtitle</Label>
                      <Input
                        id="edit-subtitle"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter chatbot subtitle"
                      />
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
                              src={editImage}
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
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
                  onValueChange={(value) =>
                    handleKnowledgeBaseAssign(bot.id, value)
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
