<script setup lang="ts">
import { useSheetData } from '~/composables/useSheetData'
interface Prompt {
  prompt: string,
  "no.": string,
  title: string,
  tags: string[],
}
const { items, error, pending } = useSheetData(PromptSchema, 'Prompts')

// Extract the header row (row index 0)
// const headers = computed<string[]>((): string[] => {
//   return items.value.length > 0 ? items.value[0] ?? [] : []
// })

// // Convert rows into an easy-to-use array of objects
// const items = computed(() => {
//   if (rows.value.length <= 1) return []
  
//   // Slice off the header row and map the remaining rows
//   return rows.value.slice(1).map((row) => {
//     const item: Record<string, string> = {}
    
//     headers.value.forEach((header, index) => {
//       // Create a lowercase key matching the header name
//       const keyName = header.toLowerCase().trim()
//       item[keyName] = row[index] || ''
//     })
    
//     return item
//   })
// })
</script>
<template>
  <UMain>
    <UPageSection>
      <UBlogPosts>
        <UBlogPost v-for="item in items.filter(item => item.prompt != '').reverse()" :description="item.prompt" :title="`#${item['no.']} ${item.title}`">
          <template #badge>
            {{ item.tags }}
          </template>
        </UBlogPost>
      </UBlogPosts>
    </UPageSection>
  </UMain>
</template>