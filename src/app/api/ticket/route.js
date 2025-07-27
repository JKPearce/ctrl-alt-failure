import { ticketSchema } from "@/lib/utils/Schemas";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_DEVKEY });

async function generateNewAITicketsBulk(amount) {
  const newTickets = [];

  for (let index = 0; index < amount; index++) {
    console.log("Generating ticket: ", index);
    const response = await openai.responses.parse({
      model: "gpt-4o-mini",
      instructions: ``,
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

async function generateNewAITicket(contract, ticketType) {
  const { companyName, companyDescription, companyUserType, companyCulture } =
    contract;

  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    instructions: `You are generating an IT support ticket in the form of an email from a user at ${companyName} which is ${companyDescription} and the users are ${companyUserType} and the culture is ${companyCulture}`,
    input: `Generate a new ${ticketType} ticket`,
    text: {
      format: zodTextFormat(ticketSchema, "it_support_ticket", {
        strict: true,
      }),
    },
    temperature: 1,
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
  console.log("contract", contract);

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

  console.log("selectedTicketIssue ", selectedTicketIssue);

  const aiGeneratedTicket = await generateNewAITicket(
    contract,
    selectedTicketIssue
  );
  return Response.json(aiGeneratedTicket);
}
