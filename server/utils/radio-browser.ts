import dns from 'dns'
import util from 'util'
import { version } from '~~/package.json'

const defaultMaxAge = 3600

export const cachedRadioBrowserHosts = defineCachedFunction(async () => {
  const resolveSrv = util.promisify(dns.resolveSrv)
  const hosts = await resolveSrv('_api._tcp.radio-browser.info')
  const urls = hosts.map(host => 'https://' + host.name)
  return urls
}, {
  maxAge: defaultMaxAge,
  name: 'radio-browser-hosts',
})

export async function getRadioBrowserBaseURL() {
  const hosts = await cachedRadioBrowserHosts()
  const host = hosts[Math.floor(Math.random() * hosts.length)]
  return `${host}/json`
}

export async function getRadioBrowserHeaders() {
  return {
    'User-Agent': `SmarroufinRadio/${version}`,
  }
}

export const cachedRadioBrowserCountries = defineCachedFunction(async () => {
  const baseURL = await getRadioBrowserBaseURL()
  const headers = await getRadioBrowserHeaders()
  return $fetch<RadioBrowserCountry[]>('/countries', {
    baseURL,
    headers,
    query: {
      hidebroken: true,
      limit: 1000,
      order: 'stationcount',
      reverse: true,
    },
  })
}, {
  maxAge: defaultMaxAge,
  name: 'radio-browser-countries',
})

export const cachedRadioBrowserTags = defineCachedFunction(async () => {
  const baseURL = await getRadioBrowserBaseURL()
  const headers = await getRadioBrowserHeaders()
  return $fetch<RadioBrowserTag[]>('/tags', {
    baseURL,
    headers,
    query: {
      hidebroken: true,
      limit: 1000,
      order: 'stationcount',
      reverse: true,
    },
  })
}, {
  maxAge: defaultMaxAge,
  name: 'radio-browser-tags',
})

export const cachedRadioBrowserPopularStreams = defineCachedFunction(async () => {
  const baseURL = await getRadioBrowserBaseURL()
  const headers = await getRadioBrowserHeaders()
  return $fetch<RadioBrowserStream[]>('/stations', {
    baseURL,
    headers,
    query: {
      hidebroken: true,
      limit: 50,
      order: 'votes',
      reverse: true,
    },
  })
}, {
  maxAge: defaultMaxAge,
  name: 'radio-browser-popular-streams',
})

export async function searchRadioBrowserStreams(name?: string, country?: string, tagList?: string[]) {
  const baseURL = await getRadioBrowserBaseURL()
  const headers = await getRadioBrowserHeaders()
  return $fetch<RadioBrowserStream[]>('/stations/search', {
    baseURL,
    headers,
    query: {
      hidebroken: true,
      limit: 50,
      order: 'votes',
      reverse: true,
      name,
      country,
      tagList: tagList?.join(','),
    },
  })
}

export async function getRadioBrowserStreams(uuids: string[]) {
  const baseURL = await getRadioBrowserBaseURL()
  const headers = await getRadioBrowserHeaders()
  return $fetch<RadioBrowserStream[]>('/stations/byuuid', {
    baseURL,
    headers,
    query: {
      hidebroken: true,
      limit: 50,
      order: 'votes',
      reverse: true,
      uuids: uuids.join(','),
    },
  })
}
