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

app.get("/", async (_, res) => {
  res.render("index")
})

app.get("/sample", async (_, res) => {
  const file = bucket.file("sample.html")

  file
    .createReadStream()
    .on("error", () => {
      res.status(404)
      res.send("Not Found")
    })
    .on("end", () => res.end())
    .pipe(res)
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
