<script setup lang="ts">
const colorMode = useColorMode()

const themes = computed(() => [
  { value: 'system', icon: 'i-carbon-laptop' },
  { value: 'light', icon: 'i-carbon-sun' },
  { value: 'dark', icon: 'i-carbon-moon' },
])
const themeIndex = computed(() => {
  return themes.value.findIndex(theme => theme.value === colorMode.preference) ?? 0
})
const icon = computed(() => {
  return themes.value[themeIndex.value]!.icon
})
function cycle() {
  colorMode.preference = themes.value[(themeIndex.value + 1) % themes.value.length]!.value
}
</script>

<template>
  <UButton
    color="neutral"
    variant="ghost"
    :icon="icon"
    aria-label="Theme switcher"
    @click="cycle"
  />
</template>
