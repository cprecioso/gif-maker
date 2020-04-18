export const getImageData = async (url: string, abortSignal?: AbortSignal) => {
  const fetchedImage = await new Promise<HTMLImageElement>(
    (fulfill, reject) => {
      const img = document.createElement("img")
      img.crossOrigin = "anonymous"
      img.src = url

      const listener = () => {
        fulfill(img)
        done()
      }
      const error = (ev: ErrorEvent | { error: string }) => {
        reject(ev.error)
        done()
      }
      const done = () => {
        img.removeEventListener("load", listener)
        img.removeEventListener("error", listener)
      }

      abortSignal &&
        abortSignal.addEventListener("abort", () =>
          reject({ error: "Aborted by user" })
        )

      img.addEventListener("load", listener, { once: true })
      img.addEventListener("error", error, { once: true })
    }
  )

  const { naturalHeight, naturalWidth } = fetchedImage

  const canvas = document.createElement("canvas")
  canvas.width = naturalWidth
  canvas.height = naturalHeight

  const ctx = canvas.getContext("2d")!
  ctx.drawImage(fetchedImage, 0, 0)

  const imgData = ctx.getImageData(0, 0, naturalWidth, naturalHeight)
  return imgData
}
