"use client";

import type React from "react";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { createChatbot } from "@/utils/api/chatbot-api";

type Props = {
  onCreated?: () => void;
};

const ChatbotConfigurationPage: React.FC<Props> = ({ onCreated }) => {
  const [chatbotName, setChatbotName] = useState("Support Bot");
  const [chatbotSubtitle, setChatbotSubtitle] = useState("Office Support");
  const [firstMessage, setFirstMessage] = useState(
    "Hi! My name is Esther. How can I help you today?"
  );
  const [chatbotColor, setChatbotColor] = useState("#10b981");
  const [chatbotImage, setChatbotImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setChatbotImage(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setFile(null);
      setChatbotImage(null);
    }
  };

  const adjustColor = (color: string, percent: number): string => {
    const num = Number.parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      await createChatbot({
        title: chatbotName,
        subTitle: chatbotSubtitle,
        firstMessage,
        colorCode: chatbotColor,
        file,
      });
      toast.success("Chatbot Created", {
        description: "Your chatbot has been created successfully.",
      });
      onCreated?.();
    } catch (err: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any) {
      toast.error("Failed to create chatbot", {
        description: err?.message ?? "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground">
            Chatbot Settings
          </h2>

          <div className="space-y-6">
            {/* Chatbot Title */}
            <div className="space-y-2">
              <Label htmlFor="chatbot-title">Chatbot Title</Label>
              <Input
                id="chatbot-title"
                type="text"
                value={chatbotName}
                onChange={(e) => setChatbotName(e.target.value)}
                placeholder="Enter chatbot name"
              />
            </div>

            {/* Chatbot Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="chatbot-subtitle">Subtitle</Label>
              <Input
                id="chatbot-subtitle"
                type="text"
                value={chatbotSubtitle}
                onChange={(e) => setChatbotSubtitle(e.target.value)}
                placeholder="Enter chatbot subtitle"
              />
            </div>

            {/* First Message */}
            <div className="space-y-2">
              <Label htmlFor="first-message">First Message</Label>
              <Textarea
                id="first-message"
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                placeholder="Enter the first message users will see"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This message will greet users when they open the chat
              </p>
            </div>

            {/* Chatbot Color */}
            <div className="space-y-2">
              <Label htmlFor="chatbot-color">Chatbot Color</Label>
              <div className="flex gap-3 items-center">
                <Input
                  id="chatbot-color"
                  type="color"
                  value={chatbotColor}
                  onChange={(e) => setChatbotColor(e.target.value)}
                  className="w-20 h-12 cursor-pointer"
                />
                <Input
                  type="text"
                  value={chatbotColor}
                  onChange={(e) => setChatbotColor(e.target.value)}
                  placeholder="#10b981"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Chatbot Image */}
            <div className="space-y-2">
              <Label htmlFor="chatbot-image">Chatbot Image</Label>
              <div className="flex gap-3 items-start">
                {chatbotImage && (
                  <div className="w-20 h-20 rounded-lg border-2 border-border overflow-hidden flex-shrink-0">
                    <img
                      src={chatbotImage || "/placeholder.svg"}
                      alt="Chatbot"
                      className="w-full h-full p-3 object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="chatbot-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload an image for your chatbot avatar
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              className="w-full gap-2 bg-[#03a84e]"
              size="lg"
              disabled={submitting}
            >
              <Save className="h-4 w-4" />
              {submitting ? "Creating..." : "Create Chatbot"}
            </Button>
          </div>
        </Card>

        {/* Preview Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold  text-foreground">
            Live Preview
          </h2>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 bg-muted/30 min-h-[500px] relative overflow-hidden flex items-center justify-center">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #000 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              {/* Chat Button */}
              <div className="absolute bottom-6 right-6 z-20">
                <div
                  className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                  style={{
                    backgroundColor: chatbotColor,
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
              </div>

              {/* Static Chat Window Preview */}
              <div className="w-[340px] h-[480px] rounded-lg shadow-xl overflow-hidden bg-white border border-gray-200 relative z-10">
                {/* Header */}
                <div
                  className="px-4 py-3 flex flex-row items-center justify-between border-b"
                  style={{
                    background: `linear-gradient(to right, ${chatbotColor}, ${adjustColor(
                      chatbotColor,
                      -20
                    )})`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 bg-white">
                        {chatbotImage && (
                          <img
                            src={chatbotImage || "/placeholder.svg"}
                            alt="Chatbot Avatar"
                            className="h-6 w-6 object-contain"
                          />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-white text-base font-medium">
                        {chatbotName || "Chatbot Name"}
                      </h3>
                      <p className="text-white/90 text-xs">
                        {chatbotSubtitle || "Subtitle"}
                      </p>
                    </div>
                  </div>
                  <button
                    className="h-7 w-7 rounded-full text-white hover:bg-white/10 border-none bg-transparent flex items-center justify-center transition-colors"
                    aria-label="Close preview"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 h-[calc(100%-120px)]">
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-white shadow-sm rounded-bl-none">
                      <div className="text-sm whitespace-pre-wrap break-words text-gray-700">
                        {firstMessage || "Hello! How can I help you?"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-3 border-t bg-white">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-400 bg-gray-50">
                      Type a message...
                    </div>
                    <button
                      className="px-3 py-2 text-white rounded-lg flex items-center gap-1 h-[36px]"
                      style={{ backgroundColor: chatbotColor }}
                      aria-label="Send"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              This preview updates automatically as you change the settings
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotConfigurationPage;
