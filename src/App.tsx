import { ThemeProvider } from "./components/chatbot/theme-provider";
import Main from "./pages";
import { useState } from "react";
import ChatPopup from "./components/chatbot/chat-popup";
import { ChatWidget } from "./components/chatbot/chat-widget";
import { Toaster } from "sonner";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemeProvider defaultTheme="light" storageKey="easydiymurphybed-theme">
      <ChatWidget isOpen={isOpen} handleIsOpen={setIsOpen} />
      <ChatPopup isChatOpen={isOpen} onOpenChat={() => setIsOpen(true)} />
      <Main />

      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

export default App;
