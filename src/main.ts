import PQueue from "p-queue"
import type { Request, Response } from "./communication"
import { getImageData } from "./getImageData"

export default class GifMaker {
  private readonly workerPool: readonly Worker[]
  private nextJobId = 0
  private queue = new PQueue({ concurrency: this.workerNumber })

  constructor(workerMaker: () => Worker, private workerNumber = 1) {
    const pool = []
    let _workerNumber = workerNumber
    while (_workerNumber--) pool.push(workerMaker())
    this.workerPool = pool
  }

  public makeGif(frameUrls: string[], abortSignal?: AbortSignal) {
    return this.queue.add(() => this._makeGifImmediate(frameUrls, abortSignal))
  }

  private async _makeGifImmediate(
    frameUrls: string[],
    abortSignal?: AbortSignal
  ) {
    const id = this.nextJobId++
    const worker = this.workerPool[id % this.workerNumber]

    const req: Request = {
      id,
      command: "make-gif",
      frames: await Promise.all(
        frameUrls.map((url) => getImageData(url, abortSignal))
      ),
    }

    const abortHandler = () => {
      const req: Request = { id, command: "cancel-make-gif" }
      worker.postMessage(req)
    }

    abortSignal &&
      abortSignal.addEventListener("abort", abortHandler, { once: true })

    const res = await new Promise<Response>((fulfill, reject) => {
      const listener = (msg: MessageEvent) => {
        const res = msg.data as Response
        if (res.id !== id) return
        worker.removeEventListener("message", listener)
        fulfill(res)
      }

      worker.addEventListener("message", listener)
      worker.postMessage(
        req,
        req.frames.map((frame) => frame.data.buffer)
      )
    })

    abortSignal && abortSignal.removeEventListener("abort", abortHandler)

    switch (res.type) {
      case "success":
        return res.gifUrl
      case "error":
        throw res.error
    }
  }
}
