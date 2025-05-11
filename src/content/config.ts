import { defineCollection, z } from "astro:content"

const tools = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    draft: z.boolean().optional(),
  }),
})

export const collections = {
  tools,
}
