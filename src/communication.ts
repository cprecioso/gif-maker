export type Request = Request.MakeGif | Request.CancelMakeGif
export declare namespace Request {
  export type MakeGif = { id: number; command: "make-gif"; frameUrls: string[] }
  export type CancelMakeGif = { id: number; command: "cancel-make-gif" }
}

export type Response = Response.Success | Response.Error
export declare namespace Response {
  export type Success = { id: number; type: "success"; gifUrl: string }
  export type Error = { id: number; type: "error"; error: string }
}
