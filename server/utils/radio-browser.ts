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

export async function getRadioBrowserBaseURL(switchUrl: boolean = false) {
  const hosts = await cachedRadioBrowserHosts()
  let index = await useStorage().getItem<number>('current-base-url-index') ?? null
  if (index === null) {
    index = Math.floor(Math.random() * hosts.length)
    await useStorage().setItem('current-base-url-index', index)
  }
  if (switchUrl) {
    index = (index + 1) % hosts.length
    await useStorage().setItem('current-base-url-index', index)
  }
  const host = hosts[index]
  return `${host}/json`
}

export async function getRadioBrowserHeaders() {
  return {
    'User-Agent': `SmarroufinRadio/${version}`,
  }
}

export async function getRadioBrowserCountries(switchUrl: boolean = false): Promise<RadioBrowserCountry[]> {
  const baseURL = await getRadioBrowserBaseURL(switchUrl)
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
  }).catch((err) => {
    if (err.response.status >= 500 && !switchUrl) {
      return getRadioBrowserCountries(true)
    }
    throw err
  })
}

export const cachedRadioBrowserCountries = defineCachedFunction(getRadioBrowserCountries, {
  maxAge: defaultMaxAge,
  name: 'radio-browser-countries',
})

export async function getRadioBrowserTags(switchUrl: boolean = false): Promise<RadioBrowserTag[]> {
  const baseURL = await getRadioBrowserBaseURL(switchUrl)
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
  }).catch((err) => {
    if (err.response.status >= 500 && !switchUrl) {
      return getRadioBrowserTags(true)
    }
    throw err
  })
}

export const cachedRadioBrowserTags = defineCachedFunction(getRadioBrowserTags, {
  maxAge: defaultMaxAge,
  name: 'radio-browser-tags',
})

export async function getRadioBrowserPopularStreams(switchUrl: boolean = false): Promise<RadioBrowserStream[]> {
  const baseURL = await getRadioBrowserBaseURL(switchUrl)
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
  }).catch((err) => {
    if (err.response.status >= 500 && !switchUrl) {
      return getRadioBrowserPopularStreams(true)
    }
    throw err
  })
}

export const cachedRadioBrowserPopularStreams = defineCachedFunction(getRadioBrowserPopularStreams, {
  maxAge: defaultMaxAge,
  name: 'radio-browser-popular-streams',
})

export async function searchRadioBrowserStreams(name?: string, country?: string, tagList?: string[], switchUrl: boolean = false): Promise<RadioBrowserStream[]> {
  const baseURL = await getRadioBrowserBaseURL(switchUrl)
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
  }).catch((err) => {
    if (err.response.status >= 500 && !switchUrl) {
      return searchRadioBrowserStreams(name, country, tagList, true)
    }
    throw err
  })
}

export async function getRadioBrowserStreams(uuids: string[], switchUrl: boolean = false): Promise<RadioBrowserStream[]> {
  const baseURL = await getRadioBrowserBaseURL(switchUrl)
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
  }).catch((err) => {
    if (err.response.status >= 500 && !switchUrl) {
      return getRadioBrowserStreams(uuids, true)
    }
    throw err
  })
}
