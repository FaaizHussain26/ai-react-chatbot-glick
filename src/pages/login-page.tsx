"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const [isPending, setIsPending] = useState(false);

  const FRONTEND_CREDENTIALS = {
    email: "glick@example.com",
    password: "example12345",
  } as const;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if token is valid
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const expiry = localStorage.getItem("tokenExpiry");
    if (token && expiry && Date.now() < Number.parseInt(expiry)) {
      navigate("/chats/history", { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (formData: LoginFormData) => {
    setIsPending(true);
    try {
      const { email, password } = formData;

      if (
        email.trim().toLowerCase() === FRONTEND_CREDENTIALS.email &&
        password === FRONTEND_CREDENTIALS.password
      ) {
        // Issue a simple dev token valid for 1 hour
        const token = "dev-access-token";
        const expiresInMs = 1000 * 60 * 60;
        const expiry = Date.now() + expiresInMs;

        localStorage.setItem("accessToken", token);
        localStorage.setItem("tokenExpiry", String(expiry));
        localStorage.setItem("userEmail", FRONTEND_CREDENTIALS.email);

        setMessage("Login successful!");
        setMessageType("success");
        navigate("/chats/", { replace: true });
        return;
      }

      setMessage("Invalid credentials. Use glick@example.com / example12345");
      setMessageType("error");
    } catch (err) {
      console.error("Login failed", err);
      setMessage("Login failed. Please try again.");
      setMessageType("error");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white shadow-none border border-none rounded-2xl">
        <CardHeader className="space-y-1 pt-8 pb-4">
          <CardTitle className="text-3xl font-semibold text-left text-gray-900">
            Login
          </CardTitle>
          <CardDescription className="text-left text-base text-gray-600">
            Hi, Welcome back 👋
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                messageType === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="glick@example.com"
                        className="h-12 bg-gray-50 border-gray-200 focus:border-[#03a84e] focus:ring-1 focus:ring-[#03a84e] rounded-lg placeholder:text-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="example12345"
                          className="h-12 pr-10 bg-gray-50 border-gray-200 focus:border-[#03a84e] focus:ring-1 focus:ring-[#03a84e] rounded-lg placeholder:text-gray-400"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 mt-6 bg-gradient-to-r from-[#03a84e] to-[#0a791e] hover:opacity-90 text-white font-semibold rounded-lg transition-opacity"
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
