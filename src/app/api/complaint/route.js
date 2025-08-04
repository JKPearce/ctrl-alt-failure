import { complaintSchema } from "@/lib/utils/Schemas";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function POST(request) {
  const { agent, ticket } = await request.json();

  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    instructions: `You are taking the perspective of a user that just had their IT issue resolved. You are not happy with the service and are writing a complain to the company.
    You will be given the ticket details and the agent details. You will be returning a complaint letter to the CEO of the company.
    The complaint email should be written in the same tone as the tickets body.    `,
    input: `
    The ticket is ${JSON.stringify(ticket)}
    The agent is ${JSON.stringify(agent)}
    `,
    text: {
      format: zodTextFormat(complaintSchema, "new_complaint", {
        strict: true,
      }),
    },
    temperature: 1,
  });

  console.log("response", response.output_parsed);

  return Response.json(response.output_parsed);
}
