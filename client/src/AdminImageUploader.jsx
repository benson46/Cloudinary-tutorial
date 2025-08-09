import { useState } from "react"
import Cropper from "react-easy-crop"
import axios from "axios"
import getCroppedImg from "./cropImage"

const AdminImageUploader = () => {
  const [images, setImages] = useState([])
  const [croppedImages, setCroppedImages] = useState([])
  const [currentImage, setCurrentImage] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    setCurrentImage(URL.createObjectURL(files[0]))
  }

  const cropAndSave = async () => {
    const croppedBlob = await getCroppedImg(currentImage, croppedAreaPixels)
    const file = new File([croppedBlob], `cropped-${Date.now()}.jpeg`, { type: "image/jpeg" })
    setCroppedImages(prev => [...prev, file])
    const nextIndex = croppedImages.length + 1
    if (nextIndex < images.length) {
      setCurrentImage(URL.createObjectURL(images[nextIndex]))
    } else {
      setCurrentImage(null)
    }
  }

  const handleUpload = async () => {
    if (croppedImages.length < 3) {
      alert("Minimum 3 images required.")
      return
    }

    const formData = new FormData()
    croppedImages.forEach(img => formData.append("images", img))

    try {
      const { data } = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      alert("Uploaded: " + data.uploaded.join("\n"))
    } catch (err) {
      console.error("Upload failed:", err)
      alert("Upload failed. Check console.")
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleImageSelect} />
      {currentImage && (
        <>
          <div style={{ width: 300, height: 300, position: "relative" }}>
            <Cropper
              image={currentImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <button onClick={cropAndSave}>Crop & Next</button>
        </>
      )}
      <button onClick={handleUpload} disabled={croppedImages.length < 3}>Upload All Cropped</button>
    </div>
  )
}

export default AdminImageUploader
