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

const toast = useToast()

const allCountriesOption = { label: 'All', value: '', code: '', icon: 'i-circle-flags-xx' }

const selectedTab = ref('popular')
const query = ref('')
const country = ref(allCountriesOption)
const tags = ref<(typeof tagsOptions)['value']>([])
const searching = ref(false)
const searchResults = ref<RadioBrowserStream[] | null>(null)

const contriesOptions = computed(() => {
  const options = metadata.value.countries
    .map(country => ({
      value: country.name,
      label: country.name,
      code: country.iso_3166_1,
      icon: `i-circle-flags-${country.iso_3166_1.toLocaleLowerCase() || 'xx'}`,
    }))
    .sort((a, b) => a.value.localeCompare(b.value))
  options.unshift(allCountriesOption)
  return options
})
const tagsOptions = computed(() => {
  return metadata.value.tags
    .map(tag => ({
      value: tag.name,
      label: tag.name,
    }))
    .sort((a, b) => a.value.localeCompare(b.value))
})

const tabs = computed(() => [
  { label: 'Popular', icon: 'i-carbon-fire', value: 'popular', slot: 'popular' },
  { label: 'Search Results', icon: 'i-carbon-search', value: 'search', slot: 'search' },
  { label: 'Pins', icon: 'i-carbon-pin', value: 'pins', slot: 'pins' },
])

async function search() {
  searching.value = true

  await $fetch('/api/streams/search', {
    query: {
      name: query.value || undefined,
      country: country.value?.value || undefined,
      tags: tags.value?.length ? tags.value.map(tag => tag.value) : undefined,
    },
  })
    .then((streams) => {
      searchResults.value = streams
      selectedTab.value = 'search'
    })
    .catch(() => {
      toast.add({
        color: 'error',
        title: 'Something went wrong',
      })
    })

  searching.value = false
}
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#FD9A00" />
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
              class="overflow-hidden space-x-1"
            >
              <AppTag
                v-for="{ label: tag } of tags"
                :key="tag"
                :tag="tag"
              />
            </div>
          </USelectMenu>
        </div>
      </form>
      <UTabs
        v-model="selectedTab"
        :items="tabs"
        :ui="{ label: 'hidden sm:inline' }"
      >
        <template #popular>
          <div class="divide-y divide-neutral-900">
            <StreamItem
              v-for="stream in popularStreams"
              :key="stream.stationuuid"
              :stream="stream"
            />
          </div>
        </template>
        <template #search>
          <div
            v-if="searchResults?.length"
            class="divide-y divide-neutral-900"
          >
            <StreamItem
              v-for="stream in searchResults"
              :key="stream.stationuuid"
              :stream="stream"
            />
          </div>
          <span
            v-else-if="searchResults"
            class="block text-center font-medium py-2"
          >
            No results found
          </span>
          <span
            v-else
            class="block text-center font-medium py-2"
          >
            Search for something &#x1F446;
          </span>
        </template>
        <template #pins>
          <div class="divide-y divide-neutral-900">
            <!-- TODO: Pins feature -->
            <span class="block text-center font-medium py-2">Coming soon...</span>
          </div>
        </template>
      </UTabs>
    </UContainer>
    <AppFooter />

    <ClientOnly>
      <AppPlayer />
    </ClientOnly>
  </UApp>
</template>
