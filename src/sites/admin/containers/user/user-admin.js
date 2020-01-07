import React, { Component } from 'react';
import { connect } from 'react-redux';
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
class UserAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 10,
            sizeSearch: 99999,
            text: '',
            title: '',
            index: '',
            info: '',
            data: [],
            total: 0,
            selected: [],
            confirmDialog: false,
            tempDelete: [],
            modalAdd: false,
            createdDate: '',
            createdUser: '',
            status: -1,
            type: 3,
        }
    }
    componentWillMount() {
        this.loadPage();
    }
    loadPage(item) {
        let params = {
            page: Number(this.state.page) + 1,
            size: this.state.sizeSearch,
            text: this.state.text.trim(),
            status: this.state.status,
            type: this.state.type,
        }
        if (this.props.userApp.listUserAdmin && this.props.userApp.listUserAdmin.length !== 0 && !item) {
            let dataPage = []
            for (let i = (params.page - 1) * this.state.size; i < params.page * this.state.size; i++) {
                if (this.props.userApp.listUserAdmin[i]) {
                    dataPage.push(this.props.userApp.listUserAdmin[i])
                }
            }
            this.setState({
                data: this.props.userApp.listUserAdmin,
                dataSearch: this.props.userApp.listUserAdmin,
                dataView: dataPage,
                total: this.props.userApp.listUserAdmin.length,
                stt: 1 + ((Number(this.state.page) >= 1 ? this.state.page : 1) - 1) * this.state.size
            })
        } else {
            userProvider.search(params).then(s => {
                if (s && s.code === 0 && s.data) {
                    debugger
                    this.props.dispatch(listUserAdmin(s.data.data))
                    let stt = 1 + (params.page - 1) * this.state.size;
                    let dataPage = []
                    for (let i = (params.page - 1) * this.state.size; i < params.page * this.state.size; i++) {
                        if (s.data.data[i]) {
                            dataPage.push(s.data.data[i])
                        }
                    }
                    this.setState({
                        dataView: dataPage,
                        dataSearch: s.data.data,
                        data: s.data.data,
                        stt,
                        total: s.data.total,
                    })
                }
            }).catch(e => {
            })
        }
    }
    modalCreateUpdate(item) {
        if (item) {
            this.setState({
                modalAdd: true,
                dataUserAdmin: item,
            })
        } else {
            this.setState({
                modalAdd: true,
                dataUserAdmin: {},
            })
        }
    }
    handleChangePage = (event, action) => {
        this.setState({
            page: action,
            selected: []
        }, () => {
            this.handleChangeFilter("", "page", action)
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ size: event.target.value }, () => {
            this.handleChangeFilter("", "size", event.target.value)
        });
    };

    showModalDelete(item) {
        this.setState({
            confirmDialog: true,
            tempDelete: item
        })
    }

    closeModal(item) {
        this.loadPage(item);
        this.setState({ modalAdd: false });
    }

    handlelogOut() {
        localStorage.clear()
        window.location.href = '/dang-nhap';
    };
    handleChangeFilter(event, action, pageSize) {
        const { text, type, status, page, size, data } = this.state
        let textSearch = text
        textSearch = textSearch.trim().toLocaleLowerCase().unsignText()
        let dataSearchChange = []
        if (action === 1) {
            let dataSearch = []
            let dataView = []
            let index = event.target.value
            index = index.trim().toLocaleLowerCase().unsignText()
            if (type === 3) {
                if (status === -1) {
                    dataSearchChange = data
                } else {
                    dataSearchChange = (data || []).filter(item => {
                        return (item.user.status === Number(status))
                    })
                }
            } else {
                if (status === -1) {
                    dataSearchChange = (data || []).filter(item => {
                        return (item.user.type === Number(type))
                    })
                } else {
                    let dataSearchType = (data || []).filter(item => {
                        return (item.user.type === Number(type))
                    })
                    dataSearchChange = (dataSearchType || []).filter(item2 => {
                        return (item2.user.status === Number(status))
                    })
                }
            }
            dataSearch = (dataSearchChange || []).filter(item => {
                return (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(index) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(index) !== -1
            })
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (dataSearch[i]) {
                    dataView.push(dataSearch[i])
                }
            }
            this.setState({
                dataSearch: dataSearch,
                dataView: dataView,
                total: dataSearch.length,
                text: event.target.value
            })
        }
        if (action === 2) {
            let dataSearch = []
            let dataView = []
            if (status === -1) {
                if ((text || "").length === 0) {
                    dataSearchChange = data
                } else {
                    dataSearchChange = (data || []).filter(item => {
                        return (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1
                    })
                }
            } else {
                if ((text || "").length === 0) {
                    dataSearchChange = (data || []).filter(item => {
                        return (item.user.status === Number(status))
                    })
                } else {
                    let dataSearchStatus = (data || []).filter(item => {
                        return (item.user.status === Number(status))
                    })
                    dataSearchChange = (dataSearchStatus || []).filter(item => {
                        return (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1
                    })
                }
            }
            if (event === 3) {
                dataSearch = dataSearchChange
            } else {
                dataSearch = (dataSearchChange || []).filter(item => {
                    return (item.user.type === Number(event))
                })
            }
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (dataSearch[i]) {
                    dataView.push(dataSearch[i])
                }
            }
            this.setState({
                dataSearch: dataSearch,
                dataView: dataView,
                total: dataSearch.length,
                type: event
            })
        }
        if (action === 3) {
            let dataSearch = []
            let dataView = []
            if (type === 3) {
                if ((text || "").length === 0) {
                    dataSearchChange = data
                } else {
                    dataSearchChange = (data || "").filter(item => {
                        return (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1
                    })
                }
            } else {
                if ((text || "").length === 0) {
                    dataSearchChange = (data || []).filter(item => {
                        return (item.user.type === Number(type))
                    })
                } else {
                    let dataSearchType = (data || []).filter(item => {
                        return (item.user.type === Number(type))
                    })
                    dataSearchChange = (dataSearchType || []).filter(item => {
                        return (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1
                    })
                }
            }
            if (event === -1) {
                dataSearch = dataSearchChange
            } else {
                dataSearch = (dataSearchChange || []).filter(item => {
                    return (item.user.status === Number(event))
                })
            }
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (dataSearch[i]) {
                    dataView.push(dataSearch[i])
                }
            }
            this.setState({
                dataSearch: dataSearch,
                dataView: dataView,
                total: dataSearch.length,
                status: event
            })
        }
        if (action === "page") {
            let dataView = []
            for (let i = pageSize * size; i < (pageSize + 1) * size; i++) {
                if (this.state.dataSearch[i]) {
                    dataView.push(this.state.dataSearch[i])
                }
            }
            this.setState({
                dataView: dataView,
                page: pageSize,
                stt: 1 + pageSize * this.state.size
            })
        }
        if (action === "size") {
            let dataView = []
            for (let i = page * pageSize; i < (page + 1) * pageSize; i++) {
                if (this.state.dataSearch[i]) {
                    dataView.push(this.state.dataSearch[i])
                }
            }
            this.setState({
                dataView: dataView,
                size: pageSize
            })
        }
    }
    renderChirenToolbar() {
        const { classes } = this.props;
        const { type, status, text } = this.state;
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
                        onChange={(event) => this.handleChangeFilter(event, 1)}
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
                            this.handleChangeFilter(ids, 2)
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
                            this.handleChangeFilter(ids, 3)
                        }}
                    />
                </div>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { dataView, page, stt, total, size, dataUserAdmin } = this.state;
        return (
            <div className="color-background-control">
                <Paper className={classes.root + " page-header"}>
                    <div className={classes.tableWrapper + ' page-wrapper'}>
                        <div className="page-title">
                            <h2 className="title-page">Tài khoản nhân viên isofhpay</h2>
                            <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} >Thêm mới</Button>
                        </div>
                        {this.renderChirenToolbar()}
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
                                    dataView && dataView.length ? dataView.map((item, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                key={index}
                                                tabIndex={-1}>
                                                <TableCell>{index + stt}</TableCell>
                                                <TableCell className="user-name-table"><span className="trim-text">{item.user.username}</span></TableCell>
                                                <TableCell>{item.user.name}</TableCell>
                                                <TableCell>{item.user.email}</TableCell>
                                                <TableCell>{moment(item.user.dob).format("DD-MM-YYYY")}</TableCell>
                                                <TableCell>{item.user.type === 1 ? "Admin" : item.user.type === 2 ? "Nhân viên" : ""}</TableCell>
                                                <TableCell>{moment(item.user.createdDate).format("DD-MM-YYYY HH:mm:ss")}</TableCell>
                                                <TableCell>{item.user.status === 1 ? "Đang hoạt động" : item.user.status === 2 ? "Đã khóa" : ""}</TableCell>
                                                <TableCell>
                                                    <Tooltip title="Chỉnh sửa">
                                                        <IconButton onClick={() => this.modalCreateUpdate(item)} color="primary" className={classes.button + " button-detail-user-card"} aria-label="EditIcon">
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
                                                    (this.state.text || this.state.type || this.state.status) ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
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
                                        count={total}
                                        rowsPerPage={size}
                                        page={page}
                                        onChangePage={this.handleChangePage}
                                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </Paper>
                {this.state.modalAdd && <ModalAddUpdate data={dataUserAdmin} callbackOff={this.closeModal.bind(this)} />}
            </div>
        );
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

export default withStyles(styles)(connect(mapStateToProps)(UserAdmin));