import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import userProvider from '../../../../data-access/user-provider';
import moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import { DateBox } from '../../../../components/input-field/InputField';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import Radio from '@material-ui/core/Radio';
import stringUtils from 'mainam-react-native-string-utils';
import imageProvider from '../../../../data-access/image-provider';
import ReactCrop from "react-image-crop";
import CropImage from '../../../../components/input-field/cropImage/cropImage';
import "react-image-crop/dist/ReactCrop.css";
function Transition(props) {
    return <Slide direction="up" {...props} />;
}

String.prototype.uintTextBox = function () {
    var re = /^\d*$/;
    return re.test(this);
}
var md5 = require('md5');
class CreateUpdateUserAdmin extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataUserAdmin: this.props.data,
            name: this.props.data && this.props.data.user && this.props.data.user.name ? this.props.data.user.name : '',
            username: this.props.data && this.props.data.user && this.props.data.user.username ? this.props.data.user.username : '',
            email: this.props.data && this.props.data.user && this.props.data.user.email ? this.props.data.user.email : "",
            dob: this.props.data && this.props.data.user && this.props.data.user.dob ? new Date(this.props.data.user.dob) : null,
            type: this.props.data && this.props.data.user && this.props.data.user.type ? this.props.data.user.type.toString() : -1,
            statusActive: this.props.data && this.props.data.user && this.props.data.user.status === 1 ? true : false,
            password: "",
            checkValidate: false,
            logo: "",
            // src: null,
            // crop: {
            //     unit: "%",
            //     width: 30,
            //     // aspect: 9 / 9
            // },
            src: null,
            crop: {
                x: 10,
                y: 10,
                width: 80,
                height: 80,
            },
        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isEmail', (value) => {
            if (!value) {
                return true
            } else {
                return value.isEmail();
            }
        });
    }
    handleClose = (item) => {
        this.props.callbackOff(item)
    };
    handlelogOut() {
        localStorage.clear()
        window.location.href = '/dang-nhap';
    };
    create = async () => {
        let id = this.state.dataUserAdmin && this.state.dataUserAdmin.user ? this.state.dataUserAdmin.user.id : '';
        if (id) {
            if (this.state.name.length <= 255 && this.state.dob && this.state.type != -1 && this.state.email) {
                this.setState({
                    checkValidate: false
                })
            } else {
                this.setState({
                    checkValidate: true
                })
                return
            }
        } else {
            if (this.state.name.length <= 255 && this.state.dob && this.state.username && this.state.password.length >= 6 && this.state.type != -1 && this.state.email) {
                this.setState({
                    checkValidate: false
                })
            } else {
                this.setState({
                    checkValidate: true
                })
                return
            }
        }
        let { dataUserAdmin, name, username, password, type, email, dob, statusActive } = this.state;
        let param = {
            name: name.trim(),
            email: email.trim(),
            password: password,
            type: type,
            username: username,
            dob: moment(dob).format("YYYY-MM-DD"),
            status: id ? statusActive ? 1 : 2 : null
        }
        console.log(JSON.stringify(param));
        if (dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id) {
            userProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật tài khoản thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose(true);
                        break
                    case 1:
                        toast.error("Username đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    case 2:
                        toast.error("Email đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    case 97:
                        this.handlelogOut();
                        break
                    default:
                        toast.error("Cập nhật tài khoản không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
            })
        } else {
            userProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Thêm mới tài khoản thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose(true);
                        break
                    case 1:
                        toast.error("Username đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    case 2:
                        toast.error("Email đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    case 97:
                        this.handlelogOut();
                        break
                    default:
                        toast.error("Thêm mới tài khoản không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
            })
        }
    }
    uploadImage(event) {
        let selector = event.target;
        let fileName = selector.value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
        let sizeImage = (event.target.files[0] || {}).size / 1048576;
        if (sizeImage) {
            if (fileName.endsWith(".jpg") ||
                fileName.endsWith(".png") ||
                fileName.endsWith(".Gif")) {
                if (sizeImage > 2) {
                    toast.error("Ảnh không vượt quá dung lượng 2MB", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    imageProvider.upload(event.target.files[0]).then(s => {
                        if (s && s.data.code == 0 && s.data.data) {
                            this.setState({
                                logo: s.data.data.image.image,
                            })
                            this.data2.logo = s.data.data.image.image;
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

            } else {
                toast.error("Vui lòng chọn đúng định dạng file ảnh", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }
    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // If you setState the crop in here you should return false.
    onImageLoaded = image => {
        this.imageRef = image;
    };

    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                "newFile.jpeg"
            );
            this.setState({ croppedImageUrl });
        }
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
        var myImg = new Image();
        myImg.onload = function () {
            ctx.drawImage(myImg, 0, 0);
        };
        // return new Promise((resolve, reject) => {
        //     imageProvider.upload(myImg).then(s => {
        //         if (s && s.data.code == 0 && s.data.data) {
        //             this.setState({
        //                 logo: s.data.data.image.image,
        //             })
        //             this.data2.logo = s.data.data.image.image;
        //         } else {
        //             toast.error("Vui lòng thử lại !", {
        //                 position: toast.POSITION.TOP_LEFT
        //             });
        //         }
        //         this.setState({ progress: false })
        //     }).catch(e => {
        //         this.setState({ progress: false })
        //     })



        //     canvas.toBlob(blob => {
        //         if (!blob) {
        //             //reject(new Error('Canvas is empty'));
        //             console.error("Canvas is empty");
        //             return;
        //         }
        //         blob.name = fileName;
        //         window.URL.revokeObjectURL(this.fileUrl);
        //         this.fileUrl = window.URL.createObjectURL(blob);
        //         resolve(this.fileUrl);
        //     }, "image/jpeg");
        // });
        const uploadData = new FormData();
        uploadData.append("image", this.state.src);
        debugger
    }

    render() {
        const { classes } = this.props;
        const { dataUserAdmin, name, email, username, password, logo, crop, croppedImageUrl, src } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    disableEnforceFocus={true}
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => this.handleClose(false)}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm onSubmit={this.create}>
                        <DialogTitle id="alert-dialog-slide-title" className="title-popup">
                            {dataUserAdmin.user && dataUserAdmin.user.id ? 'Sửa thông tin tài khoản ' : 'Thêm mới tài khoản'}
                            <IconButton onClick={() => this.handleClose(false)} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                                <Clear />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16} className="user-create-header">
                                {/* <Grid item xs={12} md={12} className="news-title">
                                    <input
                                        accept="image/png"
                                        className={classes.input}
                                        style={{ display: 'none' }}
                                        id="upload_logo_header"
                                        onChange={(event) => { this.data2.logo = (event.target.files[0] || {}).name; this.uploadImage(event) }}
                                        type="file"
                                    />
                                    <label htmlFor="upload_logo_header" style={{ marginTop: 2, marginBottom: "auto" }}>
                                        {
                                            logo ?
                                                <div style={{ marginLeft: 20 }}>
                                                    <img style={{ maxHeight: 150, maxWidth: 250, cursor: "pointer" }}
                                                        src={logo ? logo.absoluteUrl() : ""} />
                                                </div> :
                                                <img className="upload-image-create"
                                                    src="/image-icon.png" />
                                        }
                                    </label>
                                    {
                                        this.state.checkValidate && this.state.logo.toString().length == 0 ? <div className="error-dob">Vui lòng chọn logo!</div> : null
                                    }
                                </Grid> */}
                                <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: 10 }}>
                                    Ảnh (*):
                                </Grid>
                                <Grid item xs={12} md={12} className="news-title">
                                    <CropImage />
                                    {/* <div>
                                        <input type="file" onChange={this.onSelectFile} />
                                    </div>
                                    {src && (
                                        <ReactCrop
                                            src={src}
                                            crop={crop}
                                            onImageLoaded={this.onImageLoaded}
                                            onComplete={this.onCropComplete}
                                            onChange={this.onCropChange}
                                        />
                                    )}
                                    {croppedImageUrl && (
                                        <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
                                    )} */}
                                </Grid>
                                {
                                    dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                                        <Grid item xs={12} md={4} className="grid-title-2">
                                            Username (*):
                                        </Grid>
                                        : null
                                }
                                {
                                    dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                                        <Grid item xs={12} md={8} className="grid-title-2-disabled trim-text">
                                            {dataUserAdmin.user.username}
                                        </Grid> : null
                                }
                                <Grid item xs={12} md={4} className="grid-title-2">
                                    Họ và tên (*):
                                </Grid>
                                <Grid item xs={12} md={8} className="news-title">
                                    <TextValidator
                                        value={name}
                                        id="name" name="name"
                                        variant="outlined"
                                        placeholder="Nhập họ và tên"
                                        className={classes.textField + " color-text-validator"}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }); }}
                                        margin="normal"
                                    />
                                    {
                                        this.state.checkValidate && this.state.name.trim().length === 0 ? <div className="error-dob">Vui lòng nhập họ và tên</div> : null
                                    }
                                    {
                                        this.state.checkValidate && this.state.name.trim().length > 255 ? <div className="error-dob">Vui lòng nhập họ và tên nhỏ hơn 255 ký tự!</div> : null
                                    }
                                </Grid>
                                <Grid item xs={12} md={4} className="grid-title-2">
                                    Ngày sinh (*):
                                </Grid>
                                <Grid item xs={12} md={8} className="news-title-date">
                                    <DateBox
                                        isInput={true} placeholder="Nhập ngày sinh (dd/mm/yyyy)"
                                        value={this.state.dob}
                                        onChangeValue={(event) => {
                                            this.data2.dob = event;
                                            this.setState({ dob: event })
                                        }}
                                    />
                                    {
                                        this.state.checkValidate && (this.state.dob === null || (this.state.dob && this.state.dob.length === 0)) ? <div className="error-dob dob-user-admin">Vui lòng nhập ngày sinh</div> : null
                                    }
                                </Grid>
                                <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: -9 }}>
                                    Email (*):
                                </Grid>
                                <Grid item xs={12} md={8} className="news-title" style={{ marginTop: -9 }}>
                                    <TextValidator
                                        value={email}
                                        id="email" name="email"
                                        variant="outlined"
                                        placeholder="Nhập email"
                                        className={classes.textField + " color-text-validator"}
                                        onChange={(event) => { this.data2.email = event.target.value; this.setState({ email: event.target.value }); }}
                                        margin="normal"
                                        validators={['isEmail']}
                                        errorMessages={['Vui lòng nhập đúng định dạng Email']}
                                    />
                                    {
                                        this.state.checkValidate && this.state.email.trim().length == 0 ? <div className="error-dob">Vui lòng nhập email</div> : null
                                    }
                                </Grid>
                                <Grid item xs={12} md={4} className="grid-title-2">
                                    Loại tài khoản (*):
                                </Grid>
                                <Grid item xs={12} md={8} style={{ marginLeft: -18, marginTop: -18 }}>
                                    <Radio
                                        checked={this.state.type === '1'}
                                        onChange={(event) => { this.data2.type = event.target.value; this.setState({ type: event.target.value }) }}
                                        value={1}
                                        name="radio-button-demo"
                                        inputProps={{ 'aria-label': '1' }}
                                    /> Admin
                                    <Radio
                                        checked={this.state.type === '2'}
                                        onChange={(event) => { this.data2.type = event.target.value; this.setState({ type: event.target.value }) }}
                                        value={2}
                                        name="radio-button-demo"
                                        inputProps={{ 'aria-label': '2' }}
                                    /> Nhân viên
                                </Grid>
                                <Grid item xs={12} md={4}></Grid>
                                <Grid item xs={12} md={8} style={{ marginTop: -22, marginBottom: 14 }}>
                                    {
                                        this.state.checkValidate && this.state.type == -1 ? <div className="error-dob">Vui lòng chọn loại tài khoản</div> : null
                                    }
                                </Grid>
                                {
                                    dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                                        <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: -6 }}>
                                            Ngày tạo:
                                        </Grid>
                                        :
                                        <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: -16 }}>
                                            Username (*):
                                        </Grid>
                                }
                                {
                                    dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                                        <Grid item xs={12} md={8} className="grid-title-2-disabled" style={{ marginTop: -20 }}>
                                            {moment(dataUserAdmin.user.createdDate).format("DD-MM-YYYY")}
                                        </Grid> :
                                        <Grid item xs={12} md={8} className="news-title" style={{ marginTop: -14 }}>
                                            <TextValidator
                                                value={username}
                                                id="username" name="username"
                                                variant="outlined"
                                                placeholder="Nhập username"
                                                className={classes.textField + " color-text-validator"}
                                                onChange={(event) => { this.data2.username = event.target.value; this.setState({ username: event.target.value }); }}
                                                margin="normal"
                                            />
                                            {
                                                this.state.checkValidate && this.state.username.trim().length === 0 ? <div className="error-dob">Vui lòng nhập username</div> : null
                                            }
                                        </Grid>
                                }
                                {
                                    dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                                        <Grid item xs={12} md={4} className="grid-title-2">
                                            Trạng thái:
                                        </Grid> :
                                        <Grid item xs={12} md={4} className="grid-title-2">
                                            Mật khẩu (*):
                                        </Grid>
                                }
                                {
                                    dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                                        <Grid item xs={12} md={8} className="checkbox-popup">
                                            <Checkbox
                                                checked={this.state.statusActive}
                                                onChange={(event) => { this.data2.statusActive = event.target.checked; this.setState({ statusActive: event.target.checked }) }}
                                                value="hot"
                                            />
                                            <a>Đang hoạt động</a>
                                        </Grid>
                                        : <Grid item xs={12} md={8} className="news-title">
                                            <TextValidator
                                                value={password}
                                                id="password" name="password"
                                                variant="outlined"
                                                type="password"
                                                placeholder="Nhập password"
                                                className={classes.textField + " color-text-validator"}
                                                onChange={(event) => { this.data2.password = event.target.value; this.setState({ password: event.target.value }); }}
                                                margin="normal"
                                            />
                                            {
                                                this.state.checkValidate && this.state.password.trim().length === 0 ? <div className="error-dob">Vui lòng nhập password</div> : null
                                            }
                                            {
                                                this.state.checkValidate && this.state.password.trim().length != 0 && this.state.password.trim().length < 6 ? <div className="error-dob">Vui lòng nhập password ít nhất 6 ký tự!</div> : null
                                            }
                                        </Grid>
                                }
                            </Grid>
                        </DialogContent>
                        <DialogActions className="margin-button">
                            <Button onClick={() => this.handleClose(false)} variant="contained" color="inherit">Hủy</Button>
                            {
                                dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id && this.data != JSON.stringify(this.data2) ?
                                    <Button variant="contained" color="primary" type="submit" className="button-new-submit">Cập nhật</Button> :
                                    this.data != JSON.stringify(this.data2) ?
                                        <Button variant="contained" color="primary" type="submit" className="button-new-submit">Thêm mới</Button> :
                                        dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                                            <Button variant="contained" color="primary" disabled>Cập nhật</Button> :
                                            <Button variant="contained" color="primary" disabled>Thêm mới</Button>
                            }
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
            </div >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}

const styles = theme => ({
    row: {
        display: 'flex',
        justifyContent: 'center',
    }, textField: {
        width: '100%'
    }, avatar: {
        margin: 10,
    }, bigAvatar: {
        width: 60,
        height: 60,
    }, helpBlock: {
        color: 'red',
    }
});

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateUserAdmin));