import React, { useState, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from "react-redux";
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import userProvider from '../../../../data-access/user-provider';
import hospitalProvider from '../../../../data-access/hospital-provider';
import moment from 'moment';
import ModalAddUpdate from './create-update-user-hospital';
import Tooltip from '@material-ui/core/Tooltip';
import DataContants from '../../../../config/data-contants';
import { listUserAdmin, listHospital } from '../../../../reducers/actions';
import Table from '../../../../components/table';
import { InputText } from '../../../../components/input';
import { SelectText } from '../../../../components/select';
import { ButtonCreateUpdate } from '../../../../components/button';
import PageSize from '../../components/pagination/pageSize';
import { DateTimeBoxSearch } from '../../../../components/date';
const UserAdmin = ({ classes }) => {
    const [state, setState] = useState({
        page: 0,
        size: 10,
    });
    const [search, setSearch] = useState({
        text: '',
        status: -1,
    });
    const [sttAndTotal, setSttAndTotal] = useState({
        stt: "",
        total: 0
    })
    const [tableHeader, setTableHeader] = useState([
        {
            width: "18%",
            name: "Logo CSYT"
        },
        {
            width: "7%",
            name: "STT"
        },
        {
            width: "15%",
            name: "Username"
        },
        {
            width: "20%",
            name: "Tên CSYT"
        },
        {
            width: "15%",
            name: "Ngày tạo"
        },
        {
            width: "15%",
            name: "Trạng thái"
        },
        {
            width: "10%",
            name: "Hành động"
        }
    ])
    const [listData, setListData] = useState([])
    const [listDataView, setListDataView] = useState([])
    const [dataUserAdmin, setDataUserAdmin] = useState({})
    const [dataHospital, setDataHospital] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const userApp = useSelector(state => state.userApp);
    const dispatch = useDispatch();
    useEffect(() => {
        loadPage();
        getHospital();
    }, []);

    const loadPage = (action, item, fromApi) => {
        let page = action === "page" ? item : action === "size" ? 0 : state.page
        let size = action === "size" ? item : state.size
        let text = action === "text" ? item : search.text
        let status = action === "status" ? item : search.status
        let params = {
            page: page + 1,
            size: 99999,
            text: text,
            status: status,
            type: 4
        }
        if (userApp.listUserAdmin && userApp.listUserAdmin.length !== 0 && !fromApi) {
            let dataPage = []
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (userApp.listUserAdmin[i]) {
                    dataPage.push(userApp.listUserAdmin[i])
                }
            }
            setListData(userApp.listUserAdmin)
            setSttAndTotal({
                total: userApp.listUserAdmin.length,
                stt: 1 + page * size
            })
            setState({
                page: page,
                size: size,
            })
            setListDataView(dataPage)
        } else {
            userProvider.search(params).then(s => {
                if (s && s.code === 0 && s.data) {
                    dispatch(listUserAdmin(s.data.data))
                    let dataPage = []
                    let stt = 1 + page * size;
                    for (let i = page * size; i < (page + 1) * size; i++) {
                        if (s.data.data[i]) {
                            dataPage.push(s.data.data[i])
                        }
                    }
                    setState({
                        page: page,
                        size: size,
                    })
                    setListDataView(dataPage)
                    setListData(s.data.data)
                    setSttAndTotal({
                        stt,
                        total: s.data.total,
                    })
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
    const handleChangePage = (event, action) => {
        loadPage("page", action);
    };

    const handleChangeRowsPerPage = event => {
        loadPage("size", event.target.value);
    };
    const handleChangeFilter = (event, action) => {
        const { text, status } = search;
        let value = event && event.target ? event.target.value : event
        let textSearch = text
        textSearch = textSearch.trim().toLocaleLowerCase().unsignText()
        let dataSearch = [];
        let dataView = [];
        if (action === "text") {
            value = value.trim().toLocaleLowerCase().unsignText()
            dataView = listData.filter(item => {
                return ((item.user.username || "").toLocaleLowerCase().unsignText().indexOf(value) !== -1 ||
                    (item.user && item.user.hospital && item.user.hospital.name ? (item.user.hospital.name.toLocaleLowerCase().unsignText().indexOf(value)) : -1) !== -1)
                    && (status === -1 ? (item.user.status === 1 || item.user.status === 2) : item.user.status === Number(status))
            })
        } else if (action === "status") {
            dataView = listData.filter(item => {
                return ((item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 ||
                    (item.user && item.user.hospital && item.user.hospital.name ? (item.user.hospital.name.toLocaleLowerCase().unsignText().indexOf(value)) : -1) !== -1)
                    && (value === -1 ? (item.user.status === 1 || item.user.status === 2) : item.user.status === Number(value))
            })
        }
        let object = []
        for (let i = state.page * state.size; i < (state.page + 1) * state.size; i++) {
            if (dataView[i]) {
                object.push(dataView[i])
            }
        }
        setSearch({
            text: action === "text" ? event.target.value : search.text,
            status: action === "status" ? event : search.status
        });
        setListDataView(object);
        setSttAndTotal({
            stt: 1,
            total: dataView.length
        })
    }
    const modalCreateUpdate = (item) => {
        if (item) {
            setDataUserAdmin(item)
            setIsOpen(true)
        } else {
            setIsOpen(true)
        }
    }
    const closeModal = (item) => {
        if (item && item.clientX) {
            loadPage(null, null, false);
        } else {
            loadPage(null, null, item);
        }
        setIsOpen(false);
        setDataUserAdmin({});
    }
    const setTplModal = () => {
        const { type, status, text } = search;
        return (
            <>
                <InputText
                    title="Tên CSYT"
                    placeholder="Username/Tên CSYT"
                    value={text}
                    onChange={(event) => handleChangeFilter(event, 'text')}
                />
                <SelectText
                    title="Trạng thái"
                    listOption={[{ id: -1, name: "Tất cả" }, ...DataContants.listStatus]}
                    placeholder={'Tìm kiếm'}
                    selected={status}
                    getIdObject={(item) => {
                        return item.id;
                    }}
                    getLabelObject={(item) => {
                        return item.name
                    }}
                    onChangeSelect={(lists, ids) => {
                        handleChangeFilter(ids, 'status')
                    }}
                />
            </>
        )
    }
    const button = () => {
        return (
            <ButtonCreateUpdate title="Thêm mới" onClick={() => modalCreateUpdate()} />
        );
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
                                <TableCell>
                                    <img src={item.user && item.user.image && item.user.image.absoluteUrl()} alt="" style={{ height: 45 }} />
                                </TableCell>
                                <TableCell>{index + sttAndTotal.stt}</TableCell>
                                <TableCell>{(item.user || {}).username}</TableCell>
                                <TableCell>{item.user && item.user.hospital && item.user.hospital.name}</TableCell>
                                <TableCell>{moment((item.user || {}).createdDate).format("DD-MM-YYYY HH:mm:ss")}</TableCell>
                                <TableCell>{(item.user || {}).status === 1 ? "Đang hoạt động" : (item.user || {}).status === 2 ? "Đã khóa" : ""}</TableCell>
                                <TableCell>
                                    <Tooltip title="Chỉnh sửa">
                                        <IconButton onClick={() => modalCreateUpdate(item)} color="primary" className="button-detail-user-card" aria-label="EditIcon">
                                            <img src="/images/edit.png" alt="" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        );
                    })
                        :
                        <TableRow>
                            <TableCell colSpan="7">
                                {
                                    (search.text || search.status) ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
                                }
                            </TableCell>
                        </TableRow>
                }
            </>
        )
    }
    const pagination = () => {
        return (
            <>
                <PageSize
                    colSpan={7}
                    total={sttAndTotal.total}
                    size={state.size}
                    page={state.page}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
                {isOpen && <ModalAddUpdate data={dataUserAdmin} dataHospital={dataHospital} useCallback={closeModal} />}
            </>
        )
    }
    return (
        <Table
            titlePage="Tài khoản CSYT"
            setTplModal={setTplModal()}
            button={button()}
            tableHeader={tableHeader}
            tableBody={tableBody()}
            pagination={pagination()}
        />
    );
}
export default UserAdmin;