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
import cardProvider from '../../../../data-access/card-provider';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}

String.prototype.uintTextBox = function () {
    var re = /^\d*$/;
    return re.test(this);
}

class CreateUpdateHospital extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataCard: this.props.data,
            name: this.props.data && this.props.data.card && this.props.data.card.name ? this.props.data.card.name : '',
            issueDateTaxNo: this.props.data && this.props.data.card && this.props.data.card.issueDateTaxNo ? new Date(this.props.data.card.issueDateTaxNo) : '',
            accounts: this.props.data && this.props.data.card && this.props.data.card.accounts ? this.props.data.card.accounts : "",
            code: this.props.data && this.props.data.card && this.props.data.card.code ? this.props.data.card.code : "",
            phone: this.props.data && this.props.data.card && this.props.data.card.phone ? this.props.data.card.phone : "",
            fax: this.props.data && this.props.data.card && this.props.data.card.fax ? this.props.data.card.fax : "",
            address: this.props.data && this.props.data.card && this.props.data.card.address ? this.props.data.card.address : "",
            paymentMethods: this.props.data && this.props.data.card && this.props.data.card.paymentMethods ? this.props.data.card.paymentMethods : "",
            taxNo: this.props.data && this.props.data.card && this.props.data.card.taxNo ? this.props.data.card.taxNo : "",
            logo: this.props.data && this.props.data.card && this.props.data.card.logo ? this.props.data.card.logo : '',
            status: this.props.data && this.props.data.card && this.props.data.card.status === 1 ? true : false,
            value: "",
            listPaymentMethod: this.props.listPaymentMethod
        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('checkValue', (value) => {
            if (value === "0")
                return false
            return true
        });
        ValidatorForm.addValidationRule('uintTextBox', (value) => {
            if (!value) {
                return true
            } else {
                return value.toString().uintTextBox();
            }
        });
    }

    handleClose = () => {
        this.props.callbackOff()
    };
    handlelogOut() {
        localStorage.clear()
        window.location.href = '/dang-nhap';
    };

    payIn = async () => {
        let { value } = this.state;
        let id = this.state.dataCard && this.state.dataCard.card ? this.state.dataCard.card.id : '';
        let param = {
            value: Number(value),
        }
        console.log(JSON.stringify(param));
        cardProvider.payIn(id, param).then(s => {
            switch (s.code) {
                case 0:
                    toast.success("Nạp tiền vào thẻ thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.handleClose();
                    break
                default:
                    toast.error("Nạp tiền vào thẻ không thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
            }
        }).catch(e => {
            toast.error(e.message, {
                position: toast.POSITION.TOP_RIGHT
            });
        })
    }
    render() {
        const { classes } = this.props;
        const { value } = this.state;
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
                    <ValidatorForm onSubmit={this.payIn}>
                        <DialogTitle id="alert-dialog-slide-title" className="title-popup isofh-pay-title-recharge">
                            Nạp tiền vào thẻ
                            <IconButton onClick={() => this.handleClose()} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                                <Clear />
                            </IconButton>
                            <div className="isofh-pay-img-logo">
                                <img src="/images/logonapthe.png" alt="" />
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16} className="hospital-title-header-2">
                                <Grid item xs={12} md={6} className="hospital-title hospital-title-2">Thông tin chung</Grid>
                                <Grid item xs={12} md={6} className="hospital-title hospital-title-2 hospital-title-left">Thông tin nạp tiền</Grid>
                                <Grid item xs={12} md={6} className="isofh-pay-recharge-header">
                                    <Grid container spacing={16} className="isofh-pay-recharge-index">
                                        <Grid item xs={12} md={5} className="recharge-item-1">Số thẻ: </Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2 recharge-color">1059 2346 3677 1235</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Tên chủ thẻ:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">Nguyen thi lam</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Bệnh viện:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">Bệnh viện Đại học Y Hà Nội</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1 recharge-border-bottom">Ngân hàng:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2 recharge-border-bottom">Ngân hàng thương mại cổ phần Quân đội (MBBANK)</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1 recharge-border-top">Mã NB:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2 recharge-border-top">1904002336</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Họ và tên:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">Nguyễn Thị Lam</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Ngày sinh:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">09/05/1996</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Giới tính:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">Nữ</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">SĐT:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">0973654053</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Số CMND:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">125621003</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Địa chỉ:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">Kiến Quang - An Ninh - Quỳnh Phụ - Thái Bình</Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6} >
                                    <Grid container spacing={16} className="hospital-header">
                                        <Grid item xs={12} md={12} className="recharge-item-1">Số tiền</Grid>
                                        <Grid item xs={12} md={12} className="news-title">
                                            <TextValidator
                                                value={value}
                                                type="text"
                                                variant="outlined"
                                                id="value" name="value"
                                                className={classes.textField + " color-text-validator"}
                                                onChange={(event) => { this.data2.value = event.target.value; this.setState({ value: event.target.value }); }}
                                                margin="normal"
                                                validators={['required', 'uintTextBox', 'checkValue']}
                                                errorMessages={['Vui lòng nhập số tiền!', 'Vui lòng nhập đúng định dạng tiền tệ!', 'Vui lòng nhập số tiền!']}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3} className="recharge-item-3">Nội dung</Grid>
                                        <Grid item xs={12} md={9} className="recharge-item-2">
                                            Nap tien vao the {value && value.length > 0? Number(value).formatPrice() : " ... "}  VND
                                        </Grid>
                                        <Grid item xs={12} md={12} style={{ marginTop: 12 }}>
                                            <DialogActions className="margin-button">
                                                <Button onClick={this.handleClose} variant="contained" className="recharge-button-cancel">Hủy bỏ</Button>
                                                {
                                                    this.data !== JSON.stringify(this.data2) ?
                                                        <Button variant="contained" type="submit" className="recharge-button-submit color-rechange">Nạp tiền</Button> :
                                                        <Button variant="contained" className="recharge-button-submit" style={{ color: "#000"}} disabled>Nạp tiền</Button>
                                                }
                                            </DialogActions>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
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