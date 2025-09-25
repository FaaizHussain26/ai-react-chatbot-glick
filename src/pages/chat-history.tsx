import type React from "react";
import { useEffect, useState } from "react";
import { Eye, UserIcon, Calendar, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchChatHistories } from "@/utils/api";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  options?: Array<{
    id: string;
    text: string;
    value: string;
  }>;
  parts?: Array<{
    type: string;
    text: string;
  }>;
}

interface Chat {
  _id: string;
  chatId: string;
  ip: string;
  choices: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  user?: { name?: string; email?: string } | null;
}

const ChatHistoryPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await fetchChatHistories();
        setChats(data);
      } catch (err: any) {
        setError("Failed to fetch chat history: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const formatMessageContent = (message: ChatMessage) => {
    if (message.parts && message.parts.length > 0) {
      return message.parts.map((part) => part.text).join(" ");
    }
    return message.content;
  };

  const getMessagePreview = (messages: ChatMessage[]) => {
    if (!messages || messages.length === 0) return "No messages";

    const firstUserMessage = messages.find((msg) => msg.role === "user");
    if (firstUserMessage) {
      const content = formatMessageContent(firstUserMessage);
      return content.length > 100 ? content.substring(0, 100) + "..." : content;
    }

    const firstMessage = messages[0];
    const content = formatMessageContent(firstMessage);
    return content.length > 100 ? content.substring(0, 100) + "..." : content;
  };

  const ChatDialog = ({ chat }: { chat: Chat }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Chat Conversation</DialogTitle>
          <DialogDescription>
            Chat ID: {chat.chatId} • {new Date(chat.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full pr-4">
          <div className="space-y-4">
            {chat.choices &&
              chat.choices.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          message.role === "user" ? "secondary" : "default"
                        }
                      >
                        {message.role === "user" ? "User" : "Assistant"}
                      </Badge>
                    </div>
                    <div className="whitespace-pre-wrap">
                      {formatMessageContent(message)}
                    </div>
                    {message.options && message.options.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-sm font-medium opacity-90">
                          Options:
                        </div>
                        <div className="grid gap-2">
                          {message.options.map((option) => (
                            <div
                              key={option.id}
                              className="text-sm p-2 bg-white/10 rounded border border-white/20"
                            >
                              {option.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className="p-6 max-w-full">
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          Loading chat history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-full">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600 text-center">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat History</h1>
        <p className="text-gray-600">View and manage your chat conversations</p>
      </div>

      {chats.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium mb-2">
                No chat history available
              </h3>
              <p className="text-sm">
                Start a conversation to see your chat history here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {chats.map((chat) => (
            <Card key={chat._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      Chat #{chat.chatId.slice(-8)}
                    </CardTitle>
                    <CardDescription>
                      {getMessagePreview(chat.choices)}
                    </CardDescription>
                  </div>
                  <ChatDialog chat={chat} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{chat.ip}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-4 h-4" />
                      <span>
                        {chat.user ? (
                          <span className="text-gray-900 font-medium">
                            {chat.user.name || chat.user.email}
                          </span>
                        ) : (
                          "Anonymous"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {chat.choices ? chat.choices.length : 0} messages
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryPage;
