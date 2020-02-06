import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import hospitalProvider from '../../../../data-access/hospital-provider';
import IconButton from '@material-ui/core/IconButton';
import DataContants from '../../../../config/data-contants';
import Clear from '@material-ui/icons/Clear';
import ModalDetailHIS from './HIS-hospital';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}
class DetailHospital extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            dataHospital: this.props.data,
            name: this.props.data && this.props.data.hospital && this.props.data.hospital.name ? this.props.data.hospital.name : '',
            issueDateTaxNo: this.props.data && this.props.data.hospital && this.props.data.hospital.issueDateTaxNo ? this.props.data.hospital.issueDateTaxNo : null,
            taxNo: this.props.data && this.props.data.hospital && this.props.data.hospital.taxNo ? this.props.data.hospital.taxNo : "",
            code: this.props.data && this.props.data.hospital && this.props.data.hospital.code ? this.props.data.hospital.code : "",
            phone: this.props.data && this.props.data.hospital && this.props.data.hospital.phone ? this.props.data.hospital.phone : "",
            fax: this.props.data && this.props.data.hospital && this.props.data.hospital.fax ? this.props.data.hospital.fax : "",
            address: this.props.data && this.props.data.hospital && this.props.data.hospital.address ? this.props.data.hospital.address : "",
            logo: this.props.data && this.props.data.hospital && this.props.data.hospital.logo ? this.props.data.hospital.logo : '',
            status: this.props.data && this.props.data.hospital && this.props.data.hospital.status ? this.props.data.hospital.status : '',
            fileAccount: this.props.data && this.props.data.hospital && this.props.data.hospital.fileAccount ? this.props.data.hospital.fileAccount : '',
            listPaymentMethod: this.props.listPaymentMethod,
            listKeyMethod: Object.keys(this.props.listPaymentMethod),
            modalDetail: false,
            fileNames: this.props.data && this.props.data.hospital && this.props.data.hospital.fileName ? this.props.data.hospital.fileName : ""
        };
    }
    componentWillMount() {
        this.checkPaymentMethod();
    }
    checkPaymentMethod() {
        const { dataHospital, listKeyMethod, listPaymentMethod } = this.state
        let paymentMethods = dataHospital && dataHospital.hospital && dataHospital.hospital.paymentMethods
        if (paymentMethods) {
            for (let i = 0; i < listKeyMethod.length; i++) {
                listPaymentMethod[listKeyMethod[i]].length > 0 && listPaymentMethod[listKeyMethod[i]].map(item => {
                    paymentMethods[listKeyMethod[i]] && paymentMethods[listKeyMethod[i]].length > 0 && paymentMethods[listKeyMethod[i]].map(item2 => {
                        if (item2.id === item.id) {
                            item.checked = true
                        }
                    })
                    return item;
                })
            }
        }
    }
    closeModalHis(){
        this.setState({
            modalDetail: false
        })
    }
    handleClose = () => {
        this.reLoadDate()
    };
    reLoadDate() {
        let arr = []
        for (let i = 0; i < this.state.listKeyMethod.length; i++) {
            arr = this.state.listPaymentMethod[this.state.listKeyMethod[i]].map(item => {
                item.checked = false;
                return item
            })
        }

        if (arr && arr.length > 0) {
            this.setState({
                listCheckMethod: arr
            }, () => this.props.callbackOff())
        } else {
            return
        }
    }
    closeModal() {
        this.setState({ modalUpdate: false, modalCancel: false });
        this.handleClose();
    }
    getKeyMethod(item) {
        var status = DataContants.listPaymentMethod.filter((data) => {
            return parseInt(data.id) === Number(item)
        })
        if (status.length > 0)
            return status[0];
        return {};
    }
    modalDetail(item){
        hospitalProvider.getHisAccount(item.hospital.id).then(s => {
            if (s && s.data && s.code ===0){
                this.setState({
                    dataHisHospital: s.data.hisAccounts,
                    modalDetail: true,
                    dataHospital: item
                })
            }
        }).catch(e => {
        })
    }
    render() {
        const { classes } = this.props;
        const { dataHospital, status, issueDateTaxNo, taxNo, name, address, fax, phone, code, fileNames, listPaymentMethod, listKeyMethod, dataHisHospital } = this.state;
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
                        Thông tin CSYT
                        <IconButton onClick={() => this.closeModal()} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                            <Clear />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <div className="content-inner">
                            <div className="color-detail hospital-detail-button">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="group-detail-colx2 color-border">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">Mã CSYT :</span>
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
                                                        <span className="label-detail">Tên CSYT:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail" style={{ color: "#d0021b" }}>{name}</p>
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
                                            <div className="detail-item">
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
                                            <div className="detail-item" style={{ marginTop: 16 }}>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">Mã số thuế:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail">{taxNo}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">Ngày cấp:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail">{moment(issueDateTaxNo).format("DD-MM-YYYY")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item" style={{ marginTop: 16 }}>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">Trạng thái:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="content-detail" style={{ color: "rgb(39,174,96)" }}>{status === 1 ? "Đang hoạt động" : ""}</p>
                                                        <p className="content-detail" style={{ color: "#d0021b" }}>{status === 2 ? "Đã khóa" : ""}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <span className="label-detail">DS TK HIS:</span>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <p className="name-file file-padding" onClick={()=> this.modalDetail(dataHospital)}>{fileNames}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 detail-payment-agent-right">
                                        <div className="group-detail-colx2">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <span className="label-detail">Phương thức thanh toán:</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                listKeyMethod && listKeyMethod.length > 0 && listKeyMethod.map((item, index) => {
                                                    return (
                                                        <div className="detail-item" key={index}>
                                                            <div className="col-md-12">
                                                                {
                                                                    listPaymentMethod[item] && listPaymentMethod[item].length > 0 && listPaymentMethod[item].filter(x => x.checked).length > 0 ?
                                                                        <span className="content-detail">
                                                                            {this.getKeyMethod(item) ? this.getKeyMethod(item).name : ""}
                                                                        </span> : null
                                                                }
                                                            </div>
                                                            <div className="detail-item-left">
                                                                {
                                                                    listPaymentMethod[item] && listPaymentMethod[item].length > 0 && listPaymentMethod[item].map((item2, index2) => {
                                                                        return (
                                                                            <div key={index2}>
                                                                                {
                                                                                    item2.checked ?
                                                                                        <div className="col-md-5" key={index2}>
                                                                                            <p className="label-detail"> + {item2.nameAbb}</p>

                                                                                        </div>
                                                                                        : null
                                                                                }
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                {this.state.modalDetail && <ModalDetailHIS data={dataHisHospital} dataHospital={dataHospital} callbackOff={this.closeModalHis.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(DetailHospital));