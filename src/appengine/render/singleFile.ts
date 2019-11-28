import { Response } from "express"
import { File } from "@google-cloud/storage"

import isGoogleError from "../utils/isGoogleError"

export default async (file: File, res: Response): Promise<void> => {
  file
    .createReadStream()
    .on("error", e => {
      if (isGoogleError(e)) {
        res.status(e.code)
        res.send(e.message)
      } else {
        res.status(500)
        res.send("Internal server error")
      }
    })
    .on("response", response => {
      res.setHeader("content-type", response.headers["content-type"])
    })
    .on("end", () => res.end())
    .pipe(res)
}
