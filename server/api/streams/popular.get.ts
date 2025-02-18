export default defineCachedEventHandler(async () => {
  return cachedRadioBrowserPopularStreams()
}, {
  maxAge: import.meta.dev ? 1 : 3600,
})
