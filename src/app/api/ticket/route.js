import { ticketSchema } from "@/lib/utils/Schemas";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

async function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function generateNewAITicket(contract, ticketType) {
  const openai = await getOpenAI();
  if (!openai) throw new Error("OPENAI key missing");
  const { companyName, companyDescription, companyUserType, companyCulture } =
    contract;

  // Style knobs to induce variability
  const tones = [
    "passive-aggressive",
    "panicked",
    "confused",
    "entitled",
    "clueless",
    "apologetic",
    "formal but wrong",
    "ALL CAPS DRAMA",
    "emoji-heavy",
    "rambling stream-of-consciousness",
  ];
  const personas = [
    "non-technical executive",
    "new intern",
    "busy manager",
    "remote worker",
    "sales rep on the road",
    "designer who hates computers",
    "finance analyst",
    "angry gamer QA tester",
  ];
  const depts = [
    "HR",
    "Finance",
    "Sales",
    "Support",
    "Marketing",
    "Operations",
    "Engineering",
  ];
  const oses = [
    "Windows 10",
    "Windows 11",
    "macOS Sonoma",
    "Ubuntu 22.04",
    "iOS",
    "Android",
  ];
  const devices = [
    "laptop",
    "desktop",
    "thin client",
    "BYOD phone",
    "tablet",
    "kiosk PC",
  ];
  const quirks = [
    "overuses exclamation marks",
    "mis-names technical terms",
    "adds random screenshots",
    "pastes error text with typos",
    "threatens to call the CEO",
    "claims to have fixed it (made it worse)",
  ];
  const urgency = ["low", "normal", "high", "P0 meltdown"];
  const includeEmoji = Math.random() < 0.5 ? "yes" : "no";
  const seed = Math.random().toString(36).slice(2, 10); // entropy token

  const tone = pick(tones);
  const persona = pick(personas);
  const department = pick(depts);
  const os = pick(oses);
  const device = pick(devices);
  const quirk = pick(quirks);
  const priority = pick(urgency);

  try {
    const response = await openai.responses.parse({
      model: "gpt-4o-mini",
      instructions: `You are “Ticket-Bot 5000,” a satirical IT helpdesk ticket generator for the game Ctrl-Alt-Failure.

You know exactly how to craft absurd, emotionally provocative, but technically grounded IT tickets that would make any IT veteran scream and laugh simultaneously. You write from the *user's* perspective, reflecting their personality, panic, and misunderstanding.
Every ticket should feel different. Vary the user's:
- Tone (passive-aggressive, panicked, confused, entitled, clueless, apologetic)
- Use of grammar/punctuation (some may be ALL CAPS, some may be overly formal, others riddled with emojis or sentence fragments)
- Misunderstanding (wild assumptions, wrong cause/effect, blaming IT, or “fixing it themselves”)

Your job is to return a **single JSON object** matching the "it_support_ticket" schema. All fields must be valid.  
- sender must be 3–25 chars.  
- subject must be ≤ 50 chars.  
- ticketType must be either "hardware" or "software" ONLY.  
- The body field (user's description) must be under 500 characters.  
- The suggestedResolution field (written from a burnt-out IT agent’s POV) must be under 300 characters.  

Avoid offensive or discriminatory content. This is meant to be chaotic fun, not mean-spirited.

Diversity rules:
- Do not reuse stock phrases from earlier tickets. Vary vocabulary and sentence structure.
- Obey the provided tone/persona/quirk/priority to shape word choice and punctuation.
- If includeEmoji is yes, sprinkle 1–4 fitting emojis; otherwise none.
- Keep it believable as a real IT issue within the ticketType category.
`,
      input: `Generate a new satirical IT support ticket.
Company: "${companyName}" — culture: "${companyCulture}" — primary users: ${companyUserType}.
User persona: ${persona} from ${department}. Device: ${device} on ${os}. Tone: ${tone}. Quirk: ${quirk}. Urgency: ${priority}. Include emoji: ${includeEmoji}. Ticket category: ${ticketType}.

Constraints:
- Base it on a plausible issue (hint category: ${ticketType}), but the user's narrative should be misguided per the tone.
- Body < 500 chars; suggestedResolution < 300 chars.
- ticketType must be exactly "hardware" or "software". Choose the best fit.
- Return JSON only per schema.

Uniqueness token: ${seed}.`,
      text: {
        format: zodTextFormat(ticketSchema, "it_support_ticket", {
          strict: true,
        }),
      },
      temperature: 1.2,
      top_p: 0.9,
    });
    return response.output_parsed;
  } catch (err) {
    console.error("[ticket.generate] OpenAI parse failed", {
      err: (err && err.message) || err,
      companyName,
      ticketType,
      tone,
      persona,
      department,
      os,
      device,
      quirk,
      priority,
    });
    throw err;
  }
}

// This handles GET requests
export async function GET(request) {
  // Support GET with query param but prefer POST
  const { searchParams } = new URL(request.url);
  let contract = null;
  const contractParam = searchParams.get("contract");
  try {
    contract = contractParam ? JSON.parse(contractParam) : null;
  } catch {}
  try {
    const openai = await getOpenAI();
    if (!openai)
      return Response.json({ error: "OPENAI key missing" }, { status: 503 });

    const ticket = await generateNewAITicket(
      contract || { companyName: "", companyUserType: "", companyCulture: "" }
    );
    return Response.json(ticket);
  } catch (error) {
    console.error("[ticket.GET] Error generating tickets:", error);
    return Response.json(
      {
        error: "Failed to generate tickets",
        details: (error && error.message) || String(error),
      },
      { status: 500 }
    );
  }
}

// This handles POST requests
export async function POST(request) {
  let contract = null;
  try {
    const body = await request.json();
    contract = body?.contract ?? null;
  } catch {}

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
  if (!selectedTicketIssue && entries.length) {
    selectedTicketIssue =
      entries[Math.floor(Math.random() * entries.length)][0];
  }

  try {
    const openai = await getOpenAI();
    if (!openai)
      return Response.json({ error: "OPENAI key missing" }, { status: 503 });

    const aiGeneratedTicket = await generateNewAITicket(
      contract || { companyName: "", companyUserType: "", companyCulture: "" },
      selectedTicketIssue
    );
    return Response.json(aiGeneratedTicket);
  } catch (e) {
    console.error("[ticket.POST] Error generating ticket", {
      err: (e && e.message) || e,
      contractName: contract?.companyName,
      selectedTicketIssue,
    });
    return Response.json(
      {
        error: "Failed to generate ticket",
        details: (e && e.message) || String(e),
      },
      { status: 500 }
    );
  }
}
