import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import userProvider from '../../../../data-access/user-provider';
import moment from 'moment';
import { listUserUser } from '../../../../reducers/actions';
import Table from '../../../../components/table';
import { InputText } from '../../../../components/input';
import PageSize from '../../components/pagination/pageSize';
const UserHome = () => {
    const [state, setState] = useState({
        page: 0,
        size: 10,
    });
    const [search, setSearch] = useState({
        text: '',
        identification: '',
        phone: ''
    });
    const [sttAndTotal, setSttAndTotal] = useState({
        stt: "",
        total: 0
    })
    const [tableHeader] = useState([
        {
            width: "7%",
            name: "STT"
        },
        {
            width: "16%",
            name: "Username"
        },
        {
            width: "13%",
            name: "Họ và tên"
        },
        {
            width: "12%",
            name: "Ngày sinh"
        },
        {
            width: "12%",
            name: "Giới tính"
        },
        {
            width: "13%",
            name: "CMND/Hộ chiếu"
        },
        {
            width: "13%",
            name: "SĐT"
        },
        {
            width: "14%",
            name: "Ngày tạo"
        },
    ])
    const [listData, setListData] = useState([])
    const [listDataView, setListDataView] = useState([])
    const userApp = useSelector(state => state.userApp);
    const dispatch = useDispatch();
    useEffect(() => {
        loadPage();
    }, []);

    const loadPage = (action, item, fromApi) => {
        let page = action === "page" ? item : action === "size" ? 0 : state.page
        let size = action === "size" ? item : state.size
        let params = {
            page: page + 1,
            size: 99999,
            type: 8
        }
        if (userApp.listUserUser && userApp.listUserUser.length !== 0 && !fromApi) {
            let dataPage = []
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (userApp.listUserUser[i]) {
                    dataPage.push(userApp.listUserUser[i])
                }
            }
            setListData(userApp.listUserUser)
            setSttAndTotal({
                total: userApp.listUserUser.length,
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
                    dispatch(listUserUser(s.data.data))
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
        const { text, phone, identification } = search;
        let value = event && event.target ? event.target.value : event
        let textSearch = text
        textSearch = textSearch.trim().toLocaleLowerCase().unsignText()
        let dataView = [];
        if (action === "text") {
            value = value.trim().toLocaleLowerCase().unsignText()
            dataView = listData.filter(item => {
                return ((item.user.username || "").toLocaleLowerCase().unsignText().indexOf(value) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(value) !== -1)
                    && (item.user.identification || "").toLocaleLowerCase().unsignText().indexOf(identification) !== -1
                    && (item.user.phone || "").toLocaleLowerCase().unsignText().indexOf(phone) !== -1
            })
        } else if (action === "identification") {
            dataView = listData.filter(item => {
                return ((item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1)
                && (item.user.identification || "").toLocaleLowerCase().unsignText().indexOf(value) !== -1
                && (item.user.phone || "").toLocaleLowerCase().unsignText().indexOf(phone) !== -1
            })
        } else if (action === "phone") {
            dataView = listData.filter(item => {
                return ((item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1)
                && (item.user.identification || "").toLocaleLowerCase().unsignText().indexOf(identification) !== -1
                && (item.user.phone || "").toLocaleLowerCase().unsignText().indexOf(value) !== -1
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
            phone: action === "phone" ? event.target.value : search.phone,
            identification: action === "identification" ? event.target.value : search.identification
        });
        setListDataView(object);
        setSttAndTotal({
            stt: 1,
            total: dataView.length
        })
    }
    const setTplModal = () => {
        const { phone, identification, text } = search;
        return (
            <>
                <InputText
                    title="Họ và tên"
                    placeholder="Username/Họ và tên"
                    value={text}
                    onChange={(event) => handleChangeFilter(event, 'text')}
                />
                <InputText
                    title="CMND/Hộ chiếu"
                    placeholder="Nhập số"
                    value={identification}
                    onChange={(event) => handleChangeFilter(event, 'identification')}
                />
                <InputText
                    title="Số điện thoại"
                    placeholder="Nhập số"
                    value={phone}
                    onChange={(event) => handleChangeFilter(event, 'phone')}
                />
            </>
        )
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
                                <TableCell>{item.user.username}</TableCell>
                                <TableCell>{item.user.name}</TableCell>
                                <TableCell>{moment(item.user.dob).format("DD-MM-YYYY")}</TableCell>
                                <TableCell>{item.user.gender === 0 ? "Nữ" : item.user.gender === 1 ? "Nam" : ""}</TableCell>
                                <TableCell>{item.user.identification}</TableCell>
                                <TableCell>{item.user.phone}</TableCell>
                                <TableCell>{moment(item.user.createdDate).format("DD-MM-YYYY HH:mm:ss")}</TableCell>
                            </TableRow>
                        );
                    })
                        :
                        <TableRow>
                            <TableCell colSpan="8">
                                {
                                    (search.text || search.identification || search.phone) ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
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
                    colSpan={8}
                    total={sttAndTotal.total}
                    size={state.size}
                    page={state.page}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </>
        )
    }
    return (
        <Table
            titlePage="Tài khoản CSYT"
            setTplModal={setTplModal()}
            tableHeader={tableHeader}
            tableBody={tableBody()}
            pagination={pagination()}
        />
    );
}
export default UserHome;