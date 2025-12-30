"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function register() {
    setLoading(true);
    setMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/verify`
      }
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Check your inbox to confirm your email.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-[#111] p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={register}
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {msg && (
          <p className="text-center text-sm text-gray-500 mt-4">{msg}</p>
        )}

        <p className="text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 underline">Login</Link>
        </p>
      </div>
    </div>
  );
          }
