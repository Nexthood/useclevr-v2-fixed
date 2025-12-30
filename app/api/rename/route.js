import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { columns } = await req.json();

    if (!columns || columns.length === 0) {
      return NextResponse.json({ error: "No columns provided" });
    }

    const prompt = `
Rename the following dataset column names into clean, readable, professional BI names.
Do NOT change meaning, only make them clean, short, and human-readable.
Return ONLY JSON: { "newNames": [ ... ] }

Columns:
${JSON.stringify(columns, null, 2)}
    `;

    const ai = await client.chat.completions.create({
      model: "gpt-4.1",
      temperature: 0.2,
      messages: [
        { role: "system", content: "You rename dataset columns professionally." },
        { role: "user", content: prompt }
      ]
    });

    const json = JSON.parse(ai.choices[0].message.content);

    return NextResponse.json({ newNames: json.newNames });
  } catch (e) {
    return NextResponse.json({ error: e.message });
  }
}
