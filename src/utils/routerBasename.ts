/**
 * Vite 的 `import.meta.env.BASE_URL` 在子路径下通常以 / 结尾；
 * React Router 的 `basename` 应带前导 /、且不要尾部 /。
 */
export function routerBasenameFromViteBase(baseUrl: string): string | undefined {
  if (baseUrl === '/' || baseUrl === '') return undefined
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}
