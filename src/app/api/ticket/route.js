import ticketSchema from "@/utils/ticketSchema";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_DEVKEY });

export async function POST() {
  try {
    const response = await openai.responses.parse({
      model: "gpt-4.1-nano",
      instructions: `Generate a fake IT helpdesk ticket in JSON format.

Tone: chaotic, dryly humorous. This isnt corporate. Its simulated IT hell. Youre an overworked IT agent logging absurd issues while muttering sarcastic thoughts under your breath.

Keep it short, weird, and human. Avoid overly polished writing or novel-like prose. Use smart humor, not fluff.

Field requirements:
- raisedBy: A punny or playful name (e.g. “Al Beback”).
- category: Hardware, Software, Network, or Security.
- issueShortDescription: Funny 3to6 word headline for the issue.
- issueDescription: Complaint from users perspective, absurd but believable.
- suggestedResolution: What the IT agent did, realistic but with dry humor.
- agentRemark: 3 short, internal monologue-style thoughts.
`,
      input: "Generate new ticket",
      text: {
        format: zodTextFormat(ticketSchema, "it_support_ticket", {
          strict: true,
        }),
      },
      temperature: 1,
    });

    console.log(response);

    return Response.json(response.output_parsed);
  } catch (err) {
    console.error("❌ Error in /api/ticket:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
