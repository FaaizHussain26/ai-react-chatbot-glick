"use client";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { GuestMiddleware } from "@/components/middleware/guest-middleware";

import LoginPage from "./login-page";
import ChatHistoryPage from "./chat-history";
import { AuthMiddleware } from "@/components/middleware/auth-middleware";

import ChatbotConfigurationPage from "./chatbots";
import KnowledgeBasePage from "./knowledge-base";
import ManageChatbotsPage from "./manage-chatbots";

export default function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={null} />

        {/* Guest-only login route */}
        <Route
          path="/login"
          element={
            <GuestMiddleware>
              <LoginPage />
            </GuestMiddleware>
          }
        />

        <Route
          path="/chats"
          element={
            <AuthMiddleware>
              <DashboardLayout />
            </AuthMiddleware>
          }
        >
          <Route path="" element={<ChatHistoryPage />} />
        </Route>

        <Route
          path="/chatbot-configuration"
          element={
            <AuthMiddleware>
              <DashboardLayout />
            </AuthMiddleware>
          }
        >
          <Route path="" element={<ChatbotConfigurationPage />} />
        </Route>

        <Route
          path="/knowledge-base"
          element={
            <AuthMiddleware>
              <DashboardLayout />
            </AuthMiddleware>
          }
        >
          <Route path="" element={<KnowledgeBasePage />} />
        </Route>

        <Route
          path="/manage-chatbots"
          element={
            <AuthMiddleware>
              <DashboardLayout />
            </AuthMiddleware>
          }
        >
          <Route path="" element={<ManageChatbotsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
