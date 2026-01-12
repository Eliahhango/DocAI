'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileUpload } from '@/components/ui/file-upload'
import { Button } from '@/components/ui/button'
import { Upload, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UploadPage() {
  const router = useRouter()
  const [uploadedFile, setUploadedFile] = useState<{ id: string; filename: string; size: number; mimeType: string } | null>(null)
  const [title, setTitle] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleUploadComplete = (file: { id: string; filename: string; size: number; mimeType: string }) => {
    setUploadedFile(file)
    if (!title) {
      setTitle(file.filename.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleProcess = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file first')
      return
    }

    setProcessing(true)

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: uploadedFile.id,
          title: title || uploadedFile.filename,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Processing failed')
        return
      }

      toast.success('Document processed successfully')
      router.push(`/dashboard/documents/${data.document.id}`)
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Upload Document</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload and convert your existing documents (PDF, Word, PowerPoint, Text)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-6">
        <FileUpload onUploadComplete={handleUploadComplete} />

        {uploadedFile && (
          <>
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Document Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter document title"
              />
            </div>

            <Button onClick={handleProcess} className="w-full" disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Document...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Process & Add to Library
                </>
              )}
            </Button>
          </>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">📄 Supported Formats:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>PDF documents (.pdf)</li>
          <li>Word documents (.docx, .doc)</li>
          <li>PowerPoint presentations (.pptx)</li>
          <li>Text files (.txt)</li>
        </ul>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Files are automatically processed and added to your document library for editing and conversion.
        </p>
      </div>
    </div>
  )
}
