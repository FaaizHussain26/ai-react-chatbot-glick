import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ChatOption {
  id: string;
  text: string;
  value: string;
}

interface ChatOptionsProps {
  options: ChatOption[];
  onOptionSelect: (option: ChatOption) => void;
}

export function ChatOptions({ options, onOptionSelect }: ChatOptionsProps) {
  return (
    <div className="flex flex-col gap-2 mt-3">
      {options.map((option) => (
        <Button
          key={option.id}
          variant="link"
          className="justify-start text-left h-auto p-3 whitespace-normal bg-[#03a84e]"
          onClick={() => onOptionSelect(option)}
        >
          <span className="flex items-center gap-2 w-full">
            <span className="text-sm flex-1 text-white">{option.text}</span>
            <ArrowRight className="h-4 w-4 opacity-50 flex-shrink-0 text-white" />
          </span>
        </Button>
      ))}
    </div>
  );
}
