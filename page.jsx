"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white dark:bg-[#0B0B12] p-8 rounded-xl shadow-xl space-y-6">
        <h1 className="text-3xl font-bold text-center">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-neutral-900 border border-gray-300 dark:border-gray-700"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-neutral-900 border border-gray-300 dark:border-gray-700"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full py-3 rounded-lg bg-[#4B0082] text-white hover:opacity-90">
            Login
          </button>
        </form>

        <Link href="/auth/reset" className="text-blue-400 text-sm hover:underline">
          Forgot password?
        </Link>

        <Link href="/auth/register" className="block text-center text-sm">
          Create account →
        </Link>
      </div>
    </div>
  );
}
