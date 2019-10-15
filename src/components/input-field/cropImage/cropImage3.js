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
} from './ResuableUtils';
const imageMaxSize = 1000000000 // bytes
const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() })
class ImgDropAndCrop extends Component {
    constructor(props) {
        super(props)
        this.imagePreviewCanvasRef = React.createRef()
        this.fileInputRef = React.createRef()
        this.state = {
            image: '',
            crop: {
                aspect: 4 / 3,
                x: 10,
                y: 10,
                width: 80,
                height: 80,
            },
            imgSrc: null
        }
    }

    getCroppedImg = (image, pixelCrop, fileName) => {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');

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
        );

        // As a blob
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                blob.name = fileName;
                resolve(blob);
            }, 'image/jpeg');
        });
    }

    handleImageUpload = e => {
        const uploadData = new FormData();
        uploadData.append("image", this.state.imgSrc);
        debugger
        imageProvider.upload(uploadData).then(s => {
            if (s && s.data.code == 0 && s.data.data) {
                this.setState({
                    image: s.data.data.image.image,
                    imageName: s.data.data.image.name,
                })
                debugger
                if (this.props.changeImageCrop) {
                    this.props.changeImageCrop(s.data.data.image.image, s.data.data.image.name)
                }
            } else {
                toast.error("Vui lòng thử lại !", {
                    position: toast.POSITION.TOP_LEFT
                });
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
        // service.handleUpload(uploadData)
        //     .then(response => {
        //         this.setState({ image: response.secure_url });
        //     })
        //     .catch(err => {
        //         console.log("Error while uploading the file: ", err);
        //     });
    }

    handleImagePreview = e => {
        this.setState({ image: URL.createObjectURL(e.target.files[0]), imgSrc: e.target.files[0] })
    }

    handleOnCropComplete = (crop, pixelCrop) => {
        this.getCroppedImg(this.state.imgSrc, pixelCrop, 'preview.jpg')
            .then((res) => {
                const blobUrl = URL.createObjectURL(res);
                console.log(blobUrl);
            })

    }
    render() {
        return (
            <div>
                <input required onChange={this.handleImagePreview} type="file" />
                <div className="crop-div">
                    <ReactCrop
                        src={this.state.image}
                        crop={this.state.crop}
                        onChange={this.handleOnCropChange}
                        onComplete={this.handleOnCropComplete} />
                    <button className="submit-btn" onClick={this.handleImageUpload}>Crop the image</button>
                </div>
            </div>
        )
    }
}
export default ImgDropAndCrop


