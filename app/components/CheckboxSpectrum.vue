<script lang="ts" setup>
const levels = 2
const end1 = "Babygirl"
const end2 = "Mommy"
interface Spectrum {
  end1: string,
  end2: string,
  value1: number,
  value2: number,
}
const props = defineProps<{
  spectrums: Spectrum[],
}>()
</script>
<template>
  <!-- <div class="flex gap-1 [&>span]:text-dimmed [&>span]:text-xs items-center">
    <span>{{ end1 }}</span>
    <UCheckbox v-for="id in levels * 2 + 1" ></UCheckbox>
    <span>{{ end2 }}</span>
  </div> -->
  <table class="table-auto w-fit [&_td]:[&>span]:text-dimmed [&_td]:[&>span]:text-xs items-center border-spacing-1 border-spacing-y-0 border-separate [&_td]:align-middle">
    <tr v-for="spectrum in spectrums">
      <td class="text-end"><span>{{ spectrum.end1 }}</span></td>
      <td>
        <div class="flex gap-1">
          <UCheckbox v-for="id in levels * 2 + 1" :default-value="id==levels + 1 + spectrum.value2 - spectrum.value1" color="neutral" disabled :ui="{
            base: 'cursor-default'
          }"></UCheckbox>
        </div>
      </td>
      <td><span>{{ spectrum.end2 }}</span></td>
    </tr>
  </table>
</template>