import z from 'zod'

const schema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  tags: z.union([z.string(), z.string().array()]).optional().transform((value) => {
    return Array.isArray(value) ? value : (value ? [value] : undefined)
  }),
})

export default defineCachedEventHandler(async (event) => {
  const { name, country, tags } = await getValidatedQuery(event, schema.parse)
  return searchRadioBrowserStreams(name, country, tags)
}, {
  getKey: async (event) => {
    const { name, country, tags } = await getValidatedQuery(event, schema.parse)
    return `search:${name}:${country}:${tags?.join(',')}`
  },
  maxAge: import.meta.dev ? 1 : 3600,
})
