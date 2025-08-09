const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.setAttribute("crossOrigin", "anonymous")
    image.onload = () => resolve(image)
    image.onerror = (err) => reject(err)
    image.src = url
  })

const getCroppedImg = async (imageSrc, crop) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  canvas.width = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext("2d")

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 1)
  })
}

export default getCroppedImg
