export const usePlayer = createSharedComposable(() => {
  const audioRef: Ref<HTMLAudioElement | null> = ref(null)
  const playWhenLoaded = ref(false)
  const pausedStreamUrl = ref<string | null>(null)
  const forcingResume = ref(false)
  const stream = useLocalStorage<RadioBrowserStream | null>('radio-player-stream', () => null, {
    serializer: {
      read: (v: string) => v ? JSON.parse(v) : null,
      write: (v: unknown) => JSON.stringify(v),
    },
  })
  const playerVolume = useLocalStorage('radio-player-volume', () => 0.5)

  const { playing, volume, muted, waiting, seeking } = useMediaControls(audioRef)

  const pending = computed(() => waiting.value || seeking.value)

  function init(audio: HTMLAudioElement) {
    audioRef.value = audio

    volume.value = playerVolume.value

    nextTick(() => {
      if (!audioRef.value) {
        console.error('audio not found')
        return
      }
      audioRef.value.onvolumechange = () => {
        if (playerVolume.value === volume.value) {
          // mute event
          return
        }
        playerVolume.value = volume.value
        if (muted.value) {
          muted.value = false
        }
      }
      audioRef.value.onloadeddata = () => {
        if (playWhenLoaded.value) {
          playing.value = true
          playWhenLoaded.value = false
        }
      }
      audioRef.value.onpause = () => {
        pausedStreamUrl.value = stream.value?.url_resolved || null
      }
      audioRef.value.onplay = () => {
        if (pausedStreamUrl.value === stream.value?.url_resolved && !forcingResume.value) {
          // resuming same stream => force resume live
          // https://stackoverflow.com/q/27258169/3926832
          forcingResume.value = true
          const lastStream = stream.value
          stream.value = null
          nextTick(() => play(lastStream))
        }
      }
      audioRef.value.onplaying = () => {
        forcingResume.value = false
      }
    })
  }

  function play(s: RadioBrowserStream) {
    playWhenLoaded.value = true
    stream.value = s
  }

  return {
    pending,
    playing,
    volume,
    muted,
    stream: readonly(stream),
    init,
    play,
  }
})
