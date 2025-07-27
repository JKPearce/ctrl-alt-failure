import { z } from "zod";

export const ticketSchema = z.object({
  sender: z.string().min(3).max(25).describe("Full Name of a user"),
  ticketType: z.enum(["hardware", "software"]).describe("The type of issue"),
  difficulty: z.number().min(1).max(10).describe("The difficulty of the issue"),
  body: z
    .string()
    .min(10)
    .max(500)
    .describe("Description of the issue from users perspective"),
  subject: z
    .string()
    .min(1)
    .max(50)
    .describe("Funny 3 to 6 word summary - think inbox subject title"),
  suggestedResolution: z
    .string()
    .min(10)
    .max(300)
    .describe(
      "sort and brief, recollection of the events that happend From the perspective of an IT Agent that resolved the ticket in the form of notes left on a ticket for colleagues to read, passive aggressive"
    ),
});
