"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function login() {
    setLoading(true);
    setMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Logged in!");
      router.push("/"); // redirect to dashboard or home
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-[#111] p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Welcome Back</h1>

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
          onClick={login}
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {msg && <p className="text-center text-sm text-gray-500 mt-4">{msg}</p>}

        <p className="text-center mt-6 text-sm">
          No account?{" "}
          <Link href="/signup" className="text-blue-600 underline">
            Create one
          </Link>
        </p>

        <p className="text-center mt-2 text-sm">
          Forgot password?{" "}
          <Link href="/reset" className="text-blue-600 underline">
            Reset it
          </Link>
        </p>
      </div>
    </div>
  );
            }
