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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
