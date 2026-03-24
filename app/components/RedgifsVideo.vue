<script setup lang="ts">
const props = defineProps<{
  path?: string,
}>()
</script>
<template>
  <!-- <video width="320" height="240" controls>
    <source :src="`https://media.redgifs.com/${path}.mp4`" type="video/mp4">
  </video> -->
    <iframe :src='`https://www.redgifs.com/ifr/${path}`' frameBorder='0' scrolling='no' width='100%' height='100%' style='position:absolute; top:0; left:0;' allowFullScreen></iframe>
</template>