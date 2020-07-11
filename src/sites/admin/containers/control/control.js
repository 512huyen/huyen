
import React, { useState, useEffect } from 'react'
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { SelectBox } from '../../../../components/input-field/InputField';
import { DateBox } from '../../../../components/input-field/InputField';
import { TimePicker } from 'antd';
import 'antd/dist/antd.css';
import hospitalProvider from '../../../../data-access/hospital-provider';
import DataContants from '../../../../config/data-contants';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import { listHospital } from '../../../../reducers/actions';
import { toast } from 'react-toastify';
import ClientUtils from '../../../../utils/client-utils';
import transactionProvider from '../../../../data-access/transaction-provider';
import './index.scss'
const format = 'HH:mm:ss';
function Wallets(props) {
    const [state, _setState] = useState({
        open: true,
        selected: [],
        listHospital: [],
        listPaymentAgent: [],
        dataHisHospital: [],
        listPaymentMethod: [],
        listTypeId: [],
        listType: DataContants.listType,
        listTypes: [],
        progress: true,
        fromDate: new Date(),
        toDate: new Date(),
        date: new Date(),
        time: "00:00:00",
        date2: new Date(),
        time2: "23:59:59",
        hospitalId: -1,
        paymentAgentId: -1,
        paymentMethod: -1,
        type: 5,
        statusActive: props.data && props.data.user && props.data.user.status === 1 ? true : false,
        userHospitalId: props.userApp && props.userApp.currentUser && props.userApp.currentUser.hospital ? props.userApp.currentUser.hospital.id : -1,
        userHospitalName: props.userApp && props.userApp.currentUser && props.userApp.currentUser.hospital ? props.userApp.currentUser.hospital.name : '',
    });
    const setState = (_state) => {
        _setState((state) => ({
            ...state,
            ...(_state || {}),
        }));
    };
    useEffect(() => {
        if (state.userHospitalId === -1) {
            getHospital();
        } else {
            getPaymentMethodHospital(state.userHospitalId)
        }
    }, []);
    const getHospital = () => {
        let object = {
            page: 1,
            size: 9999,
            status: 1
        }
        hospitalProvider.search(object).then(s => {
            if (s && s.data && s.code === 0) {
                setState({
                    listHospital: s.data.data
                })
            }
        }).catch(e => {

        })
    }
    const hospitalPaymentMethod = (hospitalId, paymentAgentId, paymentMethod) => {
        setState({
            listTypes: []
        })
        const { listType } = state;
        let param = {
            hospitalCode: hospitalId,
            paymentMethod,
            paymentAgentCode: paymentAgentId
        }
        hospitalProvider.hospitalPaymentMethod(param).then(s => {
            if (s && s.code === 0 && s.data) {
                if (listType[0].id === 1) {
                    if ((s.data.hospitalPaymentMethod.choosePayin & 2) !== 2) {
                        listType[0] = []
                    } else if ((s.data.hospitalPaymentMethod.choosePayin & 1) === 1) {
                        listType[0].checked = true
                    }
                }
                if (listType[1].id === 2) {
                    if ((s.data.hospitalPaymentMethod.choosePayment & 2) !== 2) {
                        listType[1] = []
                    } else if ((s.data.hospitalPaymentMethod.choosePayment & 1) === 1) {
                        listType[1].checked = true
                    }
                }
                if (listType[2].id === 4) {
                    if ((s.data.hospitalPaymentMethod.chooseReturnService & 2) !== 2) {
                        listType[2] = []
                    } else if ((s.data.hospitalPaymentMethod.chooseReturnService & 1) === 1) {
                        listType[2].checked = true
                    }
                }
                let listTypes = []
                listType.map(item => {
                    if (item && item.id) {
                        listTypes.push(item)
                    }
                    return item
                })
                setState({
                    listTypes: listTypes
                })
            }
        }).catch(e => {

        })
    }
    const getPaymentMethodHospital = (item) => {
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
                setState({
                    hospitalId: s.data.hospital.code,
                    listPaymentMethod: data,
                    listPaymentAgentSearch: s.data.hospital.paymentMethods
                })
                if (data && data.length === 1) {
                    setState({
                        paymentMethod: data[0].id,
                        listPaymentAgent: s.data.hospital.paymentMethods[data[0].id.toString()]
                    })
                    if (s.data.hospital.paymentMethodss.data.hospital.paymentMethods && s.data.hospital.paymentMethods[data[0].id.toString()].length === 1) {
                        let a = s.data.hospital.paymentMethods[data[0].id.toString()]
                        setState({
                            paymentAgentId: a[0].code,
                            listPaymentAgent: a
                        });
                        hospitalPaymentMethod(s.data.hospital.code, a[0].code, data[0].id)
                    }
                }
            }
        }).catch(e => {

        })
    }
    const exportControl = () => {
        const { listType, hospitalId, paymentAgentId, paymentMethod, date, date2, time, time2, type } = state;
        let fromD = moment(date).format("YYYY-MM-DD") + " " + time;
        let toD = moment(date2).format("YYYY-MM-DD") + " " + time2;
        setState({
            fromDate: fromD,
            toDate: toD
        })
        let listTypeId = listType.filter(item => {
            return item.checked
        }).map(item => {
            return item.id
        })
        listTypeId.filter(option => {
            if (option === 2) {
                listTypeId.push(3);
            }
            return option
        })
        setState({
            listTypeId: listTypeId
        })
        if (hospitalId === -1 || paymentAgentId === -1 || paymentMethod === -1 || !date || !date2 || !time || !time2 || listTypeId.length === 0) {
            setState({
                checkValidate: true
            })
            return
        } else {
            setState({
                checkValidate: false
            })
        }
        let param = {
            hospital: hospitalId,
            paymentAgent: paymentAgentId,
            paymentMethod,
            fromDate: fromD,
            toDate: toD,
            type,
            typeValue: listTypeId
        }
        console.log(JSON.stringify(param))
        transactionProvider.report(param).then(s => {
            if (s && s.data && s.code === 0) {
                setState({
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
    const getDateTime = (event, type, action) => {
        if (type === "time") {
            if (!event) {
                if (action === "fromDate") {
                    setState({
                        time: "",
                    })
                } else {
                    setState({
                        time2: "",
                    })
                }
            } else {
                let time = moment(event && event._d).format("HH:mm:ss")
                let dateFrom = moment(state.date).format("YYYY-MM-DD") + " " + time
                if (action === "fromDate") {
                    setState({
                        time: time,
                        fromDate: dateFrom
                    })
                } else {
                    setState({
                        time2: time,
                        toDate: dateFrom
                    })
                }
            }
        }
        if (type === "date") {
            if (!event) {
                if (action === "fromDate") {
                    setState({
                        date: "",
                    })
                } else {
                    setState({
                        date2: "",
                    })
                }
            } else {
                let date = moment(event).format("YYYY-MM-DD")
                let dateFrom = date + " " + state.time
                if (action === "fromDate") {
                    setState({
                        date: date,
                        fromDate: dateFrom
                    })
                } else {
                    setState({
                        date2: date,
                        toDate: dateFrom
                    })
                }
            }
        }
    }
    const handleChangeFilter = (item, type) => {
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
            setState({
                hospitalId: item.hospital.code,
                listPaymentMethod: data,
                listPaymentAgentSearch: dataPaymentAgent
            })
            if (data && data.length === 1) {
                let dataCheckPaymentAgent = dataPaymentAgent && dataPaymentAgent[data[0].id.toString()] ? dataPaymentAgent[data[0].id.toString()] : []
                if (dataCheckPaymentAgent && dataCheckPaymentAgent.length === 1) {
                    setState({
                        paymentMethod: data[0].code,
                        paymentAgentId: dataCheckPaymentAgent[0].code,
                        listPaymentAgent: dataCheckPaymentAgent
                    })
                    hospitalPaymentMethod(item.hospital.code, dataCheckPaymentAgent[0].code, data[0].code);
                } else {
                    setState({
                        paymentMethod: data[0].id,
                        paymentAgentId: -1,
                        listPaymentAgent: dataCheckPaymentAgent
                    })
                }

            } else {
                setState({
                    paymentMethod: -1,
                    listPaymentAgent: []
                })
            }
        }
        if (type === 2) {
            let dataCheckPaymentAgent = item !== -1 ? state.listPaymentAgentSearch[item.toString()] : []
            if (dataCheckPaymentAgent && dataCheckPaymentAgent.length === 1) {
                setState({
                    paymentMethod: item,
                    paymentAgentId: dataCheckPaymentAgent[0].code,
                    listPaymentAgent: dataCheckPaymentAgent
                });
                hospitalPaymentMethod(state.hospitalId, dataCheckPaymentAgent[0].code, item);
            } else {
                setState({
                    paymentMethod: item,
                    paymentAgentId: -1,
                    listPaymentAgent: dataCheckPaymentAgent
                })
            }

        }
        if (type === 3) {
            setState({
                paymentAgentId: item.code
            });
            hospitalPaymentMethod(state.hospitalId, item.code, state.paymentMethod);
        }
    }
    const listCheckMethod = (event, item) => {
        item.checked = !item.checked;
        let listTypeId = state.listType.filter(item => {
            return item.checked
        }).map(item => {
            return item.id
        })
        setState({
            listType: [...DataContants.listType],
            listTypeId: listTypeId
        })
    }
    const closePopup = () => {
        DataContants.listType.map(item => {
            item.checked = false
            return item
        })
        setState({
            hospitalId: -1,
            paymentMethod: -1,
            paymentAgentId: -1,
            date: new Date(),
            date2: new Date(),
            time: "00:00:00",
            time2: "23:59:59"
        })
    }
    const { listHospital, userHospitalId, userHospitalName, checkValidate, listTypeId, date, time, time2, date2, listPaymentAgent, hospitalId, paymentAgentId, listTypes, paymentMethod, listPaymentMethod } = state;
    return (
        <div className="color-background-control">
            <Paper className={" user-info-body"} >
                <div className="info-hospital">
                    <div className="row">
                        {
                            userHospitalId === -1 ?
                                <Link className="setting-control"
                                    to={'/admin/setting-control'}>
                                    Thiết lập đối soát
                                        <IconButton color="primary" className={" setting-control-image"} aria-label="EditIcon">
                                        <img src="/images/settingse.png" alt="" />
                                    </IconButton>
                                </Link> : null
                        }

                        <div className="user-info-form">
                            <div className="col-md-6 offset-md-3 user-info-table user-info-recharge">
                                <h4 className="recharge-title">
                                    ĐỐI SOÁT
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
                                                            handleChangeFilter(lists, 1)
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
                                                    handleChangeFilter(ids, 2)
                                                }}
                                            />
                                            {
                                                checkValidate && paymentMethod === -1 ? <div className="error-dob">Vui lòng chọn Phương thức thanh toán!</div> : null
                                            }
                                        </div>
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
                                                    handleChangeFilter(lists, 3)
                                                }}
                                            />
                                            {
                                                checkValidate && paymentAgentId === -1 ? <div className="error-dob">Vui lòng chọn Nhà cung cấp!</div> : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                {
                                    listTypes && listTypes.length > 0 ?
                                        <div className="row recharge-detail">
                                            <div className="col-md-4">

                                                <div className="racharge-item">
                                                    Loại giao dịch (*):
                                                        </div>

                                            </div>
                                            <div className="col-md-8">
                                                {
                                                    listTypes.map((item, index) => {
                                                        return (
                                                            <div key={index}>
                                                                {
                                                                    item.checked ?
                                                                        <div className="paymentMethod-item control-index">
                                                                            <Checkbox
                                                                                checked={true}
                                                                                onClick={event => listCheckMethod(event, item)}
                                                                                value={item.id.toString()}
                                                                            /> <span className="hospital-name">{item.name}</span>
                                                                        </div> :
                                                                        <div className="paymentMethod-item control-index">
                                                                            <Checkbox
                                                                                checked={false}
                                                                                onClick={event => listCheckMethod(event, item)}
                                                                                value={item.id.toString()}
                                                                            /> <span className="hospital-name">{item.name}</span>
                                                                        </div>
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {
                                                    checkValidate && listTypeId.length === 0 ? <div className="error-dob">Vui lòng chọn Nhà cung cấp!</div> : null
                                                }
                                            </div>
                                        </div> : null
                                }
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
                                                    value={date && new Date(date)}
                                                    onChangeValue={(event) => {
                                                        getDateTime(event, "date", "fromDate")
                                                    }}
                                                />
                                                {checkValidate && !date ? <div className="error-dob">Vui lòng chọn ngày!</div> : null}
                                            </div>
                                            <div className="col-md-6 time-antd">
                                                <TimePicker
                                                    value={time && moment(time, format)}
                                                    format={format}
                                                    onChange={(event) => {
                                                        getDateTime(event, "time", "fromDate")
                                                    }}
                                                    placeholder="Nhập giờ"
                                                />
                                                {checkValidate && !time ? <div className="error-dob">Vui lòng chọn giờ!</div> : null}
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
                                                    value={date2 && new Date(date2)}
                                                    onChangeValue={(event) => {
                                                        getDateTime(event, "date", "toDate")
                                                    }}
                                                />
                                                {checkValidate && !date2 ? <div className="error-dob">Vui lòng chọn ngày!</div> : null}
                                            </div>
                                            <div className="col-md-6 time-antd">
                                                <TimePicker
                                                    value={time2 && moment(time2, format)}
                                                    format={format}
                                                    onChange={(event) => {
                                                        getDateTime(event, "time", "toDate")
                                                    }}
                                                    placeholder="Nhập giờ"
                                                />
                                                {checkValidate && !time2 ? <div className="error-dob">Vui lòng chọn giờ!</div> : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12" style={{ textAlign: "center", paddingTop: 22 }}>
                                        <Button className="button-change-update export-file-button" variant="contained" color="inherit" onClick={() => closePopup()}>Hủy</Button>
                                        <Button className="button-change-update change-password-color" variant="contained" color="inherit" onClick={() => exportControl()} >Xuất file</Button>
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
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default (connect(mapStateToProps)(Wallets));