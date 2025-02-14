<script setup lang="ts">
useSeoMeta({
  title: 'Radio',
  description: 'Open music streams for everyone',
})

const { data } = await useFetch('/api/streams/popular', {
  default: () => [],
})

const { pins } = usePins()

const streams = computed(() => {
  return data.value
    .map(stream => ({
      ...stream,
      pinned: pins.value.has(stream.changeuuid),
    }))
    .sort((a, b) => (a.pinned ? 0 : 1) - (b.pinned ? 0 : 1))
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#FD9A00" />
    <div class="relative">
      <AppHeader />
      <main class="min-h-[calc(100vh-var(--ui-header-height))]">
        <UContainer class="w-full py-4">
          <h2 class="text-lg font-semibold mb-4">
            Popular Streams
          </h2>
          <div class="divide-y divide-neutral-900">
            <StreamItem
              v-for="stream in streams"
              :key="stream.changeuuid"
              :stream="stream"
            />
          </div>
        </UContainer>
      </main>
      <AppFooter />

      <ClientOnly>
        <AppPlayer />
      </ClientOnly>
    </div>
  </UApp>
</template>
