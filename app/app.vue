<script setup lang="ts">
const { stream: currentStream, playing } = usePlayer()
const title = computed(() => {
  return currentStream.value?.name || 'Radio'
})
useSeoMeta({
  title,
  description: 'Open music streams for everyone',
})

const { data: metadata } = await useFetch('/api/metadata', {
  default: () => ({
    countries: [] as RadioBrowserCountry[],
    tags: [] as RadioBrowserTag[],
  }),
})
const { data: popularStreams } = await useFetch('/api/streams/popular', {
  default: () => [],
})

const { streams: searchedStreams, searching, query, country, tags, countriesOptions, tagsOptions, search } = useSearch({
  metadata,
  onSearchEnd: () => selectedTab.value = 'search',
})
const { streams: pinnedStreams, pending: pendingPins, fetch: fetchPinnedStream } = usePins()

const selectedTab = ref<string | number>('popular')

const tabs = computed(() => [
  { label: 'Popular', icon: 'i-carbon-fire', value: 'popular', slot: 'popular' },
  { label: 'Search Results', icon: 'i-carbon-search', value: 'search', slot: 'search' },
  { label: 'Favorites', icon: 'i-carbon-star', value: 'pins', slot: 'pins' },
])

callOnce(() => fetchPinnedStream())

onMounted(() => {
  // Confirm when closing tab while playing music
  // https://stackoverflow.com/a/61404006/3926832
  useEventListener('beforeunload', (e) => {
    if (playing.value) {
      e.preventDefault()
      e.returnValue = ''
      return
    }
    delete e['returnValue']
  })
})
</script>

<template>
  <UApp>
    <NuxtPwaManifest />
    <NuxtLoadingIndicator color="#FF8904" />
    <AppHeader />

    <UContainer
      as="main"
      class="min-h-[calc(100vh-var(--ui-header-height))] w-full py-4"
    >
      <form
        class="flex flex-col gap-2 justify-center py-8"
        @submit.prevent="search"
      >
        <UInput
          v-model="query"
          name="query"
          :disabled="searching"
          size="xl"
          :ui="{ base: 'rounded-full', trailing: 'pe-2' }"
          placeholder="Deep House Radio"
          class="w-full"
        >
          <template #trailing>
            <UButton
              icon="i-carbon-search"
              class="flex-shrink-0"
              :loading="searching"
              size="sm"
              :ui="{ base: 'rounded-full' }"
              aria-label="Search"
              type="submit"
            />
          </template>
        </UInput>
        <div class="flex flex-col sm:flex-row items-stretch gap-2">
          <AppSearchCountrySelect
            v-model="country"
            :items="countriesOptions"
            :disabled="searching"
            class="sm:w-48"
          />
          <AppSearchTagsSelect
            v-model="tags"
            :items="tagsOptions"
            :disabled="searching"
            class="sm:flex-1"
          />
        </div>
      </form>

      <UTabs
        v-model="selectedTab"
        :items="tabs"
        :ui="{
          label: 'sr-only sm:not-sr-only',
          content: 'flex flex-col items-center divide-y divide-(--ui-border)',
          indicator: 'rounded-full',
          list: 'rounded-full',
        }"
      >
        <template #popular>
          <StreamItem
            v-for="stream in popularStreams"
            :key="stream.stationuuid"
            :stream="stream"
            class="w-full"
          />
        </template>
        <template #search>
          <template v-if="searchedStreams?.length">
            <StreamItem
              v-for="stream in searchedStreams"
              :key="stream.stationuuid"
              :stream="stream"
              class="w-full"
            />
          </template>
          <UIcon
            v-else-if="searching"
            name="i-lucide-loader-circle"
            class="animate-spin size-6"
          />
          <span
            v-else-if="searchedStreams"
            class="font-medium"
          >
            No results found
          </span>
          <span
            v-else
            class="font-medium"
          >
            Search for something
          </span>
        </template>
        <template #pins>
          <template v-if="pinnedStreams.length">
            <StreamItem
              v-for="stream in pinnedStreams.sort((a, b) => b.votes - a.votes)"
              :key="stream.stationuuid"
              :stream="stream"
              class="w-full"
            />
          </template>
          <UIcon
            v-else-if="pendingPins"
            name="i-lucide-loader-circle"
            class="animate-spin size-6"
          />
          <span
            v-else
            class="font-medium"
          >
            No favorites yet
          </span>
        </template>
      </UTabs>
    </UContainer>

    <AppFooter />

    <AppPlayer />
  </UApp>
</template>
