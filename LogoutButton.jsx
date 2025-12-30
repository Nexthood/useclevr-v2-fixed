"use client";

import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <button
      onClick={logout}
      className="px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
    >
      Logout
    </button>
  );
}
