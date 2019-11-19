import imageProvider from '../../../data-access/image-provider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export function base64StringtoFile(base64String, filename) {
  var arr = base64String.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export function downloadBase64File(base64Data, filename) {
  var element = document.createElement('a')
  element.setAttribute('href', base64Data)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export function uploadImageCrop(myNewCroppedFile) {
  imageProvider.upload(myNewCroppedFile).then(s => {
    if (s && s.data.code == 0 && s.data.data) {
      this.setState({
        image: s.data.data.image.image,
      })
    } else {
      toast.error("Vui lòng thử lại !", {
        position: toast.POSITION.TOP_LEFT
      });
    }
    this.setState({ progress: false })
  }).catch(e => {
    this.setState({ progress: false })
  })
}

export function extractImageFileExtensionFromBase64(base64Data) {
  return base64Data.substring('data:image/'.length, base64Data.indexOf(';base64'))
}

export function image64toCanvasRef(canvasRef, image64, pixelCropPx) {
  const image = new Image()
  image.src = image64
  let width = image.width / 100
  let height = image.height / 100
  let pixelCrop = {
    height: height * pixelCropPx.height,
    width: width * pixelCropPx.width,
    x: width * pixelCropPx.x,
    y: height * pixelCropPx.y,
    unit: "px"
  }
  const canvas = canvasRef
  const ctx = canvas.getContext('2d')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  image.width = pixelCrop.width
  image.height = pixelCrop.height
  image.onload = function () {
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )
  }
}
