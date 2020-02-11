import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import cardProvider from '../../../../data-access/card-provider';
import moment from 'moment';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import ModalDetail from './detail-card-user';
// import ModalRechargelCard from './index';
import ModalCancelCard from './cancel-card-user';
import ModalRechargelCard from './recharge-card-user';
import hospitalProvider from '../../../../data-access/hospital-provider';
import DataContants from '../../../../config/data-contants';
import { listCard, listHospital } from '../../../../reducers/actions';
import Table from '../../../../components/table';
import { InputText } from '../../../../components/input';
import { SelectText } from '../../../../components/select';
import { ToolTip } from '../../../../components/button';
import PageSize from '../../components/pagination/pageSize';
function CardUser({ }) {
    const [tableHeader] = useState([
        {
            width: "3%",
            name: "STT"
        },
        {
            width: "12%",
            name: "Số thẻ"
        },
        {
            width: "10%",
            name: "Mã NB"
        },
        {
            width: "10%",
            name: "Họ và tên"
        },
        {
            width: "10%",
            name: "Ngày sinh"
        },
        {
            width: "9%",
            name: "Giới tính"
        },
        {
            width: "12%",
            name: "CMND/Hộ chiếu"
        },
        {
            width: "10%",
            name: "CSYT"
        },
        {
            width: "11%",
            name: "Trạng thái"
        },
        {
            width: "13%",
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
    const [hospital, setHospital] = useState(-1);
    const [passport, setPassport] = useState("");
    const [patientCode, setPatientCode] = useState("");
    const [cancel, setCancel] = useState(-1);
    const [code, setCode] = useState("");
    const [openDetail, setOpenDetail] = useState(false);
    const [openRechargeCard, setOpenRechargeCard] = useState(false);
    const [openCancelCard, setOpenCancelCard] = useState(false);
    const [listDataView, setListDataView] = useState([]);
    const [dataCardUser, setDataCardUser] = useState({});
    const [dataHospital, setDataHospital] = useState([]);
    const userApp = useSelector(state => state.userApp);
    const dispatch = useDispatch();
    useEffect(() => {
        loadPage();
        getHospital();
    }, []);
    const loadPage = (action, item, fromApi, sizeTotal) => {
        let page = action === "page" ? item : 0
        let size = action === "size" ? item : state.size
        let hospitalSearch = action === "hospital" ? item : hospital
        let passportSearch = action === "passport" ? item : passport
        let patientCodeSearch = action === "patientCode" ? item : patientCode
        let cancelSearch = action === "cancel" ? item : cancel
        let codeSearch = action === "code" ? item : code
        let params = {
            page: Number(page) + 1,
            size: sizeTotal ? sizeTotal : 99999,
            hospital: hospitalSearch,
            passport: passportSearch,
            patientCode: patientCodeSearch,
            code: codeSearch,
        }
        if (userApp.listCard && userApp.listCard.length !== 0 && !fromApi) {
            let dataPage = []
            let list = []
            if (cancelSearch === -1) {
                list = userApp.listCard
            } else {
                list = userApp.listCard.filter(item => { return (item.card.cancel === cancelSearch) })
            }
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (list[i]) {
                    dataPage.push(list[i])
                }
            }
            setSttAndTotal({
                total: list.length,
                stt: 1 + page * size
            });
            setState({
                page: page,
                size: size,
            });
            setListDataView(dataPage);
        } else {
            cardProvider.search(params).then(s => {
                if (s && s.code === 0 && s.data) {
                    if (s.data.total > params.size) {
                        loadPage("", "", true, s.data.total);
                    } else {
                        dispatch(listCard(s.data.data))
                        let stt = 1 + page * size;
                        let dataPage = []
                        let list = []
                        if (cancelSearch === -1) {
                            list = s.data.data
                        } else {
                            list = s.data.data.filter(item => { return (item.card.cancel === cancelSearch) })
                        }
                        for (let i = page * size; i < (page + 1) * size; i++) {
                            if (list[i]) {
                                dataPage.push(list[i])
                            }
                        }
                        setState({
                            page: page,
                            size: size,
                        });
                        setListDataView(dataPage);
                        setSttAndTotal({
                            stt,
                            total: list.length,
                        });
                    }

                }
            }).catch(e => {
            })
        }
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
    const modalDetail = (item) => {
        setOpenDetail(true);
        setDataCardUser(item);
    }
    const modalCancelCard = (item) => {
        // window.location.href = '/admin/cancel-card-user/' + (item.card || {}).code + "&" + item.card && (item.card.patient || {}).code + "&" + (item.card || {}).transactionId;
        setOpenCancelCard(true);
        setDataCardUser(item);
    }
    const modalRechargeCard = (item) => {
        // window.location.href = '/admin/recharge-card-user/' + (item.card || {}).code + "&" + item.card && (item.card.patient || {}).code + "&" + (item.card || {}).transactionId;
        setOpenRechargeCard(true);
        setDataCardUser(item);
    }
    const handleChangePage = (event, action) => {
        loadPage("page", action);
    };

    const handleChangeRowsPerPage = event => {
        loadPage("size", event.target.value);
    };
    const closeModal = () => {
        loadPage();
        setOpenRechargeCard(false);
        setOpenDetail(false);
        setOpenCancelCard(false);
    }
    const formatCardNumber = (value) => {
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
    const getCancelStatus = (item) => {
        var status = DataContants.listCancel.filter((data) => {
            return parseInt(data.id) === item
        })
        if (status.length > 0)
            return status[0];
        return {};
    }
    const tableBody = () => {
        return (
            <>
                {
                    listDataView && listDataView.length ? listDataView.map((item, index) => {
                        return (
                            <TableRow
                                hover
                                key={index}
                                tabIndex={-1}>
                                <TableCell>{index + sttAndTotal.stt}</TableCell>
                                <TableCell>{formatCardNumber(item.card.code)}</TableCell>
                                <TableCell>{item.card.patient && item.card.patient.code}</TableCell>
                                <TableCell>{item.card.patient && item.card.patient.name}</TableCell>
                                <TableCell>{moment(item.card.patient.dob).format("DD-MM-YYYY")}</TableCell>
                                <TableCell>{item.card.patient.gender === 0 ? "Nữ" : item.card.patient.gender === 1 ? "Nam" : ""}</TableCell>
                                <TableCell>{item.card.patient.passport}</TableCell>
                                <TableCell>{item.card.hospital && item.card.hospital.name}</TableCell>
                                <TableCell>
                                    {getCancelStatus(item.card.cancel) ? getCancelStatus(item.card.cancel).name : ""}
                                </TableCell>
                                <TableCell>
                                    <ToolTip title="Xem chi tiết" image="/images/detail.png" onClick={() => modalDetail(item)} />
                                    {
                                        item.card.cancel === 0 ?
                                            <>
                                                <ToolTip title="Nạp tiền" image="/images/nap-tien.png" onClick={() => modalRechargeCard(item)} />
                                                <ToolTip title="Hủy thẻ" image="/images/huy-the.png" onClick={() => modalCancelCard(item)} />
                                            </> :
                                            <>
                                                <ToolTip disabled title="Nạp tiền" image="/images/nap-tien-inactive.png" />
                                                <ToolTip disabled title="Hủy thẻ" image="/images/huy-the-inactive.png" />
                                            </>
                                    }
                                </TableCell>
                            </TableRow>
                        );
                    })
                        :
                        <TableRow>
                            <TableCell colSpan="10">
                                {
                                    (hospital || patientCode || passport || code || cancel) ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
                                }
                            </TableCell>
                        </TableRow>
                }
            </>
        )
    }
    const setTplModal = () => {
        return (
            <>
                <SelectText
                    title="CSYT"
                    listOption={[{ hospital: { id: -1, name: "Tất cả" } }, ...dataHospital]}
                    placeholder={'Tìm kiếm'}
                    selected={hospital}
                    getIdObject={(item) => {
                        return item.hospital.id;
                    }}
                    getLabelObject={(item) => {
                        return item.hospital.name
                    }}
                    onChangeSelect={(lists, ids) => {
                        setHospital(ids); loadPage("hospital", ids, true)
                    }}
                />
                <InputText
                    title="Mã NB"
                    placeholder="Họ tên/ Mã NB"
                    value={patientCode}
                    onChange={(event) => { setPatientCode(event.target.value); loadPage("patientCode", event.target.value, true) }}
                />
                <InputText
                    title="CMND/HC"
                    placeholder="Nhập CMND/HC"
                    value={passport}
                    onChange={(event) => { setPassport(event.target.value); loadPage("passport", event.target.value, true) }}
                />
                <InputText
                    title="Số thẻ"
                    placeholder="Nhập số thẻ"
                    value={code}
                    onChange={(event) => { setCode(event.target.value); loadPage("code", event.target.value, true) }}
                />
                <SelectText
                    title="Loại tài khoản"
                    listOption={[{ id: -1, name: "Tất cả" }, ...DataContants.listCancel]}
                    placeholder={'Tìm kiếm'}
                    selected={cancel}
                    getIdObject={(item) => {
                        return item.id;
                    }}
                    getLabelObject={(item) => {
                        return item.name
                    }}
                    onChangeSelect={(lists, ids) => {
                        setCancel(ids); loadPage("cancel", ids, true)
                    }}
                />
            </>
        )
    }
    const pagination = () => {
        return (
            <>
                <PageSize
                    colSpan={10}
                    total={sttAndTotal.total}
                    size={state.size}
                    page={state.page}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
                {openDetail && <ModalDetail data={dataCardUser} useCallback={closeModal.bind(this)} />}
                {openCancelCard && <ModalCancelCard data={dataCardUser} useCallback={closeModal.bind(this)} />}
                {openRechargeCard && <ModalRechargelCard data={dataCardUser} useCallback={closeModal.bind(this)} />}
            </>
        )
    }
    return (
        <Table
            titlePage="Danh sách thẻ người bệnh"
            setTplModal={setTplModal()}
            tableHeader={tableHeader}
            tableBody={tableBody()}
            pagination={pagination()}
        />
    );
}

export default CardUser;