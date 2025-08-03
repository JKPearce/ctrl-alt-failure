import { screamSchema } from "@/lib/utils/Schemas";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_DEVKEY });

export async function POST(request) {
  const { agent, currentTicket, chaos, currentTime, currentDay } =
    await request.json();

  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    instructions: `You are a generator for a system called "screams" this system is similar to twitter. 
You will be returning a short scream (max 280 characters) with some hashtags related to the agents personality and the current situations happening in the game.
Keep the tone authentic to the agent's personality - don't make everyone sound the same.
- Use 2-4 hashtags maximum
- Keep it under 280 characters
- Make it feel like a real social media post
- Vary the tone based on personality (WORKAHOLIC = more professional, SLACKER = more casual)`,
    input: `The current chaos level is ${chaos}% the current day is ${currentDay} and the current game time is ${currentTime}.
    Generate a new scream from the agent ${agent.agentName} who is a ${agent.age} year old ${agent.gender} and their work ethic is ${agent.behavior} and personality is ${agent.personality}.
    The current ticket is ${currentTicket} and the current chaos level is ${chaos}%.
    The more chaotic the better, but keep it believable and in line with the current chaos level of ${chaos}%.
    feel free to potentially use any of the following:
    Agent quirks: ${agent.quirk}
    Agent favorite food: ${agent.favFood}
    Agent skills: Hardware: ${agent.skills.hardware} Software: ${agent.skills.software}
    Agent personal statement: ${agent.personalStatement}
    `,
    text: {
      format: zodTextFormat(screamSchema, "new_scream", {
        strict: true,
      }),
    },
    temperature: 1,
  });

  console.log("response", response.output_parsed);

  return Response.json(response.output_parsed);
}
