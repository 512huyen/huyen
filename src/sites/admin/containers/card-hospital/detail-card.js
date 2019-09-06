import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailPaymentAgent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            dataCard: this.props.data,
            transferUser: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.transferUser ? this.props.data.cardTransferHistory.transferUser : '',
            hospitalId: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.hospital ? this.props.data.cardTransferHistory.hospital.name : '',
            quantity: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.quantity ? this.props.data.cardTransferHistory.quantity : '',
            transferDate: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.transferDate ? new Date(this.props.data.cardTransferHistory.transferDate) : "",
            paymentAgentId: this.props.data && this.props.data.cardTransferHistory.paymentAgent && this.props.data.cardTransferHistory.paymentAgent.name ? this.props.data.cardTransferHistory.paymentAgent.name : "",
            paymentAgentNameAbb: this.props.data && this.props.data.cardTransferHistory.paymentAgent && this.props.data.cardTransferHistory.paymentAgent.nameAbb ? this.props.data.cardTransferHistory.paymentAgent.nameAbb : "",
            receiverUser: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.receiverUser ? this.props.data.cardTransferHistory.receiverUser : '',
            bankId: this.props.data && this.props.data.cardTransferHistory && this.props.data.cardTransferHistory.bank && this.props.data.cardTransferHistory.bank.name ? this.props.data.cardTransferHistory.bank.name : "",
        };
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    closeModal() {
        this.setState({ modalUpdate: false, modalCancel: false });
        this.handleClose();
    }

    render() {
        const { classes } = this.props;
        const { transferUser, paymentAgentId, receiverUser, hospitalId, quantity, transferDate, paymentAgentNameAbb, bankId } = this.state;

        return (
            <div style={{ backgroundColor: 'red' }} >
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    fullWidth={true}
                    // maxWidth="md"
                    className="detail-card-max-wight"
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title" className="header-payment">
                        Chi tiết lịch sử bàn giao thẻ
                        <IconButton onClick={() => this.closeModal()} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                            <Clear />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <div className="content-inner-2">
                            <div className="group-detail">
                                <div className="detail-item" style={{ paddingTop: 27 }}>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <span className="label-detail">Ngày bàn giao:</span>
                                        </div>
                                        <div className="col-md-8">
                                            <p className="content-detail">
                                                {moment(transferDate).format("DD-MM-YYYY")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <span className="label-detail">Ngân hàng:</span>
                                        </div>
                                        <div className="col-md-8">
                                            <p className="content-detail">{bankId}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <span className="label-detail">Mã số thẻ:</span>
                                        </div>
                                        <div className="col-md-8">
                                            <p className="content-detail">{hospitalId}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <span className="label-detail">Số lượng:</span>
                                        </div>
                                        <div className="col-md-8">
                                            <p className="content-detail" style={{ color: "#d0021b" }}>{quantity}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-item" style={{ marginTop: 12 }} >
                                    <div className="row">
                                        <div className="col-md-4">
                                            <span className="label-detail">Tên người bàn giao:</span>
                                        </div>
                                        <div className="col-md-8">
                                            <p className="content-detail">{transferUser}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <span className="label-detail">Bên bàn giao:</span>
                                        </div>
                                        <div className="col-md-8">
                                            <p className="content-detail">{paymentAgentNameAbb}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-item" style={{ marginTop: 12 }} >
                                    <div className="row">
                                        <div className="col-md-4">
                                            <span className="label-detail">Tên người nhận:</span>
                                        </div>
                                        <div className="col-md-8">
                                            <p className="content-detail">{receiverUser}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <span className="label-detail">Bên nhận:</span>
                                        </div>
                                        <div className="col-md-8">
                                            <p className="content-detail">{hospitalId}</p>
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

export default withStyles(styles)(connect(mapStateToProps)(DetailPaymentAgent));