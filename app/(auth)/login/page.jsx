"use client";

import GuestRoute from "@/components/auth/GuestRoute";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <GuestRoute>
      <AuthForm mode="login" />
    </GuestRoute>
  );
}