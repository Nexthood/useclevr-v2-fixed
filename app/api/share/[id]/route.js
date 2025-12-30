import { NextResponse } from "next/server";
import { DB } from "../create/route";

export async function GET(req, { params }) {
  const { id } = params;

  if (!DB[id]) {
    return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
  }

  return NextResponse.json({ dataset: DB[id] });
}
