export function searchItems<T>(items: T[], searchTerm: string, searchFields: (keyof T)[]): T[] {
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

  return result
}
