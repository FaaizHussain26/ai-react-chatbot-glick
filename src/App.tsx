import ChatWidget from "./components/chatbot/chat-widget";
import { ThemeProvider } from "./components/chatbot/theme-provider";
import Main from "./pages";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="easydiymurphybed-theme">
      <ChatWidget />
      <Main />
    </ThemeProvider>
  );
}

export default App;
