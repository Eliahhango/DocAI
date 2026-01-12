'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Edit, Loader2, FileText } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Document {
  id: string
  title: string
  type: string
  status: string
  content: string | null
  filePath: string | null
  createdAt: string
  updatedAt: string
  metadata: any
}

export default function DocumentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchDocument()
    }
  }, [id])

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${id}`)
      const data = await response.json()
      setDocument(data.document)
    } catch (err) {
      console.error('Error fetching document:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">Document not found</p>
        <Link href="/dashboard/documents">
          <Button>Back to Documents</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/documents">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{document.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Updated {formatDate(document.updatedAt)} • {document.type}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {document.filePath && (
            <a href={`/api/documents/${document.id}/download`} download>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </a>
          )}
          <Link href={`/dashboard/rewrite?documentId=${document.id}`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit / Rewrite
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        {document.content ? (
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-900 dark:text-gray-100">
              {document.content}
            </pre>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Document content is not available
            </p>
            {document.filePath && (
              <a href={`/api/documents/${document.id}/download`} download className="mt-4 inline-block">
                <Button>Download File</Button>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Metadata */}
      {document.metadata && Object.keys(document.metadata).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Document Details</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="mt-1 text-sm capitalize">{document.status.toLowerCase()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</dt>
              <dd className="mt-1 text-sm capitalize">{document.type.toLowerCase()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
              <dd className="mt-1 text-sm">{formatDate(document.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
              <dd className="mt-1 text-sm">{formatDate(document.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
}
