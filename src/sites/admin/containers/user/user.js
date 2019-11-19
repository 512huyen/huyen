import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import EnhancedTableToolbar from '../../components/table-toolbar';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import userProvider from '../../../../data-access/user-provider';
import { withStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '../../components/pagination/pagination';
import moment from 'moment';
import ModalAddUpdate from './create-update-user-admin';
import { DateTimeBoxSearch } from '../../../../components/input-field/InputField';
import TableFooter from '@material-ui/core/TableFooter';
import ReactCrop from 'react-image-crop'
import '../../../../components/input-field/cropImage/custom-image-crop.css';
import CropImage from '../../../../components/input-field/cropImage/cropImage';
class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            size: 10,
            text: '',
            title: '',
            index: '',
            info: '',
            data: [],
            total: 0,
            identification: '',
            phone: '',
            selected: [],
            progress: false,
            confirmDialog: false,
            tempDelete: [],
            modalAdd: false,
            dob: '',
            createdUser: '',
            status: -1,
            type: 8,
            totalPage: 0
        }
    }

    componentWillMount() {
        this.loadPage(true);
    }


    loadPage(item) {
        this.setState({ progress: true })
        let params = {
            page: this.state.page === 0 ? this.state.page + 1 : Number(this.state.page),
            size: this.state.size,
            text: this.state.text.trim(),
            status: this.state.status,
            type: this.state.type,
            identification: this.state.identification,
            dob: this.state.dob ? moment(this.state.dob).format("YYYY-MM-DD") : ""
        }
        userProvider.search(params, item ? true : false).then(s => {
            if (s && s.code === 0 && s.data) {
                let stt = 1 + (params.page - 1) * params.size;
                let temp = s.data.total / params.size;
                let _totalpage = Math.round(temp);
                let totalPage = (temp > _totalpage) ? (_totalpage + 1) : _totalpage;
                let dataPage = []
                for (let i = (params.page - 1) * 10; i < params.page * 10; i++) {
                    if (s.data.data[i]) {
                        dataPage.push(s.data.data[i])
                    }
                }
                this.setState({
                    data: s.data.data,
                    dataView: dataPage,
                    stt,
                    total: s.data.total,
                    totalPage: totalPage
                })
            } else if (s && s.code === 97) {
                this.handlelogOut();
            } else {
                this.setState({
                    data: []
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
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

    closeModal() {
        this.loadPage();
    }

    handlelogOut() {
        // let param = JSON.parse(localStorage.getItem('isofh'));
        localStorage.clear()
        window.location.href = '/dang-nhap';
    };
    handleChangeFilter(event, action, pageSize) {
        const { text, identification, phone, data, page, size } = this.state;
        let index = event.target.value
        index = index.trim().toLocaleLowerCase().unsignText()
        let phoneSearch = phone
        phoneSearch = phoneSearch.trim().toLocaleLowerCase().unsignText()
        let identificationSearch = identification
        identificationSearch = identification.trim().toLocaleLowerCase().unsignText()
        let textSearch = text
        textSearch = textSearch.trim().toLocaleLowerCase().unsignText()
        let dataSearchList = []
        if (action === 1) {
            let dataSearch = []
            let dataView = []
            if (phone.length == 0) {
                if (identification.length == 0) {
                    dataSearch = data
                } else {
                    dataSearch = (data || []).filter(item => {
                        return (item.user.identification || "").toLocaleLowerCase().unsignText().indexOf(identificationSearch) != -1
                    })
                }
            } else {
                if (identification.length == 0) {
                    dataSearch = (data || []).filter(item => {
                        return (item.user.phone || "").toLocaleLowerCase().unsignText().indexOf(phoneSearch) != -1
                    })
                } else {
                    let dataSearchIdentification = (data || []).filter(item => {
                        return (item.user.identification || "").toLocaleLowerCase().unsignText().indexOf(identificationSearch) != -1
                    })
                    dataSearch = (dataSearchIdentification || []).filter(item => {
                        return (item.user.phone || "").toLocaleLowerCase().unsignText().indexOf(phoneSearch) != -1
                    })
                }
            }
            dataSearchList = (dataSearch || []).filter(item => {
                return (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(index) != -1 || item.user.username.toLocaleLowerCase().unsignText().indexOf(index) != -1
            })
            let temp = dataSearchList.length / size;
            let _totalpage = Math.round(temp);
            let totalPage = (temp > _totalpage) ? (_totalpage + 1) : _totalpage;
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (dataSearchList[i]) {
                    dataView.push(dataSearchList[i])
                }
            }
            this.setState({
                text: event.target.value,
                dataSearchList: dataSearchList,
                dataView: dataView,
                totalPage: totalPage,
                total: dataSearchList.length,
            })
        }
        if (action === 2) {
            let dataSearch = []
            let dataView = []
            if (phone.length == 0) {
                if (text.length == 0) {
                    dataSearch = data
                } else {
                    dataSearch = (data || []).filter(item => {
                        return (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) != -1 || (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) != -1
                    })
                }
            } else {
                if (text.length == 0) {
                    dataSearch = (data || []).filter(item => {
                        return (item.user.phone || "").toLocaleLowerCase().unsignText().indexOf(phoneSearch) != -1
                    })
                } else {
                    let dataSearchText = (data || []).filter(item => {
                        return (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) != -1 || (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) != -1
                    })
                    dataSearch = (dataSearchText || []).filter(item => {
                        return (item.user.phone || "").toLocaleLowerCase().unsignText().indexOf(phoneSearch) != -1
                    })
                }
            }
            dataSearchList = (dataSearch || []).filter(item => {
                return (item.user.identification || "").trim().toLocaleLowerCase().unsignText().indexOf(index) != -1
            })
            let temp = dataSearchList.length / size;
            let _totalpage = Math.round(temp);
            let totalPage = (temp > _totalpage) ? (_totalpage + 1) : _totalpage;
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (dataSearchList[i]) {
                    dataView.push(dataSearchList[i])
                }
            }
            this.setState({
                identification: event.target.value,
                dataSearchList: dataSearchList,
                dataView: dataView,
                totalPage: totalPage,
                total: dataSearchList.length,
            })
        }
        if (action === 3) {
            let dataSearch = []
            let dataView = []
            if (identification.length == 0) {
                if (text.length == 0) {
                    dataSearch = data
                } else {
                    dataSearch = (data || []).filter(item => {
                        return (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) != -1 || (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) != -1
                    })
                }
            } else {
                if (text.length == 0) {
                    dataSearch = (data || []).filter(item => {
                        return (item.user.identification || "").toLocaleLowerCase().unsignText().indexOf(identificationSearch) != -1
                    })
                } else {
                    let dataSearchText = (data || []).filter(item => {
                        return (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) != -1 || (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) != -1
                    })
                    dataSearch = (dataSearchText || []).filter(item => {
                        return (item.user.identification || "").toLocaleLowerCase().unsignText().indexOf(identificationSearch) != -1
                    })
                }
            }
            dataSearchList = (dataSearch || []).filter(item => {
                return (item.user.phone || "").trim().toLocaleLowerCase().unsignText().indexOf(index) != -1
            })
            let temp = dataSearchList.length / size;
            let _totalpage = Math.round(temp);
            let totalPage = (temp > _totalpage) ? (_totalpage + 1) : _totalpage;
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (dataSearchList[i]) {
                    dataView.push(dataSearchList[i])
                }
            }
            this.setState({
                phone: event.target.value,
                dataSearchList: dataSearchList,
                dataView: dataView,
                totalPage: totalPage,
                total: dataSearchList.length,
            })
        }
        if (action === "page") {
            let dataView = []
            for (let i = pageSize * size; i < (pageSize + 1) * size; i++) {
                if (this.state.dataSearchList[i]) {
                    dataView.push(this.state.dataSearchList[i])
                }
            }
            this.setState({
                dataView: dataView,
                page: pageSize
            })
        }
        if (action === "size") {
            let dataView = []
            for (let i = page * pageSize; i < (page + 1) * pageSize; i++) {
                if (this.state.dataSearchList[i]) {
                    dataView.push(this.state.dataSearchList[i])
                }
            }
            this.setState({
                dataView: dataView,
                size: pageSize
            })
        }
    }
    closeDate() {
        this.setState({ progress: true, dob: null })
        let params = {
            page: this.state.page === 0 ? this.state.page + 1 : Number(this.state.page),
            size: this.state.size,
            text: this.state.text.trim(),
            status: this.state.status,
            type: this.state.type,
            identification: this.state.identification,
            dob: ""
        }
        userProvider.search(params).then(s => {
            if (s && s.code === 0 && s.data) {
                let stt = 1 + (params.page - 1) * params.size;
                let temp = s.data.total / params.size;
                let _totalpage = Math.round(temp);
                let totalPage = (temp > _totalpage) ? (_totalpage + 1) : _totalpage;
                this.setState({
                    data: s.data.data,
                    stt,
                    total: s.data.total,
                    totalPage: totalPage
                })
            } else if (s && s.code === 97) {
                this.handlelogOut();
            } else {
                this.setState({
                    data: []
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }
    renderChirenToolbar() {
        const { classes } = this.props;
        const { identification, text, phone } = this.state;
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
                <div className="search-type">
                    <div className="search-name">CMND/Hộ chiếu</div>
                    <TextField
                        style={{ marginTop: 7 }}
                        id="outlined-textarea"
                        placeholder="Nhập sổ"
                        multiline
                        className={classes.textField + ' search-input-custom'}
                        margin="normal"
                        variant="outlined"
                        value={identification}
                        onChange={(event) => this.handleChangeFilter(event, 2)}
                    />
                </div>
                <div className="search-type">
                    <div className="search-name">Số điện thoại</div>
                    <TextField
                        style={{ marginTop: 7 }}
                        id="outlined-textarea"
                        placeholder="Nhập sổ"
                        multiline
                        className={classes.textField + ' search-input-custom'}
                        margin="normal"
                        variant="outlined"
                        value={phone}
                        onChange={(event) => this.handleChangeFilter(event, 3)}
                    />
                </div>
                <div className="search-type">
                    <div className="search-name" style={{ marginBottom: -12 }}>Ngày sinh</div>
                    <div className="date-picker-style-header">
                        <DateTimeBoxSearch
                            value={this.state.dob}
                            onChangeValue={(event) => {
                                this.setState({ dob: event }, () => this.loadPage(true))
                            }}
                            placeholder="Ngày sinh"
                        />
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { dataView, page, progress, selected, stt, total, size, dataUserAdmin } = this.state;
        return (
            <div>
                <Paper className={classes.root + " page-header"}>
                    <div className={classes.tableWrapper + ' page-wrapper'}>
                        <div className="page-title">
                            <h2 className="title-page">Tài khoản Người bệnh</h2>
                            {/* <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} >Thêm mới</Button> */}
                            <CropImage />
                        </div>
                        <EnhancedTableToolbar
                            className="ahihi"
                            numSelected={selected.length}
                            actionsChiren={
                                this.renderChirenToolbar()
                            }
                        />
                        {progress ? <LinearProgress /> : null}
                        <Table aria-labelledby="tableTitle" className="style-table-new">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: "7%" }}>STT</TableCell>
                                    <TableCell style={{ width: "16%" }}>Username</TableCell>
                                    <TableCell style={{ width: "13%" }}>Họ và tên</TableCell>
                                    <TableCell style={{ width: "12%" }}>Ngày sinh</TableCell>
                                    <TableCell style={{ width: "12%" }}>Giới tính</TableCell>
                                    <TableCell style={{ width: "13%" }}>CMND/Hộ chiếu</TableCell>
                                    <TableCell style={{ width: "13%" }}>SĐT</TableCell>
                                    <TableCell style={{ width: "14%" }}>Ngày tạo</TableCell>
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
                                            <TableCell colSpan="8">{this.state.name ? 'Không có kết quả phù hợp' :
                                                this.state.text ? 'Không có kết quả phù hợp' :
                                                    this.state.dob ? 'Không có kết quả phù hợp' :
                                                        this.state.status ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
                                        </TableRow>
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow className="pagination-custom" >
                                    <TablePagination
                                        colSpan={8}
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

export default withStyles(styles)(connect(mapStateToProps)(User));