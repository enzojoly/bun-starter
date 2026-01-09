const port = 3000
const staticDir = "."

const contentTypes: Record<string, string> = {
  // markup & data
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".ts": "text/typescript",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".md": "text/markdown",
  // images
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  // fonts
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  // media
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  // dev
  ".map": "application/json",
  ".wasm": "application/wasm",
}

function getContentType(path: string): string {
  const ext = path.substring(path.lastIndexOf("."))
  return contentTypes[ext] || "application/octet-stream"
}

async function serveFile(path: string): Promise<Response> {
  const filePath = path === "/" ? "/index.html" : path
  const file = Bun.file(staticDir + filePath)

  if (await file.exists()) {
    return new Response(file, {
      headers: { "Content-Type": getContentType(filePath) }
    })
  }

  return notFound()
}

function notFound(): Response {
  return new Response("404 Not Found", {
    status: 404,
    headers: { "Content-Type": "text/plain" }
  })
}

function log(request: Request, status: number, duration: number): void {
  const timestamp = new Date().toISOString()
  const method = request.method
  const path = new URL(request.url).pathname
  console.log(`${timestamp} ${method} ${path} ${status} ${duration}ms`)
}

// API routes - uncomment and extend as needed
// async function handleApi(path: string, request: Request): Promise<Response | null> {
//   if (path === "/api/health") {
//     return Response.json({ status: "ok", timestamp: Date.now() })
//   }
//   if (path === "/api/echo" && request.method === "POST") {
//     const body = await request.json()
//     return Response.json({ received: body })
//   }
//   return null // not an API route
// }

Bun.serve({
  port,
  async fetch(request) {
    const start = performance.now()
    const path = new URL(request.url).pathname

    // API routes (uncomment to enable)
    // const apiResponse = await handleApi(path, request)
    // if (apiResponse) {
    //   log(request, apiResponse.status, Math.round(performance.now() - start))
    //   return apiResponse
    // }

    const response = await serveFile(path)
    log(request, response.status, Math.round(performance.now() - start))
    return response
  }
})

console.log(`serving on http://localhost:${port}`)
