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
import moment from 'moment';
import { Col, Row } from 'reactstrap';
import stringUtils from 'mainam-react-native-string-utils';
import paymentAgentProvider from '../../../../data-access/user-provider';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import DataContants from '../../../../config/data-contants';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailBankCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            dataHospitalBank: this.props.data,
            listPaymentAgent: this.props.listPaymentAgent,
            dataHospital: this.props.dataHospital,
            hospitalId: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.hospital && this.props.data.hospitalBank.hospital.id ? this.props.data.hospitalBank.hospital.id : -1,
            issuedDate: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.issuedDate ? new Date(this.props.data.hospitalBank.issuedDate) : null,
            accountNo: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.accountNo ? this.props.data.hospitalBank.accountNo : 0,
            bank: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.bank ? this.props.data.hospitalBank.bank : "",
            brand: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.brand ? this.props.data.hospitalBank.brand : "",
            cardNo: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.cardNo ? this.props.data.hospitalBank.cardNo : 0,
            paymentAgentId: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.paymentAgent ? this.props.data.hospitalBank.paymentAgent.id : -1,
            paymentMethod: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.paymentMethod ? this.props.data.hospitalBank.paymentMethod : -1,
            accountName: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.accountName ? this.props.data.hospitalBank.accountName : "",
            type: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.type ? this.props.data.hospitalBank.type : -1,
            status: this.props.data && this.props.data.hospitalBank && this.props.data.hospitalBank.status ? this.props.data.hospitalBank.status : "",
        };
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    closeModal() {
        this.setState({ modalUpdate: false, modalCancel: false });
        this.handleClose();
    }
    formatCardNumber(value) {
        var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        var matches = v.match(/\d{4,16}/g);
        var match = matches && matches[0] || ''
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
    checkMethod(item) {
        let status = DataContants.listPaymentMethod.filter(x => {
            return x.id === item
        })
        if (status && status.length > 0)
            return status[0]
        return {}
    }
    render() {
        const { classes } = this.props;
        const { dataHospitalBank, status, type, paymentMethod, cardNo, accountNo, accountName, bank, brand, issuedDate } = this.state;

        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    fullWidth="md"
                    maxWidth="md"
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title" className="header-payment">
                        Thông tin thẻ ngân hàng CSYT
                        <IconButton onClick={() => this.closeModal()} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                            <Clear />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <div className="content-inner">
                            <div className="color-detail detail-bottom">
                                <div className="row">
                                    <div className="col-md-6 color-border-user-card">
                                        <div className="group-detail-colx3">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <span className="title-detail-history">Thông tin chung:</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 5 }}>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <span className="label-detail">Tên CSYT:</span>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="content-detail">
                                                            {dataHospitalBank && dataHospitalBank.hospitalBank && dataHospitalBank.hospitalBank.hospital && dataHospitalBank.hospitalBank.hospital.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <span className="label-detail">Loại tài khoản:</span>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="content-detail">{type === 1 ? "Chuyên thu" : type === 2 ? "Chuyên chi" : null}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <span className="label-detail">Phương thức thanh toán:</span>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="content-detail">{this.checkMethod(paymentMethod) ? this.checkMethod(paymentMethod).name : null}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <span className="label-detail">Nhà cung cấp DV:</span>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="content-detail" style={{ textTransform: "uppercase" }}>{dataHospitalBank && dataHospitalBank.hospitalBank && dataHospitalBank.hospitalBank.paymentAgent && dataHospitalBank.hospitalBank.paymentAgent.nameAbb}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 15 }}>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <span className="label-detail">Trạng thái:</span>
                                                    </div>
                                                    <div className="col-md-6">
                                                        {
                                                            status === 1 ?
                                                                <p className="content-detail" style={{ color: "rgb(39, 174, 96)" }}>Đang hoạt động</p> :
                                                                status === 2 ?
                                                                    <p className="content-detail" style={{ color: "#d0021b" }}>Đã khóa</p> : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="group-detail-colx2">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <span className="title-detail-history">Thông tin tài khoản:</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 5 }}>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Số thẻ :</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            {this.formatCardNumber(cardNo)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Số tài khoản:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail" style={{ color: "#d0021b" }}>{this.formatCardNumber(accountNo)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Tên chủ thẻ:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail" style={{ textTransform: "uppercase" }}>{accountName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Ngân hàng:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{bank}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Chi nhánh:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{brand}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Ngày phát hành:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{moment(issuedDate).format("DD-MM-YYYY")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
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
    }, controlLabel: {
        width: 150,
        marginTop: 10,
        marginBottom: 20,
    }, controls: {
        marginTop: 10,
    }
});

export default withStyles(styles)(connect(mapStateToProps)(DetailBankCard));