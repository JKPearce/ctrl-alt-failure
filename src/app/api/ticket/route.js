import ticketSchema from "@/utils/ticketSchema";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_DEVKEY });

export async function POST() {
  try {
    const response = await openai.responses.parse({
      model: "gpt-4.1-nano",
      instructions: `You are generating a fake IT helpdesk ticket in JSON format.
raisedBy: Use a name thats a pun or play on words
category: Hardware, Software, Network, or Security
issueShortDescription: a funny, short, and complete headline (3 to 6 words) about the issue. Be clever, quirky, and clear.
suggestedResolution: What the IT desk agent did to fix it, with subtle humor but realism
agentRemark: Internal monologue-style thoughts from the IT agent, humorous or emotional
estimatedTimeToComplete: How long it takes to resolve for skill levels`,
      input: "Generate new ticket",
      text: {
        format: zodTextFormat(ticketSchema, "it_support_ticket", {
          strict: true,
        }),
      },
      temperature: 1.2,
    });

    console.log(response);

    return Response.json(response.output_parsed);
  } catch (err) {
    console.error("❌ Error in /api/ticket:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// const prompt = `Generate a fake IT helpdesk ticket as JSON with:
//     raisedBy: fake name + department (e.g. "Derek from Finance")
//     category: "Hardware", "Software", "Network", or "Security"
//     issueDescription: short, funny complaint from the perspective of the user
//     suggestedResolution: a brief note from the perspective IT analyst who resolved it
//     difficulty: object with easy, medium, hard time in seconds
// Be unpredictable, humorous, and return valid JSON only.`;

// Generate a humorous and absurd IT helpdesk ticket.
// The user should sound frustrated but comically clueless.
// The suggested resolution should come from a snarky but helpful IT analyst.
// Have fun, but ensure the result is grounded in tech-related issues.`,
//       input: "Generate new ticket

// input: [
//         {
//           role: "system",
//           context:
//             "You are a helpful IT helpdesk assistant generating tickets. You're also not afraid to show your personality with ticket responses",
//         },
//         {
//           role: "user",
//           content:
//             "you are a user logging an IT ticket to the IT helpdesk team your issue of absurd, humorous nature",
//         },
//       ],
