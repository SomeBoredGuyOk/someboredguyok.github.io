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
        hidden: z.boolean().default(false)
      })
    }),
    models: defineCollection({
      type: 'page',
      source: 'models/*.yaml',
      schema: z.object({
        names: z.array(z.string()),
        nameLower: z.string().optional(),
        tags: z.array(z.string()).optional(),
        links: z.array(z.string()).optional(),
        images: z.array(z.string()).optional(),
        rating: z.number().optional(),
        cute: z.number().default(0),
        hot: z.number().default(0),
        babygirl: z.number().default(0),
        mommy: z.number().default(0),
        innocent: z.number().default(0),
        devious: z.number().default(0),
        skinny: z.number().default(0),
        chubby: z.number().default(0),

      }).transform((data) => ({
        ...data,
        nameLower: data.names[0].toLowerCase()
      }))
    })
  }
})