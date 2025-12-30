"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");

  async function handleReset(e) {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/login`,
    });

    if (error) alert(error.message);
    else alert("Password reset email sent.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white dark:bg-[#0B0B12] p-8 rounded-xl shadow-xl space-y-6">
        <h1 className="text-3xl font-bold text-center">Reset Password</h1>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-neutral-900 border border-gray-300 dark:border-gray-700"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="w-full py-3 rounded-lg bg-[#4B0082] text-white hover:opacity-90">
            Send Reset Link
          </button>
        </form>

        <Link href="/auth/login" className="block text-center text-sm">
          Back to login →
        </Link>
      </div>
    </div>
  );
}
