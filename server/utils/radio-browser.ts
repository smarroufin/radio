import dns from 'dns'
import util from 'util'

export const cachedRadioBrowserHosts = defineCachedFunction(async () => {
  const resolveSrv = util.promisify(dns.resolveSrv)
  const hosts = await resolveSrv('_api._tcp.radio-browser.info')
  const urls = hosts.map(host => 'https://' + host.name)
  return urls
}, {
  maxAge: 3600,
})
