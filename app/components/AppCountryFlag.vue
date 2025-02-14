<script setup lang="ts">
const props = defineProps({
  country: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
})

const name = computed(() => `i-circle-flags-${props.countryCode.toLowerCase() || 'xx'}`)
</script>

<template>
  <UTooltip :text="country || countryCode || 'Unknown'">
    <UIcon
      :name="name"
      class="size-5"
    />
  </UTooltip>
</template>
