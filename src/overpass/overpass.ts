export default async function overpassQuery(
  endpoint: string,
  query: string,
  timeout: number,
): Promise<Array<{ tags: { name: string } }>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeout)

  const response = await fetch(
    `${endpoint}?data=${encodeURIComponent(query)}`,
    { signal: controller.signal },
  )

  clearTimeout(timeoutId)

  const body = await response.json()

  return body.elements
}
