import app from './app.js'
import { createServer } from 'node:http'
import { initializeChatSocket } from './realtime/chatSocket.js'

const PORT = process.env.PORT || 5000
const server = createServer(app)

initializeChatSocket(server)

server.listen(PORT, () => {
  console.log(`Mediko Bazaar services are available at http://localhost:${PORT}`)
  console.log(`Live portal chat is available at ws://localhost:${PORT}/chat`)
})
