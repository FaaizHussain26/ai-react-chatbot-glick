import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { ChatOptions } from "./chat-options";
import { LinkifyText } from "../linkify";

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

interface MessageItemProps {
  message: Message;
  onOptionSelect?: (option: ChatOption) => void;
  onEstimateRequest?: () => void;
  calendlyUrl: string;
}

export function MessageItem({ message, onOptionSelect }: MessageItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg p-4",
        message.role === "user"
          ? "ml-auto max-w-[90%] bg-[#F1F8FA]"
          : `mr-auto max-w-[100%] bg-[#F1F8FA]`
      )}
    >
      <div
        className={
          message.role === "user"
            ? "flex shrink-0 select-none items-center justify-center border rounded-[20px] h-[38px] w-[38px] shadow bg-primary text-primary-foreground"
            : "flex shrink-0 select-none items-center justify-center"
        }
      >
        {message.role === "user" ? <User className="h-6 w-6" /> : ""}
      </div>
      <div className="flex-1">
        {message.role === "user" ? (
          <div
            className={`text-sm whitespace-pre-wrap text-[#104D96] mt-[8px]`}
          >
            <LinkifyText text={message.content} />
          </div>
        ) : (
          <div
            className={`text-sm whitespace-pre-wrap text-[#104D96] mt-[8px]`}
          >
            <LinkifyText text={message.content} />
          </div>
        )}

        {message.options && onOptionSelect && (
          <ChatOptions
            options={message.options}
            onOptionSelect={onOptionSelect}
          />
        )}
      </div>
    </div>
  );
}
