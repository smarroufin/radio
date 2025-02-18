export const usePins = () => {
  const toast = useToast()

  const pins = useCookie<Set<string>>('radio-pins', {
    default: () => new Set(),
    decode: (v: string) => new Set(v ? JSON.parse(v) : []),
    encode: (v: Set<string>) => JSON.stringify(Array.from(v)),
  })
  const streams = useState<RadioBrowserStream[]>('radio-pinned-streams', () => [])
  const pending = ref(false)

  async function fetch() {
    if (!pins.value.size) {
      streams.value = []
      return
    }

    pending.value = true

    await $fetch('/api/streams/pins', {
      query: {
        pins: Array.from(pins.value.values()),
      },
    })
      .then((value) => {
        streams.value = value
      })
      .catch(() => {
        toast.add({
          color: 'error',
          title: 'Something went wrong',
        })
      })

    pending.value = false
  }

  return {
    pins,
    streams,
    pending,
    fetch,
  }
}
