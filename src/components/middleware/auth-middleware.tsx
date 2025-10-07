"use client";

import { useEffect, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

export function AuthMiddleware({ children }: PropsWithChildren) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const expiry = Number(localStorage.getItem("tokenExpiry") ?? 0);

    if (!token || expiry <= Date.now()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return <>{children}</>;
}
