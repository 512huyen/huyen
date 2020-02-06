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
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import paymentAgentProvider from '../../../../data-access/paymentAgent-provider';
import moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import imageProvider from '../../../../data-access/image-provider';
import { DateBox } from '../../../../components/input-field/InputField';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import DataContants from '../../../../config/data-contants';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}
class CreateUpdatePaymentAgen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataPaymentAgent: this.props.data,
            name: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.name ? this.props.data.paymentAgent.name : '',
            issueDate: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.issueDate ? new Date(this.props.data.paymentAgent.issueDate) : null,
            taxCode: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.taxCode ? this.props.data.paymentAgent.taxCode : "",
            code: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.code ? this.props.data.paymentAgent.code : "",
            phone: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.phone ? this.props.data.paymentAgent.phone : "",
            fax: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.fax ? this.props.data.paymentAgent.fax : "",
            address: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.address ? this.props.data.paymentAgent.address : "",
            nameExchange: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.nameExchange ? this.props.data.paymentAgent.nameExchange : "",
            nameAbb: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.nameAbb ? this.props.data.paymentAgent.nameAbb : "",
            type: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.type ? this.props.data.paymentAgent.type : -1,
            paymentMethodId: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.type ? this.props.data.paymentAgent.type : -1,
            logo: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.logo ? this.props.data.paymentAgent.logo : '',
            status: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.status === 1 ? true : false,
            listPaymentMethodIds: [],
            listPaymentMethod: this.props.listPaymentMethod,
            listCheckMethod: [],
        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }
    componentWillMount() {
        this.checkPaymentMethod();
    }
    checkPaymentMethod() {
        if (this.state.listPaymentMethod && this.state.listPaymentMethod.paymentMethods && this.state.listPaymentMethod.paymentMethods.length > 0) {
            for (let i = 0; i < this.state.listPaymentMethod.paymentMethods.length; i++) {
                DataContants.listPaymentMethod.map(item => {
                    if (item.id === this.state.listPaymentMethod.paymentMethods[i]) {
                        item.checked = true
                    }
                    return item
                })
            }
        }
        this.setState({
            listCheckMethod: [...DataContants.listPaymentMethod]
        })
    }
    componentDidMount() {
        ValidatorForm.addValidationRule('isPhone', (value) => {
            if (!value && value.length === 0) {
                return true
            } else {
                return value.isPhoneNumber();
            }
        });
        ValidatorForm.addValidationRule('uintTextBox', (value) => {
            if (!value) {
                return true
            } else {
                return value.toString().uintTextBox();
            }
        });
    }
    handleClose = (item) => {
        this.reLoadDate(item)
    };
    reLoadDate(item) {
        let arr = DataContants.listPaymentMethod.map(item => {
            item.checked = false;
            return item
        })
        if (arr && arr.length > 0) {
            this.setState({
                listCheckMethod: arr
            }, () => this.props.callbackOff(item))
        } else {
            return
        }
    }

    create = async () => {
        let id = this.state.dataPaymentAgent && this.state.dataPaymentAgent.paymentAgent ? this.state.dataPaymentAgent.paymentAgent.id : '';
        if (id) {
            if (this.state.logo && this.state.nameAbb.length <= 255 && this.state.name.length <= 255 && this.state.nameExchange.length <= 255 && this.state.address.length <= 255 && this.state.phone && this.state.fax && this.state.taxCode && this.state.issueDate) {
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
            if (this.state.type !== -1 && this.state.logo && this.state.code.length <= 255 && this.state.nameAbb.length <= 255 && this.state.name.length <= 255 && this.state.nameExchange.length <= 255 && this.state.address.length <= 255 && this.state.phone && this.state.fax && this.state.taxCode && this.state.issueDate) {
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
        let { dataPaymentAgent, name, issueDate, taxCode, code, phone, fax, address, nameExchange, nameAbb, type, logo, status, listCheckMethodCreate, listCheckMethod } = this.state;
        let ids = []
        if (listCheckMethodCreate) {
            ids = listCheckMethodCreate && listCheckMethodCreate.filter(item => {
                return item.checked
            }).map(item => {
                return item.id;
            })
        } else {
            ids = listCheckMethod && listCheckMethod.filter(item => {
                return item.checked
            }).map(item => {
                return item.id;
            })
        }
        let param = {
            name: name.trim(),
            taxCode: taxCode.trim(),
            address: address,
            code: code,
            phone: phone,
            fax: fax,
            nameExchange: nameExchange,
            nameAbb: nameAbb,
            issueDate: moment(issueDate).format("YYYY-MM-DD"),
            type: type,
            logo: logo,
            status: status ? 1 : 2,
            paymentMethods: ids
        }
        console.log(JSON.stringify(param));
        if (dataPaymentAgent && dataPaymentAgent.paymentAgent && dataPaymentAgent.paymentAgent.id) {
            paymentAgentProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật nhà cung cấp thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose(true);
                        break
                    case 1:
                        toast.error("Mã số đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    case 2:
                        toast.error("Phương thức thanh toán đã được sử dụng, vui lòng không thay đổi!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    default:
                        toast.error("Cập nhật nhà cung cấp không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        } else {
            paymentAgentProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Thêm mới nhà cung cấp thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose(true);
                        break
                    case 1:
                        toast.error("Mã số đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    default:
                        toast.error("Thêm mới nhà cung cấp không thành công!", {
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
    listCheckMethod(event, item) {
        item.checked = !item.checked;
        this.setState({
            listCheckMethodCreate: [...this.state.listCheckMethod]
        })
    }
    render() {
        const { classes } = this.props;
        const { dataPaymentAgent, name, taxCode, code, phone, fax, address, nameExchange, nameAbb, type, logo, listCheckMethod } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    disableEnforceFocus={true}
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth={true}
                    maxWidth="md"
                    onClose={() => this.handleClose(false)}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm onSubmit={this.create}>
                        <DialogTitle id="alert-dialog-slide-title" className="title-popup">
                            {dataPaymentAgent.paymentAgent && dataPaymentAgent.paymentAgent.id ? 'Sửa thông tin nhà cung cấp ' : 'Thêm mới nhà cung cấp'}
                            <IconButton onClick={() => this.handleClose(false)} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                                <Clear />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16} className="user-create-header">
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={16} className="payment-agent-title-left">
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={5} className="grid-title" style={{ marginTop: 12 }}>
                                                    Logo (*):
                                                </Grid>
                                                <Grid item xs={12} md={7} className="news-title" >
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
                                                                <img style={{ maxHeight: 150, maxWidth: 250, marginLeft: 18, cursor: "pointer" }}
                                                                    src={logo ? logo.absoluteUrl() : ""} alt="" /> :
                                                                <img className="upload-image-create" alt=""
                                                                    src="/image-icon.png" />
                                                        }
                                                    </label>
                                                    {
                                                        this.state.checkValidate && this.state.logo.toString().length === 0 ? <div className="error-dob">Vui lòng chọn logo!</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={5} className="grid-title-2">
                                                    Loại nhà cung cấp (*):
                                                </Grid>
                                                <Grid item xs={12} md={7} className="news-title-select">
                                                    <SelectValidator
                                                        value={type}
                                                        onChange={(event) => {
                                                            this.data2.type = event.target.value;
                                                            this.setState({ type: event.target.value });
                                                        }}
                                                        placeholder="Chọn nhà cung cấp"
                                                        variant="outlined"
                                                        inputProps={{ name: 'selectDistrict', id: 'selectDistrict' }}>
                                                        <MenuItem value='-1'>Chọn nhà cung cấp</MenuItem>
                                                        <MenuItem value='1'>Ngân hàng</MenuItem>
                                                        <MenuItem value='2'>Nhà cung cấp khác</MenuItem>
                                                    </SelectValidator>
                                                    {
                                                        this.state.checkValidate && this.state.type === -1 ? <div className="error-dob">Vui lòng chọn nhà cung cấp!</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={12} className="grid-title-2 payment-agent-method-left">
                                                    Phương thức thanh toán:
                                                </Grid>
                                                <Grid item xs={12} md={12} className="news-title-select">
                                                    <Grid container spacing={16} className="paymentMethod-title">
                                                        {
                                                            listCheckMethod && listCheckMethod.length > 0 && listCheckMethod.map((item, index) => {
                                                                return (
                                                                    <Grid key={index} item xs={12} md={6} className="paymentMethod-index">
                                                                        <div className="paymentMethod-item">
                                                                            {
                                                                                item.checked ?
                                                                                    <Checkbox
                                                                                        checked={true}
                                                                                        onChange={(event) => { this.data2.checked = event.target.value; this.listCheckMethod(event, item) }}
                                                                                        value={item.id.toString()}
                                                                                    /> :
                                                                                    <Checkbox
                                                                                        checked={false}
                                                                                        onChange={(event) => { this.data2.checked = event.target.value; this.listCheckMethod(event, item) }}
                                                                                        value={item.id.toString()}
                                                                                    />
                                                                            } <p className="hospital-name">{item.name}</p>
                                                                        </div>
                                                                    </Grid>
                                                                )
                                                            })
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={16} className="payment-agent-title-right">
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={5} className="grid-title-2">
                                                    Mã số:
                                                </Grid>
                                                {
                                                    dataPaymentAgent && dataPaymentAgent.paymentAgent && dataPaymentAgent.paymentAgent.id ?
                                                        <Grid item xs={12} md={7} className="grid-title-2-disabled">
                                                            <div>{dataPaymentAgent.paymentAgent.code}</div>
                                                        </Grid> :
                                                        <Grid item xs={12} md={7} className="news-title">
                                                            <TextValidator
                                                                value={code}
                                                                id="code" name="code"
                                                                variant="outlined"
                                                                placeholder="Nhập mã số nhà cung cấp"
                                                                className={classes.textField + " color-text-validator"}
                                                                onChange={(event) => { this.data2.code = event.target.value; this.setState({ code: event.target.value }); }}
                                                                margin="normal"
                                                            />
                                                            {
                                                                this.state.checkValidate && this.state.code.toString().length === 0 ? <div className="error-dob">Vui lòng nhập mã số nhà cung cấp!</div> : null
                                                            }
                                                            {
                                                                this.state.checkValidate && this.state.code.toString().length > 255 ? <div className="error-dob">Vui lòng nhập Mã số nhà cung cấp tối đa 255 ký tự!</div> : null
                                                            }
                                                        </Grid>
                                                }
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={5} className="grid-title-2">
                                                    Tên viết tắt (*):
                                                </Grid>
                                                <Grid item xs={12} md={7} className="news-title">
                                                    <TextValidator
                                                        value={nameAbb}
                                                        id="nameAbb" name="nameAbb"
                                                        variant="outlined"
                                                        placeholder="Nhập tên viết tắt"
                                                        className={classes.textField + " color-text-validator"}
                                                        onChange={(event) => { this.data2.nameAbb = event.target.value; this.setState({ nameAbb: event.target.value }); }}
                                                        margin="normal"
                                                    />
                                                    {
                                                        this.state.checkValidate && this.state.nameAbb.toString().length === 0 ? <div className="error-dob">Vui lòng nhập tên viết tắt!</div> : null
                                                    }
                                                    {
                                                        this.state.checkValidate && this.state.nameAbb.toString().length > 255 ? <div className="error-dob">Vui lòng nhập tên viết tắt tối đa 255 ký tự!</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={5} className="grid-title-2">
                                                    Tên chính thức (*):
                                                </Grid>
                                                <Grid item xs={12} md={7} className="news-title">
                                                    <TextValidator
                                                        value={name}
                                                        id="name" name="name"
                                                        variant="outlined"
                                                        placeholder="Nhập tên chính thức"
                                                        className={classes.textField + " color-text-validator"}
                                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }); }}
                                                        margin="normal"
                                                    />
                                                    {
                                                        this.state.checkValidate && this.state.name.toString().length === 0 ? <div className="error-dob">Vui lòng nhập tên chính thức!</div> : null
                                                    }
                                                    {
                                                        this.state.checkValidate && this.state.name.toString().length > 255 ? <div className="error-dob">Vui lòng nhập tên chính thức tối đa 255 ký tự!</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={5} className="grid-title-2">
                                                    Tên giao dịch (*):
                                                </Grid>
                                                <Grid item xs={12} md={7} className="news-title">
                                                    <TextValidator
                                                        value={nameExchange}
                                                        id="nameExchange" name="nameExchange"
                                                        variant="outlined"
                                                        placeholder="Nhập tên giao dịch"
                                                        className={classes.textField + " color-text-validator"}
                                                        onChange={(event) => { this.data2.nameExchange = event.target.value; this.setState({ nameExchange: event.target.value }); }}
                                                        margin="normal"
                                                    />
                                                    {
                                                        this.state.checkValidate && this.state.nameExchange.toString().length === 0 ? <div className="error-dob">Vui lòng nhập tên giao dịch!</div> : null
                                                    }
                                                    {
                                                        this.state.checkValidate && this.state.nameExchange.toString().length > 255 ? <div className="error-dob">Vui lòng nhập tên giao dịch tối đa 255 ký tự!</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={5} className="grid-title-2">
                                                    Địa chỉ (*):
                                                </Grid>
                                                <Grid item xs={12} md={7} className="news-title">
                                                    <TextValidator
                                                        value={address}
                                                        id="address" name="address"
                                                        variant="outlined"
                                                        placeholder="Nhập địa chỉ"
                                                        className={classes.textField + " color-text-validator"}
                                                        onChange={(event) => { this.data2.address = event.target.value; this.setState({ address: event.target.value }); }}
                                                        margin="normal"
                                                    />
                                                    {
                                                        this.state.checkValidate && this.state.address.toString().length === 0 ? <div className="error-dob">Vui lòng nhập địa chỉ!</div> : null
                                                    }
                                                    {
                                                        this.state.checkValidate && this.state.address.toString().length > 255 ? <div className="error-dob">Vui lòng nhập địa chỉ tối đa 255 ký tự!</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={5} className="grid-title-2">
                                                    SĐT (*):
                                                </Grid>
                                                <Grid item xs={12} md={7} className="news-title">
                                                    <TextValidator
                                                        value={phone}
                                                        id="phone" name="phone"
                                                        variant="outlined"
                                                        placeholder="Nhập số điện thoại"
                                                        className={classes.textField + " color-text-validator"}
                                                        onChange={(event) => { this.data2.phone = event.target.value; this.setState({ phone: event.target.value }); }}
                                                        margin="normal"
                                                        validators={['isPhone']}
                                                        errorMessages={['Vui lòng nhập đúng định dạng số điện thoại']}
                                                    />
                                                    {
                                                        this.state.checkValidate && this.state.phone.toString().length === 0 ? <div className="error-dob">Vui lòng nhập số điện thoại!</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={5} className="grid-title-2">
                                                    Fax (*):
                                                </Grid>
                                                <Grid item xs={12} md={7} className="news-title">
                                                    <TextValidator
                                                        value={fax}
                                                        id="fax" name="fax"
                                                        variant="outlined"
                                                        placeholder="Nhập số fax"
                                                        className={classes.textField + " color-text-validator"}
                                                        onChange={(event) => { this.data2.fax = event.target.value; this.setState({ fax: event.target.value }); }}
                                                        margin="normal"
                                                        validators={['uintTextBox']}
                                                        errorMessages={['Vui lòng chỉ nhập số!']}
                                                    />
                                                    {
                                                        this.state.checkValidate && this.state.fax.toString().length === 0 ? <div className="error-dob">Vui lòng nhập số Fax!</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={5} className="grid-title-2">
                                                    Mã số thuế (*):
                                                </Grid>
                                                <Grid item xs={12} md={7} className="news-title">
                                                    <TextValidator
                                                        value={taxCode}
                                                        id="taxCode" name="taxCode"
                                                        variant="outlined"
                                                        placeholder="Nhập mã số thuế"
                                                        className={classes.textField + " color-text-validator"}
                                                        onChange={(event) => { this.data2.taxCode = event.target.value; this.setState({ taxCode: event.target.value }); }}
                                                        margin="normal"
                                                        validators={['uintTextBox']}
                                                        errorMessages={['Vui lòng chỉ nhập số!']}
                                                    />
                                                    {
                                                        this.state.checkValidate && this.state.taxCode.toString().length === 0 ? <div className="error-dob">Vui lòng nhập mã số thuế!</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={5} className="grid-title-2">
                                                    Ngày cấp (*):
                                                </Grid>
                                                <Grid item xs={12} md={7} className="news-title-date">
                                                    <DateBox
                                                        isInput={true} placeholder="Nhập ngày cấp"
                                                        value={this.state.issueDate}
                                                        onChangeValue={(event) => {
                                                            this.data2.issueDate = event; this.setState({ issueDate: event })
                                                        }}
                                                    />
                                                    {
                                                        this.state.checkValidate && (this.state.issueDate === null || (this.state.issueDate && this.state.issueDate.length === 0)) ? <div className="error-dob" style={{ marginTop: -12 }}>Vui lòng chọn ngày cấp</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {
                                            dataPaymentAgent && dataPaymentAgent.paymentAgent && dataPaymentAgent.paymentAgent.id ?
                                                <Grid item xs={12} md={12}>
                                                    <Grid container spacing={16}>
                                                        <Grid item xs={12} md={5} className="grid-title-2">
                                                            Trạng thái:
                                                        </Grid>
                                                        <Grid item xs={12} md={7} className="checkbox-popup">
                                                            <Checkbox
                                                                checked={this.state.status}
                                                                onChange={(event) => { this.data2.status = event.target.checked; this.setState({ status: event.target.checked }) }}
                                                                value="hot"
                                                            />
                                                            <span>Đang hoạt động</span>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                : null
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions className="margin-button">
                            <Button onClick={() => this.handleClose(false)} variant="contained" color="inherit">Hủy</Button>
                            {
                                dataPaymentAgent && dataPaymentAgent.paymentAgent && dataPaymentAgent.paymentAgent.id && this.data !== JSON.stringify(this.data2) ?
                                    <Button variant="contained" color="primary" type="submit" className="button-new-submit">Cập nhật</Button> :
                                    this.data !== JSON.stringify(this.data2) ?
                                        <Button variant="contained" color="primary" type="submit" className="button-new-submit">Thêm mới</Button> :
                                        dataPaymentAgent && dataPaymentAgent.paymentAgent && dataPaymentAgent.paymentAgent.id ?
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

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdatePaymentAgen));