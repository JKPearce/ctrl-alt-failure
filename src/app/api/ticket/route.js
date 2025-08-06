import { ticketSchema } from "@/lib/utils/Schemas";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

async function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

async function generateNewAITicketsBulk(amount) {
  const openai = await getOpenAI();
  if (!openai) throw new Error("OPENAI key missing");
  const newTickets = [];

  for (let index = 0; index < amount; index++) {
    const response = await openai.responses.parse({
      model: "gpt-4o-mini",
      instructions: `You are Ticket-Bot 5000, a cheeky help-desk ticket generator. Return ONLY the JSON array.`,
      input: `Generate a Generic IT related ticket`,
      text: {
        format: zodTextFormat(ticketSchema, "it_support_ticket", {
          strict: true,
        }),
      },
      temperature: 1.2,
    });

    newTickets.push(response.output_parsed);
  }

  return newTickets;
}
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

async function generateNewAITicket(contract, ticketType) {
  const openai = await getOpenAI();
  if (!openai) throw new Error("OPENAI key missing");
  const { companyName, companyDescription, companyUserType, companyCulture } =
    contract;

  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    instructions: `You know exactly how to craft the best ragebait IT related tickets from the point of view of the end user.
Return ONLY a single JSON object matching the expected format.
All fields must be strictly valid. 
Keep the 'suggestedResolution' field under 300 characters total. 
Keep the 'body' field under 1000 characters total. 
the suggested resolution should be from the perspective of an IT agent that worked on the issue, they are burnt out and stressed`,
    input: `Generate a new ${ticketType} ticket for a company named ${companyName} that is a ${companyDescription} and the userbase is ${companyUserType}. Feel free to explore ideas around this company, this is for a game where the more funny but believable it is the better. feel free to sometimes miss punctuation and grammar. and use things like multiple question marks and exclamations to push urgency and panic`,
    text: {
      format: zodTextFormat(ticketSchema, "it_support_ticket", {
        strict: true,
      }),
    },
    temperature: 1.1,
  });

  return response.output_parsed;
}

// This handles GET requests
export async function GET(request) {
  try {
    const openai = await getOpenAI();
    if (!openai)
      return Response.json({ error: "OPENAI key missing" }, { status: 503 });

    const tickets = await generateNewAITicketsBulk(1);
    return Response.json(tickets);
  } catch (error) {
    console.error("Error generating tickets:", error);
    return Response.json(
      { error: "Failed to generate tickets" },
      { status: 500 }
    );
  }
}

// This handles POST requests
export async function POST(request) {
  const { contract } = await request.json();

  // select specific issue via spawnTable
  const entries = Object.entries(contract.spawnTable);
  const roll = Math.random();
  let cumulativeProbability = 0;
  let selectedTicketIssue = null;

  for (const [key, probability] of entries) {
    cumulativeProbability += probability;
    if (roll <= cumulativeProbability) {
      selectedTicketIssue = key;
      break;
    }
  }

  try {
    const openai = await getOpenAI();
    if (!openai)
      return Response.json({ error: "OPENAI key missing" }, { status: 503 });

    const aiGeneratedTicket = await generateNewAITicket(
      contract,
      selectedTicketIssue
    );
    return Response.json(aiGeneratedTicket);
  } catch (e) {
    return Response.json(
      { error: "Failed to generate ticket" },
      { status: 500 }
    );
  }
}
