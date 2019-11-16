import express from "express"

const PORT = Number(process.env.PORT) || 8080

const app = express()

app.get("/", (_, res) => {
  res.send("This is flywheel-jp/bookshelf.")
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
