import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import './custom-image-crop.css';
import imageProvider from '../../../data-access/image-provider';
import { toast } from 'react-toastify';
import {
    base64StringtoFile,
    downloadBase64File,
    extractImageFileExtensionFromBase64,
    image64toCanvasRef
} from './ResuableUtils'

const imageMaxSize = 1000000000 // bytes
const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() })
class ImgDropAndCrop extends Component {
    constructor(props) {
        super(props)
        this.imagePreviewCanvasRef = React.createRef()
        this.fileInputRef = React.createRef()
        this.state = {
            imgSrc: null,
            imgSrcExt: null,
            crop: {
                // aspect: 1 / 1
            },
            logo: "",
            image: "",
            imageName: ""
        }
    }
    verifyFile = (files) => {
        if (files && files.length > 0) {
            const currentFile = files[0]
            const currentFileType = currentFile.type
            const currentFileSize = currentFile.size
            if (currentFileSize > imageMaxSize) {
                alert("This file is not allowed. " + currentFileSize + " bytes is too large")
                return false
            }
            if (!acceptedFileTypesArray.includes(currentFileType)) {
                alert("This file is not allowed. Only images are allowed.")
                return false
            }
            return true
        }
    }
    handleOnDrop = (files, rejectedFiles) => {
        if (rejectedFiles && rejectedFiles.length > 0) {
            this.verifyFile(rejectedFiles)
        }
        if (files && files.length > 0) {
            const isVerified = this.verifyFile(files)
            if (isVerified) {
                const currentFile = files[0]
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener("load", () => {
                    const myResult = myFileItemReader.result
                    this.setState({
                        imgSrc: myResult,
                        imgSrcExt: extractImageFileExtensionFromBase64(myResult)
                    })
                }, false)
                myFileItemReader.readAsDataURL(currentFile)
            }
        }
    }
    handleImageLoaded = (image) => {
        console.log(image)
    }
    handleOnCropChange = (crop) => {
        this.setState({ crop: crop })
    }
    handleOnCropComplete = (crop, pixelCrop) => {
        const canvasRef = this.imagePreviewCanvasRef.current
        const { imgSrc } = this.state
        image64toCanvasRef(canvasRef, imgSrc, crop)
    }
    handleSaveloadClick = (event) => {
        // event.preventDefault()
        const { imgSrc } = this.state
        if (imgSrc) {
            const canvasRef = this.imagePreviewCanvasRef.current
            const { imgSrcExt } = this.state
            const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt)
            const myFilename = "previewFile." + imgSrcExt
            const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)
            imageProvider.upload(myNewCroppedFile).then(s => {
                if (s && s.data.code == 0 && s.data.data) {
                    this.setState({
                        image: s.data.data.image.image,
                        imageName: s.data.data.image.name,
                    })
                    // if (this.props.changeImageCrop){
                    //     this.props.changeImageCrop(s.data.data.image.image, s.data.data.image.name)
                    // }
                    // if (this.props.callbackOff) {
                    //     this.props.callbackOff()
                    // }
                } else {
                    toast.error("Vui lòng thử lại !", {
                        position: toast.POSITION.TOP_LEFT
                    });
                }
                this.setState({ progress: false })
            }).catch(e => {
                this.setState({ progress: false })
            })
            // downloadBase64File(imageData64, myFilename)
            this.handleClearToDefault()
        }
    }
    handleClearToDefault = event => {
        if (event) event.preventDefault()
        const canvas = this.imagePreviewCanvasRef.current
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.setState({
            // imgSrc: null,
            imgSrcExt: null,
            crop: {
                // aspect: 1 / 1
            }
        })
        this.fileInputRef.current.value = null
    }
    handleFileSelect = event => {
        const files = event.target.files
        if (files && files.length > 0) {
            const isVerified = this.verifyFile(files)
            if (isVerified) {
                const currentFile = files[0]
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener("load", () => {
                    const myResult = myFileItemReader.result
                    this.setState({
                        imgSrc: myResult,
                        imgSrcExt: extractImageFileExtensionFromBase64(myResult)
                    })
                }, false)
                myFileItemReader.readAsDataURL(currentFile)
            }
        }
    }
    render() {
        const { imgSrc, image, imageName } = this.state
        return (
            <div>
                {/* <input
                    ref={this.fileInputRef}
                    type='file'
                    accept={acceptedFileTypes}
                    multiple={false}
                    onChange={this.handleFileSelect}
                    style={{ display: 'none' }}
                    id="upload_logo_header"
                />
                <label htmlFor="upload_logo_header" style={{ marginTop: 2, marginBottom: "auto" }}>
                    <img className="upload-image-create"
                        src="/image-icon.png" />
                </label> */}
                <input
                    ref={this.fileInputRef}
                    type='file'
                    accept={acceptedFileTypes}
                    multiple={false}
                    onChange={this.handleFileSelect}
                    style={{ display: 'none' }}
                    id="upload_logo_header"
                />
                <label htmlFor="upload_logo_header" className="change-tilte">
                    <input
                        className="change-avatar"
                        placeholder="Chọn file ảnh"
                        value={imageName}
                    />
                    <div className="change-avatar-title">Chọn</div>
                </label>
                <img className="image-avatar" src={image && image.absoluteUrl()} alt="" />
                {imgSrc !== null ?
                    <div>
                        <ReactCrop
                            src={imgSrc}
                            crop={this.state.crop}
                            onImageLoaded={this.handleImageLoaded}
                            onComplete={this.handleOnCropComplete}
                            onChange={this.handleOnCropChange}
                        />
                        <br />
                        {/* <img src={this.state.image && this.state.image.absoluteUrl()} alt="" /> */}
                        <canvas style={{ display: "none" }} ref={this.imagePreviewCanvasRef}></canvas>
                        {/* <button onClick={this.handleSaveloadClick}>Save</button> */}
                    </div>
                    : null
                }
            </div>
        )
    }
}
export default ImgDropAndCrop
