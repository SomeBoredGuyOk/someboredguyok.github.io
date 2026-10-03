import { ref, onMounted } from 'vue'

export const useSheetData = (sheetName: string = 'Sheet1') => {
  // Configuration
  const SPREADSHEET_ID = '1HKuFZgqlPGyggFPNm98aVVw1Tijlpj44s3Z58r5E1cU'
  const API_KEY = 'AIzaSyATtkUfLHJBL9USqUYHZB3QJsb63yKQeoI'

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`

  const rows = ref<string[][]>([])
  const error = ref<string | null>(null)
  const pending = ref<boolean>(true)

  const loadData = async () => {
    // Force the execution to run exclusively in the browser
    if (!import.meta.client) return

    try {
      pending.value = true

      // Use native window.fetch instead of Nuxt's \$fetch wrapper
      // This ensures no framework-specific custom headers break the Google pre-flight CORS check
      const response = await window.fetch(url)

      if (!response.ok) {
        throw new Error(`Google API responded with status ${response.status}`)
      }

      // Parse the JSON array
      const data = await response.json() as unknown as GoogleSheetsResponse

      if (data && data.values) {
        rows.value = data.values
      } else {
        rows.value = []
      }
    } catch (err: any) {
      console.error('Error fetching sheet data:', err)
      error.value = err.message || 'Failed to load spreadsheet content.'
    } finally {
      pending.value = false
    }
  }

  // Trigger the fetch as soon as the component loads in the browser
  onMounted(() => {
    loadData()
  })

  return {
    rows,
    error,
    pending,
    refresh: loadData
  }
}