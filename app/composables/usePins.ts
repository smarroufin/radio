export const usePins = () => {
  const pins = useCookie<Set<string>>('radio-pins', {
    default: () => new Set(),
    decode: (v: string) => new Set(v ? JSON.parse(v) : []),
    encode: (v: Set<string>) => JSON.stringify(Array.from(v)),
  })

  return {
    pins,
  }
}
