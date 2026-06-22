export type RevalidationTargets = {
  paths?: string[]
  tags?: string[]
}

export async function revalidateNext(targets: RevalidationTargets): Promise<void> {
  const appURL = process.env.NEXT_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL
  const secret = process.env.REVALIDATION_SECRET

  if (!appURL || !secret) {
    console.warn('[revalidation] NEXT_APP_URL and REVALIDATION_SECRET are required; skipping.')
    return
  }

  try {
    const response = await fetch(new URL('/api/revalidate', appURL), {
      method: 'POST',
      headers: {
        authorization: `Bearer ${secret}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(targets),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      const message = await response.text()
      console.error(`[revalidation] Request failed (${response.status}): ${message.slice(0, 500)}`)
    }
  } catch (error) {
    console.error('[revalidation] Unable to notify Next.js:', error)
  }
}
