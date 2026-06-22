import { timingSafeEqual } from 'node:crypto'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type RevalidationBody = {
  paths?: unknown
  tags?: unknown
}

function validSecret(received: string | null, expected: string) {
  if (!received) return false
  const receivedBuffer = Buffer.from(received)
  const expectedBuffer = Buffer.from(expected)
  return receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
}

function stringList(value: unknown, validator: (item: string) => boolean) {
  if (!Array.isArray(value)) return []
  return [...new Set(
    value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && item.length <= 250 && validator(item)),
  )].slice(0, 100)
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.REVALIDATION_SECRET
  if (!expectedSecret) {
    return NextResponse.json({ error: 'Revalidation is not configured.' }, { status: 503 })
  }

  const authorization = request.headers.get('authorization')
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : request.headers.get('x-revalidation-secret')

  if (!validSecret(token, expectedSecret)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  let body: RevalidationBody
  try {
    body = await request.json() as RevalidationBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const paths = stringList(
    body.paths,
    (path) =>
      path.startsWith('/') &&
      !path.startsWith('//') &&
      !/^\/(?:admin|api|_next)(?:\/|$)/.test(path),
  )
  const tags = stringList(
    body.tags,
    (tag) => /^[a-z0-9][a-z0-9:_-]*$/i.test(tag),
  )

  if (paths.length === 0 && tags.length === 0) {
    return NextResponse.json({ error: 'At least one valid path or tag is required.' }, { status: 400 })
  }

  for (const tag of tags) revalidateTag(tag)
  for (const path of paths) {
    revalidatePath(path, path.includes('[') ? 'page' : undefined)
  }

  return NextResponse.json({
    revalidated: true,
    paths,
    tags,
    timestamp: new Date().toISOString(),
  })
}
