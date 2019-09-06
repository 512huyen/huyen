import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import MenuItem from '@material-ui/core/MenuItem';
import userProvider from '../../../../data-access/user-provider';
import moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import imageProvider from '../../../../data-access/image-provider';
import Clear from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}

String.prototype.uintTextBox = function () {
    var re = /^\d*$/;
    return re.test(this);
}

var md5 = require('md5');
class CreateUpdateUserHospital extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataUserHospital: this.props.data,
            listHospital: this.props.listHospital,
            hospitalId: this.props.data && this.props.data.user && this.props.data.user.hospital ? this.props.data.user.hospital.id : -1,
            username: this.props.data && this.props.data.user && this.props.data.user.username ? this.props.data.user.username : '',
            image: this.props.data && this.props.data.user && this.props.data.user.image ? this.props.data.user.image : "",
            statusActive: this.props.data && this.props.data.user && this.props.data.user.status === 1 ? true : false,
            password: '',
            nameId: -1
        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('uintTextBox', (value) => {
            if (!value) {
                return true
            } else {
                return value.toString().uintTextBox();
            }
        });
    }
    handleClose = (item) => {
        this.props.callbackOff(item)
    };
    handlelogOut() {
        // let param = JSON.parse(localStorage.getItem('isofh'));
        localStorage.clear()
        window.location.href = '/dang-nhap';
    };

    create = async () => {
        let id = this.state.dataUserHospital && this.state.dataUserHospital.user ? this.state.dataUserHospital.user.id : '';
        if (id) {
            if (this.state.nameId && this.state.username) {
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
            if (this.state.nameId && this.state.username && this.state.password.length >= 6) {
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
        let { dataUserHospital, username, password, image, statusActive, hospitalId } = this.state;
        let param = {
            hospitalId: hospitalId,
            password: password,
            type: 4,
            username: username,
            status: id ? statusActive ? 1 : 2 : null,
            image: image
        }
        console.log(JSON.stringify(param));
        if (dataUserHospital && dataUserHospital.user && dataUserHospital.user.id) {
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
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
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
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
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
                        if (s && s.data.code === 0 && s.data.data) {
                            this.setState({
                                image: s.data.data.images[0].image,
                            })
                            this.data2.image = s.data.data.images[0].image;
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
    handleDeleteImage() {
        this.state.image = '';
        this.setState({
            image: this.state.image
        })
    }
    render() {
        const { classes } = this.props;
        const { dataUserHospital, listHospital, username, password, image, hospitalId } = this.state;
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
                            {dataUserHospital.user && dataUserHospital.user.id ? 'Sửa thông tin tài khoản ' : 'Thêm mới tài khoản'}
                            <IconButton onClick={() => this.handleClose(false)} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                                <Clear />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16} className="user-create-header">
                                <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: 13 }}>
                                    Logo:
                                </Grid>
                                <Grid item xs={12} md={8} className="news-title">
                                    <input
                                        accept="image/png"
                                        className={classes.input}
                                        style={{ display: 'none' }}
                                        id="upload_logo_header"
                                        onChange={(event) => { this.data2.image = (event.target.files[0] || {}).name; this.uploadImage(event) }}
                                        type="file"
                                    />
                                    <label htmlFor="upload_logo_header" style={{ marginTop: 2, marginBottom: "auto" }}>
                                        {
                                            image ?
                                                <div style={{ marginLeft: 20, cursor: "pointer" }}>
                                                    <img style={{ height: 150 }}
                                                        src={image.absoluteUrl()} />
                                                </div> :
                                                <img className="upload-image-create"
                                                    src="/image-icon.png" />
                                        }
                                    </label>
                                </Grid>
                                {
                                    dataUserHospital && dataUserHospital.user && dataUserHospital.user.id ?
                                        <Grid item xs={12} md={4} className="grid-title-2">
                                            Username :
                                        </Grid> :
                                        <Grid item xs={12} md={4} className="grid-title-2">
                                            Tên CSYT (*):
                                        </Grid>
                                }
                                {
                                    dataUserHospital && dataUserHospital.user && dataUserHospital.user.id ?
                                        <Grid item xs={12} md={8} className="grid-title-2-disabled">
                                            {dataUserHospital.user && dataUserHospital.user.username}
                                        </Grid> :
                                        <Grid item xs={12} md={8} className="news-title-select">
                                            <SelectValidator
                                                value={hospitalId}
                                                onChange={(event) => {
                                                    this.data2.hospitalId = event.target.value;
                                                    this.setState({ hospitalId: event.target.value });
                                                }}
                                                placeholder="Chọn CSYT"
                                                variant="outlined"
                                                inputProps={{ name: 'selectDistrict', id: 'selectDistrict' }}>
                                                {
                                                    listHospital && listHospital.length && listHospital.map((option, index) =>
                                                        <MenuItem key={index} value={option.hospital.id}>{option.hospital.name}</MenuItem>
                                                    )
                                                }
                                            </SelectValidator>
                                            {
                                                this.state.checkValidate && this.state.hospitalId === -1 ? <div className="error-dob">Vui lòng chọn CSYT</div> : null
                                            }
                                        </Grid>
                                }
                                {
                                    dataUserHospital && dataUserHospital.user && dataUserHospital.user.id ?
                                        <Grid item xs={12} md={4} className="grid-title-2">
                                            Tên CSYT:
                                        </Grid> :
                                        <Grid item xs={12} md={4} className="grid-title-2">
                                            Username (*):
                                        </Grid>
                                }
                                {
                                    dataUserHospital && dataUserHospital.user && dataUserHospital.user.id ?
                                        <Grid item xs={12} md={8} className="grid-title-2-disabled">
                                            {dataUserHospital.user && dataUserHospital.user.hospital && dataUserHospital.user.hospital.name}
                                        </Grid> :
                                        <Grid item xs={12} md={8} className="news-title">
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
                                    dataUserHospital && dataUserHospital.user && dataUserHospital.user.id ?
                                        <Grid item xs={12} md={4} className="grid-title-2">
                                            Trạng thái:
                                        </Grid> :
                                        <Grid item xs={12} md={4} className="grid-title-2">
                                            Mật khẩu (*):
                                        </Grid>
                                }
                                {
                                    dataUserHospital && dataUserHospital.user && dataUserHospital.user.id ?
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
                                                this.state.checkValidate && this.state.password.trim().length != 0 && this.state.password.trim().length < 6 ? <div className="error-dob">Vui lòng nhập password ít nhất 6 ký tự</div> : null
                                            }
                                        </Grid>
                                }
                            </Grid>

                        </DialogContent>
                        <DialogActions className="margin-button">
                            <Button onClick={() => this.handleClose(false)} variant="contained" color="inherit">Hủy</Button>
                            {
                                dataUserHospital && dataUserHospital.user && dataUserHospital.user.id && this.data != JSON.stringify(this.data2) ?
                                    <Button variant="contained" color="primary" type="submit" className="button-new-submit">Cập nhật</Button> :
                                    this.data != JSON.stringify(this.data2) ?
                                        <Button variant="contained" color="primary" type="submit" className="button-new-submit">Thêm mới</Button> :
                                        dataUserHospital && dataUserHospital.user && dataUserHospital.user.id ?
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

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateUserHospital));