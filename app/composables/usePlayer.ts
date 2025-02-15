export const usePlayer = createSharedComposable(() => {
  const audioRef: Ref<HTMLAudioElement | null> = ref(null)
  const playWhenLoaded = ref(false)
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
    })
  }

  function play(s: RadioBrowserStream) {
    playWhenLoaded.value = true
    stream.value = s
  }

  function pause() {
    if (!playing.value) {
      return
    }
    playing.value = false
  }

  function resume() {
    if (playing.value) {
      return
    }
    // TODO: put back to live
    playing.value = true
  }

  function togglePlay() {
    playing.value = !playing.value
  }

  function toggleMute() {
    muted.value = !muted.value
  }

  return {
    playing,
    pending,
    volume,
    muted,
    stream,
    init,
    play,
    togglePlay,
    toggleMute,
  }
})
