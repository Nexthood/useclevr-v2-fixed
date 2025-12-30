import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { user_id } = await req.json();

    const { data, error } = await supabase
      .from("datasets")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ datasets: data });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
