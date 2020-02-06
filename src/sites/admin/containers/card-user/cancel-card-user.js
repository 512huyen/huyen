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
            dataCardUser: [],
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
            bankReturnDTO: this.props.data && this.props.data.card && this.props.data.card.bankReturnDTO ? this.props.data.card.bankReturnDTO : '',
            address: this.props.data && this.props.data.card && this.props.data.card.patient ? this.props.data.card.patient.address : '',
        };
    }
    componentWillMount() {
        this.getDetail();
    }
    getDetail() {
        cardProvider.getDetail(Number(this.state.cardId)).then(s => {
            if (s && s.data && s.code === 0) {
                this.setState({
                    dataCardUser: s.data.card,
                })
            }
        }).catch(e => {

        })
    }
    handleClose = () => {
        // window.location.href = '/admin/card-user';
        this.props.callbackOff()
    };

    closeModal() {
        // window.location.href = '/admin/card-user';
        this.setState({ modalUpdate: false, modalCancel: false });
        this.handleClose();
    }
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
    cancel() {
        const { dataCardUser } = this.state;
        let params = {
            card: {
                code: dataCardUser.patient.code,
                issueDate: dataCardUser.issueDate,
                transactionId: dataCardUser.transactionId
            }
        }
        cardProvider.cancel(params).then(s => {
            if (s && s.data && s.code === 0) {
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
        const { name, code, codeCard, dob, gender, passport, bankReturnDTO, address, phone, hospitalName } = this.state;
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
                                                            {this.formatCardNumber(codeCard)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Tên chủ thẻ:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail" style={{ color: "#d0021b", textTransform: "uppercase" }}>{name}</p>
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
                                            <div className="detail-item" style={{ marginTop: 15 }}>
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