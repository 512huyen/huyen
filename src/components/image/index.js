import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import imageProvider from '../../data-access/image-provider';
import { toast } from 'react-toastify';
import './index.scss';
function Image({ value, title, width, dataImage }) {
    const [image, setImage] = useState("")
    const uploadImage = (event) => {
        let selector = event.target;
        let fileName = selector.value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
        let sizeImage = (event.target.files[0] || {}).size / 1048576;
        if (sizeImage) {
            if (fileName.endsWith(".jpg") ||
                fileName.endsWith(".png") ||
                fileName.endsWith(".gif") ||
                fileName.endsWith(".Gif")) {
                if (sizeImage > 2) {
                    toast.error("Ảnh không vượt quá dung lượng 2MB", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    imageProvider.upload(event.target.files[0]).then(s => {
                        if (s && s.data.code === 0 && s.data.data) {
                            setImage(s.data.data.image.image)
                            dataImage(s.data.data.image.image)
                        } else {
                            toast.error("Vui lòng thử lại !", {
                                position: toast.POSITION.TOP_LEFT
                            });
                        }
                    }).catch(e => {
                    })
                }

            } else {
                toast.error("Vui lòng chọn đúng định dạng file ảnh", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }
    return (
        <div className="image-modal">
            <div className="row">
                <div className={"col-md-" + width}>
                    <span className="title-modal">{title}</span>
                </div>
                <div className={"col-md-" + (12 - width) + " body-modal"}>
                    <input
                        accept="image/png"
                        style={{ display: 'none' }}
                        id="upload_logo_header"
                        onChange={(event) => { uploadImage(event) }}
                        type="file"
                    />
                    <label htmlFor="upload_logo_header">
                        {
                            image ?
                                <div style={{ cursor: "pointer" }}>
                                    <img className="image-update" alt=""
                                        src={image.absoluteUrl()} />
                                </div> :
                                <img className="upload-image-create" alt=""
                                    src="/image-icon.png" />
                        }
                    </label>
                </div>
            </div>
        </div>
    )
}

export default Image;
