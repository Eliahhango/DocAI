'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Presentation, Loader2 } from 'lucide-react'

export default function GeneratePPTPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ppt',
          prompt,
          title: title || 'Untitled Presentation',
          context: context || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Generation failed')
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
        <h1 className="text-3xl font-bold mb-2">AI PowerPoint Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create stunning presentations from a topic, outline, or uploaded document using AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Presentation Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Q4 Sales Report, Product Launch"
          />
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Presentation Topic or Outline *
          </label>
          <textarea
            id="prompt"
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="e.g., Create a presentation about artificial intelligence in healthcare. Include slides on: introduction, current applications, benefits, challenges, future trends, and conclusion."
          />
        </div>

        <div>
          <label htmlFor="context" className="block text-sm font-medium mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Provide any additional details, audience information, or specific requirements..."
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Presentation...
            </>
          ) : (
            <>
              <Presentation className="mr-2 h-4 w-4" />
              Generate PowerPoint
            </>
          )}
        </Button>
      </form>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Tips for best results:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>Provide a clear topic or theme for your presentation</li>
          <li>List the main points or slides you want included</li>
          <li>Specify the target audience (students, executives, clients, etc.)</li>
          <li>Mention if you want bullet points, detailed content, or both</li>
        </ul>
      </div>
    </div>
  )
}
