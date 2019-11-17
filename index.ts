import path from "path"

import express from "express"
import { Storage } from "@google-cloud/storage"

const PORT = Number(process.env.PORT) || 8080
const bucketName = process.env.GCLOUD_STORAGE_BUCKET
if (!bucketName) {
  throw new Error(
    `You must set GCLOUD_STORAGE_BUCKET as an environment variable.`
  )
}

const app = express()
app.set("view engine", "pug")
app.set("views", "./views")

const storage = new Storage()
const bucket = storage.bucket(bucketName)

interface GoogleError {
  code: number
  message: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGoogleError = (e: any): e is GoogleError => {
  return (
    e != null && typeof e.code === "number" && typeof e.message === "string"
  )
}

/**
 * Mouseion index page. List all documents.
 */
app.get("/", async (_, responseWriter) => {
  const response = await bucket.getFiles({
    autoPaginate: false,
    delimiter: "/"
  })
  const files = response[0]
  const apiResponse = response[2]

  responseWriter.render("index", {
    fileNames: files.map(f => f.name),
    prefixes: apiResponse?.prefixes ?? []
  })
})

/**
 * Proxy for individual files.
 */
app.get("/*", async (req, res) => {
  const name = req.url.substring(1)

  let file = bucket.file(name)
  const [exists] = await file.exists()
  if (!exists) {
    // If there isn't a file with the given name, treat it as a directory.
    file = bucket.file(path.join(name, "index.html"))
  }

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
    .on("end", () => res.end())
    .pipe(res)
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
