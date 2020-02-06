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
import cardTransferHistoryProvider from '../../../../data-access/card-transfer-history-provider';
import moment from 'moment';
import { DateBox } from '../../../../components/input-field/InputField';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Clear from '@material-ui/icons/Clear';
import Radio from '@material-ui/core/Radio';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
class CreateUpdateCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataCard: this.props.data,
            listHospitalCreate: this.props.listHospitalCreate,
            listPaymentMethodsHospital: this.props.listPaymentMethodsHospital,
            listBank: this.props.listBank,
            transferUser: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.transferUser ? this.props.data.cardTransferHistory.transferUser : '',
            hospitalId: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.hospital && this.props.data.cardTransferHistory.hospital.id ? this.props.data.cardTransferHistory.hospital.id : this.props.hospitalId,
            quantity: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.quantity ? this.props.data.cardTransferHistory.quantity : '',
            cardNoFrom: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.cardNoFrom ? this.props.data.cardTransferHistory.cardNoFrom : '',
            cardNoTo: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.cardNoTo ? this.props.data.cardTransferHistory.cardNoTo : '',
            transferDate: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.transferDate ? new Date(this.props.data.cardTransferHistory.transferDate) : null,
            bankId: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.bank && this.props.data.cardTransferHistory.bank.id ? this.props.data.cardTransferHistory.bank.id.toString() : -1,
            paymentAgentId: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.paymentAgent && this.props.data.cardTransferHistory.paymentAgent.id ? this.props.data.cardTransferHistory.paymentAgent.id.toString() : -1,
            checkValidate: false,
            receiverUser: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.receiverUser ? this.props.data.cardTransferHistory.receiverUser : '',
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
        ValidatorForm.addValidationRule('uintTextBox', (value) => {
            if (!value) {
                return true
            } else {
                return value.toString().uintTextBox();
            }
        });
    }
    handleClose = (hospitalId) => {
        this.props.callbackOff(hospitalId)
    };
    create = async () => {
        let id = this.state.dataCard && this.state.dataCard.cardTransferHistory ? this.state.dataCard.cardTransferHistory.id : '';
        if (id) {
            if (this.state.transferUser.length <= 255 && this.state.receiverUser.length <= 255 && this.state.hospitalId !== -1 && this.state.paymentAgentId !== -1) {
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
            if (this.state.transferUser.length <= 255 && this.state.receiverUser.length <= 255 && this.state.transferDate && this.state.hospitalId !== -1 && this.state.paymentAgentId !== -1 && this.state.quantity) {
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
        let { dataCard, transferUser, paymentAgentId, receiverUser, hospitalId, quantity, transferDate, bankId, cardNoTo, cardNoFrom } = this.state;
        let param = {
            transferUser: transferUser.trim(),
            receiverUser: receiverUser.trim(),
            hospitalId: hospitalId,
            paymentAgentId: paymentAgentId,
            quantity: quantity,
            cardNoFrom: cardNoFrom,
            cardNoTo: cardNoTo,
            transferDate: moment(transferDate).format("YYYY-MM-DD"),
            bankId: bankId
        }
        console.log(JSON.stringify(param));
        if (dataCard && dataCard.cardTransferHistory && dataCard.cardTransferHistory.id) {
            cardTransferHistoryProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật lịch sử bàn giao thẻ thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose(hospitalId);
                        break
                    default:
                        toast.error("Cập nhật lịch sử bàn giao thẻ không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                // toast.error(e.message, {
                //     position: toast.POSITION.TOP_RIGHT
                // });
            })
        } else {
            cardTransferHistoryProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Thêm mới lịch sử bàn giao thẻ thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose(hospitalId);
                        break
                    default:
                        toast.error("Thêm mới lịch sử bàn giao thẻ không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                // toast.error(e.message, {
                //     position: toast.POSITION.TOP_RIGHT
                // });
            })
        }
    }

    render() {
        const { classes } = this.props;
        const { dataCard, transferUser, receiverUser, hospitalId, quantity, transferDate, listHospitalCreate, listPaymentMethodsHospital, listBank, cardNoFrom, cardNoTo } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    className="detail-card-max-wight"
                    disableEnforceFocus={true}
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm onSubmit={this.create}>
                        <DialogTitle id="alert-dialog-slide-title" className="title-popup">
                            {dataCard.cardTransferHistory && dataCard.cardTransferHistory.id ? 'Sửa lịch sử bàn giao thẻ ' : 'Thêm lịch sử bàn giao thẻ'}
                            <IconButton onClick={() => this.handleClose()} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                                <Clear />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16} className="hospital-header-card">
                                <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: 2 }}>
                                    Ngày bàn giao (*):
                                </Grid>
                                <Grid item xs={12} md={8} className="news-title-date">
                                    <DateBox
                                        isInput={true} placeholder="Nhập ngày bàn giao (dd/mm/yyyy)"
                                        value={transferDate}
                                        onChangeValue={(event) => {
                                            this.data2.transferDate = event;
                                            this.setState({ transferDate: event })
                                        }}
                                    />
                                    {
                                        this.state.checkValidate && (this.state.transferDate === null || (this.state.transferDate && this.state.transferDate.length === 0)) ? <div className="error-dob" style={{ marginTop: -12 }}>Vui lòng nhập ngày bàn giao</div> : null
                                    }
                                </Grid>
                                <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: -8 }} >
                                    Ngân hàng (*):
                                </Grid>
                                <Grid item xs={12} md={8} className="checkbox-popup card-create-popup">
                                    <Grid container spacing={16} className="hospital-body-card">
                                        {
                                            listBank && listBank.length > 0 ? listBank.map((item, index) => {
                                                return (
                                                    <Grid item xs={12} md={6} className="hospital-padding" key={index}>
                                                        <Radio
                                                            checked={this.state.bankId === item.id.toString()}
                                                            onClick={(event) => {
                                                                this.data2.bankId = event.target.value ? event.target.value : item.id.toString();
                                                                this.setState({ bankId: event.target.value ? event.target.value : item.id.toString() })
                                                            }}
                                                            value={item.id}
                                                            name="radio-button-demo"
                                                            inputProps={{ 'aria-label': item.id.toString() }}
                                                        /> {item.name}
                                                    </Grid>
                                                )
                                            }) : null
                                        }
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: -8 }}>
                                    Mã số thẻ:
                                </Grid>
                                <Grid item xs={12} md={8} className="news-title" style={{ marginTop: -15 }}>
                                    <Grid container spacing={16}>
                                        <Grid item xs={12} md={6}>
                                            <div className="card-create-title-popup">Từ</div>
                                            <TextValidator
                                                value={cardNoFrom}
                                                id="cardNoFrom" name="cardNoFrom"
                                                variant="outlined"
                                                placeholder="Nhập mã số"
                                                className={classes.textField + " color-text-validator"}
                                                onChange={(event) => { this.data2.cardNoFrom = event.target.value; this.setState({ cardNoFrom: event.target.value }); }}
                                                margin="normal"
                                                validators={['uintTextBox']}
                                                errorMessages={['Vui lòng chỉ nhập số!']}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <div className="card-create-title-popup">Đến</div>
                                            <TextValidator
                                                value={cardNoTo}
                                                id="cardNoTo" name="cardNoTo"
                                                variant="outlined"
                                                placeholder="Nhập mã số"
                                                className={classes.textField + " color-text-validator"}
                                                onChange={(event) => { this.data2.cardNoTo = event.target.value; this.setState({ cardNoTo: event.target.value }); }}
                                                margin="normal"
                                                validators={['uintTextBox']}
                                                errorMessages={['Vui lòng chỉ nhập số!']}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={4} className="grid-title-2">
                                    Số lượng (*):
                                </Grid>
                                <Grid item xs={12} md={8} className="news-title">
                                    <TextValidator
                                        value={quantity}
                                        id="taxCode" name="taxCode"
                                        variant="outlined"
                                        placeholder="Nhập số lượng"
                                        className={classes.textField + " color-text-validator"}
                                        onChange={(event) => { this.data2.quantity = event.target.value; this.setState({ quantity: event.target.value }); }}
                                        margin="normal"
                                        validators={['uintTextBox']}
                                        errorMessages={['Vui lòng chỉ nhập số!']}
                                    />
                                    {
                                        this.state.checkValidate && this.state.quantity.toString().length === 0 ? <div className="error-dob">Vui lòng nhập số lượng!</div> : null
                                    }
                                </Grid>
                                <Grid item xs={12} md={4} className="grid-title-2">
                                    Tên người bàn giao (*):
                                </Grid>
                                <Grid item xs={12} md={8} className="news-title">
                                    <TextValidator
                                        value={transferUser}
                                        id="transferUser" name="transferUser"
                                        variant="outlined"
                                        placeholder="Nhập tên người bàn giao"
                                        className={classes.textField + " color-text-validator"}
                                        onChange={(event) => { this.data2.transferUser = event.target.value; this.setState({ transferUser: event.target.value }); }}
                                        margin="normal"
                                    />
                                    {
                                        this.state.checkValidate && this.state.transferUser.trim().length === 0 ? <div className="error-dob">Vui lòng nhập tên người bàn giao</div> : null
                                    }
                                    {
                                        this.state.checkValidate && this.state.transferUser.toString().length > 255 ? <div className="error-dob">Vui lòng nhập tên người bàn giao tối đa 255 ký tự!</div> : null
                                    }
                                </Grid>
                                <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: -5 }}>
                                    Bên bàn giao (*):
                                </Grid>
                                <Grid item xs={12} md={8} className="checkbox-popup card-create-popup-2">
                                    <Grid container spacing={16} className="hospital-body-card">
                                        {
                                            listPaymentMethodsHospital && listPaymentMethodsHospital.paymentMethods && listPaymentMethodsHospital.paymentMethods["1"] && listPaymentMethodsHospital.paymentMethods["1"].length > 0 ? listPaymentMethodsHospital.paymentMethods["1"].map((item, index) => {
                                                return (
                                                    <Grid item xs={12} md={6} className="hospital-padding" key={index}>
                                                        <Radio
                                                            checked={this.state.paymentAgentId === item.id.toString()}
                                                            onClick={(event) => {
                                                                this.data2.paymentAgentId = event.target.value ? event.target.value : item.id.toString();
                                                                this.setState({ paymentAgentId: event.target.value ? event.target.value : item.id.toString() })
                                                            }}
                                                            value={item.id}
                                                            name="radio-button-demo"
                                                            inputProps={{ 'aria-label': item.id.toString() }}
                                                        /> {item.nameAbb}
                                                    </Grid>
                                                )
                                            }) : <Grid item xs={12} md={8} className="data-nul"></Grid>
                                        }
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: -15 }}>
                                    Tên người nhận (*):
                                </Grid>
                                <Grid item xs={12} md={8} className="news-title" style={{ marginTop: -15 }}>
                                    <TextValidator
                                        value={receiverUser}
                                        id="receiverUser" name="receiverUser"
                                        variant="outlined"
                                        placeholder="Nhập tên người nhận"
                                        className={classes.textField + " color-text-validator"}
                                        onChange={(event) => { this.data2.receiverUser = event.target.value; this.setState({ receiverUser: event.target.value }); }}
                                        margin="normal"
                                    />
                                    {
                                        this.state.checkValidate && this.state.receiverUser.trim().length === 0 ? <div className="error-dob">Vui lòng nhập tên người nhận</div> : null
                                    }
                                    {
                                        this.state.checkValidate && this.state.receiverUser.toString().length > 255 ? <div className="error-dob">Vui lòng nhập tên người nhận tối đa 255 ký tự!</div> : null
                                    }
                                </Grid>
                                <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: -5 }}>
                                    Bên nhận (*):
                                </Grid>
                                <Grid item xs={12} md={8} className="news-title-select">
                                    <SelectValidator
                                        value={hospitalId}
                                        onChange={(event) => {
                                            this.data2.hospitalId = event.target.value;
                                            this.setState({ hospitalId: event.target.value });
                                        }}
                                        placeholder="Chọn bên nhận"
                                        variant="outlined"
                                        inputProps={{ name: 'selectDistrict', id: 'selectDistrict' }}>
                                        {
                                            listHospitalCreate && listHospitalCreate.length && listHospitalCreate.map((option, index) =>
                                                <MenuItem key={index} value={option.hospital.id}>{option.hospital.name}</MenuItem>
                                            )
                                        }
                                    </SelectValidator>
                                    {
                                        this.state.checkValidate && this.state.hospitalId === -1 ? <div className="error-dob">Vui lòng chọn bên nhận!</div> : null
                                    }
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions className="margin-button">
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Hủy</Button>
                            {
                                dataCard && dataCard.cardTransferHistory && dataCard.cardTransferHistory.id && this.data !== JSON.stringify(this.data2) ?
                                    <Button variant="contained" color="primary" type="submit" className="button-new-submit">Cập nhật</Button> :
                                    this.data !== JSON.stringify(this.data2) ?
                                        <Button variant="contained" color="primary" type="submit" className="button-new-submit">Thêm mới</Button> :
                                        dataCard && dataCard.cardTransferHistory && dataCard.cardTransferHistory.id ?
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

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateCard));