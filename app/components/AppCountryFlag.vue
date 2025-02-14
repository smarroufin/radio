<script setup lang="ts">
defineProps({
  country: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
})

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
</script>

<template>
  <UTooltip :text="country || countryCode || 'Unknown'">
    <span>{{ getFlagEmoji(countryCode) || '&#x1F3F3;' }}</span>
  </UTooltip>
</template>
