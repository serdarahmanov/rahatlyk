import path from 'path'
import fs from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const CV_DIR = path.resolve(process.cwd(), 'cv')

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { filename } = await params
  // Prevent path traversal — only the basename is ever used
  const safe = path.basename(filename)
  const filePath = path.join(CV_DIR, safe)

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const buffer = fs.readFileSync(filePath)
  const ext = safe.split('.').pop()?.toLowerCase()

  const mimeMap: Record<string, string> = {
    pdf:  'application/pdf',
    doc:  'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }
  const contentType = (ext && mimeMap[ext]) ?? 'application/octet-stream'

  return new NextResponse(buffer, {
    headers: {
      'Content-Type':        contentType,
      'Content-Disposition': `attachment; filename="${safe}"`,
      'Cache-Control':       'private, no-cache',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
