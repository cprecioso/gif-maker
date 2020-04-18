import getStream from "get-stream"
import GIFEncoder from "gifencoder"

const DELAY = 100
const QUALITY = 10

const makeGIF = async (frames: ImageData[], abortSignal?: AbortSignal) => {
  const { width, height } = (await frames[0])!

  const encoder = new GIFEncoder(width, height)
  const stream = getStream.buffer(encoder.createReadStream())

  encoder.start()
  encoder.setRepeat(0)
  encoder.setDelay(DELAY)
  encoder.setQuality(QUALITY)

  for (const frame of frames) {
    encoder.addFrame((frame.data as unknown) as number[])
    if (abortSignal && abortSignal.aborted) throw "Aborted by user"
  }

  encoder.finish()

  const blob = new Blob([await stream], { type: "image/gif" })
  return URL.createObjectURL(blob)
}

export default makeGIF
