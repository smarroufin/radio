<script setup lang="ts">
defineProps({
  tag: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <span class="bg-neutral-800 px-2 py-0.5 text-xs rounded-full whitespace-nowrap">{{ tag }}</span>
</template>
