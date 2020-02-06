import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import DataContants from '../../../../config/data-contants';
import moment from 'moment';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
class DetailTransactionHistoryHospital extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            dataHospital: this.props.data,
            name: this.props.data && this.props.data.transaction && this.props.data.transaction.patient && this.props.data.transaction.patient.name ? this.props.data.transaction.patient.name : '',
            type: this.props.data && this.props.data.transaction && this.props.data.transaction.type ? this.props.data.transaction.type : -1,
            transactionId: this.props.data && this.props.data.transaction && this.props.data.transaction.transactionId ? this.props.data.transaction.transactionId : "",
            amount: this.props.data && this.props.data.transaction && this.props.data.transaction.amount ? this.props.data.transaction.amount : 0,
            status: this.props.data && this.props.data.transaction && (this.props.data.transaction.status || this.props.data.transaction.status === 0) ? this.props.data.transaction.status : -1,
            createdDate: this.props.data && this.props.data.transaction && this.props.data.transaction.createdDate ? this.props.data.transaction.createdDate : "",
            paymentMethod: this.props.data && this.props.data.transaction && this.props.data.transaction.paymentMethod ? this.props.data.transaction.paymentMethod : "",
            nameAbb: this.props.data && this.props.data.transaction && this.props.data.transaction.paymentAgent && this.props.data.transaction.paymentAgent.nameAbb ? this.props.data.transaction.paymentAgent.nameAbb : "",
            name: this.props.data && this.props.data.transaction && this.props.data.transaction.patient && this.props.data.transaction.patient.name ? this.props.data.transaction.patient.name : "",
            code: this.props.data && this.props.data.transaction && this.props.data.transaction.patient && this.props.data.transaction.patient.code ? this.props.data.transaction.patient.code : "",
            patientDocument: this.props.data && this.props.data.transaction && this.props.data.transaction.codeHS ? this.props.data.transaction.codeHS : "",
            nameHospital: this.props.data && this.props.data.transaction && this.props.data.transaction.hospital && this.props.data.transaction.hospital.name ? this.props.data.transaction.hospital.name : "",
        };
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    closeModal() {
        this.setState({ modalUpdate: false, modalCancel: false });
        this.handleClose();
    }
    
    getTypeSearch(item) {
        var status = DataContants.listTypeSearch.filter((data) => {
            return parseInt(data.id) === item
        })
        if (status.length > 0)
            return status[0];
        return {};
    }
    getStatusTransactionHistory(item) {
        var status = DataContants.listStatusTransactionHistory.filter((data) => {
            return parseInt(data.id) === item
        })
        if (status.length > 0)
            return status[0];
        return {};
    }
    getPaymentMethod(item) {
        var status = DataContants.listPaymentMethod.filter((data) => {
            return parseInt(data.id) === item
        })
        if (status.length > 0)
            return status[0];
        return {};
    }
    render() {
        const { classes } = this.props;
        const { transactionId, status, nameAbb, type, name, amount, createdDate, paymentMethod, patientDocument, code, nameHospital } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    fullWidth={true}
                    maxWidth="md"
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title" className="header-payment">
                        Thông tin chi tiết giao dịch
                        <IconButton onClick={() => this.closeModal()} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                            <Clear />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <div className="content-inner">
                            <div className="color-detail detail-bottom">
                                <div className="row">
                                    <div className="col-md-6  color-border-user-card">
                                        <div className="group-detail-colx3">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <span className="title-detail-history">Thông tin giao dịch</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 4 }}>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Loại giao dịch:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{this.getTypeSearch(type).name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Mã giao dịch :</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            {transactionId}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Số tiền:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail" style={{ color: "#d0021b" }}>{amount.formatPrice()} VNĐ</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Nội dung:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">Thanh toán tiền khám da liễu tại bệnh viện</p>
                                                    </div>
                                                </div>
                                            </div> */}
                                            <div className="detail-item" style={{ marginTop: 15 }}>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Trạng thái:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail" style={{ color: "#27ad60" }}>{this.getStatusTransactionHistory(status).name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Ngày giao dịch:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{moment(createdDate).format("DD-MM-YYYY")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Phương thức TT:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{this.getPaymentMethod(paymentMethod).name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Nhà cung cấp:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail" style={{ color: "rgb(33,152,188)" }}>{nameAbb}</p>
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
                                                        <span className="title-detail-history">Thông tin người bệnh</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 4 }}>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Tên người bệnh:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Mã người bệnh:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{code}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Mã hồ sơ:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{patientDocument}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 25 }}>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">CSYT:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{nameHospital}</p>
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

export default withStyles(styles)(connect(mapStateToProps)(DetailTransactionHistoryHospital));