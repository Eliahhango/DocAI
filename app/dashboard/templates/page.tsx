'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FileText, Loader2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface Template {
  id: string
  name: string
  description: string | null
  category: string
  preview: string | null
  isPremium: boolean
}

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    fetchTemplates()
  }, [selectedCategory])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const url = selectedCategory === 'all'
        ? '/api/templates'
        : `/api/templates?category=${selectedCategory}`
      
      const response = await fetch(url)
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (err) {
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = (template: Template) => {
    router.push(`/dashboard/generate/word?template=${template.id}`)
  }

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'business', name: 'Business' },
    { id: 'academic', name: 'Academic' },
    { id: 'resume', name: 'Resume' },
    { id: 'letter', name: 'Letter' },
    { id: 'report', name: 'Report' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Document Templates</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from professional templates to get started quickly
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No templates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              {template.isPremium && (
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                    Premium
                  </span>
                </div>
              )}
              
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>

              <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {template.description || 'Professional template'}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 capitalize">
                  {template.category}
                </span>
                <Button size="sm" onClick={() => handleUseTemplate(template)}>
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
