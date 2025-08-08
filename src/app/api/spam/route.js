import { spamEmailSchema } from "@/lib/utils/Schemas";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

export async function POST(request) {
  const { contract } = await request.json();
  const { companyName, companyDescription, companyUserType, companyCulture } =
    contract;

  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (!apiKey) {
    return Response.json({ error: "OPENAI key missing" }, { status: 503 });
  }
  const openai = new OpenAI({ apiKey });

  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    instructions: `You are a spam email generator for a game that is based on an IT helpdesk. You will generate humorous but believable spam emails that could be sent to a company's helpdesk. It could be from a nigerian prince trying to sell you something or maybe its a fake gmail email or some sort of fake click here to expand your ram capacity. You must return only raw JSON, with no explanations, no formatting, and no Markdown. Ensure all newlines are escaped properly within strings using \\n. Do not include any backticks or code blocks. Do not prefix the output with text like "Here's your JSON".
`,
    input: `Generate a new spam email for this IT helpdesk company.
Company: ${companyName} — culture: ${companyCulture} — users: ${companyUserType}.
Vary sender style, subject bait, and payload (phish, fake invoice, scareware). Keep it humorous but not offensive.`,
    text: {
      format: zodTextFormat(spamEmailSchema, "spam_email", {
        strict: true,
      }),
    },
    temperature: 1.1,
  });

  return Response.json(response.output_parsed);
}
