<script setup lang="ts">
defineProps({
  stream: {
    type: Object as PropType<RadioBrowserStream>,
    required: true,
  },
})
</script>

<template>
  <div class="flex items-center gap-4 py-1">
    <div class="flex-1 min-w-0 flex items-center gap-2">
      <span class="flex-shrink font-medium truncate">{{ stream.name }}</span>
      <AppCountryFlag
        :country="stream.country"
        :country-code="stream.countrycode"
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
      <!-- TODO: use votes & tags -->
      <!-- <span>{{ stream.votes }}</span>
      <UTooltip
        :text="stream.tags"
        class="hidden lg:flex"
      >
        <span>Tags</span>
      </UTooltip> -->
    </div>
    <div class="flex items-center gap-2">
      <StreamPinButton :stream="stream" />
      <StreamPlayButton :stream="stream" />
    </div>
  </div>
</template>
