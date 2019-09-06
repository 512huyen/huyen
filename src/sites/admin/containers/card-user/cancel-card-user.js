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
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import cardProvider from '../../../../data-access/card-provider';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailCardUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            dataCard: this.props.data,
            name: this.props.data && this.props.data.card && this.props.data.card.name ? this.props.data.card.name : '',
            issueDate: this.props.data && this.props.data.card && this.props.data.card.issueDate ? this.props.data.card.issueDate : null,
            taxCode: this.props.data && this.props.data.card && this.props.data.card.taxCode ? this.props.data.card.taxCode : "",
            code: this.props.data && this.props.data.card && this.props.data.card.code ? this.props.data.card.code : "",
            phone: this.props.data && this.props.data.card && this.props.data.card.phone ? this.props.data.card.phone : "",
            fax: this.props.data && this.props.data.card && this.props.data.card.fax ? this.props.data.card.fax : "",
            address: this.props.data && this.props.data.card && this.props.data.card.address ? this.props.data.card.address : "",
            nameExchange: this.props.data && this.props.data.card && this.props.data.card.nameExchange ? this.props.data.card.nameExchange : "",
            nameAbb: this.props.data && this.props.data.card && this.props.data.card.nameAbb ? this.props.data.card.nameAbb : "",
            type: this.props.data && this.props.data.card && this.props.data.card.type ? this.props.data.card.type : -1,
            logo: this.props.data && this.props.data.card && this.props.data.card.logo ? this.props.data.card.logo : '',
            status: this.props.data && this.props.data.card && this.props.data.card.status ? this.props.data.card.status : '',
        };
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    closeModal() {
        this.setState({ modalUpdate: false, modalCancel: false });
        this.handleClose();
    }
    cancel() {
        const { dataCard } = this.state;
        cardProvider.cancel(dataCard.card.id).then(s => {
            if (s && s.data && s.code === 0){
                toast.success("Hủy map thẻ thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.handleClose();
            } else {
                toast.success("Hủy map thẻ không thành công!", {
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
        const { dataCard, status, nameAbb, nameExchange, name, address, fax, phone, bookingTime, code, taxCode, issueDate } = this.state;

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
                        Hủy thẻ
                        <IconButton onClick={() => this.closeModal()} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                            <Clear />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent style={{ paddingBottom: 0 }}>
                        <div className="content-inner">
                            <div className="color-detail detail-bottom-2">
                                <div className="row">
                                    <div className="col-md-6 color-border-user-card">
                                        <div className="group-detail-colx3">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Số thẻ :</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            123556779123556
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Số tài khoản:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">123556779123556</p>
                                                    </div>
                                                </div>
                                            </div> */}
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Tên chủ thẻ:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail" style={{ color: "#d0021b", textTransform: "uppercase" }}>nguyễn thị lâm</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 15 }}>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Ngân hàng:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail" style={{ textTransform: "uppercase" }}>MB Bank</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">CSYT:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">Bệnh viện Đại học Y Hà Nội</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="group-detail-colx2">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Tên NB :</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            Nguyễn Thị Lam
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Mã NB:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail" style={{ color: "#d0021b" }}>20293965779157</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Ngày sinh:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">22/10/1992</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Giới tính:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">Nữ</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">SĐT:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">01336666666</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 15 }}>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Số CMND/Hộ chiếu:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">01336666666</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Địa chỉ:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">An Nữ - An Ninh - Quỳnh Phụ - Thái Bình</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions className="margin-button">
                        <Button variant="contained" className="isofh-pay-button-card-user" onClick={() => this.cancel()}>Xác nhận huỷ thẻ</Button>
                        <Button variant="contained" color="inherit" className="isofh-pay-button-cancel" onClick={() => this.handleClose()}>Không hủy</Button>
                    </DialogActions>
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

export default withStyles(styles)(connect(mapStateToProps)(DetailCardUser));