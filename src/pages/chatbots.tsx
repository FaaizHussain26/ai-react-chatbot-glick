import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { toast } from "sonner";

const ChatbotConfigurationPage: React.FC = () => {
  const [chatbotName, setChatbotName] = useState("Support Bot");
  const [chatbotColor, setChatbotColor] = useState("#10b981");
  const [chatbotImage, setChatbotImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChatbotImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Here you would send the data to your backend
    toast.success("Chatbot Updated", {
      description: "Your chatbot settings have been saved successfully.",
    });
  };

  return (
    <div className="max-w-6xl ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-foreground">
            Chatbot Settings
          </h2>

          <div className="space-y-6">
            {/* Chatbot Title */}
            <div className="space-y-2">
              <Label htmlFor="chatbot-name">Chatbot Title</Label>
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
              <Label htmlFor="chatbot-name">Subtitle</Label>
              <Input
                id="chatbot-subtitle"
                type="text"
                value={chatbotName}
                onChange={(e) => setChatbotName(e.target.value)}
                placeholder="Enter chatbot name"
              />
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
                      src={chatbotImage}
                      alt="Chatbot"
                      className="w-full h-full p-3 object-cover "
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
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Preview Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Live Preview
          </h2>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 bg-muted/30 min-h-[250px] relative">
              {/* Simulated Chat Widget */}
              <div className="absolute bottom-6 right-6">
                <div
                  className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                  style={{ backgroundColor: chatbotColor }}
                >
                  <img
                    src="/assets/chat-white.png"
                    alt="logo"
                    className="w-7 h-7"
                  />
                </div>
              </div>

              {/* Sample Chat Bubble */}
              <div className="absolute bottom-24 right-6 max-w-[280px]">
                <div className="bg-card border border-border rounded-lg shadow-lg p-4 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        👋 Hi there! Do you have any questions?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium text-foreground">
                  {chatbotName}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Color:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border border-border"
                    style={{ backgroundColor: chatbotColor }}
                  />
                  <span className="font-mono text-xs text-foreground">
                    {chatbotColor}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Image:</span>
                <span className="font-medium text-foreground">
                  {chatbotImage ? "Uploaded" : "None"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotConfigurationPage;
