// Store active connections
const connections = new Map<string, ReadableStreamDefaultController>()

// Broadcast message to all connected users
export function broadcastMessage(message: any) {
  const data = `data: ${JSON.stringify(message)}\n\n`

  for (const [userId, controller] of connections.entries()) {
    try {
      controller.enqueue(data)
    } catch (error) {
      // Remove dead connection
      connections.delete(userId)
    }
  }
}

// Get online users count
export function getOnlineUsers() {
  return Array.from(connections.keys())
}

// Add connection
export function addConnection(
  userId: string,
  controller: ReadableStreamDefaultController
) {
  connections.set(userId, controller)
}

// Remove connection
export function removeConnection(userId: string) {
  connections.delete(userId)
}
