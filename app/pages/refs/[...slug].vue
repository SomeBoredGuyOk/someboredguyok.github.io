<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection("refs").path(route.path).first()
})
</script>
<template>
  <UContainer>
    <div class="h-200 relative">
      <!-- <RedgifsVideo v-if="page?.key" :path="page.key"></RedgifsVideo> -->
    </div>
  </UContainer>
</template>