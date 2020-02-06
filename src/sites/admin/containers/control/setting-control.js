
import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import '../../css/user-info.css'
import { SelectBox } from '../../../../components/input-field/InputField';
import hospitalProvider from '../../../../data-access/hospital-provider';
import DataContants from '../../../../config/data-contants';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { listHospital } from '../../../../reducers/actions'
class Wallets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            listHospital: [],
            listPaymentAgent: [],
            dataHisHospital: [],
            listPaymentMethod: [],
            hospitalId: -1,
            paymentAgent: -1,
            paymentMethod: -1,
            userHospitalId: this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.hospital ? this.props.userApp.currentUser.hospital.id : -1,
            userHospitalName: this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.hospital ? this.props.userApp.currentUser.hospital.name : '',
            methodCompare: '',
            choosePayin: 2,
            choosePayment: 2,
            chooseReturnService: 2
        }
    }
    componentWillMount() {
        if (this.state.userHospitalId === -1) {
            this.getHospital();
        } else {
            this.getPaymentMethodHospital(this.state.userHospitalId)
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
    getPaymentMethodHospital(item) {
        hospitalProvider.getDetail(item).then(s => {
            if (s && s.data && s.code === 0) {
                let paymentMethod = Object.keys(s.data.hospital.paymentMethods)
                let data = []
                paymentMethod.map(index => {
                    DataContants.listPaymentMethod.filter(index2 => {
                        if (index2.id === Number(index)) {
                            data.push(index2)
                        }
                        return index2
                    })
                    return index
                })
                this.setState({
                    hospitalId: item,
                    listPaymentMethod: data,
                    listPaymentAgentSearch: s.data.hospital.paymentMethods
                })
                if (data && data.length === 1) {
                    this.setState({
                        paymentMethod: data[0].id
                    })
                    if (s.data.hospital.paymentMethods && s.data.hospital.paymentMethods[data[0].id.toString()].length === 1) {
                        let a = s.data.hospital.paymentMethods[data[0].id.toString()]
                        this.setState({
                            paymentAgent: a[0].id,
                            listPaymentAgent: a
                        })
                    }
                }
            }
        }).catch(e => {

        })
    }
    settingControl() {
        const { hospitalId, paymentAgent, paymentMethod, choosePayin, choosePayment, chooseReturnService, methodCompare } = this.state;
        if (hospitalId === -1 || paymentAgent === -1 || paymentMethod === -1 || !methodCompare || methodCompare.length === 0) {
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
            choosePayin,
            choosePayment,
            chooseReturnService,
            hospitalId,
            methodCompare: Number(methodCompare),
            paymentAgent,
            paymentMethod
        }
        console.log(JSON.stringify(param))
        hospitalProvider.updateSetting(param).then(s => {
            toast.success("Thiết lập đối soát thành công!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }).catch(e => {
            toast.error("Thiết lập đối soát không thành công!", {
                position: toast.POSITION.TOP_RIGHT
            });
        })
    }
    handleChangeFilter(item, type) {
        if (type === 1) {
            let dataPaymentMethod = item.hospital && item.hospital.paymentMethods ? Object.keys(item.hospital.paymentMethods) : []
            let data = []
            let dataPaymentAgent = item.hospital && item.hospital.paymentMethods
            dataPaymentMethod && dataPaymentMethod.map(index => {
                DataContants.listPaymentMethod.filter(index2 => {
                    if (index2.id === Number(index)) {
                        data.push(index2)
                    }
                    return index2
                })
                return index
            })
            this.setState({
                hospitalId: item.hospital.id,
                hospitalCode: item.hospital.code,
                listPaymentMethod: data,
                listPaymentAgentSearch: dataPaymentAgent
            })
            if (data && data.length === 1) {
                let dataCheckPaymentAgent = dataPaymentAgent && dataPaymentAgent[data[0].id.toString()] ? dataPaymentAgent[data[0].id.toString()] : []
                if (dataCheckPaymentAgent && dataCheckPaymentAgent.length === 1) {
                    this.setState({
                        paymentMethod: data[0].id,
                        paymentAgent: dataCheckPaymentAgent[0].id,
                        paymentAgentCode: dataCheckPaymentAgent[0].code,
                        listPaymentAgent: dataCheckPaymentAgent
                    }, () => this.hospitalPaymentMethod())
                } else {
                    this.setState({
                        paymentMethod: data[0].id,
                        paymentAgent: -1,
                        listPaymentAgent: dataCheckPaymentAgent
                    })
                }
            } else {
                this.setState({
                    paymentMethod: -1,
                    listPaymentAgent: []
                })
            }
        }
        if (type === 2) {
            let dataCheckPaymentAgent = item !== -1 ? this.state.listPaymentAgentSearch[item.toString()] : []
            if (dataCheckPaymentAgent && dataCheckPaymentAgent.length === 1) {
                this.setState({
                    paymentMethod: item,
                    paymentAgent: dataCheckPaymentAgent[0].id,
                    paymentAgentCode: dataCheckPaymentAgent[0].code,
                    listPaymentAgent: dataCheckPaymentAgent
                }, () => this.hospitalPaymentMethod())
            } else {
                this.setState({
                    paymentMethod: item,
                    paymentAgent: -1,
                    listPaymentAgent: dataCheckPaymentAgent
                })
            }
        }
        if (type === 3) {
            this.setState({
                paymentAgent: item.id,
                paymentAgentCode: item.code,
            }, () => this.hospitalPaymentMethod())
        }
    }
    listCheckMethod(event, item) {
        const { choosePayin, choosePayment, chooseReturnService } = this.state;
        if (item === "choosePayin") {
            if (choosePayin === Number(event.target.value)) {
                this.setState({
                    choosePayin: -1
                })
            } else if (choosePayin === 3) {
                this.setState({
                    choosePayin: choosePayin - Number(event.target.value)
                })
            } else if (choosePayin === -1) {
                this.setState({
                    choosePayin: choosePayin + Number(event.target.value) + 1
                })
            } else {
                this.setState({
                    choosePayin: choosePayin + Number(event.target.value)
                })
            }
        } else if (item === "choosePayment") {
            if (choosePayment === Number(event.target.value)) {
                this.setState({
                    choosePayment: -1
                })
            } else if (choosePayment === 3) {
                this.setState({
                    choosePayment: choosePayment - Number(event.target.value)
                })
            } else if (choosePayment === -1) {
                this.setState({
                    choosePayment: choosePayment + Number(event.target.value) + 1
                })
            } else {
                this.setState({
                    choosePayment: choosePayment + Number(event.target.value)
                })
            }
        } else if (item === "chooseReturnService") {
            if (chooseReturnService === Number(event.target.value)) {
                this.setState({
                    chooseReturnService: -1
                })
            } else if (chooseReturnService === 3) {
                this.setState({
                    chooseReturnService: chooseReturnService - Number(event.target.value)
                })
            } else if (chooseReturnService === -1) {
                this.setState({
                    chooseReturnService: chooseReturnService + Number(event.target.value) + 1
                })
            } else {
                this.setState({
                    chooseReturnService: chooseReturnService + Number(event.target.value)
                })
            }
        }
    }
    hospitalPaymentMethod() {
        const { hospitalCode, paymentAgentCode, paymentMethod } = this.state;
        let param = {
            hospitalCode: hospitalCode,
            paymentMethod,
            paymentAgentCode: paymentAgentCode
        }
        hospitalProvider.hospitalPaymentMethod(param).then(s => {
            this.setState({
                choosePayin: s.data.hospitalPaymentMethod.choosePayin === 0 ? s.data.hospitalPaymentMethod.choosePayin + 2 : s.data.hospitalPaymentMethod.choosePayin,
                choosePayment: s.data.hospitalPaymentMethod.choosePayment === 0 ? s.data.hospitalPaymentMethod.choosePayment + 2 : s.data.hospitalPaymentMethod.choosePayment,
                chooseReturnService: s.data.hospitalPaymentMethod.chooseReturnService === 0 ? s.data.hospitalPaymentMethod.chooseReturnService + 2 : s.data.hospitalPaymentMethod.chooseReturnService,
                methodCompare: s.data.hospitalPaymentMethod.methodCompare.toString()
            })
        }).catch(e => {

        })
    }
    closePopup() {
        this.setState({
            hospitalId: -1,
            paymentMethod: -1,
            paymentAgent: -1
        })
    }
    render() {
        const { classes } = this.props;
        const { listHospital, userHospitalId, userHospitalName, checkValidate, listPaymentAgent, hospitalId, paymentAgent, paymentMethod, listPaymentMethod, methodCompare, choosePayin, choosePayment, chooseReturnService } = this.state;
        return (
            <div>
                <Paper className={classes.root + " user-info-body"}>
                    <div className="info-hospital">
                        <div className="row">
                            <div className="user-info-form">
                                <div className="col-md-6 offset-md-3 user-info-table user-info-recharge">
                                    <h4 className="recharge-title">
                                        THIẾT LẬP ĐỐI SOÁT
                                    </h4>
                                    <div className="row">
                                        <div className="recharge-detail">
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
                                                                listOption={[{ hospital: { id: -1, name: "Chọn CSYT" } }, ...listHospital]}
                                                                placeholder={'Chọn CSYT'}
                                                                selected={hospitalId}
                                                                getIdObject={(item) => {
                                                                    return item.hospital.id;
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
                                        <div className="recharge-detail">
                                            <div className="col-md-4">
                                                <div className="racharge-item">
                                                    Phương thức thanh toán (*):
                                            </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="select-box-recharge">
                                                    <SelectBox
                                                        listOption={[{ id: -1, name: "Chọn phương thức thanh toán" }, ...listPaymentMethod]}
                                                        placeholder={'Chọn phương thức thanh toán'}
                                                        selected={paymentMethod}
                                                        getIdObject={(item) => {
                                                            return item.id;
                                                        }}
                                                        getLabelObject={(item) => {
                                                            return item.name
                                                        }}
                                                        onChangeSelect={(lists, ids) => {
                                                            this.handleChangeFilter(ids, 2)
                                                        }}
                                                    />
                                                    {
                                                        checkValidate && paymentMethod === -1 ? <div className="error-dob">Vui lòng chọn Phương thức thanh toán!</div> : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="recharge-detail">
                                            <div className="col-md-4">
                                                <div className="racharge-item">
                                                    Nhà cung cấp DV (*):
                                            </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="select-box-recharge">
                                                    <SelectBox
                                                        listOption={[{ id: -1, nameAbb: "Chọn nhà cung cấp" }, ...listPaymentAgent]}
                                                        placeholder={'Chọn nhà cung cấp'}
                                                        selected={paymentAgent}
                                                        getIdObject={(item) => {
                                                            return item.id;
                                                        }}
                                                        getLabelObject={(item) => {
                                                            return item.nameAbb
                                                        }}
                                                        onChangeSelect={(lists, ids) => {
                                                            this.handleChangeFilter(lists, 3)
                                                        }}
                                                    />
                                                    {
                                                        checkValidate && paymentAgent === -1 ? <div className="error-dob">Vui lòng chọn Nhà cung cấp!</div> : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="recharge-detail">
                                            <div className="col-md-4">
                                                <div className="racharge-item">
                                                    Phương thức đối soát (*):
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <Radio
                                                            className="radio-set-up"
                                                            checked={methodCompare === '1'}
                                                            onClick={(event) => { this.setState({ methodCompare: event.target.value ? event.target.value : "1" }) }}
                                                            value={1}
                                                            name="radio-button-demo"
                                                            inputProps={{ 'aria-label': '1' }}
                                                        /> Qua API
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Radio
                                                            className="radio-set-up"
                                                            checked={methodCompare === '2'}
                                                            onClick={(event) => { this.setState({ methodCompare: event.target.value ? event.target.value : "2" }) }}
                                                            value={2}
                                                            name="radio-button-demo"
                                                            inputProps={{ 'aria-label': '2' }}
                                                        /> Qua file SFTP
                                                    </div>
                                                </div>
                                                {
                                                    checkValidate && (!methodCompare || methodCompare.length === 0) ? <div className="error-dob">Vui lòng chọn Phương thức đối soát!</div> : null
                                                }
                                            </div>
                                        </div>
                                        <div className="recharge-detail">
                                            <div className="col-md-4">
                                                <div className="racharge-item">
                                                    Hiển thị loại giao dịch:
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <Table aria-labelledby="tableTitle" className="style-table-set-up">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell style={{ width: "44%" }}>Loại giao dịch</TableCell>
                                                            <TableCell style={{ width: "28%" }}>Hiển thị</TableCell>
                                                            <TableCell style={{ width: "28%" }}>Mặc định</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>Nạp tiền</TableCell>
                                                            <TableCell style={{ textAlign: "center" }}>
                                                                {
                                                                    choosePayin === 3 ?
                                                                        <Checkbox
                                                                            style={{ cursor: "default" }}
                                                                            checked={(choosePayin === 2 || choosePayin === 3) ? true : false}
                                                                            value={"2"}
                                                                        /> :
                                                                        <Checkbox
                                                                            checked={(choosePayin === 2 || choosePayin === 3) ? true : false}
                                                                            onClick={event => this.listCheckMethod(event, "choosePayin")}
                                                                            value={"2"}
                                                                        />
                                                                }

                                                            </TableCell>
                                                            <TableCell style={{ textAlign: "center" }}>
                                                                <Checkbox
                                                                    checked={(choosePayin === 1 || choosePayin === 3) ? true : false}
                                                                    onClick={event => this.listCheckMethod(event, "choosePayin")}
                                                                    value={"1"}
                                                                    disabled={(choosePayin === 2 || choosePayin === 3) ? false : true}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Thanh toán/ Tạm ứng</TableCell>
                                                            <TableCell style={{ textAlign: "center" }}>
                                                                {
                                                                    choosePayment === 3 ?
                                                                        <Checkbox
                                                                            style={{ cursor: "default" }}
                                                                            checked={(choosePayment === 2 || choosePayment === 3) ? true : false}
                                                                            value={"2"}
                                                                        /> :
                                                                        <Checkbox
                                                                            checked={(choosePayment === 2 || choosePayment === 3) ? true : false}
                                                                            onClick={event => this.listCheckMethod(event, "choosePayment")}
                                                                            value={"2"}
                                                                        />
                                                                }

                                                            </TableCell>
                                                            <TableCell style={{ textAlign: "center" }}>
                                                                <Checkbox
                                                                    checked={(choosePayment === 1 || choosePayment === 3) ? true : false}
                                                                    onClick={event => this.listCheckMethod(event, "choosePayment")}
                                                                    value={"1"}
                                                                    disabled={(choosePayment === 2 || choosePayment === 3) ? false : true}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Hoàn DV</TableCell>
                                                            <TableCell style={{ textAlign: "center" }}>
                                                                {
                                                                    chooseReturnService === 3 ?
                                                                        <Checkbox
                                                                            style={{ cursor: "default" }}
                                                                            checked={(chooseReturnService === 2 || chooseReturnService === 3) ? true : false}
                                                                            value={"2"}
                                                                        /> :
                                                                        <Checkbox
                                                                            checked={(chooseReturnService === 2 || chooseReturnService === 3) ? true : false}
                                                                            onClick={event => this.listCheckMethod(event, "chooseReturnService")}
                                                                            value={"2"}
                                                                        />
                                                                }
                                                            </TableCell>
                                                            <TableCell style={{ textAlign: "center" }}>
                                                                <Checkbox
                                                                    checked={(chooseReturnService === 1 || chooseReturnService === 3) ? true : false}
                                                                    onClick={event => this.listCheckMethod(event, "chooseReturnService")}
                                                                    value={"1"}
                                                                    disabled={(chooseReturnService === 2 || chooseReturnService === 3) ? false : true}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                                {
                                                    checkValidate && (chooseReturnService === 0 && choosePayment === 0 && choosePayin === 0) ? <div className="error-dob">Vui lòng chọn Hiển thị loại giao dịch!</div> : null
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-12" style={{ textAlign: "center", paddingTop: 22 }}>
                                            <Button className="button-change-update export-file-button" variant="contained" color="inherit" onClick={() => this.closePopup()}>Hủy</Button>
                                            <Button className="button-change-update change-password-color" variant="contained" color="inherit" onClick={() => this.settingControl()} >Lưu</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Paper>
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