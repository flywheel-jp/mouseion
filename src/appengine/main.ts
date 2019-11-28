import path from "path"

import express from "express"
import { Storage } from "@google-cloud/storage"

import renderIndexPage from "./render/indexPage"
import renderSingleFile from "./render/singleFile"

const PORT = Number(process.env.PORT) || 8080
const bucketName = process.env.GCLOUD_STORAGE_BUCKET
if (!bucketName) {
  throw new Error(
    `You must set GCLOUD_STORAGE_BUCKET as an environment variable.`
  )
}

const app = express()

// Use pug
app.set("view engine", "pug")
app.set("views", "./views")

const storage = new Storage()
const bucket = storage.bucket(bucketName)

/**
 * Root page.
 */
app.get("/", (req, res) => {
  renderIndexPage(req, res, { bucket })
})

/**
 * Route for other GET requests.
 */
app.get("/*", async (req, res) => {
  const name = req.url.substring(1) // remove heading slash char

  if (name !== "" && !name.endsWith("/")) {
    // Check if there is a file with the given file name
    const exactFile = bucket.file(name)
    const [exactFileExists] = await exactFile.exists()
    if (exactFileExists) {
      renderSingleFile(exactFile, res)
      return
    }
  }

  // From this line, the `name` is considered as a directory name.

  // Check if there is a index.html in the directory.
  const indexFile = bucket.file(path.join(name, "index.html"))
  const [indexFileExists] = await indexFile.exists()
  if (indexFileExists) {
    renderSingleFile(indexFile, res)
    return
  }

  // Show all files in the directory.
  renderIndexPage(req, res, { bucket })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
