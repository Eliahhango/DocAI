'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Trash2, Download, Search, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Document {
  id: string
  title: string
  type: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function DocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (err) {
      console.error('Error fetching documents:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc.id !== id))
      }
    } catch (err) {
      console.error('Error deleting document:', err)
      alert('Failed to delete document')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTypeIcon = (type: string) => {
    return <FileText className="h-5 w-5" />
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'word':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
      case 'pdf':
        return 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
      case 'powerpoint':
      case 'ppt':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Documents</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all your documents in one place
          </p>
        </div>
        <Link href="/dashboard/generate/word">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery ? 'No documents found matching your search' : 'No documents yet'}
          </p>
          {!searchQuery && (
            <Link href="/dashboard/generate/word">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Document
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded ${getTypeColor(doc.type)} flex items-center justify-center`}>
                  {getTypeIcon(doc.type)}
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={deletingId === doc.id}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  {deletingId === doc.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Link href={`/dashboard/documents/${doc.id}`}>
                <h3 className="font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
                  {doc.title}
                </h3>
              </Link>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="capitalize">{doc.type.toLowerCase()}</span>
                <span className="capitalize">{doc.status.toLowerCase()}</span>
              </div>

              <div className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                Updated {formatDate(doc.updatedAt)}
              </div>

              <div className="flex gap-2">
                <Link href={`/dashboard/documents/${doc.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View
                  </Button>
                </Link>
                {doc.status === 'COMPLETED' && (
                  <a
                    href={`/api/documents/${doc.id}/download`}
                    download
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-3 w-3" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
