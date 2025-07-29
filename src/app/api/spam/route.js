import { spamEmailSchema } from "@/lib/utils/Schemas";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_DEVKEY });

export async function POST(request) {
  const { contract, chaos } = await request.json();

  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    instructions: `You are a spam email generator for a game that is based on an IT helpdesk. You will generate humorous but believable spam emails that could be sent to a company's helpdesk. It could be from a nigerian prince trying to sell you something or maybe its a fake gmail email or some sort of fake click here to expand your ram capacity. You must return only raw JSON, with no explanations, no formatting, and no Markdown. Ensure all newlines are escaped properly within strings using \\n. Do not include any backticks or code blocks. Do not prefix the output with text like "Here's your JSON".
`,
    input: `Generate a new spam email for this IT helpdesk company. The current chaos level is ${chaos}%. You may use aspects of the players current client, their clients name is ${contract.companyName} and they are a ${contract.companyDescription} and the userbase is ${contract.companyUserType}. the more chaotic the better, but keep it believable and in line with the current chaos level of ${chaos}%.`,
    text: {
      format: zodTextFormat(spamEmailSchema, "spam_email", {
        strict: true,
      }),
    },
    temperature: 1,
  });

  console.log("response", response.output_parsed);

  return Response.json(response.output_parsed);
}
