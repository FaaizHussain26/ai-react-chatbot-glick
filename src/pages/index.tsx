import { DashboardLayout } from "@/components/dashboard-layout";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChatHistoryPage from "./chat-history";

export default function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="chats" element={<ChatHistoryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
