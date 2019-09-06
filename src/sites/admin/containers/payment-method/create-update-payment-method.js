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
import paymentAgentProvider from '../../../../data-access/paymentAgent-provider';
import paymentMethodProvider from '../../../../data-access/payment-method-provider';
import moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import imageProvider from '../../../../data-access/image-provider';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}

String.prototype.uintTextBox = function () {
    var re = /^\d*$/;
    return re.test(this);
}

var md5 = require('md5');
class CreateUpdatePaymentMethod extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataPaymentMethod: this.props.data,
            name: this.props.data && this.props.data.paymentMethod && this.props.data.paymentMethod.name ? this.props.data.paymentMethod.name : '',
            code: this.props.data && this.props.data.paymentMethod && this.props.data.paymentMethod.code ? this.props.data.paymentMethod.code : "",
            logo: this.props.data && this.props.data.paymentMethod && this.props.data.paymentMethod.logo ? this.props.data.paymentMethod.logo : '',
            paymentAgentIds: [],
            status: this.props.data && this.props.data.paymentMethod && this.props.data.paymentMethod.status == 1 ? true : false,
        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }
    componentWillMount() {
        this.getPaymentAgent();
    }
    componentDidMount() {
        ValidatorForm.addValidationRule('isPhone', (value) => {
            if (!value && value.length == 0) {
                return true
            } else {
                return value.isPhoneNumber();
            }
        });
    }
    getPaymentAgent() {
        this.setState({ progress: true })
        let params = {
            page: 1,
            size: 9999,
            status: 1,
            sortNameAbb: 1
        }
        paymentAgentProvider.search(params).then(s => {
            if (s && s.code == 0 && s.data) {
                let listPaymentAgent = s.data.data.map(item => {
                    if (this.state.dataPaymentMethod.paymentAgents) {
                        item.checked = this.state.dataPaymentMethod.paymentAgents.filter(x => x.id == item.paymentAgent.id).length > 0;
                    }
                    return item;
                });
                this.setState({
                    listPaymentAgent: listPaymentAgent
                })
            } else if (s && s.code == 97) {
                this.handlelogOut();
            } else {
                this.setState({
                    data: []
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }
    handleClose = () => {
        this.props.callbackOff()
    };
    handlelogOut() {
        // let param = JSON.parse(localStorage.getItem('isofh'));
        localStorage.clear()
        window.location.href = '/dang-nhap';
    };

    create = async () => {
        let { dataPaymentMethod, name, paymentAgentIds, code, logo, listPaymentAgent, status } = this.state;
        let id = dataPaymentMethod && dataPaymentMethod.paymentMethod ? dataPaymentMethod.paymentMethod.id : '';
        let arr = []
        arr = listPaymentAgent.filter(t => t.checked === true);
        if (id) {
            if (this.state.name.length <= 255 && this.state.logo && arr && arr.length > 0) {
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
            if (this.state.name.length <= 255 && this.state.logo && this.state.code.length <= 255 && arr && arr.length > 0) {
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
        for (let i = 0; i < arr.length; i++) {
            paymentAgentIds.push(arr[i].paymentAgent.id)
        }
        let param = {
            name: name.trim(),
            code: code.trim(),
            logo: logo,
            paymentAgentIds: paymentAgentIds,
            status: dataPaymentMethod && dataPaymentMethod.paymentMethod && dataPaymentMethod.paymentMethod.id ? (status ? 1 : 2) : 1
        }
        console.log(JSON.stringify(param));
        if (dataPaymentMethod && dataPaymentMethod.paymentMethod && dataPaymentMethod.paymentMethod.id) {
            paymentMethodProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật phương thức thanh toán thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose();
                        break
                    case 1:
                        toast.error("Mã số đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    case 97:
                        this.handlelogOut();
                        break
                    default:
                        toast.error("Cập nhật phương thức thanh toán không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        } else {
            paymentMethodProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Thêm mới phương thức thanh toán thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose();
                        break
                    case 1:
                        toast.error("Mã số đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    case 97:
                        this.handlelogOut();
                        break
                    default:
                        toast.error("Thêm mới phương thức thanh toán không thành công!", {
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
                        if (s && s.data.code == 0 && s.data.data) {
                            this.setState({
                                logo: s.data.data.images[0].image,
                            })
                            this.data2.logo = s.data.data.images[0].image;
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
    render() {
        const { classes } = this.props;
        const { dataPaymentMethod, listPaymentAgent, name, taxCode, code, phone, fax, address, nameExchange, nameAbb, type, logo } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    disableEnforceFocus={true}
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth={true}
                    maxWidth="md"
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm onSubmit={this.create}>
                        <DialogTitle id="alert-dialog-slide-title" className="title-popup">
                            {dataPaymentMethod.paymentMethod && dataPaymentMethod.paymentMethod.id ? 'Sửa thông tin phương thức thanh toán ' : 'Thêm mới phương thức thanh toán'}
                            <IconButton onClick={() => this.handleClose()} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                                <Clear />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16} className="payment-agent-body">
                                <Grid item xs={12} md={3} className="grid-title">
                                    Logo (*):
                                </Grid>
                                <Grid item xs={12} md={9} className="news-title">
                                    <input
                                        accept="image/png"
                                        className={classes.input}
                                        style={{ display: 'none' }}
                                        id="upload_logo_header"
                                        onChange={(event) => { this.data2.logo = (event.target.files[0] || {}).name; this.uploadImage(event) }}
                                        type="file"
                                    />
                                    <label htmlFor="upload_logo_header">
                                        {
                                            logo ?
                                                <img style={{ maxHeight: 150, maxWidth: 300, cursor: "pointer" }}
                                                    src={logo ? logo.absoluteUrl() : ""} /> :
                                                <img className="upload-image-create"
                                                    src="/image-icon.png" />
                                        }
                                    </label>
                                    {
                                        this.state.checkValidate && this.state.logo.toString().length == 0 ? <div className="error-dob">Vui lòng chọn logo!</div> : null
                                    }
                                </Grid>
                                <Grid item xs={12} md={3} className="grid-title-2">
                                    Tên PTTT (*):
                                </Grid>
                                <Grid item xs={12} md={9} className="news-title">
                                    <TextValidator
                                        value={name}
                                        id="name" name="name"
                                        variant="outlined"
                                        placeholder="Nhập tên PTTT"
                                        className={classes.textField + " color-text-validator"}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }); }}
                                        margin="normal"
                                    />
                                    {
                                        this.state.checkValidate && this.state.name.toString().length == 0 ? <div className="error-dob">Vui lòng nhập tên phương thức thanh toán!</div> : null
                                    }
                                    {
                                        this.state.checkValidate && this.state.name.toString().length > 255 ? <div className="error-dob">Vui lòng nhập tên phương thức thanh toán tối đa 255 kí tự!</div> : null
                                    }
                                </Grid>
                                <Grid item xs={12} md={3} className="grid-title-2">
                                    Mã số (*):
                                </Grid>
                                {
                                    dataPaymentMethod && dataPaymentMethod.paymentMethod && dataPaymentMethod.paymentMethod.id ?
                                        <Grid item xs={12} md={9} className="grid-title-2-disabled">
                                            {dataPaymentMethod.paymentMethod.code}
                                        </Grid> :
                                        <Grid item xs={12} md={9} className="news-title">
                                            <TextValidator
                                                value={code}
                                                id="code" name="code"
                                                variant="outlined"
                                                placeholder="Nhập mã số PTTT"
                                                className={classes.textField + " color-text-validator"}
                                                onChange={(event) => { this.data2.code = event.target.value; this.setState({ code: event.target.value }); }}
                                                margin="normal"
                                            />
                                            {
                                                this.state.checkValidate && this.state.code.toString().length == 0 ? <div className="error-dob">Vui lòng nhập mã số phương thức thanh toán!</div> : null
                                            }
                                            {
                                                this.state.checkValidate && this.state.code.toString().length > 255 ? <div className="error-dob">Vui lòng nhập mã số phương thức thanh toán tối đa 255 kí tự!</div> : null
                                            }
                                        </Grid>
                                }
                                <Grid item xs={12} md={3} className="grid-title-2" style={{ marginTop: 11 }}>
                                    Nhà cung cấp PTTT (*):
                                </Grid>
                                <Grid item xs={12} md={9} className="grid-title-2" style={{ marginLeft: -12 }}>
                                    <Grid container spacing={16} className="hospital-body-card">
                                        {
                                            listPaymentAgent && listPaymentAgent.length > 0 ? listPaymentAgent.map((item, index) => {
                                                return (
                                                    <Grid item xs={12} md={6} key={index} className="hospital-padding">
                                                        {item.checked ?
                                                            <Checkbox
                                                                onChange={(event) => { item.checked = !item.checked; this.data2.checked = event.target.value; this.setState({ listPaymentAgent: [...listPaymentAgent] }) }}
                                                                checked={true}
                                                            /> :
                                                            <Checkbox
                                                                onChange={(event) => { item.checked = !item.checked; this.data2.checked = event.target.value; this.setState({ listPaymentAgent: [...listPaymentAgent] }) }}
                                                                checked={false} />
                                                        }
                                                        <a className="hospital-name">{item.paymentAgent.nameAbb} ( MS: {item.paymentAgent.code})</a>
                                                    </Grid>
                                                )
                                            }) : null
                                        }
                                    </Grid>
                                    {
                                        this.state.checkValidate && listPaymentAgent.filter(t => t.checked === true).length == 0 ? <div className="error-dob3">Vui lòng nhập tên phương thức thanh toán!</div> : null
                                    }
                                </Grid>
                                {
                                    dataPaymentMethod && dataPaymentMethod.paymentMethod && dataPaymentMethod.paymentMethod.id ?
                                        <Grid item xs={12} md={3} className="grid-title-2">
                                            Trạng thái:
                                        </Grid> : null
                                }
                                {
                                    dataPaymentMethod && dataPaymentMethod.paymentMethod && dataPaymentMethod.paymentMethod.id ?
                                        <Grid item xs={12} md={9} className="checkbox-popup">
                                            <Checkbox
                                                checked={this.state.status}
                                                onChange={(event) => { this.data2.status = event.target.checked; this.setState({ status: event.target.checked }) }}
                                                value="hot"
                                            />
                                            <a>Đang hoạt động</a>
                                        </Grid>
                                        : null
                                }
                            </Grid>
                        </DialogContent>
                        <DialogActions className="margin-button">
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Hủy</Button>
                            {
                                dataPaymentMethod && dataPaymentMethod.paymentMethod && dataPaymentMethod.paymentMethod.id && this.data != JSON.stringify(this.data2) ?
                                    <Button variant="contained" color="primary" type="submit" className="button-new-submit">Cập nhật</Button> :
                                    this.data != JSON.stringify(this.data2) ?
                                        <Button variant="contained" color="primary" type="submit" className="button-new-submit">Thêm mới</Button> :
                                        dataPaymentMethod && dataPaymentMethod.paymentMethod && dataPaymentMethod.paymentMethod.id ?
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

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdatePaymentMethod));