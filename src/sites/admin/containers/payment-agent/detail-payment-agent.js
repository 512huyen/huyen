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
import DataContants from '../../../../config/data-contants';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailPaymentAgent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            dataPaymentAgent: this.props.data,
            name: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.name ? this.props.data.paymentAgent.name : '',
            issueDate: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.issueDate ? this.props.data.paymentAgent.issueDate : null,
            taxCode: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.taxCode ? Number(this.props.data.paymentAgent.taxCode) : 0,
            code: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.code ? this.props.data.paymentAgent.code : "",
            phone: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.phone ? this.props.data.paymentAgent.phone : "",
            fax: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.fax ? this.props.data.paymentAgent.fax : "",
            address: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.address ? this.props.data.paymentAgent.address : "",
            nameExchange: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.nameExchange ? this.props.data.paymentAgent.nameExchange : "",
            nameAbb: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.nameAbb ? this.props.data.paymentAgent.nameAbb : "",
            type: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.type ? this.props.data.paymentAgent.type : -1,
            logo: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.logo ? this.props.data.paymentAgent.logo : '',
            status: this.props.data && this.props.data.paymentAgent && this.props.data.paymentAgent.status ? this.props.data.paymentAgent.status : '',
        };
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    closeModal() {
        this.setState({ modalUpdate: false, modalCancel: false });
        this.handleClose();
    }

    getKeyMethod(item) {
        let status = DataContants.listPaymentMethod.filter(x => {
            return x.id === item
        })
        if (status && status.length)
            return status[0]
        return {}
    }

    render() {
        const { classes } = this.props;
        const { dataPaymentAgent, status, nameAbb, nameExchange, name, address, fax, phone, code, taxCode, issueDate } = this.state;

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
                        Thông tin nhà cung cấp
                        <IconButton onClick={() => this.closeModal()} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                            <Clear />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <div className="content-inner-2">
                            <div className="color-detail hospital-detail-button">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="group-detail-colx2 color-border detail-left-index">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">Mã số :</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail">
                                                            {code}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">Tên viết tắt:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail" style={{ color: "#d0021b" }}>{nameAbb}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">Tên chính thức:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail">{name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">Tên giao dịch:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail">{nameExchange}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">Địa chỉ:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail">{address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 16 }}>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">SĐT:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail">{phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">Fax:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail">{fax}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">Mã số thuế:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail">{taxCode}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">Ngày cấp:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail">{moment(issueDate).format("DD-MM-YYYY")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 16 }}>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">Trạng thái:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail" style={{ color: "rgb(39,174,96)" }}>{status == 1 ? "Đang hoạt động" : ""}</p>
                                                        <p className="content-detail" style={{ color: "#d0021b" }}>{status == 2 ? "Đã khóa" : ""}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-5 detail-payment-agent-right" >
                                        <div className="group-detail-colx2">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <span className="content-detail">Phương thức thanh toán:</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        {
                                                            dataPaymentAgent && dataPaymentAgent.paymentAgent && dataPaymentAgent.paymentAgent.paymentMethods && dataPaymentAgent.paymentAgent.paymentMethods.map((option, index) => {
                                                                return (
                                                                    <p key={index} className="label-detail  detail-index">{this.getKeyMethod(option) ? "+ " + this.getKeyMethod(option).name : ""}</p>
                                                                )
                                                            })
                                                        }
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

export default withStyles(styles)(connect(mapStateToProps)(DetailPaymentAgent));