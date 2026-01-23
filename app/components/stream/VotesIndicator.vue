<script setup lang="ts">
const props = defineProps<{
  votes: number
}>()

const SLICES = 6

const slicesCount = computed(() => {
  const length = props.votes === 0 ? 0 : props.votes.toString().length
  return Math.min(length, SLICES)
})

const slices = computed<boolean[]>(() => {
  return Array.from({ length: SLICES }, (_, index) => index < slicesCount.value)
})
</script>

<template>
  <UTooltip :text="`${votes} votes`">
    <div class="flex gap-0.5 h-3">
      <div
        v-for="(isColored, index) in slices"
        :key="index"
        class="w-[2px] h-full rounded-sm"
        :class="isColored ? 'bg-primary' : 'bg-elevated'"
      />
    </div>
  </UTooltip>
</template>
