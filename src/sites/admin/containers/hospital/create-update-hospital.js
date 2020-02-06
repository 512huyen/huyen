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
import hospitalProvider from '../../../../data-access/hospital-provider';
import moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import imageProvider from '../../../../data-access/image-provider';
import { DateBox } from '../../../../components/input-field/InputField';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import DataContants from '../../../../config/data-contants';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
class CreateUpdateHospital extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            dataHospital: this.props.data,
            name: this.props.data && this.props.data.hospital && this.props.data.hospital.name ? this.props.data.hospital.name : '',
            issueDateTaxNo: this.props.data && this.props.data.hospital && this.props.data.hospital.issueDateTaxNo ? new Date(this.props.data.hospital.issueDateTaxNo) : null,
            fileAccount: this.props.data && this.props.data.hospital && this.props.data.hospital.fileAccount ? this.props.data.hospital.fileAccount : "",
            code: this.props.data && this.props.data.hospital && this.props.data.hospital.code ? this.props.data.hospital.code : "",
            phone: this.props.data && this.props.data.hospital && this.props.data.hospital.phone ? this.props.data.hospital.phone : "",
            fax: this.props.data && this.props.data.hospital && this.props.data.hospital.fax ? this.props.data.hospital.fax : "",
            address: this.props.data && this.props.data.hospital && this.props.data.hospital.address ? this.props.data.hospital.address : "",
            paymentMethods: this.props.data && this.props.data.hospital && this.props.data.hospital.paymentMethods ? this.props.data.hospital.paymentMethods : "",
            taxNo: this.props.data && this.props.data.hospital && this.props.data.hospital.taxNo ? this.props.data.hospital.taxNo : "",
            logo: this.props.data && this.props.data.hospital && this.props.data.hospital.logo ? this.props.data.hospital.logo : '',
            status: this.props.data && this.props.data.hospital && this.props.data.hospital.status === 1 ? true : false,
            listPaymentMethod: this.props.listPaymentMethod,
            listKeyMethod: Object.keys(this.props.listPaymentMethod),
            listMethodCheckBox: [],
            fileNames: this.props.data && this.props.data.hospital && this.props.data.hospital.fileName ? this.props.data.hospital.fileName : ""
        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }
    componentWillMount() {
        this.checkPaymentMethod();
    }
    checkPaymentMethod() {
        const { dataHospital, listKeyMethod, listPaymentMethod } = this.state
        let paymentMethods = dataHospital && dataHospital.hospital && dataHospital.hospital.paymentMethods
        if (paymentMethods) {
            for (let i = 0; i < listKeyMethod.length; i++) {
                listPaymentMethod[listKeyMethod[i]].length > 0 && listPaymentMethod[listKeyMethod[i]].map(item => {
                    paymentMethods[listKeyMethod[i]] && paymentMethods[listKeyMethod[i]].length > 0 && paymentMethods[listKeyMethod[i]].map(item2 => {
                        if (item.id === item2.id) {
                            item.checked = true
                        }
                        return item2
                    })
                    return item;
                })
            }
        }
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
        this.setState({
            checkMethodValidate: true
        })
        this.reLoadDate(item)
    };
    reLoadDate(item) {
        let arr = []
        for (let i = 0; i < this.state.listKeyMethod.length; i++) {
            arr = this.state.listPaymentMethod[this.state.listKeyMethod[i]].map(item => {
                item.checked = false;
                return item
            })
        }
        if (arr && arr.length > 0) {
            this.setState({
                listCheckMethod: arr
            }, () => this.props.callbackOff(item))
        } else {
            return
        }
    }
    checkValidateMethod(option) {
        const { listPaymentMethod } = this.state;
        let data = {}
        let data3 = []
        for (let i = 0; i < this.state.listKeyMethod.length; i++) {
            let method = listPaymentMethod[this.state.listKeyMethod[i]].length > 0 && listPaymentMethod[this.state.listKeyMethod[i]].filter(item => {
                return item.checked
            }).map(item => {
                return item.id;
            })
            data[this.state.listKeyMethod[i].toString()] = method
            if (method && method.length > 0) {
                data3.push(method.length)
            }
        }
        this.setState({
            checkMethodValidate: data3.length > 0 ? false : true
        })
    }
    create = async () => {
        let { dataHospital, name, fileNames, issueDateTaxNo, code, phone, fax, address, taxNo, logo, status, listPaymentMethod, fileAccount } = this.state;
        let data = {}
        let data3 = []
        let id = this.state.dataHospital && this.state.dataHospital.hospital ? this.state.dataHospital.hospital.id : '';
        for (let i = 0; i < this.state.listKeyMethod.length; i++) {
            let method = listPaymentMethod[this.state.listKeyMethod[i]].length > 0 && listPaymentMethod[this.state.listKeyMethod[i]].filter(item => {
                return item.checked
            }).map(item => {
                return item.id;
            })
            data[this.state.listKeyMethod[i].toString()] = method
            if (method && method.length > 0) {
                data3.push(method.length)
            }
        }
        if (id) {
            if (this.state.logo && this.state.name.length <= 255 && this.state.address.length <= 255 && this.state.phone && this.state.fax && this.state.taxNo && this.state.issueDateTaxNo && data3 && data3.length > 0) {
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
            if (this.state.logo && this.state.name.length <= 255 && this.state.code.length <= 255 && this.state.address.length <= 255 && this.state.phone && this.state.fax && this.state.taxNo && this.state.issueDateTaxNo) {
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
        if (data3 && data3.length === 0) {
            toast.error("Vui lòng chọn phương thức thanh toán!", {
                position: toast.POSITION.TOP_RIGHT
            });
            return
        }
        let param = {
            address: address.trim(),
            code: code.trim(),
            fax: fax.trim(),
            name: name.trim(),
            logo: logo,
            issueDateTaxNo: moment(issueDateTaxNo).format("YYYY-MM-DD"),
            paymentMethods: data,
            phone: phone.trim(),
            taxNo: taxNo.trim(),
            status: status ? 1 : 2,
            fileAccount: fileAccount ? fileAccount : null,
            fileName: fileNames ? fileNames : null
        }
        console.log(JSON.stringify(param));
        if (dataHospital && dataHospital.hospital && dataHospital.hospital.id) {
            hospitalProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật CSYT thành công!", {
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
                        toast.error("Nhà cung cấp đã được sử dụng. Vui lòng không thay đổi!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    default:
                        toast.error("Cập nhật CSYT không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        } else {
            hospitalProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Thêm mới CSYT thành công!", {
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
                        toast.error("Nhà cung cấp đã được sử dụng. Vui lòng không thay đổi!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    default:
                        toast.error("Thêm mới CSYT không thành công!", {
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
    uploadFile(event) {
        let selector = event.target;
        let fileName = selector.value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
        if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
            imageProvider.uploadFile(event.target.files[0]).then(s => {
                if (s && s.data.code === 0 && s.data.data) {
                    this.setState({
                        fileAccount: s.data.data.file.file,
                        fileNames: s.data.data.file.name
                    })
                    this.data2.fileAccount = s.data.data.file;
                } else {
                    toast.error("Vui lòng thử lại !", {
                        position: toast.POSITION.TOP_LEFT
                    });
                }
                this.setState({ progress: false })
            }).catch(e => {
                this.setState({ progress: false })
            })
        } else {
            toast.error("Vui lòng chọn đúng định dạng file .txt", {
                position: toast.POSITION.TOP_RIGHT
            });
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
    getKeyMethod(item) {
        var status = DataContants.listPaymentMethod.filter((data) => {
            return parseInt(data.id) === Number(item)
        })
        if (status.length > 0)
            return status[0];
        return {};
    }
    render() {
        const { classes } = this.props;
        const { dataHospital, name, taxNo, code, phone, fax, address, fileNames, logo, listKeyMethod, listPaymentMethod } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    disableEnforceFocus={true}
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    maxWidth="md"
                    onClose={() => this.handleClose(false)}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm onSubmit={this.create}>
                        <DialogTitle id="alert-dialog-slide-title" className="title-popup">
                            {dataHospital.hospital && dataHospital.hospital.id ? 'Sửa thông tin CSYT ' : 'Thêm mới CSYT'}
                            <IconButton onClick={() => this.handleClose(false)} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                                <Clear />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16} className="hospital-title-header">
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={16} className="color-border-hospital hospital-header">
                                        <Grid item xs={12} md={12} className="hospital-title">Thông tin chung</Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: 10 }}>
                                                    Ảnh (*):
                                                </Grid>
                                                <Grid item xs={12} md={8} className="news-title">
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
                                                                        alt="" src={logo ? logo.absoluteUrl() : ""} />
                                                                </div> :
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
                                                <Grid item xs={12} md={4} className="grid-title-2">
                                                    Mã CSYT (*):
                                                </Grid>
                                                {
                                                    dataHospital && dataHospital.hospital && dataHospital.hospital.id ?
                                                        <Grid item xs={12} md={8} className="grid-title-2-disabled">
                                                            <div>{dataHospital.hospital.code}</div>
                                                        </Grid> :
                                                        <Grid item xs={12} md={8} className="news-title">
                                                            <TextValidator
                                                                value={code}
                                                                id="code" name="code"
                                                                variant="outlined"
                                                                placeholder="Nhập mã số CSYT"
                                                                className={classes.textField + " color-text-validator"}
                                                                onChange={(event) => { this.data2.code = event.target.value; this.setState({ code: event.target.value }); }}
                                                                margin="normal"
                                                            />
                                                            {
                                                                this.state.checkValidate && this.state.code.toString().length === 0 ? <div className="error-dob">Vui lòng nhập mã số CSYT!</div> : null
                                                            }
                                                            {
                                                                this.state.checkValidate && this.state.code.toString().length > 255 ? <div className="error-dob">Vui lòng nhập Mã số CSYT tối đa 255 ký tự!</div> : null
                                                            }
                                                        </Grid>
                                                }
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={4} className="grid-title-2">
                                                    Tên CSYT (*):
                                                </Grid>
                                                <Grid item xs={12} md={8} className="news-title">
                                                    <TextValidator
                                                        value={name}
                                                        id="name" name="name"
                                                        variant="outlined"
                                                        placeholder="Nhập tên CSYT"
                                                        className={classes.textField + " color-text-validator"}
                                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }); }}
                                                        margin="normal"
                                                    />
                                                    {
                                                        this.state.checkValidate && this.state.name.toString().length === 0 ? <div className="error-dob">Vui lòng nhập tên CSYT!</div> : null
                                                    }
                                                    {
                                                        this.state.checkValidate && this.state.name.toString().length > 255 ? <div className="error-dob">Vui lòng nhập tên CSYT tối đa 255 ký tự!</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={4} className="grid-title-2">
                                                    Địa chỉ (*):
                                                </Grid>
                                                <Grid item xs={12} md={8} className="news-title">
                                                    <TextValidator
                                                        value={address}
                                                        id="address" name="address"
                                                        variant="outlined"
                                                        placeholder="Nhập địa chỉ CSYT"
                                                        className={classes.textField + " color-text-validator"}
                                                        onChange={(event) => { this.data2.address = event.target.value; this.setState({ address: event.target.value }); }}
                                                        margin="normal"
                                                    />
                                                    {
                                                        this.state.checkValidate && this.state.address.toString().length === 0 ? <div className="error-dob">Vui lòng nhập địa chỉ CSYT!</div> : null
                                                    }
                                                    {
                                                        this.state.checkValidate && this.state.address.toString().length > 255 ? <div className="error-dob">Vui lòng nhập địa chỉ CSYT tối đa 255 ký tự!</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={4} className="grid-title-2">
                                                    SĐT (*):
                                                </Grid>
                                                <Grid item xs={12} md={8} className="news-title">
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
                                                <Grid item xs={12} md={4} className="grid-title-2">
                                                    Fax (*):
                                                </Grid>
                                                <Grid item xs={12} md={8} className="news-title">
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
                                                <Grid item xs={12} md={4} className="grid-title-2">
                                                    Mã số thuế (*):
                                                </Grid>
                                                <Grid item xs={12} md={8} className="news-title">
                                                    <TextValidator
                                                        value={taxNo}
                                                        id="taxNo" name="taxNo"
                                                        variant="outlined"
                                                        placeholder="Nhập mã số thuế"
                                                        className={classes.textField + " color-text-validator"}
                                                        onChange={(event) => { this.data2.taxNo = event.target.value; this.setState({ taxNo: event.target.value }); }}
                                                        margin="normal"
                                                        validators={['uintTextBox']}
                                                        errorMessages={['Vui lòng chỉ nhập số!']}
                                                    />
                                                    {
                                                        this.state.checkValidate && this.state.taxNo.toString().length === 0 ? <div className="error-dob">Vui lòng nhập mã số thuế!</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={4} className="grid-title-2">
                                                    Ngày cấp (*):
                                                </Grid>
                                                <Grid item xs={12} md={8} className="news-title-date">
                                                    <DateBox
                                                        isInput={true} placeholder="Nhập ngày cấp"
                                                        value={this.state.issueDateTaxNo}
                                                        onChangeValue={(event) => {
                                                            this.data2.issueDateTaxNo = event; this.setState({ issueDateTaxNo: event })
                                                        }}
                                                    />
                                                    {
                                                        this.state.checkValidate && (this.state.issueDateTaxNo === null || (this.state.issueDateTaxNo && this.state.issueDateTaxNo.length === 0)) ? <div className="error-dob" style={{ marginTop: -12 }}>Vui lòng chọn ngày cấp</div> : null
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {
                                            dataHospital && dataHospital.hospital && dataHospital.hospital.id ?
                                                <Grid item xs={12} md={12}>
                                                    <Grid container spacing={16}>
                                                        <Grid item xs={12} md={4} className="grid-title-2">
                                                            Trạng thái:
                                                        </Grid>
                                                        <Grid item xs={12} md={8} className="checkbox-popup">
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
                                        <Grid item xs={12} md={12}>
                                            <Grid container spacing={16}>
                                                <Grid item xs={12} md={4} className="grid-title-2">
                                                    DS TK HIS:
                                                </Grid>
                                                <Grid item xs={12} md={8} className="news-title">
                                                    <input
                                                        accept="file_extension"
                                                        className={classes.input}
                                                        style={{ display: 'none' }}
                                                        id="upload_file_header"
                                                        onChange={(event) => { this.data2.fileAccount = (event.target.files[0] || {}).name; this.uploadFile(event) }}
                                                        type="file"
                                                    />
                                                    <label htmlFor="upload_file_header">
                                                        {
                                                            fileNames ?
                                                                <div className="name-file">
                                                                    {fileNames}
                                                                </div> :
                                                                <Button component="span" className="button-upload file-upload" style={{ marginTop: 2, marginBottom: "auto", marginLeft: -5 }}>
                                                                    Upload
                                                        </Button>
                                                        }
                                                    </label>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={16} className="hospital-header">
                                        <Grid item xs={12} md={12} className="hospital-title">Phương thức thanh toán (*):</Grid>
                                        {
                                            listKeyMethod && listKeyMethod.length > 0 ? listKeyMethod.map((item, index) => {
                                                return (
                                                    <Grid item xs={12} md={12} className="hospital-padding" key={index}>
                                                        <span className="hospital-name">
                                                            {this.getKeyMethod(item) ? this.getKeyMethod(item).name : ""}
                                                        </span>
                                                        <Grid container spacing={16} className="hospital-body" >
                                                            {
                                                                listPaymentMethod[item] && listPaymentMethod[item].length > 0 ? listPaymentMethod[item].map((item2, index2) => {
                                                                    return (
                                                                        <Grid item xs={12} md={6} className="hospital-padding hospital-padding-style-1" key={index2}>
                                                                            {item2.checked ?
                                                                                <Checkbox
                                                                                    onChange={(event) => {
                                                                                        item2.checked = !item2.checked; this.data2.checked = event.target.value;
                                                                                        this.setState({ listPaymentMethodCreate: [...listPaymentMethod[item]] }); this.checkValidateMethod(item2)
                                                                                    }}
                                                                                    checked={true}
                                                                                    value={item2.id.toString()}
                                                                                /> :
                                                                                <Checkbox
                                                                                    onChange={(event) => {
                                                                                        item2.checked = !item2.checked; this.data2.checked = event.target.value;
                                                                                        this.setState({ listPaymentMethodCreate: [...listPaymentMethod[item]] }); this.checkValidateMethod(item2)
                                                                                    }}
                                                                                    checked={false}
                                                                                    value={item2.id.toString()}
                                                                                />
                                                                            }
                                                                            <span className="hospital-name">{item2.nameAbb}</span>
                                                                        </Grid>
                                                                    )
                                                                }) : null
                                                            }
                                                        </Grid>
                                                    </Grid>
                                                )
                                            }) : null
                                        }
                                        {
                                            this.state.checkValidate && this.state.checkMethodValidate ? <div className="error-dob" style={{ marginLeft: 40 }}>Vui lòng chọn phương thức thanh toán!</div> : null
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions className="margin-button">
                            <Button onClick={() => this.handleClose(false)} variant="contained" color="inherit">Hủy</Button>
                            {
                                dataHospital && dataHospital.hospital && dataHospital.hospital.id && this.data !== JSON.stringify(this.data2) ?
                                    <Button variant="contained" color="primary" type="submit" className="button-new-submit">Cập nhật</Button> :
                                    this.data !== JSON.stringify(this.data2) ?
                                        <Button variant="contained" color="primary" type="submit" className="button-new-submit">Thêm mới</Button> :
                                        dataHospital && dataHospital.hospital && dataHospital.hospital.id ?
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

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateHospital));