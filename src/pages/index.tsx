import { DashboardLayout } from "@/components/dashboard-layout";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChatHistoryPage from "./chat-history";

export default function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/chats" element={<DashboardLayout />}>
          <Route path="history" element={<ChatHistoryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
