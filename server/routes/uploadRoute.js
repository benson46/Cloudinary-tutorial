import express from "express"
import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import cloudinary from "cloudinary"
import path from "path"
import fs from "fs"

const router = express.Router()

const uploadFolder = path.join(process.cwd(), "uploads")

// Automatically create folder if missing
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder)
}

// Multer setup for memory storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname)
  },
})
const upload = multer({ storage })

// Cloudinary config
cloudinary.v2.config({
  cloud_name: "your_cloud_name",
  api_key: "your_api_key",
  api_secret: "your_api_secret",
})

// Upload handler
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const urls = []

    for (const file of req.files) {
      const result = await cloudinary.v2.uploader.upload(file.path, {
        folder: "admin-products",
      })
      urls.push(result.secure_url)
      fs.unlinkSync(file.path)
    }

    res.status(200).json({ uploaded: urls })
  } catch (err) {
    console.error("Upload error:", err)
    res.status(500).json({ error: "Upload failed" })
  }
})

export default router
