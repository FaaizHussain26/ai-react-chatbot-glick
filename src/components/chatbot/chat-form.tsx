/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatFormProps {
  input: string;
  handleSubmit: (e?: any) => void;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const ChatForm: React.FC<ChatFormProps> = ({
  input,
  handleSubmit,
  handleInputChange,
}) => {
  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className="p-3">
        <div className="relative flex items-center bg-gray-100 rounded-2xl border border-gray-200">
          <Textarea
            placeholder="Type your message here"
            className="flex-1 min-h-[60px] resize-none border-0 bg-transparent px-4 py-4 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="mr-2 h-10 w-10 rounded-full hover:bg-gray-200"
            disabled={!input.trim()}
          >
            <img
              src="/assets/send-button.png"
              alt="Virtual Assistant Avatar"
              className="h-[40px] w-[70px] cursor-pointer"
            />
          </Button>
        </div>
      </form>
      <p className="text-slate-700 p-2 text-center font-light text-[16px] mb-1">
        Disclaimer: Do not include any confidential, proprietary, and personally
        identifiable information
      </p>
    </React.Fragment>
  );
};

export default ChatForm;
