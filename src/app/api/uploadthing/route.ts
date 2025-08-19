import { createRouteHandler } from 'uploadthing/next'
import { ourFileRouter } from '../../../lib/core'

console.log('[v0] UPLOADTHING_TOKEN exists:', !!process.env.UPLOADTHING_TOKEN)
console.log('[v0] Token length:', process.env.UPLOADTHING_TOKEN?.length)

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
    logLevel: 'Info',
  },
})
