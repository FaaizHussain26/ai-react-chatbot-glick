export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-gray-500 text-sm px-4 py-2 border border-gray-200 rounded-full bg-gray-50 w-[23%]">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0s]"></div>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
      </div>
    </div>
  );
}
