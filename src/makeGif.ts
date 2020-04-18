import getStream from "get-stream"
import GIFEncoder from "gifencoder"
import decodeJpeg from "jpeg-js/lib/decoder"

const DELAY = 100
const QUALITY = 10

const processFrame = async (url: string, abortSignal?: AbortSignal) => {
  const res = await fetch(url, { mode: "cors", signal: abortSignal })
  const buf = await res.arrayBuffer()
  const jpeg = decodeJpeg(buf, true)
  return jpeg
}

const makeGIF = async (urls: string[], abortSignal?: AbortSignal) => {
  const framePromises = urls.map((url) => processFrame(url, abortSignal))

  const firstFrame = await framePromises.shift()!
  if (abortSignal && abortSignal.aborted) throw "Aborted by user"

  const encoder = new GIFEncoder(firstFrame.width, firstFrame.height)
  const stream = getStream.buffer(encoder.createReadStream())

  encoder.start()
  encoder.setRepeat(0)
  encoder.setDelay(DELAY)
  encoder.setQuality(QUALITY)

  for (const framePromise of framePromises) {
    const frame = await framePromise
    encoder.addFrame((frame.data as unknown) as number[])
    if (abortSignal && abortSignal.aborted) throw "Aborted by user"
  }

  encoder.finish()

  const blob = new Blob([await stream], { type: "image/gif" })
  return URL.createObjectURL(blob)
}

export default makeGIF
