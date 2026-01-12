import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'

let io: SocketIOServer | null = null

export function initializeSocket(server: HTTPServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join-document', (documentId: string) => {
      socket.join(`document:${documentId}`)
      socket.to(`document:${documentId}`).emit('user-joined', socket.id)
    })

    socket.on('leave-document', (documentId: string) => {
      socket.leave(`document:${documentId}`)
      socket.to(`document:${documentId}`).emit('user-left', socket.id)
    })

    socket.on('document-change', (data: { documentId: string; content: string; userId: string }) => {
      socket.to(`document:${data.documentId}`).emit('document-updated', {
        content: data.content,
        userId: data.userId,
      })
    })

    socket.on('cursor-position', (data: { documentId: string; position: number; userId: string }) => {
      socket.to(`document:${data.documentId}`).emit('cursor-moved', {
        position: data.position,
        userId: data.userId,
      })
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })

  return io
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized')
  }
  return io
}
