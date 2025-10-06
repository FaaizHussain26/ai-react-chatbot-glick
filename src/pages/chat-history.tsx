import { Badge } from "@/components/ui/badge";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteChat, fetchChatHistories } from "@/utils/api";
import { Calendar, Eye, Trash2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  messages: string;
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
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await fetchChatHistories();
        setChats(data);
      } catch (err: // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any) {
        setError("Failed to fetch chat history: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleDeleteChat = async (chatId: string) => {
    try {
      // Set loading state
      setIsDeleting(chatId);

      // Call the API to delete the chat
      await deleteChat(chatId);

      // Remove the chat from local state
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));

      console.log("Chat deleted successfully:", chatId);

      // Show success toast notification
      toast.success("Chat deleted successfully", {
        description: "The chat has been removed from your history.",
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to delete chat:", error);

      // Show error toast notification
      toast.error("Failed to delete chat", {
        description: "Something went wrong. Please try again.",
        position: "top-right",
      });
    } finally {
      // Clear loading state
      setIsDeleting(null);
    }
  };

  const ChatDialog = ({ chat }: { chat: Chat }) => (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="cursor-pointer bg-[#03a84e] hover:bg-[#03a84e]/80 text-white"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Chat
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Chat Conversation</DialogTitle>
          <DialogDescription>
            Chat ID: {chat.chatId}{" "}
            <span className="text-muted-foreground flex text-xs">
              {new Date(chat.createdAt).toLocaleString()}
            </span>
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
                        ? "bg-[#03a84e] text-white"
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
                      {message.messages}
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
      <div className="mb-6 ">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat History</h1>
        <div className="flex">
          <p className="text-gray-600 w-[750px]">
            View and manage your chat conversations
          </p>
        </div>
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
            <Card
              key={chat._id}
              className="hover:shadow-md transition-shadow hover:bg-[#03a84e]/10"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      <span className="text-gray-600">Chat at</span>{" "}
                      {new Date(chat.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardTitle>
                    <CardDescription></CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <ChatDialog chat={chat} />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="cursor-pointer bg-red-100 hover:bg-red-200"
                      onClick={() => handleDeleteChat(chat._id)}
                      disabled={isDeleting === chat._id}
                    >
                      <Trash2 className="w-4 h-4 mr-1 text-red-600" />
                      {isDeleting === chat._id ? "Deleting..." : ""}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#03a84e]/10 text-gray-600"
                  >
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
