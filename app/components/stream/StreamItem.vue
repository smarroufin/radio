<script setup lang="ts">
const props = defineProps({
  stream: {
    type: Object as PropType<RadioBrowserStream>,
    required: true,
  },
})

const favicon = computed(() => props.stream.favicon?.replace('http://', 'https://') || '')

const tags = computed(() => {
  return props.stream.tags.split(',').map(tag => tag.trim()).filter(tag => !!tag)
})
</script>

<template>
  <div class="flex items-center gap-2 py-3">
    <UAvatar
      :src="favicon"
      :alt="stream.name[0]"
      width="52"
      height="52"
      class="mr-2 rounded-full size-13"
      size="3xl"
    />
    <div class="flex-1 min-w-0 flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <span class="flex-shrink font-medium truncate">{{ stream.name }}</span>
        <StreamVotesIndicator
          :votes="stream.votes"
          class="flex-shrink-0"
        />
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
        <AppTag
          v-for="tag of tags"
          :key="tag"
          :tag="tag"
          mode="add"
        />
      </div>
    </div>
    <StreamPinButton :stream="stream" />
    <StreamPlayButton :stream="stream" />
  </div>
</template>
