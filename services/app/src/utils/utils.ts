export const isDev = () => {
  return process.env.NODE_ENV === 'development'
}

export const normalizeName = (name: string) => {
  return name.trim().replace(/\s+/g, ' ')
}
