<script setup lang="ts">
const { stream: currentStream } = usePlayer()
const title = computed(() => {
  return [currentStream.value?.name, 'Radio'].filter(i => !!i).join(' - ')
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

const { streams: searchedStreams, searching, query, country, tags, contriesOptions, tagsOptions, search } = useSearch({
  metadata,
  onSearchEnd: () => selectedTab.value = 'search',
})
const { streams: pinnedStreams, pending: pendingPins, fetch: fetchPinnedStream } = usePins()

const selectedTab = ref('popular')

const tabs = computed(() => [
  { label: 'Popular', icon: 'i-carbon-fire', value: 'popular', slot: 'popular' },
  { label: 'Search Results', icon: 'i-carbon-search', value: 'search', slot: 'search' },
  { label: 'Favorites', icon: 'i-carbon-star', value: 'pins', slot: 'pins' },
])

callOnce(() => fetchPinnedStream())
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#FF6900" />
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
          <USelectMenu
            v-model="country"
            :icon="country?.icon"
            :items="contriesOptions"
            search-input
            :filter-fields="['label', 'code']"
            placeholder="Country"
            :disabled="searching"
            :ui="{ base: 'rounded-full' }"
            class="sm:w-48"
          />
          <USelectMenu
            v-model="tags"
            multiple
            :items="tagsOptions"
            search-input
            placeholder="Tags"
            :disabled="searching"
            :ui="{ base: 'rounded-full' }"
            class="sm:flex-1"
          >
            <div
              v-if="tags.length"
              class="flex overflow-hidden gap-1"
            >
              <AppTag
                v-for="{ label: tag } of tags"
                :key="tag"
                :tag="tag"
                mode="remove"
              />
            </div>
          </USelectMenu>
        </div>
      </form>

      <UTabs
        v-model="selectedTab"
        :items="tabs"
        :ui="{
          label: 'sr-only sm:not-sr-only',
          content: 'flex flex-col items-center divide-y divide-neutral-900',
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
            No pins yet
          </span>
        </template>
      </UTabs>
    </UContainer>

    <AppFooter />

    <ClientOnly>
      <AppPlayer />
    </ClientOnly>
  </UApp>
</template>
