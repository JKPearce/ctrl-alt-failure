import { loadJSON, saveJSON } from "@/lib/utils/fileManager";
import ticketSchema from "@/lib/utils/ticketSchema";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_DEVKEY });

export async function POST() {
  const fresh = await loadJSON("freshTickets.json");
  const archive = await loadJSON("staleTickets.json");

  if (fresh.length < 10) {
    const newTickets = await generateNewAITickets(5);

    fresh.push(...newTickets);
    archive.push(...newTickets);

    await saveJSON("staleTickets.json", archive);
  }

  const selected = fresh.shift();
  await saveJSON("freshTickets.json", fresh);

  return Response.json(selected);
}

async function generateNewAITickets(amount) {
  const newTickets = [];

  for (let index = 0; index < amount; index++) {
    console.log("Generating ticket: ", index);
    const response = await openai.responses.parse({
      model: "gpt-4.1-nano",
      instructions: `Generate a fake IT helpdesk ticket in JSON format.
Tone: chaotic, dryly humorous. This isnt corporate. Its simulated IT hell. Youre an overworked IT agent logging absurd issues while muttering sarcastic thoughts under your breath.
Keep it short, weird, and human. Avoid overly polished writing or novel-like prose. Use smart humor, not fluff.
Field requirements:
raisedBy: A punny or playful name (e.g. “Al Beback”).
category: Hardware, Software, Network, or Security.
issueShortDescription: Funny 3to6 word headline for the issue.
issueDescription: Complaint from users perspective, absurd but believable.
suggestedResolution: What the IT agent did, realistic but with dry humor.
agentRemark: 3 short, internal monologue-style thoughts.`,
      input: "Generate new ticket",
      text: {
        format: zodTextFormat(ticketSchema, "it_support_ticket", {
          strict: true,
        }),
      },
      temperature: 1,
    });

    console.log("ticket generated", response.output_parsed);
    newTickets.push(response.output_parsed);
  }

  return newTickets;
}
