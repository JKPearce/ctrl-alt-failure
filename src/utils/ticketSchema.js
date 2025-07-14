import { z } from "zod";

const ticketSchema = z.object({
  raisedBy: z
    .string()
    .min(3)
    .max(15)
    .describe("First name and Last name in the form of a pun"),
  category: z
    .enum(["Hardware", "Software", "Network", "Security"])
    .describe("The type of issue that the issueDescribed is referencing"),
  issueDescription: z
    .string()
    .min(10)
    .max(300)
    .describe(
      "Short, funny complaint about an IT Issue that has been written by the user in raisedBy"
    ),
  issueShortDescription: z
    .string()
    .min(1)
    .max(50)
    .describe(
      "A 3 to 6 word funny summary of the issue (like a headline). Examples: Laptop thinks its a toaster"
    ),
  suggestedResolution: z
    .string()
    .min(10)
    .max(300)
    .describe(
      "From the perspective of an IT Agent that resolved the ticket, with their humorous quirks"
    ),
  estimatedTimeToComplete: z
    .object({
      beginner: z
        .number()
        .min(1)
        .describe("Time in seconds. Skills of an beginner IT analyst"),
      intermediate: z
        .number()
        .min(1)
        .describe("Time in seconds. Skills of an intermediate IT analyst"),
      advanced: z
        .number()
        .min(10)
        .max(500)
        .describe("Time in seconds. Skills of an advanced IT analyst"),
    })
    .describe(
      "Time in seconds for how long a ticket of this issue will take to resolve. (IT analyst with beginner level skills may take 200 seconds to resolve a ticket but someone with export skills could resolve it in 20 seconds)"
    ),

  agentRemark: z
    .array(
      z.object({
        comment: z
          .string()
          .min(3)
          .max(300)
          .describe(
            "Internal monologue from the agent while working on the ticket"
          ),
        tone: z
          .enum(["helpful", "angry", "sarcastic", "neutral", "frustrated"])
          .describe("The emotional tone or archetype of the agent's comment"),
      })
    )
    .min(3)
    .max(3)
    .describe(
      "Absurd, humorous Remarks that could be made by an IT Agent working on this ticket"
    ),
});

export default ticketSchema;
