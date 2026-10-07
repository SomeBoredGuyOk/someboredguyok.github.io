import { ref, onMounted } from 'vue'
import { z } from 'zod'

export const useSheetData = <T extends z.ZodTypeAny>(
  schema: T, 
  sheetName: string = 'Sheet1'
) => {
  // Configuration
  const SPREADSHEET_ID = '1HKuFZgqlPGyggFPNm98aVVw1Tijlpj44s3Z58r5E1cU'
  const API_KEY = 'AIzaSyATtkUfLHJBL9USqUYHZB3QJsb63yKQeoI'

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`

   // Extract the underlying inferred TypeScript type from the passed schema
  const dataItems = ref<z.infer<T>[]>([])
  const error = ref<string | null>(null)
  const pending = ref<boolean>(true)

  const loadData = async () => {
    if (!import.meta.client) return

    try {
      pending.value = true
      error.value = null
      
      const response = await window.fetch(url)
      if (!response.ok) throw new Error(`Google API status ${response.status}`)

      const payload = await response.json()
      const rawRows: string[][] = payload.values || []

      if (rawRows.length <= 1) {
        dataItems.value = []
        return
      }

      const headers = rawRows[0]?.map(h => h.toLowerCase().trim()) || []

      dataItems.value = rawRows.slice(1).map((row) => {
        const rawRowObject: Record<string, string> = {}
        headers.forEach((header, index) => {
          rawRowObject[header] = (row[index] || '').trim()
        })
        
        // Zod automatically parses array columns and ignores plain text commas
        return schema.parse(rawRowObject)
      })

    } catch (err: any) {
      console.error('Error fetching sheet data:', err)
      error.value = err.message || 'Failed to load spreadsheet content.'
    } finally {
      pending.value = false
    }
  }

  onMounted(() => {
    loadData()
  })

  return {
    items: dataItems,
    error,
    pending,
    refresh: loadData
  }
}