import React, { useState, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import userProvider from '../../../../data-access/user-provider';
import { withStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '../../components/pagination/pagination';
import moment from 'moment';
import ModalAddUpdate from './create-update-user-admin';
import TableFooter from '@material-ui/core/TableFooter';
import Tooltip from '@material-ui/core/Tooltip';
import DataContants from '../../../../config/data-contants';
import { SelectBox } from '../../../../components/input-field/InputField';
import { listUserAdmin } from '../../../../reducers/actions'
const UserAdmin = ({ classes }) => {
    const [state, setState] = useState({
        page: 0,
        size: 10,
    });
    const [search, setSearch] = useState({
        text: '',
        status: -1,
        type: 3,
    });
    const [sttAndTotal, setSttAndTotal] = useState({
        stt: "",
        total: 0
    })
    const [listData, setListData] = useState([])
    const [listDataView, setListDataView] = useState([])
    const [dataUserAdmin, setDataUserAdmin] = useState({})
    const [isOpen, setIsOpen] = useState(false);
    const userApp = useSelector(state => state.userApp);
    const dispatch = useDispatch();
    useEffect(() => {
        loadPage();
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
            type: type
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
    const renderChirenToolbar = () => {
        const { type, status, text } = search;
        return (
            <div className="header-search">
                <div className="search-type">
                    <div className="search-name">Họ và tên</div>
                    <TextField
                        style={{ marginTop: 7 }}
                        id="outlined-textarea"
                        placeholder="Username/Họ và tên"
                        multiline
                        className={classes.textField + ' search-input-custom'}
                        margin="normal"
                        variant="outlined"
                        value={text}
                        onChange={(event) => handleChangeFilter(event, 'text')}
                    />
                </div>
                <div className="select-box-search">
                    <div className="search-name select-title-search">Loại tài khoản</div>
                    <SelectBox
                        listOption={[{ id: 3, name: "Tất cả" }, ...DataContants.listUser]}
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
                </div>
                <div className="select-box-search">
                    <div className="search-name select-title-search">Trạng thái</div>
                    <SelectBox
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
                </div>
            </div>
        )
    }

    const handleChangeFilter = (event, action) => {
        const { text, status, type } = search;
        let value = event && event.target ? event.target.value : event
        let textSearch = text
        textSearch = textSearch.trim().toLocaleLowerCase().unsignText()
        let dataSearch = [];
        let dataView = [];
        if (action === "text") {
            value = value.trim().toLocaleLowerCase().unsignText()
            if (status === -1 && type === 3) {
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
            if (type === 3) {
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
                        && item.user.type === Number(value)
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
    return (
        <div className="color-background-control">
            <Paper className={classes.root + " page-header"}>
                <div className={classes.tableWrapper + ' page-wrapper'}>
                    <div className="page-title">
                        <h2 className="title-page">Tài khoản nhân viên isofhpay</h2>
                        <Button className="button-new" variant="contained" color="primary" onClick={() => modalCreateUpdate()} >Thêm mới</Button>
                    </div>
                    {renderChirenToolbar()}
                    <Table aria-labelledby="tableTitle" className="style-table-new">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: "5%" }}>STT</TableCell>
                                <TableCell style={{ width: "10%" }}>Username</TableCell>
                                <TableCell style={{ width: "12%" }}>Họ và tên</TableCell>
                                <TableCell style={{ width: "15%" }}>Email</TableCell>
                                <TableCell style={{ width: "10%" }}>Ngày sinh</TableCell>
                                <TableCell style={{ width: "10%" }}>Loại tài khoản</TableCell>
                                <TableCell style={{ width: "10%" }}>Ngày tạo</TableCell>
                                <TableCell style={{ width: "10%" }}>Trạng thái</TableCell>
                                <TableCell style={{ width: "8%" }}>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
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
                                            <TableCell>{moment(item.user.createdDate).format("DD-MM-YYYY HH:mm:ss")}</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>{item.user.status === 1 ? "Đang hoạt động" : item.user.status === 2 ? "Đã khóa" : ""}</TableCell>
                                            <TableCell style={{ textAlign: "center" }}>
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton onClick={() => modalCreateUpdate(item)} color="primary" className={classes.button + " button-detail-user-card"} aria-label="EditIcon">
                                                        <img src="/images/edit.png" alt="" />
                                                    </IconButton>
                                                </Tooltip>
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
                        </TableBody>
                        <TableFooter>
                            <TableRow className="pagination-custom" >
                                <TablePagination
                                    colSpan={9}
                                    labelRowsPerPage="Số dòng trên trang"
                                    rowsPerPageOptions={[10, 20, 50, 100]}
                                    count={sttAndTotal.total}
                                    rowsPerPage={state.size}
                                    page={state.page}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </Paper>
            {isOpen && <ModalAddUpdate data={dataUserAdmin} useCallback={closeModal} />}
        </div>
    );
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
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});
export default withStyles(styles)(UserAdmin);