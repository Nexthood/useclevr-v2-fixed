import OpenAI from "openai";

export async function POST(req) {
  const body = await req.json();
  const { dataset, columns } = body;

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const preview = dataset.slice(0, 20);

  const prompt = `
You are a senior data analyst. Summarize this dataset clearly and professionally.

Columns:
${columns.join(", ")}

Preview (first 20 rows):
${JSON.stringify(preview, null, 2)}

Provide:
- High-level summary
- Key metrics
- Trends or patterns
- Data quality issues
- 3 insights worth exploring
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: prompt }],
  });

  const summary = completion.choices[0].message.content;

  return Response.json({ summary });
}
