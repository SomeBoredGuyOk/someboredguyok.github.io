import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    refs: defineCollection({
      type: 'page',
      source: 'refs/*.yaml',
      schema: z.object({
        description: z.string().optional(),
        models: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        date: z.string(),
        rating: z.number().optional(),
      })
    }),
    models: defineCollection({
      type: 'page',
      source: 'models/*.yaml',
      schema: z.object({
        names: z.array(z.string()),
        tags: z.array(z.string()).optional(),
        links: z.array(z.string()).optional(),
        images: z.array(z.string()).optional(),
        rating: z.number().optional(),
      })
    })
  }
})