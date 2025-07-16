import { z } from "zod";

const ticketSchema = z.object({
  raisedBy: z.string().min(3).max(25).describe("Punny name (e.g. Al Beback)"),
  category: z
    .enum(["Hardware", "Software", "Network", "Security"])
    .describe("The type of issue"),
  issueDescription: z
    .string()
    .min(10)
    .max(300)
    .describe("Users absurd complaint from their point of view"),
  issueShortDescription: z
    .string()
    .min(1)
    .max(50)
    .describe("Funny 3 to 6 word summary"),
  suggestedResolution: z
    .string()
    .min(10)
    .max(300)
    .describe("From the perspective of an IT Agent that resolved the ticket"),
  estimatedTimeToComplete: z
    .object({
      beginner: z.number().min(1).max(1000),
      intermediate: z.number().min(1).max(700),
      advanced: z.number().min(10).max(500),
    })
    .describe(
      "Time in seconds it will take to resolve based on IT analyst skills. Beginners may take 100 seconds but advanced 20 seconds"
    ),
  agentRemark: z
    .array(
      z.object({
        comment: z.string().min(3).max(300).describe("Agents inner thoughts"),
        tone: z
          .enum(["helpful", "angry", "sarcastic", "neutral", "frustrated"])
          .describe("Emotional Tone"),
      })
    )
    .min(3)
    .max(3)
    .describe(
      "Funny remarks from the perspective of the agent resolving the issue being described"
    ),
});

export default ticketSchema;
