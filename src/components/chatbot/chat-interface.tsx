import type React from "react";
import { useChat } from "@ai-sdk/react";
import ChatForm from "./chat-form";
import MessagesCard from "./messages-card";
import { chatApiMiddleware } from "@/utils/api";
import { ChatOption, INITIAL_MESSAGE } from "@/utils/constants";
import { useState } from "react";

interface ChatInterfaceProps {
  inModal?: boolean;
}

export default function ChatInterface({ inModal = false }: ChatInterfaceProps) {
  const [loading, setLoading] = useState(false);
  const { messages, input, handleInputChange, setMessages } = useChat({
    initialMessages: INITIAL_MESSAGE,
    api: "/api/chat",
    onResponse() {
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    //@ts-ignore
    setMessages((prev) => [...prev, userMessage]);
    handleInputChange({ target: { value: "" } } as any);

    try {
      const assistantResponse = await chatApiMiddleware([
        ...messages,
        userMessage,
      ]);
      setMessages((prev) => [...prev, assistantResponse]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error:", err);
    }
  };

  const handleOptionSelect = async (option: ChatOption) => {
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: option.text,
    };
    //@ts-ignore
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const assistantResponse = await chatApiMiddleware([
        ...messages,
        userMessage,
        {
          id: (Date.now() + 1).toString(),
          role: "user",
          content: `User selected ${option.value}`,
        },
      ]);
      setMessages((prev) => [...prev, assistantResponse]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Option handler error:", err);
    }
  };

  console.log(loading, "messages");
  return (
    <div
      className={`flex flex-col ${
        inModal
          ? "h-[calc(600px-64px)]"
          : "h-[calc(100vh-12rem)] max-w-3xl mx-auto"
      }`}
    >
      <MessagesCard
        loading={loading}
        inModal={inModal}
        messages={messages}
        onOptionSelect={handleOptionSelect}
      />
      <ChatForm
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}
