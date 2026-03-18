export function validateLink(value: string) {
  return /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(value)
}
