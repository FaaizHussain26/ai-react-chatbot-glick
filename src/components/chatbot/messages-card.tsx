import type React from "react";
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MessageItem } from "./message-item";
import { TypingIndicator } from "./typing-indicator";

interface ChatOption {
  id: string;
  text: string;
  value: string;
}

interface Message {
  id: number | string;
  role: string;
  content: string;
  options?: ChatOption[];
  showEstimateButton?: boolean;
  showConsultationButton?: boolean;
  showPDFButton?: boolean;
}

interface MessagesCardProps {
  loading: boolean;
  inModal: boolean;
  messages: Message[];
  onOptionSelect?: (option: ChatOption) => void;
  onEstimateRequest?: () => void;
  onConsultationRequest?: () => void;
  calendlyUrl?: string;
}

const MessagesCard: React.FC<MessagesCardProps> = ({
  loading,
  inModal,
  messages,
  onOptionSelect,
  onEstimateRequest,
  calendlyUrl = "https://calendly.com/your-username/consultation",
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  return (
    <Card
      className={cn(
        "flex-1 p-4 mb-4 overflow-hidden",
        inModal && "border-0 shadow-none rounded-none"
      )}
    >
      <ScrollArea className="h-full pr-4">
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              onOptionSelect={onOptionSelect}
              onEstimateRequest={onEstimateRequest}
              calendlyUrl={calendlyUrl || ""}
            />
          ))}

          {loading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </Card>
  );
};

export default MessagesCard;
