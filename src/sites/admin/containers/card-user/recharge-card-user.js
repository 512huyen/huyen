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
import moment from 'moment';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
class CreateUpdateHospital extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            dataCardUser: [],
            value: "",
            name: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.name : '',
            nameCard: this.props.data && this.props.data.card && this.props.data.card ? this.props.data.card.name : '',
            code: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.code : '',
            createdDate: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.createdDate : '',
            dob: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.dob : '',
            phone: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.phone : '',
            gender: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.gender : '',
            passport: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.passport : '',
            issueDate: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.issueDate : '',
            codeCard: this.props.data && this.props.data.card && this.props.data.card.code ? this.props.data.card.code : '',
            transactionId: this.props.data && this.props.data.card && this.props.data.card.transactionId ? this.props.data.card.transactionId : '',
            hospitalName: this.props.data && this.props.data.card && this.props.data.card.hospital ? this.props.data.card.hospital.name : '',
            hospitalCode: this.props.data && this.props.data.card && this.props.data.card.hospital ? this.props.data.card.hospital.code : '',
            bankReturnDTO: this.props.data && this.props.data.card && this.props.data.card.bankReturnDTO ? this.props.data.card.bankReturnDTO : '',
            address: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.address : '',
        };
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
    formatCardNumber(value) {
        var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        var matches = v.match(/\d{4,16}/g);
        var match = matches ? matches[0] : []
        var parts = []
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }
        if (parts.length) {
            return parts.join(' ')
        } else {
            return value
        }
    }
    payIn = async () => {
        let { value, billId, codeCard, hospitalCode, transactionId } = this.state;
        let param = {
            amount: Number(value),
            billId: billId,
            code: codeCard,
            hospitalCode: hospitalCode,
            transactionId: transactionId
        }
        console.log(JSON.stringify(param));
        cardProvider.payIn(param).then(s => {
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
        const { name, code, codeCard, dob, gender, passport, bankReturnDTO, address, phone, hospitalName, value } = this.state;
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
                                        <Grid item xs={12} md={7} className="recharge-item-2 recharge-color">{this.formatCardNumber(codeCard)}</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Tên chủ thẻ:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">{name}</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Bệnh viện:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">{hospitalName}</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1 recharge-border-bottom">Ngân hàng:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2 recharge-border-bottom">{bankReturnDTO.name}</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1 recharge-border-top">Mã NB:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2 recharge-border-top">{code}</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Họ và tên:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">{name}</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Ngày sinh:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">{moment(dob).format("DD-MM-YYYY")}</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Giới tính:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">{gender === 1 ? "Nam" : gender === 0 ? "Nữ" : ""}</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">SĐT:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">{phone}</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Số CMND/Hộ chiếu:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">{passport}</Grid>
                                        <Grid item xs={12} md={5} className="recharge-item-1">Địa chỉ:</Grid>
                                        <Grid item xs={12} md={7} className="recharge-item-2">{address}</Grid>
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
                                                onChange={(event) => { this.setState({ value: event.target.value }); }}
                                                margin="normal"
                                                validators={['required', 'uintTextBox', 'checkValue']}
                                                errorMessages={['Vui lòng nhập số tiền!', 'Vui lòng nhập đúng định dạng tiền tệ!', 'Vui lòng nhập số tiền!']}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3} className="recharge-item-3">Nội dung</Grid>
                                        <Grid item xs={12} md={9} className="recharge-item-2">
                                            Nap tien vao the {value && value.length > 0 ? Number(value).formatPrice() : " ... "}  VND
                                        </Grid>
                                        <Grid item xs={12} md={12} style={{ marginTop: 12 }}>
                                            <DialogActions className="margin-button">
                                                <Button onClick={this.handleClose} variant="contained" className="recharge-button-cancel">Hủy bỏ</Button>
                                                <Button variant="contained" type="submit" className="recharge-button-submit color-rechange">Nạp tiền</Button>
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
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 2048,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});
export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateHospital));