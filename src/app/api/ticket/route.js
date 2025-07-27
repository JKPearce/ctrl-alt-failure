import { ticketSchema } from "@/lib/utils/Schemas";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_DEVKEY });

async function generateNewAITickets(amount) {
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

// This handles GET requests
export async function GET(request) {
  try {
    // Call your function and wait for it to complete
    const tickets = await generateNewAITickets(1);

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
  // your logic here
}
