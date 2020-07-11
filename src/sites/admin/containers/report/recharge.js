
import React from 'react'
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { SelectBox } from '../../../../components/input-field/InputField';
import { DateBox } from '../../../../components/input-field/InputField';
import { TimePicker } from 'antd';
import 'antd/dist/antd.css';
import Iframe from 'react-iframe';
import hospitalProvider from '../../../../data-access/hospital-provider';
import transactionProvider from '../../../../data-access/transaction-provider';
import ClientUtils from '../../../../utils/client-utils';
import { listHospital } from '../../../../reducers/actions';
import '../control/index.scss';
const format = 'HH:mm:ss';
class Wallets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            isShowIframe: false,
            selected: [],
            listHospital: [],
            listPaymentAgent: [],
            dataHisHospital: [],
            progress: true,
            checkValidate: false,
            fromDate: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
            toDate: moment(new Date()).format("YYYY-MM-DD 23:59:59"),
            date: new Date(),
            time: "00:00:00",
            date2: new Date(),
            time2: "23:59:59",
            hospitalId: -1,
            paymentAgentId: -1,
            type: 1,
            userId: '',
            userCreate: '',
            userHospitalId: this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.hospital ? this.props.userApp.currentUser.hospital.id : -1,
            userHospitalName: this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.hospital ? this.props.userApp.currentUser.hospital.name : '',
        }
    }
    componentWillMount() {
        if (this.state.userHospitalId === -1) {
            this.getHospital();
        } else {
            this.getPaymentMethodHospital(this.state.userHospitalId)
            this.getDetailHIS(this.state.userHospitalId)
        }
    }
    getPaymentMethodHospital(item) {
        hospitalProvider.getDetail(item).then(s => {
            if (s && s.data && s.code === 0) {
                let x = s.data.hospital.paymentMethods && s.data.hospital.paymentMethods["1"]
                if (x && x.length === 1) {
                    this.setState({
                        paymentAgentId: x[0].code,
                    })
                }
                this.setState({
                    listPaymentAgent: x,
                    hospitalId: s.data.hospital.code
                })
            }
        }).catch(e => {

        })
    }
    exportRecharge() {
        const { fromDate, hospitalId, paymentAgentId, toDate, userId, userCreate, type, date, date2, time, time2 } = this.state;
        if (hospitalId === -1 || paymentAgentId === -1 || !userId || (userId || "").length === 0 || !date || !date2 || !time || !time2) {
            this.setState({
                checkValidate: true
            })
            return
        } else {
            this.setState({
                checkValidate: false
            })
        }
        let param = {
            hospital: hospitalId,
            paymentAgent: paymentAgentId,
            fromDate: fromDate ? moment(fromDate).format("YYYY-MM-DD HH:mm:ss") : "",
            toDate: toDate ? moment(toDate).format("YYYY-MM-DD HH:mm:ss") : "",
            userCreate,
            type
        }
        transactionProvider.report(param).then(s => {
            if (s && s.data && s.code === 0) {
                this.setState({
                    fileName: s.data.fileName
                })
                window.open(ClientUtils.serverApi + "/" + s.data.fileName)
            } else if (s.code === 3) {
                toast.error("Không tồn tại Cơ sở y tế!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else if (s.code === 4) {
                toast.error("Không tồn tại Nhà cung cấp!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else if (s.code === 6) {
                toast.error("Không tồn tại bản ghi mới!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.error("Xuất file thất bại!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }).catch(e => {

        })
    }

    download(item) {
        ClientUtils.download(item, ClientUtils.serverApiDownload).then(s => {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = s;
            a.download = "Báo-cáo-nạp-tiền.xlsx";
            a.click();
            window.URL.revokeObjectURL(s);
        }).catch(e => {

        })
    }
    getDateTime(event, type, action) {
        if (type === "time") {
            if (!event) {
                if (action === "fromDate") {
                    this.setState({
                        time: "",
                    })
                } else {
                    this.setState({
                        time2: "",
                    })
                }
            } else {
                let time = moment(event && event._d).format("HH:mm:ss")
                let dateFrom = moment(this.state.date).format("YYYY/MM/DD") + " " + time
                if (action === "fromDate") {
                    this.setState({
                        time: time,
                        fromDate: dateFrom
                    })
                } else {
                    this.setState({
                        time2: time,
                        toDate: dateFrom
                    })
                }
            }
        }
        if (type === "date") {
            if (!event) {
                if (action === "fromDate") {
                    this.setState({
                        date: "",
                    })
                } else {
                    this.setState({
                        date2: "",
                    })
                }
            } else {
                let date = moment(event).format("YYYY/MM/DD")
                let dateFrom = date + " " + this.state.time
                if (action === "fromDate") {
                    this.setState({
                        date: date,
                        fromDate: dateFrom
                    })
                } else {
                    this.setState({
                        date2: date,
                        toDate: dateFrom
                    })
                }
            }
        }
    }
    getHospital() {
        let object = {
            page: 1,
            size: 9999
        }
        if (this.props.userApp.listHospital && this.props.userApp.listHospital.length !== 0) {
            this.setState({
                listHospital: this.props.userApp.listHospital.filter(item => { return (item.hospital.status === 1) })
            })
        } else {
            hospitalProvider.search(object).then(s => {
                if (s && s.data && s.code === 0) {
                    this.props.dispatch(listHospital(s.data.data))
                    this.setState({
                        listHospital: s.data.data.filter(item => { return (item.hospital.status === 1) })
                    })
                }
            }).catch(e => {

            })
        }
    }
    getDetailHIS(item) {
        hospitalProvider.getHisAccount(item).then(s => {
            if (s && s.data && s.code === 0) {
                if (s.data.hisAccounts.length === 0) {
                    this.setState({
                        dataHisHospital: [],
                        userId: ""
                    })
                } else {
                    this.setState({
                        dataHisHospital: s.data.hisAccounts,
                        userId: -1
                    })
                }
            }
        }).catch(e => {

        })
    }
    closePopup() {
        this.setState({
            hospitalId: -1,
            userId: "",
            paymentAgentId: -1,
            date: new Date(),
            date2: new Date(),
            time: "00:00:00",
            time2: "23:59:59"
        })
    }
    handlelogOut() {
        this.setState({
            isShowIframe: false
        })
    };
    file() {
        this.setState({
            isShowIframe: true,
        })
        setTimeout(() => {
            this.handlelogOut()
        }, 3000);
    }
    handleChangeFilter(item, type) {
        if (type === 1) {
            let dataPaymentAgent = item.hospital && item.hospital.paymentMethods && item.hospital.paymentMethods["1"] ? item.hospital.paymentMethods["1"] : []
            this.setState({
                hospitalId: item.hospital.code,
                listPaymentAgent: dataPaymentAgent,
            })
            if (dataPaymentAgent && dataPaymentAgent.length === 1) {
                this.setState({
                    paymentAgentId: dataPaymentAgent[0].code
                })
            } else {
                this.setState({
                    paymentAgentId: -1,
                })
            }
            this.getDetailHIS(item.hospital.id)
        }
        if (type === 2) {
            this.setState({
                paymentAgentId: item.code
            })
        }
        if (type === 3) {
            this.setState({
                userId: item.id,
                userCreate: item.username
            })
        }
    }
    render() {
        const { classes } = this.props;
        const { listHospital, isShowIframe, date, time, time2, date2, listPaymentAgent, hospitalId, paymentAgentId, dataHisHospital, userId, checkValidate, userHospitalId, userHospitalName } = this.state;
        return (
            <div className="color-background-control">
                <Paper className={classes.root + " user-info-body"}>
                    <div className="info-hospital">
                        <div className="row">
                            <ValidatorForm onSubmit={() => this.exportRecharge()} className="user-info-form">
                                <div className="col-md-6 offset-md-3 user-info-table user-info-recharge">
                                    <h4 className="recharge-title">
                                        BÁO CÁO NẠP TIỀN
                                    </h4>
                                    <div className="row recharge-detail">
                                        <div className="col-md-4">
                                            <div className="racharge-item">
                                                Tên CSYT (*):
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            {
                                                userHospitalId === -1 ?
                                                    <div className="select-box-recharge">
                                                        <SelectBox
                                                            listOption={[{ hospital: { code: -1, name: "Chọn CSYT" } }, ...listHospital]}
                                                            placeholder={'Chọn CSYT'}
                                                            selected={hospitalId}
                                                            getIdObject={(item) => {
                                                                return item.hospital.code;
                                                            }}
                                                            getLabelObject={(item) => {
                                                                return item.hospital.name
                                                            }}
                                                            onChangeSelect={(lists, ids) => {
                                                                this.handleChangeFilter(lists, 1)
                                                            }}
                                                        />
                                                        {
                                                            checkValidate && hospitalId === -1 ? <div className="error-dob">Vui lòng chọn CSYT!</div> : null
                                                        }
                                                    </div> :
                                                    <div className="recharge-disabled">
                                                        {userHospitalName}
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="row recharge-detail">
                                        <div className="col-md-4">
                                            <div className="racharge-item">
                                                Nhà cung cấp DV (*):
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="select-box-recharge">
                                                <SelectBox
                                                    listOption={[{ code: -1, nameAbb: "Chọn nhà cung cấp" }, ...listPaymentAgent]}
                                                    placeholder={'Chọn nhà cung cấp'}
                                                    selected={paymentAgentId}
                                                    getIdObject={(item) => {
                                                        return item.code;
                                                    }}
                                                    getLabelObject={(item) => {
                                                        return item.nameAbb
                                                    }}
                                                    onChangeSelect={(lists, ids) => {
                                                        this.handleChangeFilter(lists, 2)
                                                    }}
                                                />
                                                {
                                                    checkValidate && paymentAgentId === -1 ? <div className="error-dob">Vui lòng chọn Nhà cung cấp!</div> : null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row recharge-detail">
                                        <div className="col-md-4">
                                            <div className="racharge-item">
                                                Từ ngày (*):
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="row">
                                                <div className="col-md-6 select-date-time">
                                                    <DateBox
                                                        isInput={true}
                                                        placeholder="Nhập ngày"
                                                        value={date}
                                                        onChangeValue={(event) => {
                                                            this.getDateTime(event, "date", "fromDate")
                                                        }}
                                                    />
                                                    {
                                                        checkValidate && !date ? <div className="error-dob">Vui lòng chọn ngày!</div> : null
                                                    }
                                                </div>
                                                <div className="col-md-6 time-antd">
                                                    <TimePicker
                                                        value={time && moment(time, format)}
                                                        format={format}
                                                        onChange={(event) => {
                                                            this.getDateTime(event, "time", "fromDate")
                                                        }}
                                                        placeholder="Nhập giờ"
                                                    />
                                                    {
                                                        checkValidate && !time ? <div className="error-dob">Vui lòng chọn giờ!</div> : null
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="row recharge-detail">
                                        <div className="col-md-4">
                                            <div className="racharge-item">
                                                Đến ngày (*):
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="row">
                                                <div className="col-md-6 select-date-time">
                                                    <DateBox
                                                        isInput={true}
                                                        placeholder="Nhập ngày"
                                                        value={date2}
                                                        onChangeValue={(event) => {
                                                            this.getDateTime(event, "date", "toDate")
                                                        }}
                                                    />
                                                    {
                                                        checkValidate && !date2 ? <div className="error-dob">Vui lòng chọn ngày!</div> : null
                                                    }
                                                </div>
                                                <div className="col-md-6 time-antd">
                                                    <TimePicker
                                                        value={time2 && moment(time2, format)}
                                                        format={format}
                                                        onChange={(event) => {
                                                            this.getDateTime(event, "time", "toDate")
                                                        }}
                                                        placeholder="Nhập giờ"
                                                    />
                                                    {
                                                        checkValidate && !time2 ? <div className="error-dob">Vui lòng chọn giờ!</div> : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row recharge-detail">
                                        <div className="col-md-4">
                                            <div className="racharge-item">
                                                Tài khoản nạp tiền (*):
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="select-box-recharge">
                                                <SelectBox
                                                    listOption={[dataHisHospital && dataHisHospital.length === 0 ? { id: "", name: "Chọn tài khoản nạp tiền" } : { id: -1, name: "Tất cả" }, ...dataHisHospital]}
                                                    placeholder={'Chọn tài khoản nạp tiền'}
                                                    selected={userId}
                                                    getIdObject={(item) => {
                                                        return item.id;
                                                    }}
                                                    getLabelObject={(item) => {
                                                        return item.name
                                                    }}
                                                    onChangeSelect={(lists, ids) => {
                                                        this.handleChangeFilter(lists, 3)
                                                    }}
                                                />
                                                {
                                                    checkValidate && (userId || "").length === 0 ? <div className="error-dob">Vui lòng chọn Tài khoản nạp tiền!</div> : null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12" style={{ textAlign: "center", paddingTop: 22 }}>
                                        <Button className="button-change-update export-file-button" variant="contained" color="inherit" onClick={() => this.closePopup()}>Hủy</Button>
                                        <Button className="button-change-update change-password-color" variant="contained" color="inherit" type="submit">Xuất file</Button>
                                    </div>
                                </div>
                            </ValidatorForm>
                        </div>
                    </div>
                </Paper>
                {isShowIframe && <Iframe url={window.location.origin + "/recharge/export-file"}
                    width="0px"
                    height="0px"
                    id="import-ticket-store"
                    className="import-ticket-store"
                    display="block"
                    position="relative"
                />
                }
            </div>
        )
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
    }, contentClass: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});

Wallets.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps)(Wallets));