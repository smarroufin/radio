import { version } from '../../../package.json'

export default defineCachedEventHandler(async () => {
  const hosts = await cachedRadioBrowserHosts()
  const host = hosts[Math.floor(Math.random() * hosts.length)]
  return $fetch<RadioBrowserStream[]>('/stations', {
    baseURL: `${host}/json`,
    headers: {
      'User-Agent': `SmarroufinRadio/${version}`,
    },
    query: {
      hidebroken: true,
      limit: 100,
      order: 'votes',
      reverse: true,
    },
  })
}, {
  maxAge: 3600,
})
