import type React from "react";
import { useEffect, useRef, useState } from "react";

interface ChatPopupProps {
  isChatOpen: boolean;
  onOpenChat: () => void;
}

export default function ChatPopup({ isChatOpen, onOpenChat }: ChatPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    clearTimer();

    if (isChatOpen) {
      setIsVisible(false);
      setIsDismissed(false);
      return;
    }

    if (isDismissed) {
      setIsVisible(false);
      return;
    }

    timerRef.current = window.setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem("chatPopupInitialized", "1");
    }, 3000);

    return () => {
      clearTimer();
    };
  }, [isChatOpen, isDismissed]);

  if (!isVisible || isDismissed) return null;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleClick = () => {
    setIsVisible(false);
    onOpenChat();
  };

  return (
    <div className="fixed bottom-28 right-6 z-50 select-none">
      <div
        className="relative cursor-pointer group transition-transform hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-500"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label="Open chat"
      >
        <div className="rounded-lg bg-white text-gray-900 border border-gray-200 shadow-lg hover:shadow-xl px-4 py-3 max-w-[260px] transition-shadow">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm flex-1">
              {"👋 Hi there! Do you have any questions?"}
            </p>
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors -mt-0.5 -mr-1"
              aria-label="Dismiss message"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        {/* Tail pointer */}
        <div className="absolute -bottom-2 right-8 w-3 h-3 rotate-45 bg-white border-r border-b border-gray-200" />
      </div>
    </div>
  );
}
