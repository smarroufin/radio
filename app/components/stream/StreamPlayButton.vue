<script setup lang="ts">
const props = defineProps({
  stream: {
    type: Object as PropType<RadioBrowserStream>,
    required: true,
  },
})

const { stream: currentStream, playing, pending, play } = usePlayer()

const isCurrentStream = computed(() => currentStream.value?.url_resolved === props.stream.url_resolved)

function togglePlay() {
  if (!isCurrentStream.value) {
    play(props.stream)
  }
  else {
    playing.value = !playing.value
  }
}
</script>

<template>
  <UButton
    :icon="isCurrentStream && playing ? 'i-carbon-pause' : 'i-carbon-play'"
    :aria-label="isCurrentStream && playing ? 'Pause' : 'Play'"
    :loading="isCurrentStream && pending"
    :ui="{ base: 'rounded-full' }"
    @click="togglePlay()"
  />
</template>
