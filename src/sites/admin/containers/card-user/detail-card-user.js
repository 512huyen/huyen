import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
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
class DetailCardUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            dataCardUser: this.props.data,
            name: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.name : '',
            nameCard: this.props.data && this.props.data.card && this.props.data.card ? this.props.data.card.name : '',
            code: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.code : '',
            dob: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.dob : '',
            phone: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.phone : '',
            gender: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.gender : '',
            passport: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.passport : '',
            codeCard: this.props.data && this.props.data.card && this.props.data.card.code ? this.props.data.card.code : 0,
            transactionId: this.props.data && this.props.data.card && this.props.data.card.transactionId ? this.props.data.card.transactionId : '',
            cancel: this.props.data && this.props.data.card && (this.props.data.card.cancel || this.props.data.card.cancel === 0) ? this.props.data.card.cancel : '',
            hospitalName: this.props.data && this.props.data.card && this.props.data.card.hospital ? this.props.data.card.hospital.name : '',
            bankReturnDTO: this.props.data && this.props.data.card && this.props.data.card.bankReturnDTO ? this.props.data.card.bankReturnDTO : '',
            address: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.address : '',
            createdDate : this.props.data && this.props.data.card && this.props.data.card.createdDate  ? this.props.data.card.createdDate  : '',
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
        // var match = matches && matches[0] || ''
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
    render() {
        const { classes } = this.props;
        const { dataCardUser, name, code, codeCard, dob, gender, passport, bankReturnDTO, cancel, createdDate , address, phone, hospitalName } = this.state;
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
                        Thông tin thẻ
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
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Số thẻ :</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            {this.formatCardNumber(codeCard)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Ngày phát hành:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{moment(createdDate).format("DD-MM-YYYY")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 15 }}>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Ngân hàng:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail" style={{ textTransform: "uppercase" }}>{bankReturnDTO.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">CSYT:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{hospitalName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 15 }}>
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Trạng thái thẻ:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        {
                                                            cancel === 0 ?
                                                                <p className="content-detail">Đang hoạt động</p> :
                                                                cancel ===1 ? <p className="content-detail">Đã khóa</p> : null
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                cancel === 0 ?
                                                    <div className="detail-item" style={{ marginTop: 5 }}>
                                                        <div className="row">
                                                            <div className="col-md-5">
                                                                <span className="label-detail">Hành động:</span>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <Button variant="contained" color="secondary">Hủy thẻ</Button>
                                                            </div>
                                                        </div>
                                                    </div> :
                                                    <div className="detail-item" style={{ marginTop: 5 }}>
                                                        <div className="row">
                                                            <div className="col-md-5">
                                                                <span className="label-detail">Ngày hủy thẻ:</span>
                                                            </div>
                                                            <div className="col-md-7">
                                                                <p className="content-detail">{moment(dataCardUser.card.updatedDate).format("DD-MM-YYYY")}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                            }
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
                                                            {name}
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
                                                        <p className="content-detail" style={{ color: "#d0021b" }}>{code}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Ngày sinh:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{moment(dob).format("DD-MM-YYYY")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Giới tính:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{gender === 1 ? "Nam" : gender === 0 ? "Nữ" : ""}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">SĐT:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Số CMND/Hộ chiếu:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{passport}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Địa chỉ:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{address}</p>
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
export default withStyles(styles)(connect(mapStateToProps)(DetailCardUser));