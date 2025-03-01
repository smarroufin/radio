export function searchItems<T>(items: T[], searchTerm: string, searchFields: (keyof T)[], limit = 50): T[] {
  let result = items

  if (searchTerm) {
    result = items.filter((item) => {
      for (const field of searchFields) {
        const value = item[field]
        if (typeof value !== 'string') {
          continue
        }
        if (value.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true
        }
      }
      return false
    })
  }

  return result.slice(0, limit)
}
