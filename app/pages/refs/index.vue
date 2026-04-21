<script setup lang="ts">
import type { RefsCollectionItem } from '@nuxt/content';
import type { DropdownMenuItem } from '@nuxt/ui';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

onMounted(() => {
  const hash = location.hash.slice(1)
  if (hash != '') {
    currentRef.value = refs.value?.find(({title}) => title == hash)
    console.log(hash)
  }
})
const { data: refs } = await useAsyncData("all-refs", () => {
  return queryCollection("refs").order("date", "DESC").all()
})
const { data: models } = await useAsyncData("all-models", () => {
  return queryCollection("models").order("names", "DESC").all()
})
const refMap = ref(new Map<RefsCollectionItem|undefined, boolean>(refs.value?.map(ref => [ref, false])))
const currentRef = ref<RefsCollectionItem>()
const modalOpen1 = ref(false)
const modalOpen = computed<boolean>({
  get() {
    return currentRef.value != undefined
  },
  set(value) {
    if (value == false) {
      currentRef.value = undefined
    }
  }
})
function viewRef(ref: RefsCollectionItem) {
  currentRef.value = ref
  modalOpen.value = true
}
const tags = computed(() => {
  return [...new Set(refs.value?.flatMap(ref => refTags(ref)))].sort()
})
function refModels(ref: RefsCollectionItem) {
  return ref.models?.map(model => models.value?.find(({title}) => title == model)) || []
}
function refTags(ref: RefsCollectionItem) {
  const refTags = ref.tags || []
  refTags.push(...(refModels(ref).flatMap(model => model?.tags || [])))
  return [...new Set(refTags)]
}
function refRating(ref: RefsCollectionItem) {
  const array: number[] = []
  if (ref.rating) array.push(ref.rating)
  refModels(ref).forEach(model => {
    if (model?.rating) array.push(model.rating)
  })
  if (array.length > 0) return array.reduce((prev, curr) => prev + curr, 0) / array.length
  return 0
}
const selectedTags = ref<string[]>([])
const bookend = '```'
const selectedRefs = computed(() => {
  return Array.from((refMap.value.entries())).filter(entry => entry[0] != undefined).filter(entry => entry[1]).map(entry => entry[0]) as RefsCollectionItem[]
})
// const exportText = computed(() => {
//   if (selectedRefs.value.length == 0) return `
// `
//   return selectedRefs.value.reduce((prev, curr, i) => prev + (i + 1) + '.' + `
// ` + 'https://www.redgifs.com/watch/' + curr.toLowerCase() + `
// `, ``)
// })
const exportText = computed(() => {
  if (selectedRefs.value.length == 0) return `
`
  return selectedRefs.value.reduce((prev, curr, i) => prev + (i + 1) + '. ' + (curr.models?.map(model => models.value?.find(({title}) => title == model)?.names[0]).filter(model => model != undefined).join(', ') || '') + `
` + location.origin + '/refs#' + curr.title + `
`, ``)
})
const breakpoints = useBreakpoints(breakpointsTailwind)
// Returns true if screen is smaller than 'sm' (640px)
const isMobile = breakpoints.smaller('sm') 
const filteredRefs = computed(() => {
  return refs.value?.filter(ref => {
    
    return selectedTags.value.every(tag => refTags(ref).includes(tag))
  }).sort((a, b) => {
    return refRating(b) - refRating(a)
  }) || []
})
function moveCurrentRefBy(by: number) {
  if (currentRef.value && filteredRefs.value) {
    const currentIndex = filteredRefs.value.findIndex(({title}) => title == currentRef.value?.title)
    if (currentIndex > -1) {
      if (currentIndex + by == filteredRefs.value.length) currentRef.value = filteredRefs.value[0]
      else if (currentIndex + by == -1) currentRef.value = filteredRefs.value[filteredRefs.value.length - 1]
      else currentRef.value = filteredRefs.value[currentIndex + by]
    }
  }
}
const currentModels = computed(() => {
  return models.value?.filter(({title}) => currentRef.value?.models?.includes(title)) || []
})
function urlToLabel(url: string) {
  const _url = new URL(url)
  return _url.hostname + _url.pathname
}
const urlIconMap = new Map<string|undefined, string>([
  [
    "xcancel.com",
    "mdi:twitter",
  ],
  [
    "www.tiktok.com",
    "ic:round-tiktok"
  ],
  [
    "www.instagram.com",
    "mdi:instagram"
  ]
])
function urlToIcon(url: string) {
  return urlIconMap.get(new URL(url).hostname) || "lucide:globe"
}
watch(currentRef, () => {
  location.hash = currentRef.value?.title || ''
})
</script>
<template>
  <UMain>
    <div class="flex flex-col gap-4 py-4 mb-54">
      <div class="flex justify-center">
        <UInputMenu
          :items="tags"
          multiple
          class="w-full sm:w-auto mx-4"
          v-model="selectedTags"
          icon="lucide:hash"
        ></UInputMenu>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8">
        <div v-for="ref in filteredRefs"
          class="aspect-3/4 overflow-hidden flex justify-center relative group"
        >
          <div class=" transition-opacity absolute h-full w-full cursor-pointer group"
            @click="viewRef(ref)"
          >
            <div class="bg-linear-45 from-primary to-secondary mix-blend-color absolute h-full w-full opacity-0 group-hover:opacity-50"></div>
            <div class="flex justify-center items-center w-full h-full absolute sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <div class="bg-default/50 p-2 rounded-full">
                <UIcon name="mingcute:play-fill" mode="svg" class="size-10 sm:size-14 drop-shadow-md"></UIcon>
              </div>
            </div>
          </div>
          <!-- <div class="flex justify-center items-center w-full h-full absolute">
            
          </div> -->
          <div class="flex items-start justify-end w-full">
            <div class=" m-1 group-hover:opacity-100 data-[selected=true]:opacity-100 sm:opacity-0 transition-opacity"
              :data-selected="refMap.get(ref)"
            >
              <UCheckbox
                :model-value="refMap.get(ref)"
                variant="card"
                :ui="{
                  root: 'bg-default/50 p-2 size-9 flex justify-center items-center backdrop-blur-sm border-inverted',
                  base: 'data-[state=unchecked]:ring-inverted'
                }"
                @update:model-value="(value) => console.log(refMap.set(ref, Boolean(value)))"
              ></UCheckbox>
            </div>
          </div>
          <img class=" object-cover w-full h-full absolute -z-10" :src="`https://media.redgifs.com/${ref.title}-mobile.jpg`" referrerpolicy="no-referrer">
        </div>
      </div>
    </div>
  </UMain>
  <UModal v-model:open="modalOpen"
    :ui="{
      content: ' sm:h-dvh sm:max-w-2/3 sm:min-w-100',
    }"
    :fullscreen="isMobile"
  >
    <template #header>
      <div class="flex w-full gap-2 items-center">
        <UDropdownMenu
          v-for="model in currentModels"
          :content="{
            align: 'start',
          }"
          :ui="{
            // viewport: 'max-w-screen left-0 right-0'
          }"
          :items="([
            ...(model.names.slice(1).length > 0 ? [
              {
                type: 'label',
                slot: 'aka' as const,
              },
              {
                type: 'separator',
              },
            ] : []),
            ...(model.rating ? [
              {
                type: 'label',
                slot: 'rating' as const,
              },
              {
                type: 'separator',
              }
            ] : []),
            {
              type: 'label',
              label: `Links (${model.links?.length || 0})`
            },
            ...((model.links || []).map(link => ({
              to: link,
              label: urlToLabel(link),
              color: 'primary',
              trailing: 'lucide:arrow-up-right',
              target: '_blank',
              icon: urlToIcon(link),
            }))),
            {
              type: 'separator'
            },
            {
              type: 'label',
              label: 'Tags',
            },
            ...((model.tags || []).sort().map(tag => ({
              label: tag,
              icon: 'lucide:hash',
              slot: 'tag' as const,
              // onSelect: () => {
              //   if (selectedTags.indexOf(tag) == -1) selectedTags.push(tag)
              // },
              type: 'checkbox',
              checked: selectedTags.indexOf(tag) > -1,
              onUpdateChecked: (checked) => {
                if (checked) {
                  selectedTags.push(tag)
                } else {
                  selectedTags.splice(selectedTags.indexOf(tag), 1)
                }
              }
            } as DropdownMenuItem)))
          ] as DropdownMenuItem[])"
        >
          <UButton
            :label="model.names[0]"
            variant="subtle"
            color="neutral"
          ></UButton>
          <template #aka>
            <div class="flex divide-accented divide-x *:px-2 *:first:ps-0 items-center *:last:pe-0">
              <div class="font-bold text-dimmed">AKA</div>
              <div
                v-for="name in model.names.slice(1)"
              >
                {{ name }}
              </div>
            </div>
          </template>
          <template #rating>
            <div class="w-full flex gap-2 items-center divide-x divide-accented">
              <div class="pe-2 text-dimmed font-bold">Rating</div>
              <UBadge
                variant="subtle"
              >
                <div v-if="model.rating" class="flex gap-1 *:size-4">
                  <UIcon
                    name="material-symbols:star"
                    v-for="star in model.rating"
                  ></UIcon>
                  <UIcon
                    name="material-symbols:star-outline"
                    v-for="star in 5 - model.rating"
                  ></UIcon>
                </div>
              </UBadge>
            </div>
          </template>
          <!-- <template #tag-trailing>
            <div class="flex text-muted items-center gap-1 group-hover:opacity-100 sm:opacity-0 transition-opacity">
              <UIcon name="lucide:funnel-plus" class="size-5"></UIcon>
              Add to filter
            </div>
          </template> -->
        </UDropdownMenu>
        <UCheckbox
          size="xl"
          :model-value="refMap.get(currentRef)"
          @update:model-value="(value) => console.log(refMap.set(currentRef, Boolean(value)))"
        ></UCheckbox>
        <!-- <UPopover
          v-for="model in currentModels"
          :content="{
            align: 'start'
          }"
        >
          <UButton
            :label="model.names[0]"
            variant="subtle"
            color="neutral"
          ></UButton>
          <template #content>
            <div class="flex gap-2 p-2 flex-wrap">
              <UFieldGroup v-if="model.names.slice(1).length > 0">
                <UBadge
                  label="AKA"
                  color="neutral"
                  variant="outline"
                  :ui="{
                    label: 'font-black text-dimmed'
                  }"
                ></UBadge>
                <UBadge
                  v-for="name in model.names.slice(1)"
                  :label="name"
                  color="neutral"
                  variant="outline"
                  size="lg"
                ></UBadge>
              </UFieldGroup>
              <UButton
                v-for="link in model.links"
                :to="link"
                variant="soft"
                target="_blank"
                :label="urlToLabel(link)"
                trailing-icon="lucide:arrow-up-right"
              ></UButton>
            </div>
          </template>
        </UPopover> -->
      </div>
      <div class="flex justify-end gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          v-for="button in [
            {
              icon: 'lucide:chevron-left',
              click: () => moveCurrentRefBy(-1),
            },
            {
              icon: 'lucide:chevron-right',
              click: () => moveCurrentRefBy(1),
            },
            {
              icon: 'lucide:x',
              click: () => {
                modalOpen = false
              }
            },
          ]"
          v-bind="button"
          @click="button.click"
        ></UButton>
      </div>
    </template>
    <template #body>
      <div class="relative h-full">
        <iframe :src='`https://www.redgifs.com/ifr/${currentRef?.title}`' frameBorder='0' scrolling='no' width='100%' height='100%' style='position:absolute; top:0; left:0;' allowFullScreen></iframe>
      </div>
    </template>
  </UModal>
  <div class="fixed flex justify-end bottom-0 right-0 p-4 sm:w-1/3 w-full">
    <ProsePre
      :ui="{
        root: 'my-0 w-full hidden sm:block',
        base: 'w-full bg-default/80 backdrop-blur-md max-h-50',
        copy: 'z-50',
      }"
      class="prose-pre:my-0"
      :code="exportText"
    >
      {{ exportText }}
    </ProsePre>
    <!-- <MDC :value="exportText" class=" prose-code:my-0"></MDC> -->
    <UModal fullscreen>
      <UButton
        :label="selectedRefs.length.toString()"
        variant="subtle"
        :ui="{
          base: 'bg-default font-mono'
        }"
        size="xl"
        icon="lucide:copy"
        color="neutral"
        class="sm:hidden"
      ></UButton>
      <template #body>
        <ProsePre
          :ui="{
            root: 'my-0 w-full',
            base: 'w-full',
            copy: 'z-50',
          }"
          class="prose-pre:my-0"
          :code="exportText"
        >
          {{ exportText }}
        </ProsePre>
      </template>
    </UModal>
  </div>
</template>