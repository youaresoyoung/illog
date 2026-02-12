import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const REGION = process.env.AWS_REGION
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const SESSION_TOKEN = process.env.AWS_SESSION_TOKEN
const BUCKET_NAME = process.env.S3_DOWNLOAD_BUCKET
const PRESIGN_TTL_SECONDS = Number.parseInt(process.env.S3_PRESIGN_TTL ?? '300', 10)

const PLATFORM_OBJECT_MAP: Record<string, string | undefined> = {
  'mac-intel': process.env.S3_OBJECT_KEY_MAC_INTEL,
  'mac-arm': process.env.S3_OBJECT_KEY_MAC_ARM,
  'mac-universal': process.env.S3_OBJECT_KEY_MAC_UNIVERSAL,
  windows: process.env.S3_OBJECT_KEY_WINDOWS,
  linux: process.env.S3_OBJECT_KEY_LINUX,
  // Default 'mac' uses universal or falls back to arm (most common now)
  mac: process.env.S3_OBJECT_KEY_MAC_UNIVERSAL ?? process.env.S3_OBJECT_KEY_MAC_ARM
}

function createS3Client() {
  if (!REGION || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    return null
  }

  return new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
      ...(SESSION_TOKEN && { sessionToken: SESSION_TOKEN })
    }
  })
}

type RouteContext = {
  params: Promise<{ platform: string }>
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { platform: rawPlatform } = await context.params
  const platform = rawPlatform.toLowerCase()

  // Validate platform
  const objectKey = PLATFORM_OBJECT_MAP[platform]
  if (!objectKey) {
    return NextResponse.json(
      {
        error: 'Unsupported platform',
        supported: Object.keys(PLATFORM_OBJECT_MAP).filter((k) => PLATFORM_OBJECT_MAP[k])
      },
      { status: 404 }
    )
  }

  // Check configuration
  if (!BUCKET_NAME) {
    console.error('[download api] Missing S3_DOWNLOAD_BUCKET configuration')
    return NextResponse.json({ error: 'Download service not configured' }, { status: 503 })
  }

  const s3Client = createS3Client()
  if (!s3Client) {
    console.error('[download api] Missing AWS credentials')
    return NextResponse.json({ error: 'Download service not configured' }, { status: 503 })
  }

  try {
    const filename = objectKey.split('/').pop() ?? 'illog.dmg'

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      ResponseContentDisposition: `attachment; filename="${encodeURIComponent(filename)}"`
    })

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: Number.isFinite(PRESIGN_TTL_SECONDS) ? PRESIGN_TTL_SECONDS : 300
    })

    // Redirect to the presigned URL
    return NextResponse.redirect(signedUrl, 302)
  } catch (error) {
    console.error('[download api] Failed to generate presigned URL', {
      platform,
      objectKey,
      error: error instanceof Error ? error.message : error
    })

    return NextResponse.json(
      { error: 'Failed to prepare download. Please try again later.' },
      { status: 500 }
    )
  }
}
