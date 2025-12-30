"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <nav className="w-full bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-semibold">
        UseClevr
      </Link>

      <div className="flex items-center gap-4">
        {!user && (
          <>
            <Link href="/auth/login" className="text-sm hover:underline">
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-black text-white text-sm rounded-lg"
            >
              Sign up
            </Link>
          </>
        )}

        {user && (
          <>
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
