/**
 * Storage abstraction for file handling
 * Supports both local filesystem (development) and Vercel Blob (production)
 */

export async function storeFile(
  filename: string,
  buffer: Buffer,
  contentType?: string
): Promise<string> {
  // Check if we're using Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob')
    const blob = await put(filename, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType,
    })
    return blob.url
  }

  // Fallback to local filesystem (development only)
  const fs = await import('fs/promises')
  const path = await import('path')
  const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads'

  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  const filePath = path.join(UPLOAD_DIR, filename)
  await fs.writeFile(filePath, buffer)
  
  return filePath
}

export async function getFile(filePathOrUrl: string): Promise<Buffer> {
  // If it's a URL (Vercel Blob), fetch it
  if (filePathOrUrl.startsWith('http://') || filePathOrUrl.startsWith('https://')) {
    const response = await fetch(filePathOrUrl)
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  // Otherwise, read from filesystem
  const fs = await import('fs/promises')
  return await fs.readFile(filePathOrUrl)
}

export async function deleteFile(filePathOrUrl: string): Promise<void> {
  // If it's a URL (Vercel Blob), use blob API
  if (filePathOrUrl.startsWith('http://') || filePathOrUrl.startsWith('https://')) {
    const { del } = await import('@vercel/blob')
    await del(filePathOrUrl, {
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    })
    return
  }

  // Otherwise, delete from filesystem
  const fs = await import('fs/promises')
  try {
    await fs.unlink(filePathOrUrl)
  } catch (error) {
    // File might not exist, ignore error
  }
}
