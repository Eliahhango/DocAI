'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'
import { Users } from 'lucide-react'

interface CollaborationEditorProps {
  documentId: string
  initialContent: string
  onContentChange?: (content: string) => void
}

export function CollaborationEditor({
  documentId,
  initialContent,
  onContentChange,
}: CollaborationEditorProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState(initialContent)
  const [activeUsers, setActiveUsers] = useState<string[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      transports: ['websocket'],
    })

    newSocket.on('connect', () => {
      newSocket.emit('join-document', documentId)
    })

    newSocket.on('user-joined', (userId: string) => {
      setActiveUsers((prev) => [...prev, userId])
    })

    newSocket.on('user-left', (userId: string) => {
      setActiveUsers((prev) => prev.filter((id) => id !== userId))
    })

    newSocket.on('document-updated', (data: { content: string; userId: string }) => {
      if (data.userId !== session?.user?.id) {
        setContent(data.content)
        onContentChange?.(data.content)
      }
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [documentId, session?.user?.id, onContentChange])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    onContentChange?.(newContent)

    if (socket && socket.connected) {
      socket.emit('document-change', {
        documentId,
        content: newContent,
        userId: session?.user?.id,
      })
    }
  }

  return (
    <div className="space-y-4">
      {activeUsers.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {activeUsers.length} {activeUsers.length === 1 ? 'person' : 'people'} editing
          </span>
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        className="w-full h-96 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
        placeholder="Start typing..."
      />
    </div>
  )
}
