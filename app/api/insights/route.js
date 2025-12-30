import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const { question, dataset, kpis, schema, correlations } = body;

    // FIXED: correct validation
    if (!question || !dataset) {
      return NextResponse.json(
        { answer: "Invalid request. Missing data or question." },
        { status: 400 }
      );
    }

    // Compact summary for the LLM
    const summary = {
      rows: dataset.length,
      columns: schema.map((col) => col.name),
      kpis,
      correlations,
    };

    const prompt = `
You are UseClevr AI. The user asked a question about a dataset.
You must analyze dataset characteristics, KPIs, correlations and schema.

QUESTION:
"${question}"

DATASET SUMMARY:
${JSON.stringify(summary, null, 2)}

Give a clear, short, structured answer.
Reference correlations or KPIs if relevant.
Avoid hallucinating columns that do not exist.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      temperature: 0.2,
    });

    const answer = completion.choices[0].message.content;

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json(
      { answer: "Server error: " + error.message },
      { status: 500 }
    );
  }
}
