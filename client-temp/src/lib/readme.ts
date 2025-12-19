// lib/readme.ts
export const fetchReadme = async (url: string) => {
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    // throw new Error('Failed to fetch README')
    return null
  }

  return res.text()
}

export const fetchReadmeFromApi = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch README')
  }

  const data = await res.json()

  if (!data.content) {
    throw new Error('No content in response')
  }

  // Decode base64
  const decoded = Buffer.from(data.content, 'base64').toString('utf-8')
  return decoded
}
