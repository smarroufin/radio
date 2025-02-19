export const useSearch = ({
  metadata,
  onSearchEnd,
}: {
  metadata: Ref<{ countries: RadioBrowserCountry[], tags: RadioBrowserTag[] }>
  onSearchEnd?: () => void
}) => {
  const toast = useToast()

  const allCountriesOption = { label: 'All', value: '', code: '', icon: 'i-circle-flags-xx' }

  const query = ref('')
  const country = ref(allCountriesOption)
  const tags = ref<{ label: string, value: string }[]>([])
  const searching = ref(false)
  const streams = ref<RadioBrowserStream[] | null>(null)

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

  async function search() {
    searching.value = true

    await $fetch('/api/streams/search', {
      query: {
        name: query.value || undefined,
        country: country.value?.value || undefined,
        tags: tags.value?.length ? tags.value.map(tag => tag.value) : undefined,
      },
    })
      .then((value) => {
        streams.value = value
        onSearchEnd?.()
      })
      .catch(() => {
        toast.add({
          color: 'error',
          title: 'Something went wrong',
        })
      })

    searching.value = false
  }

  return {
    query,
    country,
    tags,
    searching,
    streams,
    contriesOptions,
    tagsOptions,
    search,
  }
}
