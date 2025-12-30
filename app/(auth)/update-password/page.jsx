"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function updatePassword() {
    setLoading(true);
    setMsg("");

    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Password updated! You can now log in.");
      setTimeout(() => router.push("/login"), 2000);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-[#111] p-8 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6">Set New Password</h1>

        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 mb-6 border rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={updatePassword}
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {msg && <p className="text-center text-sm text-gray-500 mt-4">{msg}</p>}
      </div>
    </div>
  );
}
