"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function handleSignup(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/datasets");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-semibold mb-6 text-center">Sign Up</h1>

        <form className="space-y-5" onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            className="border w-full p-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border w-full p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMsg && (
            <p className="text-red-600 text-sm">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline text-blue-600">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
