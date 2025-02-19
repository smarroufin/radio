<script setup lang="ts">
const props = defineProps({
  stream: {
    type: Object as PropType<RadioBrowserStream>,
    required: true,
  },
})

const { pins, pin, unpin } = usePins()

const isPinned = computed(() => pins.value.has(props.stream.stationuuid))

function togglePin() {
  if (!isPinned.value) {
    pin(props.stream)
  }
  else {
    unpin(props.stream)
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
