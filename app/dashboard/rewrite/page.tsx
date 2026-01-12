'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2, FileText } from 'lucide-react'

interface Document {
  id: string
  title: string
  type: string
}

function RewriteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocId, setSelectedDocId] = useState(searchParams.get('documentId') || '')
  const [instructions, setInstructions] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (err) {
      setError('Failed to load documents')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDocId) {
      setError('Please select a document')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/documents/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: selectedDocId,
          instructions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Rewrite failed')
        return
      }

      router.push(`/dashboard/documents/${data.document.id}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Document Rewriter & Enhancer</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Improve and rewrite your documents with AI-powered suggestions and enhancements.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="document" className="block text-sm font-medium mb-2">
            Select Document *
          </label>
          {fetching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">No documents found</p>
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/generate/word')}>
                Create a Document
              </Button>
            </div>
          ) : (
            <select
              id="document"
              required
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a document...</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title} ({doc.type})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="instructions" className="block text-sm font-medium mb-2">
            Rewriting Instructions *
          </label>
          <textarea
            id="instructions"
            required
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="e.g., Make it more professional and formal. Improve clarity and flow. Add more details. Simplify the language. Focus on technical accuracy."
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading || !selectedDocId}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Rewriting Document...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Rewrite Document
            </>
          )}
        </Button>
      </form>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Examples of instructions:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>Make the tone more professional and formal</li>
          <li>Simplify the language for a general audience</li>
          <li>Add more technical details and specifications</li>
          <li>Improve clarity and readability</li>
          <li>Make it more concise and to the point</li>
          <li>Enhance with examples and case studies</li>
        </ul>
      </div>
    </div>
  )
}

export default function RewritePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <RewriteContent />
    </Suspense>
  )
}
