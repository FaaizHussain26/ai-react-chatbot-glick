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

export default function Main() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Guest-only login route; authenticated users are redirected by GuestMiddleware */}
        <Route
          path="/login"
          element={
            <GuestMiddleware>
              <LoginPage />
            </GuestMiddleware>
          }
        />

        {/* Dashboard layout with nested routes */}
        <Route path="/chats" element={<DashboardLayout />}>
          <Route path="" element={<ChatHistoryPage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
