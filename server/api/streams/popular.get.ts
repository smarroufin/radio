export default defineCachedEventHandler(async () => {
  const urls = await cachedRadioBrowserHosts()
  const url = urls[Math.floor(Math.random() * urls.length)]
  const data = (await $fetch(`${url}/json/stations?order=votes&limit=50&reverse=true`)) as RadioBrowserStream[]
  return data.sort((a, b) => b.votes - a.votes)
}, {
  maxAge: 3600,
})
