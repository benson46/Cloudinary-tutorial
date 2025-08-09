import express from "express"
import cors from "cors"
import uploadRoute from "./routes/uploadRoute.js"

const app = express()

app.use(cors({ origin: "http://localhost:5174", credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/upload", uploadRoute)

app.listen(5000, () => {
  console.log("Server running on port 5000")
})
