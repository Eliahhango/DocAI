import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Presentation, FileCheck, Sparkles, ArrowRight, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await getSession()
  
  if (!session?.user?.email) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      documents: {
        take: 5,
        orderBy: { updatedAt: 'desc' },
      },
    },
  })

  const recentDocuments = user?.documents || []
  const documentCount = await prisma.document.count({
    where: { userId: user?.id },
  })

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {session.user.name || 'User'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create, edit, and manage your documents with AI assistance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold">{documentCount}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Documents</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold capitalize">{user?.subscription.toLowerCase()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Subscription Plan</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold">∞</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">AI Credits</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <action.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Documents</h2>
          <Link href="/dashboard/documents">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {recentDocuments.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentDocuments.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/dashboard/documents/${doc.id}`}
                  className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(doc.updatedAt)} • {doc.type}
                        </div>
                      </div>
                    </div>
                    <div className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 capitalize">
                      {doc.status.toLowerCase()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No documents yet</p>
            <Link href="/dashboard/generate/word">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Document
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

const quickActions = [
  {
    title: 'AI Word Generator',
    description: 'Generate Word documents',
    href: '/dashboard/generate/word',
    icon: FileText,
  },
  {
    title: 'AI PPT Generator',
    description: 'Create presentations',
    href: '/dashboard/generate/ppt',
    icon: Presentation,
  },
  {
    title: 'AI PDF Generator',
    description: 'Generate PDF documents',
    href: '/dashboard/generate/pdf',
    icon: FileCheck,
  },
  {
    title: 'AI Rewriter',
    description: 'Enhance your documents',
    href: '/dashboard/rewrite',
    icon: Sparkles,
  },
]
