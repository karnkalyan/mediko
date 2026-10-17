import { WebSocketServer, WebSocket } from 'ws'

const rooms = new Map()

const leaveCurrentRoom = (socket) => {
  if (!socket.conversationId) return
  const members = rooms.get(socket.conversationId)
  if (!members) return
  members.delete(socket)
  if (members.size === 0) rooms.delete(socket.conversationId)
}

const joinRoom = (socket, conversationId) => {
  leaveCurrentRoom(socket)
  socket.conversationId = conversationId
  const members = rooms.get(conversationId) || new Set()
  members.add(socket)
  rooms.set(conversationId, members)
}

const broadcast = (conversationId, payload, except) => {
  const encoded = JSON.stringify(payload)
  for (const client of rooms.get(conversationId) || []) {
    if (client !== except && client.readyState === WebSocket.OPEN) client.send(encoded)
  }
}

export const initializeChatSocket = (server) => {
  const wss = new WebSocketServer({ server, path: '/chat' })

  wss.on('connection', (socket) => {
    socket.isAlive = true
    socket.on('pong', () => { socket.isAlive = true })

    socket.on('message', (rawMessage) => {
      try {
        const data = JSON.parse(rawMessage.toString())
        if (data.type === 'join' && data.conversationId) {
          joinRoom(socket, data.conversationId)
          socket.user = { role: data.role, name: data.name }
          socket.send(JSON.stringify({ type: 'joined', conversationId: data.conversationId }))
          return
        }

        if (data.type === 'message' && data.conversationId && data.message) {
          broadcast(data.conversationId, {
            type: 'message',
            conversationId: data.conversationId,
            message: {
              ...data.message,
              id: data.message.id || `message-${Date.now()}`,
              sender: socket.user?.name || data.message.sender || 'Portal user',
              role: socket.user?.role || data.message.role || 'User',
            },
          }, socket)
        }
      } catch {
        socket.send(JSON.stringify({ type: 'error', message: 'Message could not be read.' }))
      }
    })

    socket.on('close', () => leaveCurrentRoom(socket))
  })

  const heartbeat = setInterval(() => {
    for (const socket of wss.clients) {
      if (socket.isAlive === false) {
        leaveCurrentRoom(socket)
        socket.terminate()
        continue
      }
      socket.isAlive = false
      socket.ping()
    }
  }, 30000)

  wss.on('close', () => clearInterval(heartbeat))
  return wss
}
