export const useSearch = ({
  metadata,
  onSearchEnd,
}: {
  metadata?: Ref<{ countries: RadioBrowserCountry[], tags: RadioBrowserTag[] }>
  onSearchEnd?: () => void
} = {}) => {
  const toast = useToast()

  const allCountriesOption = { label: 'All', value: '', code: '', icon: 'i-circle-flags-xx' }

  const query = useState('radio-search-query', () => '')
  const country = useState('radio-search-country', () => allCountriesOption)
  const _tags = useState<Set<string>>('radio-search-tags', () => new Set())
  const tags = computed({
    get: () => Array.from(_tags.value.values()).map(t => ({ label: t })),
    set: value => _tags.value = new Set(value.map(t => t.label)),
  })
  const searching = useState('radio-search-searching', () => false)
  const streams = useState<RadioBrowserStream[] | null>('radio-search-streams', () => null)

  const countriesOptions = computed(() => {
    const options = metadata?.value.countries
      .map(country => ({
        value: country.name,
        label: country.name,
        code: country.iso_3166_1,
        icon: `i-circle-flags-${country.iso_3166_1.toLocaleLowerCase() || 'xx'}`,
      })) || []
    options.unshift(allCountriesOption)
    return options
  })

  const tagsOptions = computed(() => {
    return metadata?.value.tags
      .map(tag => ({
        label: tag.name,
      })) || []
  })

  async function search() {
    searching.value = true

    await $fetch('/api/streams/search', {
      query: {
        name: query.value || undefined,
        country: country.value?.value || undefined,
        tags: tags.value?.length ? tags.value.map(tag => tag.label) : undefined,
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

  function addTag(tag: string) {
    _tags.value.add(tag)
  }

  function deleteTag(tag: string) {
    _tags.value.delete(tag)
  }

  return {
    query,
    country,
    tags,
    searching,
    streams,
    countriesOptions,
    tagsOptions,
    search,
    addTag,
    deleteTag,
  }
}
