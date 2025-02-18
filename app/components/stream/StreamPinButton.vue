<script setup lang="ts">
const props = defineProps({
  stream: {
    type: Object as PropType<RadioBrowserStream>,
    required: true,
  },
})

const { pins, streams } = usePins()

const isPinned = computed(() => pins.value.has(props.stream.stationuuid))

function togglePin() {
  if (!isPinned.value) {
    pins.value.add(props.stream.stationuuid)
    streams.value.push(props.stream)
  }
  else {
    pins.value.delete(props.stream.stationuuid)
    streams.value = streams.value.filter(s => s.stationuuid !== props.stream.stationuuid)
  }
}
</script>

<template>
  <UButton
    :icon="isPinned ? 'i-carbon-star-filled' : 'i-carbon-star'"
    :aria-label="isPinned ? 'Unpin' : 'Pin'"
    :ui="{ base: 'rounded-full' }"
    @click="togglePin()"
  />
</template>
