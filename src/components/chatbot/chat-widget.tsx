import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [hasShownPopup, setHasShownPopup] = useState<boolean>(false);
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

  // Show popup only once after delay if chat hasn't been opened
  useEffect(() => {
    if (!hasShownPopup && !isOpen) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        setHasShownPopup(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasShownPopup, isOpen]);

  // Hide popup when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowPopup(false);
    }
  }, [isOpen]);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Bot responses (simple responses for demo)
  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("hey")
    ) {
      return "Hello! Thanks for reaching out to Glick Roofing. How can I assist you with your roofing needs today?";
    }
    if (
      message.includes("price") ||
      message.includes("cost") ||
      message.includes("quote")
    ) {
      return "I'd be happy to help you with pricing information! For an accurate quote, I'll need some details about your project. Can you tell me more about what type of roofing work you need?";
    }
    if (message.includes("roof") || message.includes("roofing")) {
      return "Great! We specialize in all types of roofing services including repairs, replacements, and new installations. What specific roofing service are you interested in?";
    }
    if (
      message.includes("contact") ||
      message.includes("phone") ||
      message.includes("call")
    ) {
      return "You can reach us at our main office for immediate assistance. We're also available for emergency roofing services. Would you like me to connect you with one of our specialists?";
    }
    if (message.includes("thank")) {
      return "You're very welcome! Is there anything else I can help you with regarding your roofing needs?";
    }

    return "Thanks for your message! I'm here to help with any roofing questions you have. Can you provide more details about what you're looking for?";
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
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Popup Message */}
      <AnimatePresence>
        {showPopup && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-28 right-6 z-50 w-[260px]"
          >
            <div
              className="relative rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-md 
                      shadow-lg p-4 overflow-hidden"
            >
              {/* Decorative gradient top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#03a84e] to-[#0a791e]" />

              {/* Close button */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center 
                     rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 
                     transition-colors text-sm"
              >
                ×
              </button>

              {/* Content */}
              <div className="pt-2">
                <p className="text-gray-700 text-sm leading-relaxed">
                  👋 Hi there! Do you have any questions?.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group fixed bottom-6 right-6 z-50 flex h-18 w-18 items-center justify-center 
             rounded-full bg-[#03a84e] shadow-lg border-none 
             transition-all duration-200 hover:scale-105 hover:bg-gray-200 hover:shadow-xl"
      >
        {/* Default Logo (green button) */}
        <img
          src="/assets/glick-roofing-white-logo.svg"
          alt="logo"
          width={45}
          height={45}
          className="block group-hover:hidden transition-opacity duration-200"
        />
        {/* Hover Logo (light gray button) */}
        <img
          src="/assets/glick-roofing-logo.svg"
          alt="logo-colored"
          width={45}
          height={45}
          className="hidden group-hover:block transition-opacity duration-200"
        />
      </button>

      {/* Chat Interface */}
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
                  <p className="text-gray-200 text-sm ">AI Support</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
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
              {/* Chat Interface */}
              <div className="flex-1 overflow-hidden bg-gray-50">
                <div className="h-full flex flex-col">
                  {/* Messages area */}
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
                          <p
                            className={`text-sm ${
                              message.sender === "user"
                                ? "text-white"
                                : "text-gray-700"
                            }`}
                          >
                            {message.text}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Typing indicator */}
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

                  {/* Input area */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03a84e] focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-[#03a84e] to-[#0a791e] text-white rounded-lg hover:from-[#028a42] hover:to-[#086b1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
