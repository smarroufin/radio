<script setup lang="ts">
const props = defineProps({
  stream: {
    type: Object as PropType<RadioBrowserStream>,
    required: true,
  },
})

const tags = computed(() => {
  return props.stream.tags.split(',').map(tag => tag.trim()).filter(tag => !!tag)
})
</script>

<template>
  <div class="flex items-center gap-4 py-1">
    <div class="flex-1 min-w-0 flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <span class="flex-shrink font-medium truncate">{{ stream.name }}</span>
        <UButton
          icon="i-carbon-launch"
          variant="link"
          size="sm"
          :to="stream.homepage"
          target="_blank"
          aria-label="Open stream homepage"
          class="p-0"
        />
      </div>
      <div class="flex items-center gap-1 overflow-hidden">
        <AppCountryFlag
          :country="stream.country"
          :country-code="stream.countrycode"
          class="flex-shrink-0"
        />
        <span
          v-for="tag of tags"
          :key="tag"
          class="bg-neutral-800 px-2 py-0.5 text-xs rounded-full whitespace-nowrap"
        >{{ tag }}</span>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <StreamPinButton :stream="stream" />
      <StreamPlayButton :stream="stream" />
    </div>
  </div>
</template>
