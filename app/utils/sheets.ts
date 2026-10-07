// app/types/sheets.ts
import { z } from 'zod'

// Helper to automatically turn comma-separated string cells into string arrays
const commaDelimitedArray = z.preprocess((val) => {
  if (typeof val !== 'string' || !val) return []
  return val.split(',').map((item) => item.trim()).filter(Boolean)
}, z.array(z.string()))

// 2. Break Delimited Split (Handles Alt+Enter / Ctrl+Enter from Google Sheets)
const breakDelimitedArray = z.preprocess((val) => {
  if (typeof val !== 'string' || !val) return []
  
  // Splits on standard line breaks (\n) and carriage returns (\r)
  return val
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}, z.array(z.string()))

// 1. Define your structure ONCE here
export const RefSchema = z.object({
  id: z.string(),
  date: z.string(), // Commas here stay as plain text strings!
  tags: commaDelimitedArray,             // Commas here automatically become a clean string[]
  models: commaDelimitedArray          // Commas here automatically become a clean string[]
})
export const ModelSchema = z.object({
  id: z.string(),
  tags: commaDelimitedArray,
  names: commaDelimitedArray,
  rating: z.coerce.number(),
  links: breakDelimitedArray,
})
export const PromptSchema = z.object({
  prompt: z.string(),
  "no.": z.string(),
  title: z.string(),
  tags: commaDelimitedArray,
})
// 2. Automatically extract the TypeScript type interface from the schema
export type RefItem = z.infer<typeof RefSchema>
export type ModelItem = z.infer<typeof ModelSchema>
export type PromptItem = z.infer<typeof PromptSchema>