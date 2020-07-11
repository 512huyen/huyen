import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import userProvider from '../../../../data-access/user-provider';
import moment from 'moment';
import ModalAddUpdate from './create-update-user-admin';
import DataContants from '../../../../config/data-contants';
import { listUserAdmin } from '../../../../reducers/actions';
import Table from '../../../../components/table';
import { InputText } from '../../../../components/input';
import { SelectText } from '../../../../components/select';
import { ButtonCreateUpdate, ToolTip } from '../../../../components/button';
import PageSize from '../../components/pagination/pageSize';
const UserAdmin = () => {
    const [state, setState] = useState({
        page: 0,
        size: 10,
    });
    const [search, setSearch] = useState({
        text: '',
        status: -1,
        type: -1,
    });
    const [sttAndTotal, setSttAndTotal] = useState({
        stt: "",
        total: 0
    })
    const [tableHeader] = useState([
        {
            width: "5%",
            name: "STT"
        },
        {
            width: "10%",
            name: "Username"
        },
        {
            width: "12%",
            name: "Họ và tên"
        },
        {
            width: "15%",
            name: "Email"
        },
        {
            width: "10%",
            name: "Ngày sinh"
        },
        {
            width: "10%",
            name: "Loại tài khoản"
        },
        {
            width: "10%",
            name: "Ngày tạo"
        },
        {
            width: "10%",
            name: "Trạng thái"
        },
        {
            width: "8%",
            name: "Hành động"
        },
    ])
    const [listData, setListData] = useState([])
    const [listDataView, setListDataView] = useState([])
    const [dataUserAdmin, setDataUserAdmin] = useState({})
    const [isOpen, setIsOpen] = useState(false);
    const userApp = useSelector(state => state.userApp);
    const dispatch = useDispatch();
    useEffect(() => {
        loadPage("", "", true);
    }, []);
    const loadPage = (action, item, fromApi) => {
        let page = action === "page" ? item : action === "size" ? 0 : state.page
        let size = action === "size" ? item : state.size
        let text = action === "text" ? item : search.text
        let status = action === "status" ? item : search.status
        let type = action === "type" ? item : search.type
        let params = {
            page: page + 1,
            size: 99999,
            text: text,
            status: status,
            type: type === -1 ? 3 : type
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
    const handleChangePage = (event, action) => {
        loadPage("page", action);
    };
    const handleChangeRowsPerPage = event => {
        loadPage("size", event.target.value);
    };
    const handleChangeFilter = (event, action) => {
        const { text, status, type } = search;
        let value = event && event.target ? event.target.value : event
        let textSearch = text
        textSearch = textSearch.trim().toLocaleLowerCase().unsignText()
        let dataSearch = [];
        let dataView = [];
        if (action === "text") {
            value = value.trim().toLocaleLowerCase().unsignText()
            if (status === -1 && type === -1) {
                dataView = listData.filter(item => {
                    return (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(value) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(value) !== -1
                })
            } else if (status === -1) {
                dataSearch = listData.filter(option => {
                    return option.user.type === Number(type)
                })
                dataView = dataSearch.filter(item => {
                    return (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(value) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(value) !== -1
                })
            } else {
                dataSearch = listData.filter(option => {
                    return option.user.status === Number(status)
                })
                dataView = dataSearch.filter(item => {
                    return (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(value) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(value) !== -1
                })
            }
        } else if (action === "status") {
            if (type === -1) {
                dataView = listData.filter(item => {
                    return ((item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1)
                        && (value === -1 ? (item.user.status === 1 || item.user.status === 2) : item.user.status === Number(value))
                })
            } else {
                dataView = listData.filter(item => {
                    return ((item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1)
                        && item.user.status === Number(value)
                        && item.user.type === Number(type)
                })
            }
        } else if (action === "type") {
            if (status === -1) {
                dataView = listData.filter(item => {
                    return ((item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1)
                        && (value === -1 ? (item.user.type === 1 || item.user.type === 2) : item.user.type === Number(value))
                })
            } else {
                dataView = listData.filter(item => {
                    return ((item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1)
                        && item.user.status === Number(status)
                        && item.user.type === Number(value)
                })
            }
        }
        let object = []
        for (let i = state.page * state.size; i < (state.page + 1) * state.size; i++) {
            if (dataView[i]) {
                object.push(dataView[i])
            }
        }
        setSearch({
            text: action === "text" ? event.target.value : search.text,
            type: action === "type" ? event : search.type,
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
                {/* <DateTimeBoxSearch
                    title="Từ ngày"
                    value={text}
                    onChangeValue={(event) => {
                        // this.setState({ toDate: event }, () => this.loadPage())
                    }}
                    placeholder="Đến ngày"
                /> */}
                <InputText
                    title="Họ và tên"
                    placeholder="Username/Họ và tên"
                    value={text}
                    onChange={(event) => handleChangeFilter(event, 'text')}
                />
                <SelectText
                    title="Loại tài khoản"
                    listOption={[{ id: -1, name: "Tất cả" }, ...DataContants.listUser]}
                    placeholder={'Tìm kiếm'}
                    selected={type}
                    getIdObject={(item) => {
                        return item.id;
                    }}
                    getLabelObject={(item) => {
                        return item.name
                    }}
                    onChangeSelect={(lists, ids) => {
                        handleChangeFilter(ids, 'type')
                    }}
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
                                <TableCell>{index + sttAndTotal.stt}</TableCell>
                                <TableCell className="user-name-table"><span className="trim-text">{item.user.username}</span></TableCell>
                                <TableCell>{item.user.name}</TableCell>
                                <TableCell>{item.user.email}</TableCell>
                                <TableCell>{moment(item.user.dob).format("DD-MM-YYYY")}</TableCell>
                                <TableCell style={{ textAlign: "center" }}>{item.user.type === 1 ? "Admin" : item.user.type === 2 ? "Nhân viên" : ""}</TableCell>
                                <TableCell>{moment(item.user.createdDate).format("DD-MM-YYYY")}</TableCell>
                                <TableCell style={{ textAlign: "center" }}>{item.user.status === 1 ? "Đang hoạt động" : item.user.status === 2 ? "Đã khóa" : ""}</TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                    <ToolTip title="Chỉnh sửa" image="/images/edit.png" onClick={() => modalCreateUpdate(item)} />
                                </TableCell>
                            </TableRow>
                        );
                    })
                        :
                        <TableRow>
                            <TableCell colSpan="9">
                                {
                                    (search.text || search.type || search.status) ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
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
                    colSpan={9}
                    total={sttAndTotal.total}
                    size={state.size}
                    page={state.page}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
                {isOpen && <ModalAddUpdate data={dataUserAdmin} useCallback={closeModal} />}
            </>
        )
    }
    return (
        <Table
            titlePage="Tài khoản hệ thống"
            setTplModal={setTplModal()}
            button={button()}
            tableHeader={tableHeader}
            tableBody={tableBody()}
            pagination={pagination()}
        />
    );
}
export default UserAdmin;