/// <reference lib="webworker" />

import { Request, Response } from "./communication"
import makeGIF from "./makeGif"

let currentlyProcessingId: number | null = null
let currentAbortController = new AbortController()

self.addEventListener("message", async (msg: MessageEvent) => {
  const request: Request = msg.data

  try {
    if (currentlyProcessingId != null && currentlyProcessingId !== request.id) {
      throw "Already processing a gif"
    } else if (request.command === "make-gif") {
      const { signal } = currentAbortController
      currentlyProcessingId = request.id

      const gifUrl = await makeGIF(request.frameUrls, signal)

      if (signal.aborted) throw "Aborted by user"

      const response: Response.Success = {
        id: request.id,
        type: "success",
        gifUrl,
      }
      self.postMessage(response)

      currentlyProcessingId = null
    } else if (request.command === "cancel-make-gif") {
      currentAbortController.abort()
      currentAbortController = new AbortController()
      currentlyProcessingId = null
    } else {
      throw "Unknown command"
    }
  } catch (error) {
    const response: Response.Error = { id: request.id, type: "error", error }
    self.postMessage(response)
  } finally {
  }
})
