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
import stringUtils from 'mainam-react-native-string-utils';
import hospitalBankProvider from '../../../../data-access/hospital-bank-provider';
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

class CreateUpdateBankCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataHospitalBank: this.props.data,
            listPaymentAgent: this.props.listPaymentAgent,
            dataHospital: this.props.dataHospital,
            hospitalId: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.hospital && this.props.data.hospitalBank.hospital.id ? this.props.data.hospitalBank.hospital.id : -1,
            issuedDate: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.issuedDate ? new Date(this.props.data.hospitalBank.issuedDate) : null,
            accountNo: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.accountNo ? this.props.data.hospitalBank.accountNo : "",
            bank: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.bank ? this.props.data.hospitalBank.bank : "",
            brand: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.brand ? this.props.data.hospitalBank.brand : "",
            cardNo: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.cardNo ? this.props.data.hospitalBank.cardNo : "",
            paymentAgentId: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.paymentAgent ? this.props.data.hospitalBank.paymentAgent.id : -1,
            paymentMethod: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.paymentMethod ? this.props.data.hospitalBank.paymentMethod : -1,
            accountName: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.accountName ? this.props.data.hospitalBank.accountName : "",
            type: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.type ? this.props.data.hospitalBank.type : -1,
            status: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.status === 1 ? true : false,
            checkValidate: false
        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }

    handleClose = () => {
        this.props.callbackOff()
    };
    handlelogOut() {
        localStorage.clear()
        window.location.href = '/dang-nhap';
    };

    create = async () => {
        let id = this.state.dataHospitalBank && this.state.dataHospitalBank.hospitalBank ? this.state.dataHospitalBank.hospitalBank.id : '';
        if (id) {
            if (this.state.type !== -1 && this.state.paymentMethod !== -1 && this.state.accountName.length <= 255 && this.state.accountNo.length <= 255 && this.state.bank.length <= 255 && this.state.brand.length <= 255 && this.state.cardNo.length <= 255 && this.state.issuedDate && this.state.paymentMethod !== -1) {
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
            if (this.state.type !== -1 && this.state.paymentMethod !== -1 && this.state.accountName.length <= 255 && this.state.accountNo.length <= 255 && this.state.bank.length <= 255 && this.state.brand.length <= 255 && this.state.cardNo.length <= 255 && this.state.hospitalId !== -1 && this.state.issuedDate && this.state.paymentMethod !== -1) {
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
        let { dataHospitalBank, accountName, accountNo, bank, brand, cardNo, hospitalId, issuedDate, paymentAgentId, type, paymentMethod, status } = this.state;
        let param = {
            accountName: accountName.trim(),
            accountNo: accountNo.trim(),
            bank: bank,
            brand: brand,
            cardNo: cardNo,
            hospitalId: hospitalId,
            paymentAgentId: paymentAgentId,
            issuedDate: moment(issuedDate).format("YYYY-MM-DD"),
            type: type,
            paymentMethod: paymentMethod,
            status: status ? 1 : 2
        }
        console.log(JSON.stringify(param));
        if (dataHospitalBank && dataHospitalBank.hospitalBank && dataHospitalBank.hospitalBank.id) {
            hospitalBankProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật CSYT thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose();
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
            hospitalBankProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Thêm mới CSYT thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose();
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
        const { dataHospitalBank, cardNo, hospitalId, dataHospital, accountNo, accountName, bank, paymentMethod, paymentAgentId, brand, type, listPaymentAgent } = this.state;
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
                            {dataHospitalBank.hospitalBank && dataHospitalBank.hospitalBank.id ? 'Sửa thông tin tài khoản ngân hàng của CSYT ' : 'Thêm mới thẻ ngân hàng của CSYT'}
                            <IconButton onClick={() => this.handleClose()} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                                <Clear />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16} className="hospital-title-header">
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={16} className="color-border-hospital hospital-header">
                                        <Grid item xs={12} md={12} className="hospital-title title-bottom">Thông tin chung</Grid>
                                        <Grid item xs={12} md={5} className="grid-title-2">
                                            Tên CSYT (*):
                                        </Grid>
                                        {
                                            dataHospitalBank && dataHospitalBank.hospitalBank && dataHospitalBank.hospitalBank.id ?
                                                <Grid item xs={12} md={7} className="grid-title-2-disabled">
                                                    <div>{dataHospitalBank.hospitalBank && dataHospitalBank.hospitalBank.hospital && dataHospitalBank.hospitalBank.hospital.name}</div>
                                                </Grid> :
                                                <Grid item xs={12} md={7} className="news-title-select">
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
                                                            dataHospital && dataHospital.length && dataHospital.map((option, index) =>
                                                                <MenuItem key={index} value={option.hospital.id}>{option.hospital.id === -1 ? "Chọn CSYT" : option.hospital.name}</MenuItem>
                                                            )
                                                        }
                                                    </SelectValidator>
                                                    {
                                                        this.state.checkValidate && this.state.hospitalId === -1 ? <div className="error-dob">Vui lòng chọn tên CSYT!</div> : null
                                                    }
                                                </Grid>
                                        }
                                        <Grid item xs={12} md={5} className="grid-title-2">
                                            Loại tài khoản (*):
                                        </Grid>
                                        <Grid item xs={12} md={7} className="news-title-select">
                                            <SelectValidator
                                                value={type}
                                                onChange={(event) => {
                                                    this.data2.type = event.target.value;
                                                    this.setState({ type: event.target.value });
                                                }}
                                                placeholder="Chọn loại tài khoản"
                                                variant="outlined"
                                                inputProps={{ name: 'selectDistrict', id: 'selectDistrict' }}>
                                                <MenuItem value='-1'>Chọn loại tài khoản</MenuItem>
                                                <MenuItem value='1'>Chuyên thu</MenuItem>
                                                <MenuItem value='2'>Chuyên chi</MenuItem>
                                            </SelectValidator>
                                            {
                                                this.state.checkValidate && this.state.type === -1 ? <div className="error-dob">Vui lòng chọn loại tài khoản!</div> : null
                                            }
                                        </Grid>
                                        <Grid item xs={12} md={5} className="grid-title-2">
                                            PTTT (*):
                                        </Grid>
                                        <Grid item xs={12} md={7} className="news-title-select">
                                            <SelectValidator
                                                value={paymentMethod}
                                                onChange={(event) => {
                                                    this.data2.paymentMethod = event.target.value;
                                                    this.setState({ paymentMethod: event.target.value });
                                                }}
                                                placeholder="Chọn PTTTT"
                                                variant="outlined"
                                                inputProps={{ name: 'selectPaymentMethod', id: 'selectPaymentMethod' }}>
                                                {
                                                    DataContants.listPaymentMethodCreate && DataContants.listPaymentMethodCreate.length > 0 && DataContants.listPaymentMethodCreate.map((option, index) =>
                                                        <MenuItem key={index} value={option.id}>{option.name}</MenuItem>
                                                    )
                                                }
                                            </SelectValidator>
                                            {
                                                this.state.checkValidate && this.state.paymentMethod === -1 ? <div className="error-dob">Vui lòng chọn phương thức thanh toán!</div> : null
                                            }
                                        </Grid>
                                        <Grid item xs={12} md={5} className="grid-title-2">
                                            Nhà cung cấp DV (*):
                                        </Grid>
                                        <Grid item xs={12} md={7} className="news-title-select">
                                            <SelectValidator
                                                value={paymentAgentId}
                                                onChange={(event) => {
                                                    this.data2.paymentAgentId = event.target.value;
                                                    this.setState({ paymentAgentId: event.target.value });
                                                }}
                                                placeholder="Chọn nhà cung cấp"
                                                variant="outlined"
                                                inputProps={{ name: 'selectDistrict', id: 'selectDistrict' }}>
                                                {
                                                    listPaymentAgent && listPaymentAgent.length && listPaymentAgent.map((option, index) =>
                                                        <MenuItem key={index} value={option.paymentAgent.id}>{option.paymentAgent.id === -1 ? "Chọn nhà cung cấp DV" : option.paymentAgent.nameAbb}</MenuItem>
                                                    )
                                                }
                                            </SelectValidator>
                                            {
                                                this.state.checkValidate && this.state.paymentAgentId === -1 ? <div className="error-dob">Vui lòng chọn nhà cung cấp DV!</div> : null
                                            }
                                        </Grid>
                                        {
                                            dataHospitalBank && dataHospitalBank.hospitalBank && dataHospitalBank.hospitalBank.id ?
                                                <Grid item xs={12} md={5} className="grid-title-2">
                                                    Trạng thái:
                                                </Grid> : null
                                        }
                                        {
                                            dataHospitalBank && dataHospitalBank.hospitalBank && dataHospitalBank.hospitalBank.id ?
                                                <Grid item xs={12} md={7} className="checkbox-popup">
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
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={16} className="hospital-header">
                                        <Grid item xs={12} md={12} className="hospital-title title-bottom">Thông tin tài khoản</Grid>
                                        <Grid item xs={12} md={5} className="grid-title-2">
                                            Số thẻ (*):
                                        </Grid>
                                        <Grid item xs={12} md={7} className="news-title">
                                            <TextValidator
                                                value={cardNo}
                                                id="cardNo" name="cardNo"
                                                variant="outlined"
                                                placeholder="Nhập số thẻ"
                                                className={classes.textField + " color-text-validator"}
                                                onChange={(event) => { this.data2.cardNo = event.target.value; this.setState({ cardNo: event.target.value }); }}
                                                margin="normal"
                                            />
                                            {
                                                this.state.checkValidate && this.state.cardNo.toString().length === 0 ? <div className="error-dob">Vui lòng nhập số thẻ!</div> : null
                                            }
                                            {
                                                this.state.checkValidate && this.state.cardNo.toString().length > 255 ? <div className="error-dob">Vui lòng nhập số thẻ tối đa 255 ký tự!</div> : null
                                            }
                                        </Grid>
                                        <Grid item xs={12} md={5} className="grid-title-2">
                                            Số tài khoản (*):
                                        </Grid>
                                        <Grid item xs={12} md={7} className="news-title">
                                            <TextValidator
                                                value={accountNo}
                                                id="accountNo" name="accountNo"
                                                variant="outlined"
                                                placeholder="Nhập số tài khoản"
                                                className={classes.textField + " color-text-validator"}
                                                onChange={(event) => { this.data2.accountNo = event.target.value; this.setState({ accountNo: event.target.value }); }}
                                                margin="normal"
                                            />
                                            {
                                                this.state.checkValidate && this.state.accountNo.toString().length === 0 ? <div className="error-dob">Vui lòng nhập số tài khoản!</div> : null
                                            }
                                            {
                                                this.state.checkValidate && this.state.accountNo.toString().length > 255 ? <div className="error-dob">Vui lòng nhập số tài khoản tối đa 255 ký tự!</div> : null
                                            }
                                        </Grid>
                                        <Grid item xs={12} md={5} className="grid-title-2">
                                            Tên chủ thẻ (*):
                                        </Grid>
                                        <Grid item xs={12} md={7} className="news-title">
                                            <TextValidator
                                                value={accountName}
                                                id="accountName" name="accountName"
                                                variant="outlined"
                                                placeholder="Nhập tên chủ thẻ"
                                                className={classes.textField + " color-text-validator"}
                                                onChange={(event) => { this.data2.accountName = event.target.value; this.setState({ accountName: event.target.value }); }}
                                                margin="normal"
                                            />
                                            {
                                                this.state.checkValidate && this.state.accountName.toString().length === 0 ? <div className="error-dob">Vui lòng nhập tên chủ thẻ!</div> : null
                                            }
                                            {
                                                this.state.checkValidate && this.state.accountName.toString().length > 255 ? <div className="error-dob">Vui lòng nhập tên chủ thẻ tối đa 255 ký tự!</div> : null
                                            }
                                        </Grid>
                                        <Grid item xs={12} md={5} className="grid-title-2">
                                            Ngân hàng (*):
                                        </Grid>
                                        <Grid item xs={12} md={7} className="news-title">
                                            <TextValidator
                                                value={bank}
                                                id="bank" name="bank"
                                                variant="outlined"
                                                placeholder="Nhập tên ngân hàng"
                                                className={classes.textField + " color-text-validator"}
                                                onChange={(event) => { this.data2.bank = event.target.value; this.setState({ bank: event.target.value }); }}
                                                margin="normal"
                                            />
                                            {
                                                this.state.checkValidate && this.state.bank.toString().length === 0 ? <div className="error-dob">Vui lòng nhập tên ngân hàng!</div> : null
                                            }
                                            {
                                                this.state.checkValidate && this.state.bank.toString().length > 255 ? <div className="error-dob">Vui lòng nhập tên ngân hàng tối đa 255 ký tự!</div> : null
                                            }
                                        </Grid>
                                        <Grid item xs={12} md={5} className="grid-title-2">
                                            Chi nhánh (*):
                                        </Grid>
                                        <Grid item xs={12} md={7} className="news-title">
                                            <TextValidator
                                                value={brand}
                                                id="brand" name="brand"
                                                variant="outlined"
                                                placeholder="Nhập tên chi nhánh"
                                                className={classes.textField + " color-text-validator"}
                                                onChange={(event) => { this.data2.brand = event.target.value; this.setState({ brand: event.target.value }); }}
                                                margin="normal"
                                            />
                                            {
                                                this.state.checkValidate && this.state.brand.toString().length === 0 ? <div className="error-dob">Vui lòng nhập tên chi nhánh!</div> : null
                                            }
                                            {
                                                this.state.checkValidate && this.state.brand.toString().length > 255 ? <div className="error-dob">Vui lòng nhập tên chi nhánh tối đa 255 ký tự!</div> : null
                                            }
                                        </Grid>
                                        <Grid item xs={12} md={5} className="grid-title-2">
                                            Ngày phát hành (*):
                                        </Grid>
                                        <Grid item xs={12} md={7} className="news-title-date">
                                            <DateBox
                                                isInput={true} placeholder="Nhập ngày phát hành"
                                                value={this.state.issuedDate}
                                                onChangeValue={(event) => {
                                                    this.data2.issuedDate = event; this.setState({ issuedDate: event })
                                                }}
                                            />
                                            {
                                                this.state.checkValidate && ((this.state.issuedDate && this.state.issuedDate.length === 0) || this.state.issuedDate === null) ? <div className="error-dob" style={{ marginTop: -12 }}>Vui lòng chọn ngày phát hành!</div> : null
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions className="margin-button">
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Hủy</Button>
                            {
                                dataHospitalBank && dataHospitalBank.hospitalBank && dataHospitalBank.hospitalBank.id && this.data != JSON.stringify(this.data2) ?
                                    <Button variant="contained" color="primary" type="submit" className="button-new-submit">Cập nhật</Button> :
                                    this.data != JSON.stringify(this.data2) ?
                                        <Button variant="contained" color="primary" type="submit" className="button-new-submit">Thêm mới</Button> :
                                        dataHospitalBank && dataHospitalBank.hospitalBank && dataHospitalBank.hospitalBank.id ?
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

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateBankCard));