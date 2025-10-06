"use client";

import { LoginFormData } from "@/utils/validation/login-schema";
import { useState } from "react";

type Callbacks = {
  onSuccess?: (response: unknown) => void;
  onError?: (err: unknown) => void;
};

export function useLoginMutation() {
  const [isPending, setIsPending] = useState(false);

  const mutate = (formData: LoginFormData, callbacks: Callbacks = {}) => {
    setIsPending(true);
    (async () => {
      try {
        // Simulate async login (you can replace with real API later)
        await new Promise((res) => setTimeout(res, 600));

        const response = {
          accessToken: "dev-access-token",
          expiresInMs: 1000 * 60 * 60, // 1 hour
          user: { email: formData.email },
        };

        callbacks.onSuccess?.(response);
      } catch (e) {
        callbacks.onError?.(e);
      } finally {
        setIsPending(false);
      }
    })();
  };

  return { mutate, isPending };
}
