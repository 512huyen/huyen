import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import cardTransferHistoryProvider from '../../../../data-access/card-transfer-history-provider';
import hospitalProvider from '../../../../data-access/hospital-provider';
import ModalAddUpdate from './create-update-card';
import ModalDetail from './detail-card';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import moment from 'moment';
import { toast } from 'react-toastify';
import bankProvider from '../../../../data-access/bank-provider';
import { listHospital } from '../../../../reducers/actions';
import ConfirmDialog from '../../components/confirm/';
import Table from '../../../../components/table/table';
import TableComponent from '../../../../components/table';
import { SelectText } from '../../../../components/select';
import { DateTimeBoxSearch } from '../../../../components/date';
import PageSize from '../../components/pagination/pageSize';
import { ButtonCreateUpdate, ToolTip } from '../../../../components/button';
import './index.scss';
function Card() {
    const [tableHeader] = useState([
        {
            width: "3%",
            name: "STT"
        },
        {
            width: "14%",
            name: "Ngày bàn giao"
        },
        {
            width: "10%",
            name: "Số lượng"
        },
        {
            width: "14%",
            name: "Người ban giao"
        },
        {
            width: "14%",
            name: "Bên bàn giao"
        },
        {
            width: "13%",
            name: "Người nhận"
        },
        {
            width: "18%",
            name: "Ngân hàng"
        },
        {
            width: "14%",
            name: "Hành động"
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
    const [name, setName] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [bankId, setBankId] = useState("");
    const [hospitalId, setHospitalId] = useState(userApp && userApp.currentUser && userApp.currentUser.hospital ? userApp.currentUser.hospital.id : -1);
    const [data, setData] = useState([]);
    const [dataHospital, setDataHospital] = useState([]);
    const [dataBank, setDataBank] = useState([]);
    const [dataBankHospital, setDataBankHospital] = useState([]);
    const [dataPaymentMethodsHospital, setDataPaymentMethodsHospital] = useState([]);
    const [tempDelete, setTempDelete] = useState({});
    const [dataCard, setDataCard] = useState({});
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [modalAdd, setModalAdd] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const userApp = useSelector(state => state.userApp);
    const dispatch = useDispatch();
    useEffect(() => {
        if (userApp && userApp.currentUser && userApp.currentUser.hospital && userApp.currentUser.hospital.id) {
            loadPage();
            getBankHospital(userApp.currentUser.hospital.id);
            setName(userApp.currentUser.hospital.name);
            setHospitalId(userApp.currentUser.hospital.id);
        }
        getHospital();
        getBank();
    }, []);

    const loadPage = (item, action) => {
        let page = action === "page" ? item : action === "size" ? 0 : state.page
        let size = action === "size" ? item : state.size
        let fromDateSearch = action === "fromDate" ? item : fromDate
        let toDateSearch = action === "toDate" ? item : toDate
        let bankIdSearch = action === "bankId" ? item : bankId
        let params = {
            page: page + 1,
            size: size,
            bankId: bankIdSearch,
            fromDate: fromDateSearch ? moment(fromDateSearch).format("YYYY-MM-DD") : "",
            toDate: toDateSearch ? moment(toDateSearch).format("YYYY-MM-DD") : "",
            hospitalId: action === "hospitalId" ? item : hospitalId
        }
        if (params.page === 0) {
            setSttAndTotal({
                stt: 0,
                total: 0,
            })
            setData([])
        } else {
            cardTransferHistoryProvider.search(params).then(s => {
                if (s && s.code === 0 && s.data) {
                    let stt = 1 + (params.page - 1) * params.size;
                    let data = s.data.data.filter(x => {
                        return x.cardTransferHistory.deleted === 0
                    })
                    setSttAndTotal({
                        stt,
                        total: s.data.total,
                    });
                    setState({
                        page: page,
                        size: size,
                    });
                    setData(data);
                } else {
                    setData([]);
                }
            }).catch(e => {
            })
        }
    }
    const getHospital = () => {
        let object = {
            page: 1,
            size: 99999
        }
        if (userApp.listHospital && userApp.listHospital.length !== 0) {
            let listData = userApp.listHospital.filter(item => { return (item.hospital.status === 1) })
            setDataHospital(listData)
        } else {
            hospitalProvider.search(object).then(s => {
                if (s && s.data && s.code === 0) {
                    dispatch(listHospital(s.data.data))
                    let listData = s.data.data.filter(item => { return (item.hospital.status === 1) })
                    setDataHospital(listData)
                }
            }).catch(e => {

            })
        }
    }
    const getBank = () => {
        bankProvider.getAll().then(s => {
            setDataBank(s)
        }).catch(e => {
        })
    }
    const getBankHospital = (item) => {
        hospitalProvider.getBank(item).then(s => {
            if (s && s.data && s.code === 0) {
                setDataBankHospital(s.data.paymentAgents)
            }
        }).catch(e => {

        })
    }
    const getPaymentMethodsHospital = (item) => {
        hospitalProvider.getDetail(item).then(s => {
            if (s && s.data && s.code === 0) {
                setDataPaymentMethodsHospital(s.data.hospital)
            }
        }).catch(e => {

        })
    }
    const modalCreateUpdate = (item) => {
        if (item) {
            setModalAdd(true)
            setDataCard(item)
            setDataBank(dataBank)
        } else {
            setModalAdd(true)
            setDataCard({})
            setDataBank(dataBank)
        }
    }
    const handleChangePage = (event, action) => {
        loadPage("page", action);
    };

    const handleChangeRowsPerPage = event => {
        loadPage("size", event.target.value);
    };
    const closeModal = (hospitalId) => {
        loadPage();
        getBankHospital(hospitalId);
        setModalAdd(false);
        setOpenDetail(false)
    }
    const checkHospital = (item) => {
        setData([]);
        setHospitalId(item.hospital.id);
        setName(item.hospital.name);
        loadPage(item.hospital.id, "hospitalId");
        getBankHospital(item.hospital.id);
        getPaymentMethodsHospital(item.hospital.id)
    }
    const modalDelete = (item) => {
        setConfirmDialog(true);
        setTempDelete(item)
    }
    const modalDetail = (item) => {
        setOpenDetail(true);
        setDataCard(item);
    }
    const Delete = (type) => {
        setConfirmDialog(false)
        if (type === 1) {
            cardTransferHistoryProvider.delete(tempDelete.cardTransferHistory.id).then(s => {
                if (s && s.code === 0 && s.data) {
                    toast.success(" Xóa lịch sử bàn giao thẻ thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    loadPage();
                } else {
                    toast.error(" Xóa lịch sử bàn giao thẻ không thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            })
        }
    }

    const setTplModal = () => {
        return (
            <>
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
                <SelectText
                    isDisabled={hospitalId !== -1 ? false : true}
                    title="Loại tài khoản"
                    listOption={[{ id: -1, name: "Tất cả" }, ...dataBank]}
                    placeholder={'Tìm kiếm'}
                    selected={bankId}
                    getIdObject={(item) => {
                        return item.id;
                    }}
                    getLabelObject={(item) => {
                        return item.name
                    }}
                    onChangeSelect={(lists, ids) => { setBankId(ids); loadPage(ids, "bankId") }}
                />
            </>
        )
    }
    const tableBodyTable = () => {
        return (
            <>
                {
                    data && data.length ? data.map((item, index) => {
                        return (
                            <TableRow
                                hover
                                key={index}
                                tabIndex={-1}>
                                <TableCell>{index + sttAndTotal.stt}</TableCell>
                                <TableCell>{moment(item.cardTransferHistory && item.cardTransferHistory.transferDate).format("DD-MM-YYYY")}</TableCell>
                                <TableCell>{item.cardTransferHistory && item.cardTransferHistory.quantity}</TableCell>
                                <TableCell>{item.cardTransferHistory && item.cardTransferHistory.transferUser}</TableCell>
                                <TableCell>{item.cardTransferHistory && item.cardTransferHistory.paymentAgent && item.cardTransferHistory.paymentAgent.nameAbb}</TableCell>
                                <TableCell>{item.cardTransferHistory && item.cardTransferHistory.receiverUser}</TableCell>
                                <TableCell>{item.cardTransferHistory && item.cardTransferHistory.bank && item.cardTransferHistory.bank.name}</TableCell>
                                <TableCell>
                                    <ToolTip title="Xem chi tiết" image="/images/detail.png" onClick={() => modalDetail(item)} />
                                    <ToolTip title="Chỉnh sửa" image="/images/edit.png" onClick={() => modalCreateUpdate(item)} />
                                    <ToolTip title="Xóa" image="/images/delete.png" onClick={() => modalDelete(item)} />
                                </TableCell>
                            </TableRow>
                        );
                    })
                        :
                        <TableRow>
                            <TableCell colSpan="8">
                                {
                                    (bankId || toDate || fromDate) ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
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
                <div className="row">
                    <div className="col-sm-12 col-md-5 col-lg-4 card-main-left">
                        <div className="div_content">
                            {
                                userApp && userApp.currentUser && userApp.currentUser.hospital && userApp.currentUser.hospital.id ? null :
                                    <div className="chon">
                                        <p className="title_left">CHỌN CSYT</p>
                                        {
                                            dataHospital && dataHospital.length > 0 ? dataHospital.map((item, index) => {
                                                return (
                                                    <div key={index} className="div_anh">
                                                        <input type="radio" id={"s-option" + index} name="selector" className="card-option" />
                                                        <label htmlFor={"s-option" + index} className="card-option-2" >
                                                            <div className="check-history" onClick={() => checkHospital(item)}>
                                                                <img src={item.hospital && item.hospital.logo && item.hospital.logo.absoluteUrl()} alt="" className="logo_anh " />
                                                                <img src="/images/checked.png" alt="" className="check_box" />
                                                                <div className="inside"></div>
                                                            </div>
                                                        </label>
                                                    </div>
                                                )
                                            }) : null
                                        }
                                    </div>
                            }
                            <div className="chon">
                                <p className="title_left">{dataBankHospital && dataBankHospital.length ? "KHO THẺ" : null}</p>
                                <div className="khothe-inner">
                                    {
                                        dataBankHospital && dataBankHospital.length ? dataBankHospital.map((item, index) => {
                                            return (
                                                <div className="khothe_detail" key={index}>
                                                    <div className="khothe-item">
                                                        <p className="bank_name">{item.nameAbb}</p>
                                                        <div className="khothe-body-card">
                                                            <div className="detail_the color-item-card">
                                                                <div className="row">
                                                                    <div className="col-md-7">
                                                                        <span className="label-detail-bold">Tổng thẻ</span>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <p className="content-detail-card">{item.totalCard}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="detail_the color-item-while">
                                                                <div className="row">
                                                                    <div className="col-md-7">
                                                                        <span className="label-detail">Đã sử dụng</span>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <p className="content-detail-card">{item.usedCard}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="detail_the color-item-while">
                                                                <div className="row">
                                                                    <div className="col-md-7">
                                                                        <span className="label-detail">Chưa sử dụng</span>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <p className="content-detail-card">{item.totalCard - item.usedCard}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="detail_the color-item-card-2">
                                                                <div className="row">
                                                                    <div className="col-md-7">
                                                                        <span className="label-detail-bold">Đang sử dụng</span>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <p className="content-detail-card">{item.usedCard - item.cancelCard}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="detail_the color-item-while">
                                                                <div className="row">
                                                                    <div className="col-md-7">
                                                                        <span className="label-detail">Đã Hủy</span>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <p className="content-detail-card">{item.cancelCard}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }) : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-7 col-lg-8">
                        <Table
                            nameHospital={name}
                            titlePage="Lịch sử bàn giao thẻ"
                            setTplModal={setTplModal()}
                            button={hospitalId !== -1 ? button() : null}
                            tableHeader={tableHeader}
                            tableBody={tableBodyTable()}
                            pagination={pagination()}
                        />
                    </div>
                </div>
            </div>
        )
    }
    const button = () => {
        return (
            <ButtonCreateUpdate title="Thêm mới" onClick={() => modalCreateUpdate()} />
        );
    }
    const pagination = () => {
        return (
            <>
                <PageSize
                    colSpan={8}
                    total={sttAndTotal.total}
                    size={state.size}
                    page={state.page}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
                {modalAdd && <ModalAddUpdate data={dataCard} dataHospital={dataHospital} dataPaymentMethodsHospital={dataPaymentMethodsHospital} dataBank={dataBank} hospitalID={hospitalId} useCallback={closeModal.bind(this)} />}
                {openDetail && <ModalDetail data={dataCard} useCallback={closeModal.bind(this)} />}
                {confirmDialog && <ConfirmDialog title="Xác nhận" content={"Bạn chắc chắn muốn xóa lịch sử bàn giao thẻ này?"} btnOk="Xác nhận" btnCancel="Hủy" cbFn={Delete.bind(this)} />}
            </>
        )
    }
    return (
        <TableComponent
            tableBody={tableBody()}
            tableBodyAll={true}
        />
    );
}
export default Card;