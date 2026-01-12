import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText, Presentation, FileCheck, Sparkles, Languages, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DocAI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              Your AI-Powered Document Assistant
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Create, edit, convert, and manage professional documents with ease. 
              Powered by advanced AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful AI Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to create professional documents
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Documents?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users creating professional documents with AI assistance
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Start Creating Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: 'AI Word Generator',
    description: 'Generate reports, proposals, letters, resumes, and assignments instantly',
  },
  {
    icon: <Presentation className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: 'AI PowerPoint Creator',
    description: 'Create stunning presentations from topics, outlines, or documents',
  },
  {
    icon: <FileCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: 'AI PDF Generator',
    description: 'Generate professional PDFs from text, Word, or PowerPoint files',
  },
  {
    icon: <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: 'AI Rewriter & Enhancer',
    description: 'Improve and rewrite your documents with AI-powered suggestions',
  },
  {
    icon: <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: 'Grammar & Formatting',
    description: 'Get real-time grammar checks and professional formatting assistance',
  },
  {
    icon: <Languages className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: 'Multi-Language Support',
    description: 'Translate and work with documents in multiple languages',
  },
]
