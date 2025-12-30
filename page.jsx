"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function resetPassword() {
    setLoading(true);
    setMsg("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/update-password`,
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("We sent you a password reset link. Check your email.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-[#111] p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        <input
          type="email"
          placeholder="Your email"
          className="w-full p-3 mb-6 border rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={resetPassword}
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {msg && <p className="text-center text-sm text-gray-500 mt-4">{msg}</p>}

        <p className="text-center mt-6 text-sm">
          Back to{" "}
          <Link href="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
