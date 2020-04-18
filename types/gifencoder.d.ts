declare module "gifencoder" {
  import stream from "stream"

  class GIFEncoder extends stream.Writable {
    constructor(width: number, height: number)

    createReadStream(): stream.Readable

    start(): void
    finish(): void

    setRepeat(times: number | 0 | -1): void
    setDelay(ms: number): void
    setQuality(level: number): void

    addFrame(ctx: CanvasRenderingContext2D | number[]): void
  }

  export = GIFEncoder
}
