"use client";

import GuestRoute from "@/components/auth/GuestRoute";
import AuthForm from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <GuestRoute>
      <AuthForm mode="signup" />
    </GuestRoute>
  );
}