declare module "jpeg-js/lib/encoder" {
  import jpeg from "jpeg-js"

  function encode(jpegImageData: jpeg.JpegData, quality: number): jpeg.JpegData

  export = encode
}

declare module "jpeg-js/lib/decoder" {
  import jpeg from "jpeg-js"

  function decode(
    jpegData: ArrayBufferView | ArrayBuffer,
    asUint8?: false
  ): jpeg.JpegData
  function decode(
    jpegData: ArrayBufferView | ArrayBuffer,
    asUint8: true
  ): jpeg.JpegData<Uint8Array>

  export = decode
}

declare module "jpeg-js" {
  import decode from "jpeg-js/lib/decoder"
  import encode from "jpeg-js/lib/encoder"

  const jpeg: { encode: typeof encode; decode: typeof decode }

  declare namespace jpeg {
    interface JpegData<T extends Uint8Array = Buffer> {
      width: number
      height: number
      data: T
    }
  }

  export = jpeg
}
