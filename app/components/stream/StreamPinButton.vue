<script setup lang="ts">
const props = defineProps({
  stream: {
    type: Object as PropType<RadioBrowserStream>,
    required: true,
  },
})

const { pins } = usePins()

const isPinned = computed(() => pins.value.has(props.stream.changeuuid))

function togglePin() {
  if (!isPinned.value) {
    pins.value.add(props.stream.changeuuid)
  }
  else {
    pins.value.delete(props.stream.changeuuid)
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
