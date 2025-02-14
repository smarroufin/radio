export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      neutral: 'stone',
    },
    icons: {
      loading: 'i-lucide-loader-circle',
    },
    button: {
      slots: {
        base: 'cursor-pointer',
      },
    },
    slider: {
      slots: {
        track: 'cursor-pointer',
        thumb: 'cursor-pointer',
      },
    },
  },
})
