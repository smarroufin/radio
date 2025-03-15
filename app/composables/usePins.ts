export const usePins = () => {
  const toast = useToast()

  const pins = useCookie<Set<string>>('radio-pins', {
    default: () => new Set(),
    decode: (v: string) => new Set(v ? JSON.parse(v) : []),
    encode: (v: Set<string>) => JSON.stringify(Array.from(v)),
    // FIXME: stop using cookies for storing pins
    maxAge: 60 * 60 * 24 * 365,
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

  function pin(stream: RadioBrowserStream) {
    pins.value.add(stream.stationuuid)
    streams.value.push(stream)
  }

  function unpin(stream: RadioBrowserStream) {
    pins.value.delete(stream.stationuuid)
    streams.value = streams.value.filter(s => s.stationuuid !== stream.stationuuid)
  }

  return {
    pins,
    streams,
    pending,
    fetch,
    pin,
    unpin,
  }
}
