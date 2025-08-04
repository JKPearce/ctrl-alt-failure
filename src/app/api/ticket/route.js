import { ticketSchema } from "@/lib/utils/Schemas";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

async function generateNewAITicketsBulk(amount) {
  const newTickets = [];

  for (let index = 0; index < amount; index++) {
    console.log("Generating ticket: ", index);
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

    console.log("ticket generated", response.output_parsed);
    newTickets.push(response.output_parsed);
  }

  return newTickets;
}

async function generateNewAITicket(contract, ticketType) {
  const { companyName, companyDescription, companyUserType, companyCulture } =
    contract;

  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    instructions: `You are Ticket-Bot 5000, a cheeky help-desk ticket generator. 
Return ONLY a single JSON object matching the expected format.
All fields must be strictly valid. 
Keep the 'suggestedResolution' field under 300 characters total. 
Avoid unnecessary rambling or repetition. Stay concise and passive-aggressive.`,
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
    // Call your function and wait for it to complete
    const tickets = await generateNewAITicketsBulk(1);

    // Return a proper JSON response
    return Response.json(tickets);
  } catch (error) {
    // Handle any errors that occur
    console.error("Error generating tickets:", error);

    // Return an error response
    return Response.json(
      { error: "Failed to generate tickets" },
      { status: 500 }
    );
  }
}

// This handles POST requests
export async function POST(request) {
  const { contract } = await request.json();

  //I want to make a "generic IT Ticket" one that can happen in any company
  //i also want to roll on the spawnTable to get a specific type of ticket related to the company
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

  const aiGeneratedTicket = await generateNewAITicket(
    contract,
    selectedTicketIssue
  );
  return Response.json(aiGeneratedTicket);
}
