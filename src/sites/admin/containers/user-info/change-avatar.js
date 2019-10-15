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
import stringUtils from 'mainam-react-native-string-utils';
import userProvider from '../../../../data-access/user-provider';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import '../../css/change-avatar.css';
import imageProvider from '../../../../data-access/image-provider';
import CropImage from '../../../../components/input-field/cropImage/cropImage';
import dataCacheProvider from '../../../../data-access/datacache-provider'
import constants from "../../../../resources/strings";
function Transition(props) {
    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class SetPassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            dataUser: this.props.data,
            image: ""
        };
        this.updateAvatar = this.updateAvatar.bind(this);
    }

    handleClose = () => {
        this.props.callbackOff()
    };
    handlelogOut() {
        localStorage.clear()
        window.location.href = '/dang-nhap';
    };
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
                                image: s.data.data.image.image,
                                imageName: s.data.data.image.name
                            })
                            this.update(s.data.data.image)
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
    updateAvatar() {
        this.changeAvatar.handleSaveloadClick();
    }
    changeImageCrop = (image, imageName) => {
        // const { dataUser } = this.state;
        // let param = {
        //     image: image,
        //     phone: dataUser.phone,
        //     address: dataUser.address,
        //     identification: dataUser.identification,
        //     name: dataUser.name,
        //     type: dataUser.type,
        //     email: dataUser.email,
        //     dob: dataUser.dob,
        //     status: dataUser.status,
        //     hospitalId: this.props.userApp.currentUser && this.props.userApp.currentUser.hospital && this.props.userApp.currentUser.hospital.id
        // }
        // console.log(param);
        // if ((this.props.userApp.currentUser || {}).id) {
        //     userProvider.update((this.props.userApp.currentUser || {}).id, param).then(s => {
        //         if (s && s.data && s.code === 0) {
        //             this.props.dispatch({ type: constants.action.action_change_user_info, value: s.data.user && s.data.user })
        //             dataCacheProvider.save("", constants.key.storage.change_user_info, s.data.user && s.data.user)
        //             toast.success("Cập nhật ảnh đại diện thành công!", {
        //                 position: toast.POSITION.TOP_RIGHT
        //             });
        //             // if (this.props.callbackOff) {
        //             //     this.props.callbackOff()
        //             // }
        //         } else {
        //             toast.error("Cập nhật ảnh đại diện không thành công!", {
        //                 position: toast.POSITION.TOP_RIGHT
        //             });
        //         }
        //     }).catch(e => {
        //     })
        // }
    }
    render() {
        const { classes } = this.props;
        const { dataUser, image, imageName } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                {/* <CropImage
                    ref={ref => this.changeAvatar = ref}
                    // callbackOff={this.closeModal.bind(this)}
                    changeImageCrop={this.changeImageCrop.bind(this)}
                    // handleSaveloadClick={this.handleSaveloadClick}
                />
                <Button variant="contained" color="primary" onClick={()=>this.updateAvatar()} >Lưu</Button> */}
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth={true}
                    maxWidth="sm"
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm onSubmit={this.updateAvatar}>
                        <DialogTitle id="alert-dialog-slide-title" className="change-password-index">
                            <span className="change-password-title">Cập nhật ảnh đại diện</span>
                            <IconButton onClick={() => this.handleClose()} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                                <Clear />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent className="change-password-content">
                            <Grid container spacing={16} className="change-password-body">
                                <Grid item xs={12} md={12} >
                                    <CropImage
                                        ref={ref => this.changeAvatar = ref}
                                        // callbackOff={this.closeModal.bind(this)}
                                        changeImageCrop={this.changeImageCrop.bind(this)}
                                        handleSaveloadClick={this.handleSaveloadClick}
                                    />

                                    {/* <input
                                        accept="file_extension"
                                        className={classes.input}
                                        style={{ display: 'none' }}
                                        placeholder="chọn ảnh"
                                        id="upload_logo_header"
                                        onChange={(event) => { this.uploadImage(event) }}
                                        type="file"
                                    />
                                    <label htmlFor="upload_logo_header" className="change-tilte">
                                        <input
                                            className="change-avatar"
                                            placeholder="Chọn file ảnh"
                                            value={imageName}
                                        />
                                        <div className="change-avatar-title">Chọn</div>
                                    </label>
                                    <img className="image-avatar" src={image && image.absoluteUrl()} alt="" /> */}
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions className="margin-button">
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Hủy</Button>
                            <Button variant="contained" color="primary" type="submit">Lưu</Button>
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
        color: 'red'
    },
});

export default withStyles(styles)(connect(mapStateToProps)(SetPassword));