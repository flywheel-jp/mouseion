import { Response, Request } from "express-serve-static-core"
import { Bucket } from "@google-cloud/storage"

import stripTrailingSlash from "../utils/stripTrailingSlash"

export default async (
  request: Request,
  responseWriter: Response,
  {
    bucket,
  }: {
    bucket: Bucket
  }
): Promise<void> => {
  const path = stripTrailingSlash(request.url)

  const prefix = path === "" ? "" : path.substring(1) + "/"
  const response = await bucket.getFiles({
    autoPaginate: false,
    delimiter: "/",
    prefix,
  })
  const files = response[0]
  const apiResponse = response[2]
  const prefixes = apiResponse?.prefixes ?? []

  if (files.length === 0 && prefixes.length === 0) {
    responseWriter.status(404)
    responseWriter.send("Not Found")
    return
  }

  responseWriter.render("index", {
    fileNames: files.filter(f => f.name !== prefix).map(f => f.name),
    prefixes: apiResponse?.prefixes ?? [],
    title: process.env.SITE_TITLE || "Mouseion",
  })
}
