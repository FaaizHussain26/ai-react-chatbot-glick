"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const API_URL = import.meta.env.VITE_API_URL;

const renderTextWithLinks = (text: string, isUserMessage = false) => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const phoneRegex =
    /($$\d{3}$$[-.\s]?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]\d{3}[-.\s]?\d{4})/g;

  // Split text by URLs and phone numbers while keeping the matches
  const parts = text.split(
    /(https?:\/\/[^\s]+|www\.[^\s]+|$$\d{3}$$[-.\s]?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]\d{3}[-.\s]?\d{4})/gi
  );

  return parts.map((part, index) => {
    // Check if it's a URL
    if (urlRegex.test(part)) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline hover:no-underline ${
            isUserMessage
              ? "text-white hover:text-gray-200"
              : "text-blue-600 hover:text-blue-800"
          }`}
        >
          {part}
        </a>
      );
    }

    // Check if it's a phone number
    if (phoneRegex.test(part)) {
      // Clean phone number for tel: link
      const cleanPhone = part.replace(/[^\d]/g, "");
      return (
        <a
          key={index}
          href={`tel:${cleanPhone}`}
          className={`underline hover:no-underline ${
            isUserMessage
              ? "text-white hover:text-gray-200"
              : "text-blue-600 hover:text-blue-800"
          }`}
        >
          {part}
        </a>
      );
    }

    // Return regular text
    return part;
  });
};

export const ChatWidget = ({
  isOpen,
  handleIsOpen,
}: {
  isOpen?: boolean;
  handleIsOpen?: (value: boolean) => void;
}) => {
  const [chatId, setChatId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! My name is Esther. How can I help you today? 🙂",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const textareaRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    const textarea = e.target;
    textarea.style.height = "auto"; // reset height
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"; // grow up to 200px
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = inputValue;
    setInputValue("");

    if (textareaRef.current) {
      (textareaRef.current as HTMLTextAreaElement).style.height = "44px";
    }

    try {
      const botResponseText = await getBotResponse(currentInput);

      setTimeout(() => {
        setIsTyping(true);

        setTimeout(() => {
          const botResponse: Message = {
            id: Date.now() + 1,
            text: botResponseText,
            sender: "bot",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, botResponse]);
          setIsTyping(false);
        }, 2000);
      }, 400);
    } catch (error) {
      setTimeout(() => {
        setIsTyping(true);

        setTimeout(() => {
          const errorResponse: Message = {
            id: Date.now() + 1,
            text: "I'm sorry, I'm having trouble connecting right now. Please try again.",
            sender: "bot",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, errorResponse]);
          setIsTyping(false);
        }, 2000);
      }, 400);
    }
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const requestBody: // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any = {
        messages: userMessage,
      };

      if (chatId) {
        requestBody.chatId = chatId;
      }

      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      if (!chatId && data.id) {
        setChatId(data.id);
      }

      return data.content || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error("Error getting bot response:", error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again.";
    }
  };

  return (
    <>
      <button
        onClick={() => {
          handleIsOpen?.(!isOpen);
        }}
        className="group fixed bottom-6 right-6 z-50 flex h-18 w-18 items-center justify-center 
             rounded-full bg-[#03a84e] shadow-lg border-none 
             transition-all duration-200 hover:scale-105 hover:bg-gray-200 hover:shadow-xl"
      >
        <img
          src="/assets/chat-white.png"
          alt="logo"
          width={35}
          height={35}
          className="block group-hover:hidden transition-opacity duration-200"
        />
        <img
          src="/assets/chat-green.png"
          alt="logo-colored"
          width={36}
          height={36}
          className="hidden group-hover:block transition-opacity duration-200"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-27 right-6 sm:right-8 w-[90vw] sm:w-[400px] md:w-[450px] h-[600px] 
                        rounded-lg shadow-xl overflow-hidden z-40 bg-white border border-gray-200"
          >
            <div className="px-6 py-4 bg-gradient-to-r from-[#03a84e] to-[#0a791e] flex flex-row items-center justify-between border-b gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/50 bg-white">
                    <img
                      src="/assets/glick-roofing-logo.svg"
                      alt="Virtual Assistant Avatar"
                      className="h-8 w-8 object-contain"
                    />
                  </div>

                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-white text-xl font-medium">
                    Glick Roofing
                  </h2>
                  <p className="text-gray-200 text-sm ">Office Support</p>
                </div>
              </div>
              <button
                onClick={() => handleIsOpen?.(false)}
                className="h-8 w-8 rounded-full text-white hover:bg-white/10 border-none bg-transparent flex items-center justify-center transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden h-[calc(100%-76px)] flex flex-col">
              <div className="flex-1 overflow-hidden bg-gray-50">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === "user"
                              ? "bg-[#03a84e] text-white rounded-br-none"
                              : "bg-gray-200/80 shadow-sm rounded-bl-none"
                          }`}
                        >
                          <div
                            className={`text-sm whitespace-pre-wrap break-words ${
                              message.sender === "user"
                                ? "text-white"
                                : "text-gray-700"
                            }`}
                          >
                            {renderTextWithLinks(
                              message.text,
                              message.sender === "user"
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white shadow-sm rounded-lg rounded-bl-none p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-4 border-t bg-white">
                    <div className="flex gap-2 items-end">
                      <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message..."
                        rows={1}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03a84e] focus:border-transparent resize-none overflow-hidden max-h-[200px]"
                        style={{ minHeight: "44px" }}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="px-4 py-3 bg-gradient-to-r from-[#03a84e] to-[#0a791e] text-white rounded-lg hover:from-[#028a42] hover:to-[#086b1a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-[44px]"
                      >
                        <Send size={18} />
                        <span className="font-medium">Send</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 ml-1">
                      Press Enter to send • Shift + Enter for new line
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
