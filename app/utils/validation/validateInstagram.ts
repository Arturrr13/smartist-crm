export function validateInstagram(value: string) {
  return /^@[a-zA-Z0-9._]{1,30}$/.test(value.trim())
}