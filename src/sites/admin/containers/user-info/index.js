
import React from 'react'
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import ChangePassword from './change-password';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import userProvider from '../../../../data-access/user-provider';
import imageProvider from '../../../../data-access/image-provider';
import '../../css/user-info.css'
import dataCacheProvider from '../../../../data-access/datacache-provider'
import constants from "../../../../resources/strings";
import Reply from '@material-ui/icons/Reply';
import IconButton from '@material-ui/core/IconButton';
class Wallets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            selected: [],
            progress: true,
            dataUser: this.props.userApp.currentUser,
            image: (this.props.userApp.currentUser || {}).image,
            address: (this.props.userApp.currentUser || {}).address,
            phone: (this.props.userApp.currentUser || {}).phone,
            type: (this.props.userApp.currentUser || {}).type,
            hospital: (this.props.userApp.currentUser || {}).hospital,
            tempChangePassword: [],
            confirmDialogPassword: false,
        }
        this.data = JSON.stringify(this.props.userApp.currentUser);
        this.data2 = this.props.userApp.currentUser;
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('maxLength', (value) => {
            if (value.length > 255)
                return false
            return true
        });
        ValidatorForm.addValidationRule('isEmail', (value) => {
            if (!value && value.length === 0) {
                return true
            } else {
                return value.isEmail();
            }
        });
        ValidatorForm.addValidationRule('checkSpace', (value) => {
            if (value.trim() === "")
                return false
            return true
        });
    }

    getDetail() {
        let userId = (this.props.userApp.currentUser || {}).id;
        userProvider.getDetail(userId).then(data => {
            if (data && data.code === 0 && data.data) {
                this.setState({
                    dataUser: data.data.user,
                    image: data.data.user.image,
                    phone: data.data.user.phone,
                    address: data.data.user.address
                });
            }
        }).catch(error => {
        });
    }

    closeModal() {
        this.setState({ confirmDialogPassword: false });
    }

    update = (item) => {
        const { image, phone, address, dataUser } = this.state;
        let param = {
            image: item && item.image ? item.image : image,
            phone: phone,
            address: address,
            identification: dataUser.identification,
            name: dataUser.name,
            type: dataUser.type,
            email: dataUser.email,
            dob: dataUser.dob,
            status: dataUser.status,
            hospitalId: this.props.userApp.currentUser && this.props.userApp.currentUser.hospital && this.props.userApp.currentUser.hospital.id
        }
        console.log(param);
        if ((this.props.userApp.currentUser || {}).id) {
            userProvider.update((this.props.userApp.currentUser || {}).id, param).then(s => {
                if (s && s.data && s.code === 0) {
                    this.props.dispatch({ type: constants.action.action_change_user_info, value: s.data.user && s.data.user })
                    dataCacheProvider.save("", constants.key.storage.change_user_info, s.data.user && s.data.user)
                    if (item && item.image) {
                        toast.success("Cập nhật ảnh đại diện thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    } else {
                        toast.success("Cập nhật tài khoản thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                } else {
                    if (item && item.image) {
                        toast.error("Cập nhật ảnh đại diện không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    } else {
                        toast.error("Cập nhật tài khoản không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                }
            }).catch(e => {
            })
        }
    }

    modalChangePassword(item) {
        this.setState({
            confirmDialogPassword: true,
            tempChangePassword: item
        })
    }

    uploadImage(event) {
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
                            this.setState({
                                image: s.data.data.image.image,
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

    closePopup() {
        this.getDetail()
    }
    handleHome() {
        window.location.href = '/';
    }
    render() {
        const { classes } = this.props;
        const { dataUser, image, phone, address, tempChangePassword, hospital } = this.state;
        return (
            <div>
                <Paper className={classes.root + " user-info-body"}>
                    <div className="info-hospital">
                        <div className="row">
                            <ValidatorForm onSubmit={this.update} className="user-info-form">
                                <div className="col-md-6 offset-md-3 user-info-table">
                                    {
                                        (this.props.userApp.currentUser || {}).type === 8 ?
                                            <IconButton onClick={() => this.handleHome()} color="primary" className={classes.button + " button-user-info"} aria-label="Reply">
                                                <Reply /><span className="button-user-info-item">Quay lại</span>
                                            </IconButton> : null
                                    }
                                    <h4 className="user-info-title">
                                        HỒ SƠ
                                    </h4>
                                    <div className="row">
                                        {
                                            (this.props.userApp.currentUser || {}).type === 8 ?
                                                <div className="col-md-7">
                                                    <div className="detail-info-user">
                                                        <div className="title-item">Tên đăng nhập:</div>
                                                        <div className="user-info-input-item-disabled">
                                                            <div>{dataUser.username}</div>
                                                        </div>
                                                    </div>
                                                    <div className="detail-info-user">
                                                        <div className="title-item">Họ và tên:</div>
                                                        <div className="user-info-input-item-disabled">
                                                            <div>{dataUser.name}</div>
                                                        </div>
                                                    </div>
                                                    <div className="detail-info-user">
                                                        <div className="title-item">Ngày sinh:</div>
                                                        <div className="user-info-input-item-disabled">
                                                            <div>{moment(dataUser.dob).format("DD-MM-YYYY")}</div>
                                                        </div>
                                                    </div>
                                                    <div className="detail-info-user">
                                                        <div className="title-item">Giới tính:</div>
                                                        <div className="user-info-input-item-disabled">
                                                            <div>{dataUser.gender === 1 ? "Nam" : dataUser.gender === 0 ? "Nữ" : null}</div>
                                                        </div>
                                                    </div>
                                                    <div className="user-info-input-item">
                                                        <div className="title-item">Số điện thoại: </div>
                                                        <TextValidator
                                                            value={phone}
                                                            id="name" name="name"
                                                            variant="outlined"
                                                            placeholder="Nhập tên chính thức"
                                                            className={classes.textField + " color-text-validator"}
                                                            onChange={(event) => { this.data2.phone = event.target.value; this.setState({ phone: event.target.value }); }}
                                                            margin="normal"
                                                        />
                                                    </div>
                                                    <div className="detail-info-user">
                                                        <div className="title-item">Số CMND/Hộ chiếu:</div>
                                                        <div className="user-info-input-item-disabled">
                                                            <div>{dataUser.identification}</div>
                                                        </div>
                                                    </div>
                                                    <div className="user-info-input-item">
                                                        <div className="title-item">Địa chỉ:</div>
                                                        <TextValidator
                                                            value={address}
                                                            id="name" name="name"
                                                            variant="outlined"
                                                            placeholder="Nhập tên chính thức"
                                                            className={classes.textField + " color-text-validator"}
                                                            onChange={(event) => { this.data2.address = event.target.value; this.setState({ address: event.target.value }); }}
                                                            margin="normal"
                                                        />
                                                    </div>
                                                </div>
                                                : (this.props.userApp.currentUser || {}).type === 4 ?
                                                    <div className="col-md-7">
                                                        <div className="detail-info-user">
                                                            <div className="title-item">Tên đăng nhập:</div>
                                                            <div className="user-info-input-item-disabled">
                                                                <div>{dataUser.username}</div>
                                                            </div>
                                                        </div>
                                                        <div className="detail-info-user">
                                                            <div className="title-item">Tên CSYT:</div>
                                                            <div className="user-info-input-item-disabled">
                                                                <div>{hospital && hospital.name}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : (this.props.userApp.currentUser || {}).type === 1 || (this.props.userApp.currentUser || {}).type === 2 ?
                                                        <div className="col-md-7">
                                                            <div className="detail-info-user">
                                                                <div className="title-item">Tên đăng nhập:</div>
                                                                <div className="user-info-input-item-disabled">
                                                                    <div>{dataUser.username}</div>
                                                                </div>
                                                            </div>
                                                            <div className="detail-info-user">
                                                                <div className="title-item">Họ và tên:</div>
                                                                <div className="user-info-input-item-disabled">
                                                                    <div>{dataUser.name}</div>
                                                                </div>
                                                            </div>
                                                            <div className="detail-info-user">
                                                                <div className="title-item">Ngày sinh:</div>
                                                                <div className="user-info-input-item-disabled">
                                                                    <div>{moment(dataUser.dob).format("DD/MM/YYYY")}</div>
                                                                </div>
                                                            </div>
                                                            <div className="detail-info-user">
                                                                <div className="title-item">Email:</div>
                                                                <div className="user-info-input-item-disabled">
                                                                    <div>{dataUser.email}</div>
                                                                </div>
                                                            </div>
                                                            <div className="detail-info-user">
                                                                <div className="title-item">Loại tài khoản:</div>
                                                                <div className="user-info-input-item-disabled">
                                                                    <div>{dataUser.type === 1 ? "Admin" : dataUser.type === 2 ? "Nhân viên" : null}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : null
                                        }
                                        <div className="col-md-5 user-info-avatar-right">
                                            <div className="row">
                                                <div className="col-md-12 ">
                                                    <div className="title-item-2">Ảnh đại diện:</div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="img-user-info">
                                                        <input
                                                            accept="file_extension"
                                                            className={classes.input}
                                                            style={{ display: 'none' }}
                                                            placeholder="chọn ảnh"
                                                            id="upload_logo_header"
                                                            onChange={(event) => { this.uploadImage(event) }}
                                                            type="file"
                                                        />
                                                        <label htmlFor="upload_logo_header">
                                                            <Button component="span">
                                                                {image ? <img alt="" src={image.absoluteUrl()} className="image-info" /> : <img src="/avatar.png" alt="" className="image-user-info" />}
                                                            </Button>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="user-info-password" onClick={() => this.modalChangePassword(dataUser)}>Đổi mật khẩu</div>
                                        </div>
                                        {
                                            (this.props.userApp.currentUser || {}).type === 8 ?
                                                <div className="col-md-12" style={{ textAlign: "center" }}>
                                                    <Button className="button-change-update" variant="contained" color="inherit" onClick={() => this.closePopup()}>Hủy</Button>
                                                    {
                                                        this.data !== JSON.stringify(this.data2) ?
                                                            <Button className="button-change-update change-password-color" variant="contained" color="inherit" type="submit">Lưu</Button> :
                                                            <Button className="button-change-update" variant="contained" color="inherit" type="submit" disabled>Lưu</Button>
                                                    }

                                                </div> : null
                                        }
                                    </div>
                                </div>
                            </ValidatorForm>
                        </div>
                    </div>
                </Paper>
                {this.state.confirmDialogPassword && <ChangePassword data={tempChangePassword} callbackOff={this.closeModal.bind(this)} />}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 2048,
    },
    tableWrapper: {
        overflowX: 'auto',
    }, contentClass: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
});

Wallets.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps)(Wallets));