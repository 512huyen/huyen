import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailTransactionHistoryHospital extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            dataHospital: this.props.data,
            name: this.props.data && this.props.data.user && this.props.data.user.name ? this.props.data.user.name : '',
            issueDate: this.props.data && this.props.data.user && this.props.data.user.issueDate ? this.props.data.user.issueDate : null,
            taxCode: this.props.data && this.props.data.user && this.props.data.user.taxCode ? this.props.data.user.taxCode : "",
            code: this.props.data && this.props.data.user && this.props.data.user.code ? this.props.data.user.code : 0,
            phone: this.props.data && this.props.data.user && this.props.data.user.phone ? this.props.data.user.phone : "",
            fax: this.props.data && this.props.data.user && this.props.data.user.fax ? this.props.data.user.fax : "",
            address: this.props.data && this.props.data.user && this.props.data.user.address ? this.props.data.user.address : "",
            nameExchange: this.props.data && this.props.data.user && this.props.data.user.nameExchange ? this.props.data.user.nameExchange : "",
            nameAbb: this.props.data && this.props.data.user && this.props.data.user.nameAbb ? this.props.data.user.nameAbb : "",
            type: this.props.data && this.props.data.user && this.props.data.user.type ? this.props.data.user.type : -1,
            logo: this.props.data && this.props.data.user && this.props.data.user.logo ? this.props.data.user.logo : '',
            status: this.props.data && this.props.data.user && this.props.data.user.status ? this.props.data.user.status : '',
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
        const { dataHospital, status, nameAbb, nameExchange, name, address, fax, phone, bookingTime, code, taxCode, issueDate } = this.state;

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
                                                        <p className="content-detail">Thanh toán</p>
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
                                                            2096739078
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
                                                        <p className="content-detail" style={{ color: "#d0021b" }}>200.000 VNĐ</p>
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
                                                        <p className="content-detail" style={{ color: "#27ad60" }}>Thành công</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Ngày giao dịch:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">22/02/2019</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Phương thức TT:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">QR Code</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Nhà cung cấp:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail" style={{ color: "rgb(33,152,188)" }}>VNPay</p>
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
                                                        <p className="content-detail">Nguyễn Thị Huyền</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Mã người bệnh:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">38946745</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Mã hồ sơ:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">38946745</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 25 }}>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">CSYT:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">Bệnh viện đại học y Hà Nội</p>
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