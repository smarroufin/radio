declare interface RadioBrowserStream {
  changeuuid: string
  stationuuid: string
  serveruuid: string
  name: string
  url: string
  url_resolved: string
  homepage: string
  favicon: string
  tags: string
  country: string
  countrycode: string
  iso_3166_2: string
  state: string
  language: string
  languagecodes: string
  votes: number
  lastchangetime: string
  lastchangetime_iso8601: string
  codec: string
  bitrate: number
  hls: number
  lastcheckok: number
  lastchecktime: string
  lastchecktime_iso8601: string
  lastcheckoktime: string
  lastcheckoktime_iso8601: string
  lastlocalchecktime: string
  lastlocalchecktime_iso8601: string
  clicktimestamp: string
  clicktimestamp_iso8601: string
  clickcount: number
  clicktrend: number
  ssl_error: number
  geo_lat: unknown
  geo_long: unknown
  geo_distance: unknown
  has_extended_info: boolean
}

declare interface RadioBrowserCountry {
  name: string
  iso_3166_1: string
  stationcount: number
}

declare interface RadioBrowserTag {
  name: string
  stationcount: number
}
