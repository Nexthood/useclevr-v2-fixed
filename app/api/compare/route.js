import OpenAI from "openai";

export async function POST(req) {
  const body = await req.json();
  const { datasetA, datasetB, nameA, nameB } = body;

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const previewA = datasetA.slice(0, 20);
  const previewB = datasetB.slice(0, 20);

  const prompt = `
You are a senior data analyst. Compare the following two datasets.

Dataset A: ${nameA}
Preview (first 20 rows):
${JSON.stringify(previewA, null, 2)}

Dataset B: ${nameB}
Preview (first 20 rows):
${JSON.stringify(previewB, null, 2)}

Provide a structured comparison:
- Summary of each dataset
- Key differences
- Similarities
- Trends
- Correlations
- 3 actionable insights
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: prompt }],
  });

  const answer = completion.choices[0].message.content;

  return Response.json({ answer });
}
