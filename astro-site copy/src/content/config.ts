import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    categories: z.array(z.string()).default([]),
    description: z.string().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = {
  blog,
};
