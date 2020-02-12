import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import transactionProvider from '../../../../data-access/transaction-provider';
import hospitalProvider from '../../../../data-access/hospital-provider';
import moment from 'moment';
import ModalDetail from './detail-transaction-history';
import DataContants from '../../../../config/data-contants';
import { listHospital } from '../../../../reducers/actions';
import Table from '../../../../components/table/table';
import TableCard from '../../../../components/table/tableCard';
import { SelectText } from '../../../../components/select';
import { DateTimeBoxSearch } from '../../../../components/date';
import PageSize from '../../components/pagination/pageSize';
import { ToolTip } from '../../../../components/button';
import { InputText } from '../../../../components/input';
import '../card/index.scss';
import './index.scss';
function TransactionHistory({ classes }) {
    const [tableHeader] = useState([
        {
            width: "6%",
            name: ""
        },
        {
            width: "20%",
            name: "Ngày bàn giao"
        },
        {
            width: "12%",
            name: "Số tiền"
        },
        {
            width: "10%",
            name: "Mã NB"
        },
        {
            width: "8%",
            name: "Mã hồ sơ"
        },
        {
            width: "14%",
            name: "Tên người bệnh"
        },
        {
            width: "10%",
            name: "Trạng thái"
        },
        {
            width: "12%",
            name: ""
        },
        {
            width: "8%",
            name: ""
        }
    ])
    const [state, setState] = useState({
        page: 0,
        size: 10,
    });
    const [sttAndTotal, setSttAndTotal] = useState({
        stt: "",
        total: 0
    })
    const [paymentAgentId, setPaymentAgentId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [codeHS, setCodeHS] = useState("");
    const [patientName, setPatientName] = useState("");
    const [patientvalue, setPatientvalue] = useState("");
    const [status, setStatus] = useState("");
    const [type, setType] = useState("");
    const [nameHospital, setNameHospital] = useState("");
    const [hospitalId, setHospitalId] = useState(userApp && userApp.currentUser && userApp.currentUser.hospital && userApp.currentUser.hospital.id ? userApp.currentUser.hospital.id : -1);
    const [data, setData] = useState([]);
    const [dataHospital, setDataHospital] = useState([]);
    const [dataPaymentMethod, setDataPaymentMethod] = useState([]);
    const [dataPaymentAgent, setDataPaymentAgent] = useState([]);
    const [openDetail, setOpenDetail] = useState(false);
    const userApp = useSelector(state => state.userApp);
    const dispatch = useDispatch();
    useEffect(() => {
        if (userApp && userApp.currentUser && userApp.currentUser.hospital && userApp.currentUser.hospital.id) {
            loadPage(userApp.currentUser.hospital.id, "hospitalId");
            getDetail(userApp.currentUser.hospital.id)
        }
        getHospital();
    }, []);
    const loadPage = (item, action) => {
        let page = action === "page" ? item : action === "size" ? 0 : state.page
        let size = action === "size" ? item : state.size
        let paymentMethodSearch = action === "paymentMethod" ? item : state.paymentMethod
        let paymentAgentIdSearch = action === "paymentAgentId" ? item : state.paymentAgentId
        let typeSearch = action === "type" ? item : state.type
        let fromDateSearch = action === "fromDate" ? item : fromDate
        let toDateSearch = action === "toDate" ? item : toDate
        let amountSearch = action === "amount" ? item : amount
        let patientvalueSearch = action === "patientvalue" ? item : patientvalue
        let codeHSSearch = action === "codeHS" ? item : codeHS
        let patientNameSearch = action === "patientName" ? item : patientName
        let statusSearch = action === "status" ? item : status
        let params = {
            page: page + 1,
            size: size,
            paymentAgentId: paymentAgentIdSearch,
            paymentMethod: paymentMethodSearch,
            amount: amountSearch,
            codeHS: codeHSSearch,
            patientName: patientNameSearch,
            patientvalue: patientvalueSearch,
            status: statusSearch,
            type: typeSearch,
            fromDate: fromDateSearch ? moment(fromDateSearch).format("YYYY-MM-DD") : "",
            toDate: toDateSearch ? moment(toDateSearch).format("YYYY-MM-DD") : "",
            hospitalId: action === "hospitalId" ? item : hospitalId,
        }
        if (params.page === 0) {
            setSttAndTotal({
                stt: 0,
                total: 0,
            })
            setData([])
        } else {
            transactionProvider.search(params).then(s => {
                if (s && s.code === 0 && s.data) {
                    let stt = 1 + (params.page - 1) * params.size;
                    setSttAndTotal({
                        stt,
                        total: s.data.total,
                    });
                    setState({
                        page: page,
                        size: size,
                    });
                    setData(s.data.data);
                }
            }).catch(e => {
                setData([])
            })
        }
    }
    const getDetail = (item) => {
        hospitalProvider.getDetail(item).then(s => {
            if (s && s.data && s.code === 0) {
                let paymentMethod = Object.keys(s.data.hospital.paymentMethods)
                let data = []
                let listPaymentAgent = []
                paymentMethod.map(index => {
                    DataContants.listPaymentMethod.filter(index2 => {
                        if (index2.id === Number(index)) {
                            data.push(index2)
                        }
                    })
                })
                paymentMethod.map(option => {
                    s.data.hospital.paymentMethods[option.toString()].map(item => {
                        listPaymentAgent.push(item)
                    })
                })
                let ids = listPaymentAgent.map((item) => {
                    return item.id
                }).filter((item, index, self) => {
                    return self.indexOf(item) === index;
                })
                let listDataPaymentAgent = []
                ids.map(item => {
                    let abc = listPaymentAgent.filter(option => {
                        return option.id === item
                    })
                    listDataPaymentAgent.push(abc[0])
                })
                setHospitalId(item);
                setDataPaymentMethod(data);
                setDataPaymentAgent(listDataPaymentAgent);
            }
        }).catch(e => {

        })
    }
    const getHospital = () => {
        let params = {
            page: 1,
            size: "99999"
        }
        if (userApp.listHospital && userApp.listHospital.length !== 0) {
            let listData = userApp.listHospital.filter(item => { return (item.hospital.status === 1) })
            setDataHospital(listData)
        } else {
            hospitalProvider.search(params).then(s => {
                if (s && s.code === 0 && s.data) {
                    dispatch(listHospital(s.data.data))
                    let listData = s.data.data.filter(item => { return (item.hospital.status === 1) })
                    setDataHospital(listData)
                }
            }).catch(e => {
            })
        }
    }
    const handleChangePage = (event, action) => {
        loadPage(action, "page");
    };
    const handleChangeRowsPerPage = event => {
        loadPage(event.target.value, "size");
    };
    const closeModal = () => {
        setOpenDetail(false)
        loadPage();
    }

    const setTplModal = () => {
        return (
            <>
                <SelectText
                    isDisabled={hospitalId !== -1 ? false : true}
                    title="Phương thức thanh toán"
                    listOption={[{ id: -1, name: "Tất cả" }, ...dataPaymentMethod]}
                    placeholder={'Tìm kiếm'}
                    selected={paymentMethod}
                    getIdObject={(item) => {
                        return item.id;
                    }}
                    getLabelObject={(item) => {
                        return item.name
                    }}
                    onChangeSelect={(lists, ids) => { setPaymentMethod(ids); loadPage(ids, "paymentMethod") }}
                />
                <SelectText
                    isDisabled={hospitalId !== -1 ? false : true}
                    title="Nhà cung cấp"
                    listOption={[{ id: -1, nameAbb: "Tất cả" }, ...dataPaymentAgent]}
                    placeholder={'Tìm kiếm'}
                    selected={paymentAgentId}
                    getIdObject={(item) => {
                        return item.id;
                    }}
                    getLabelObject={(item) => {
                        return item.nameAbb
                    }}
                    onChangeSelect={(lists, ids) => { setPaymentAgentId(ids); loadPage(ids, "paymentAgentId") }}
                />
                <SelectText
                    isDisabled={hospitalId !== -1 ? false : true}
                    title="Loại giao dịch"
                    listOption={[{ id: -1, name: "Tất cả" }, ...DataContants.listTypeSearch]}
                    placeholder={'Tìm kiếm'}
                    selected={type}
                    getIdObject={(item) => {
                        return item.id;
                    }}
                    getLabelObject={(item) => {
                        return item.name
                    }}
                    onChangeSelect={(lists, ids) => { setType(ids); loadPage(ids, "type") }}
                />
                <DateTimeBoxSearch
                    disabled={hospitalId !== -1 ? false : true}
                    title="Từ ngày"
                    value={fromDate}
                    onChange={(event) => { setFromDate(event); loadPage(event, "fromDate") }}
                    placeholder="Từ ngày"
                />
                <DateTimeBoxSearch
                    disabled={hospitalId !== -1 ? false : true}
                    title="Đến ngày"
                    value={toDate}
                    onChange={(event) => { setToDate(event); loadPage(event, "toDate") }}
                    placeholder="Đến ngày"
                />
            </>
        )
    }
    const modalDetail = (item) => {
        setOpenDetail(true);
        setDataHospital(item);
    }
    const checkHospital = (item) => {
        let paymentMethod = Object.keys(item.hospital.paymentMethods)
        let data = []
        let listPaymentAgent = []
        paymentMethod.map(index => {
            DataContants.listPaymentMethod.filter(index2 => {
                if (index2.id === Number(index)) {
                    data.push(index2)
                }
            })
        })
        paymentMethod.map(option => {
            item.hospital.paymentMethods[option.toString()].map(item => {
                listPaymentAgent.push(item)
            })
        })
        let ids = listPaymentAgent.map((item) => {
            return item.id
        }).filter((item, index, self) => {
            return self.indexOf(item) === index;
        })
        let listDataPaymentAgent = []
        ids.map(item => {
            let abc = listPaymentAgent.filter(option => {
                return option.id === item
            })
            listDataPaymentAgent.push(abc[0])
        })
        setHospitalId(item.hospital.id);
        setNameHospital(item.hospital.name);
        setDataPaymentMethod(data);
        setDataPaymentAgent(listDataPaymentAgent);
        loadPage(item.hospital.id, "hospitalId");
    }
    const tableBodyTable = () => {
        return (
            <>
                <TableRow className="transaction-row">
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="transaction-select">
                        <SelectText
                            isDisabled={hospitalId !== -1 ? false : true}
                            listOption={[{ id: -1, name: "Tất cả" }, ...DataContants.listNumberSearch]}
                            placeholder={'Tìm kiếm'}
                            selected={amount}
                            getIdObject={(item) => {
                                return item.id;
                            }}
                            getLabelObject={(item) => {
                                return item.name
                            }}
                            onChangeSelect={(lists, ids) => { setAmount(ids); loadPage(ids, "amount") }}
                        />
                    </TableCell>
                    <TableCell className="transaction-input">
                        <InputText
                            disabled={hospitalId !== -1 ? false : true}
                            placeholder="Mã NB"
                            value={patientvalue}
                            onChange={(event) => { setPatientvalue(event.target.value); loadPage("patientvalue", event.target.value) }}
                        />
                    </TableCell>
                    <TableCell className="transaction-input">
                        <InputText
                            disabled={hospitalId !== -1 ? false : true}
                            placeholder="Mã hồ sơ"
                            value={codeHS}
                            onChange={(event) => { setCodeHS(event.target.value); loadPage("codeHS", event.target.value) }}
                        />
                    </TableCell>
                    <TableCell className="transaction-input">
                        <InputText
                            disabled={hospitalId !== -1 ? false : true}
                            placeholder="Nhập tên NB"
                            value={patientName}
                            onChange={(event) => { setPatientName(event.target.value); loadPage("patientName", event.target.value) }}
                        />
                    </TableCell>
                    <TableCell className="transaction-select">
                        <SelectText
                            isDisabled={hospitalId !== -1 ? false : true}
                            listOption={[{ id: -1, name: "Tất cả" }, ...DataContants.listStatusTransactionHistory]}
                            placeholder={'Tìm kiếm'}
                            selected={status}
                            getIdObject={(item) => {
                                return item.id;
                            }}
                            getLabelObject={(item) => {
                                return item.name
                            }}
                            onChangeSelect={(lists, ids) => { setStatus(ids); loadPage(ids, "status") }}
                        />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                </TableRow>
                {
                    data && data.length ? data.map((item, index) => {
                        return (
                            <TableRow
                                hover
                                key={index}
                                tabIndex={-1}
                                className="transaction-history-tr">
                                <TableCell className="transaction-history-index-1">
                                    {
                                        item.transaction && (item.transaction.type === 2 || item.transaction.type === 3) ?
                                            <img src="/images/back1.png" alt="" /> :
                                            item.transaction && (item.transaction.type === 1 || item.transaction.type === 4) ? <img src="/images/path.png" alt="" /> : null
                                    }
                                </TableCell>
                                <TableCell>{moment(item.transaction && item.transaction.createdDate).format("HH:mm:ss - DD/MM/YYYY")}</TableCell>
                                <TableCell className="history-font" style={{ textAlign: "center" }}>
                                    {/* {
                                        item.transaction && (item.transaction.type === 2 || item.transaction.type === 3) ?
                                            <span className="color-active"> + {item.transaction.amount.formatPrice()}</span> :
                                            item.transaction && (item.transaction.type === 1 || item.transaction.type === 4) ? <span className="color-inActive"> - {item.transaction.amount.formatPrice()}</span> : null
                                    } */}
                                    {item.transaction.amount.formatPrice()}
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>{item.transaction.patient && item.transaction.patient.code}</TableCell>
                                <TableCell style={{ textAlign: "center" }}>{item.transaction && item.transaction.codeHS}</TableCell>
                                <TableCell>
                                    <div>
                                        <div>{item.transaction.patient && item.transaction.patient.name}</div>
                                        {/* <div className="name-user">{item.transaction.patient && item.transaction.patient.name}</div> */}
                                        {/* <div>{formatCardNumber(item.transaction.patient && item.transaction.patient.code)}</div> */}
                                    </div>
                                </TableCell>
                                {/* <TableCell>Nguyen Thi Lam thanh toán khám bệnh tại khoa khám bệnh</TableCell> */}
                                {/* <TableCell className="color-inActive" style={{ textAlign: "center" }}>{getStatusTransactionHistory(item.transaction.status).name}</TableCell> */}
                                <TableCell className="color-inActive" style={{ textAlign: "center" }}>
                                    {item.transaction.status === 1 ? <span style={{ color: "#27ad60" }}>Thành công</span> : item.transaction.status === 0 ? <span>Thất bại</span> : item.transaction.status === 3 ? <span>Đang xử lý</span> : null}
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}><img src={item.transaction.paymentAgent && item.transaction.paymentAgent.logo.absoluteUrl()} alt="" style={{ maxWidth: 50, maxHeight: 50 }} /></TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                    <ToolTip title="Xem chi tiết" image="/images/detail.png" onClick={() => modalDetail(item)} />
                                </TableCell>
                            </TableRow>
                        );
                    })
                        :
                        <TableRow>
                            <TableCell colSpan="9">
                                {
                                    hospitalId === -1 ? 'Vui lòng chọn CSYT' :
                                        (amount || fromDate || codeHS || patientName || patientvalue ||
                                            paymentAgentId || paymentMethod || status || toDate || type) ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
                                }
                            </TableCell>
                        </TableRow>
                }
            </>
        )
    }
    const tableBody = () => {
        return (
            <div className="card-main">
                <div className="card-main-title">
                    Lịch sử giao dịch
                </div>
                <div className="card-main-left">
                    {
                        userApp && userApp.currentUser && userApp.currentUser.hospital && userApp.currentUser.hospital.id ? null :
                            <div className="div_content">
                                <div className="chon">
                                    {
                                        dataHospital && dataHospital.length > 0 ? dataHospital.map((item, index) => {
                                            return (
                                                <div key={index} className="div_anh div_anh-hostory">
                                                    <input type="radio" id={"s-option" + index} name="selector" className="card-option" />
                                                    <label htmlFor={"s-option" + index} className="card-option-2" >
                                                        <div className="check-history" onClick={() => checkHospital(item)}>
                                                            <img src={item.hospital && item.hospital.logo && item.hospital.logo.absoluteUrl()} className="logo_anh " />
                                                            <img src="/images/checked.png" className="check_box" />
                                                            <div className="inside"></div>
                                                        </div>
                                                    </label>
                                                </div>
                                            )
                                        }) : null
                                    }
                                </div>
                            </div>
                    }
                </div>
                <Table
                    titlePage={userApp && userApp.currentUser && userApp.currentUser.hospital && userApp.currentUser.hospital.id ? null : nameHospital}
                    setTplModal={setTplModal()}
                    tableHeader={tableHeader}
                    tableBody={tableBodyTable()}
                    pagination={pagination()}
                />
            </div>
        )
    }
    const pagination = () => {
        return (
            <>
                <PageSize
                    colSpan={9}
                    total={sttAndTotal.total}
                    size={state.size}
                    page={state.page}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
                {openDetail && <ModalDetail data={dataHospital} useCallback={closeModal.bind(this)} />}
            </>
        )
    }
    return (
        <TableCard
            tableBody={tableBody()}
        />
    );
}
export default TransactionHistory;