export default defineCachedEventHandler(async () => {
  const countries = await cachedRadioBrowserCountries()
  const tags = await cachedRadioBrowserTags()
  return {
    countries,
    tags,
  }
}, {
  maxAge: import.meta.dev ? 1 : 3600,
})
