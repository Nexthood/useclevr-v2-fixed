import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

// TEMP IN-MEMORY DATABASE (lifetime until restart)
// Later we switch to Supabase or PostgreSQL
const DB = {};

export async function POST(req) {
  try {
    const { dataset } = await req.json();

    if (!dataset || dataset.length === 0) {
      return NextResponse.json({ error: "Empty dataset" });
    }

    const id = randomUUID();
    DB[id] = dataset;

    return NextResponse.json({
      id,
      url: `/share/${id}`
    });
  } catch (e) {
    return NextResponse.json({ error: e.message });
  }
}

// TEMP EXPORT FOR OTHER ROUTES (server-wide)
export { DB };
