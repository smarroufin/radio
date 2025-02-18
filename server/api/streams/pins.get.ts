import z from 'zod'

export default defineEventHandler(async (event) => {
  const { pins } = await getValidatedQuery(event, z.object({
    pins: z.union([z.string(), z.string().array()]).transform((value) => {
      return Array.isArray(value) ? value : [value]
    }),
  }).parse)

  return getRadioBrowserStreams(pins)
})
