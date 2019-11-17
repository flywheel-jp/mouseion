import path from "path"

import express, { Response, Request } from "express"
import { Storage, File } from "@google-cloud/storage"

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

const stripTrailingSlash = (str: string): string =>
  str.endsWith("/") ? str.slice(0, -1) : str

const renderIndexPage = async (
  request: Request,
  responseWriter: Response
): Promise<void> => {
  const path = stripTrailingSlash(request.url)

  const prefix = path === "" ? "" : path.substring(1) + "/"
  const response = await bucket.getFiles({
    autoPaginate: false,
    delimiter: "/",
    prefix
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
    path,
    fileNames: files.filter(f => f.name !== prefix).map(f => f.name),
    prefixes: apiResponse?.prefixes ?? []
  })
}

const renderSingleFile = async (file: File, res: Response): Promise<void> => {
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
}

/**
 * Route for GET requests ending with a slash.
 */
app.get("/", renderIndexPage)

/**
 * Route for other GET requests.
 */
app.get("/*", async (req, res) => {
  const name = req.url.substring(1)

  if (name !== "" && !name.endsWith("/")) {
    // Check if there is a file with the given file name
    const exactFile = bucket.file(name)
    const [exactFileExists] = await exactFile.exists()
    if (exactFileExists) {
      renderSingleFile(exactFile, res)
      return
    }
  }

  // From this line, the name is considered as a directory name.

  // Check if there is a index.html in the directory.
  const indexFile = bucket.file(path.join(name, "index.html"))
  const [indexFileExists] = await indexFile.exists()
  if (indexFileExists) {
    renderSingleFile(indexFile, res)
    return
  }

  // Show all files in the directory.
  renderIndexPage(req, res)
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
