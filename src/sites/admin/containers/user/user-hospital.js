import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import EnhancedTableToolbar from '../../components/table-toolbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import hospitalProvider from '../../../../data-access/hospital-provider';
import userProvider from '../../../../data-access/user-provider';
import { withStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '../../components/pagination/pagination';
import moment from 'moment';
import ModalAddUpdate from './create-update-user-hospital';
import TableFooter from '@material-ui/core/TableFooter';
import Tooltip from '@material-ui/core/Tooltip';
import DataContants from '../../../../config/data-contants';
import { SelectBox } from '../../../../components/input-field/InputField';
import stringUtils from 'mainam-react-native-string-utils';

class UserHospital extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            size: 10,
            text: "",
            title: '',
            index: '',
            info: '',
            data: [],
            total: 0,
            selected: [],
            progress: false,
            confirmDialog: false,
            tempDelete: [],
            listHospital: [],
            dataView: [],
            dataSearch: [],
            modalAdd: false,
            createdDate: '',
            createdUser: '',
            status: -1,
            type: 4,
            totalPage: 0
        }
    }

    componentWillMount() {
        this.loadPage();
        this.getHospital()
    }


    loadPage(item) {
        this.setState({ progress: true })
        let params = {
            page: this.state.page === 0 ? this.state.page + 1 : Number(this.state.page) + 1,
            size: this.state.size,
            text: this.state.text.trim(),
            status: this.state.status,
            type: this.state.type,
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
    getHospital() {
        this.setState({ progress: true })
        let params = {
            page: 1,
            size: "99999"
        }
        hospitalProvider.search(params).then(s => {
            if (s && s.code === 0 && s.data) {
                let dataTemp = [{
                    hospital: {
                        id: -1,
                        name: '--- Chọn CSYT (*)---'
                    }
                }]
                for (var i = 0; i < s.data.data.length; i++) {
                    dataTemp.push(s.data.data[i])
                }
                this.setState({
                    listHospital: dataTemp
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
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
        // let param = JSON.parse(localStorage.getItem('isofh'));
        localStorage.clear()
        window.location.href = '/dang-nhap';
    };
    handleChangeFilter(event, action, pageSize) {
        const { status, text, data, size, page } = this.state
        if (action === 1) {
            let dataSearch = []
            let dataView = []
            let index = event.target.value
            index = index.toString().toLocaleLowerCase().unsignText()
            let dataSearchStatus = []
            if (status != -1) {
                dataSearchStatus = (data || []).filter(item => {
                    if (item.user.status == Number(status))
                        return item
                })
            } else {
                dataSearchStatus = data
            }
            dataSearch = (dataSearchStatus || []).filter(item => {
                return (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(index) != -1 || (item.user.hospital && item.user.hospital.name.toLocaleLowerCase().unsignText().indexOf(index) != -1)
            })
            let temp = dataSearch.length / size;
            let _totalpage = Math.round(temp);
            let totalPage = (temp > _totalpage) ? (_totalpage + 1) : _totalpage;
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (dataSearch[i]) {
                    dataView.push(dataSearch[i])
                }
            }
            this.setState({
                text: event.target.value,
                dataSearch: dataSearch,
                total: dataSearch.length,
                totalPage: totalPage,
                dataView: dataView
            })
        }
        if (action === 2) {
            let dataSearch = []
            let dataView = []
            let index = event
            let dataSearchStatus = []
            if (text && text.length > 0) {
                let textName = text.trim().toLocaleLowerCase().unsignText();
                dataSearchStatus = (data || []).filter(item => {
                    return item.user.username.toLocaleLowerCase().unsignText().indexOf(textName) != -1 || (item.user.hospital && item.user.hospital.name.toLocaleLowerCase().unsignText().indexOf(textName) != -1)
                })
            } else {
                dataSearchStatus = data
            }
            if (event == -1) {
                dataSearch = dataSearchStatus
            } else {
                dataSearch = (dataSearchStatus || []).filter(item => {
                    if (item.user.status == index)
                        return item
                })
            }
            let temp = dataSearch.length / size;
            let _totalpage = Math.round(temp);
            let totalPage = (temp > _totalpage) ? (_totalpage + 1) : _totalpage;
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (dataSearch[i]) {
                    dataView.push(dataSearch[i])
                }
            }
            this.setState({
                status: event,
                dataSearch: dataSearch,
                total: dataSearch.length,
                totalPage: totalPage,
                dataView: dataView
            })
        }
        if (action === "page"){
            let dataView = []
            for (let i = pageSize * size; i < (pageSize + 1) * size; i++) {
                if (this.state.dataSearch[i]) {
                    dataView.push(this.state.dataSearch[i])
                }
            }
            this.setState({
                dataView: dataView,
                page: pageSize
            })
        }
        if (action === "size"){
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
        const { status, text } = this.state;
        return (
            <div className="header-search">
                <div className="search-type">
                    <div className="search-name">Tên CSYT</div>
                    <TextField
                        style={{ marginTop: 7 }}
                        id="outlined-textarea"
                        placeholder="username/tên CSYT"
                        multiline
                        className={classes.textField + ' search-input-custom'}
                        margin="normal"
                        variant="outlined"
                        value={text}
                        onChange={(event) => this.handleChangeFilter(event, 1)}
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
                            this.handleChangeFilter(ids, 2)
                        }}
                    />
                </div>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { dataView, page, progress, selected, stt, total, size, dataUserAdmin, listHospital } = this.state;
        return (
            <div>
                <Paper className={classes.root + " page-header"}>
                    <div className={classes.tableWrapper + ' page-wrapper'}>
                        <div className="page-title">
                            <h2 className="title-page">Tài khoản CSYT</h2>
                            <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} >Thêm mới</Button>
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
                                    <TableCell style={{ width: "18%" }}>Logo CSYT</TableCell>
                                    <TableCell style={{ width: "7%" }}>STT</TableCell>
                                    <TableCell style={{ width: "15%" }}>Username</TableCell>
                                    <TableCell style={{ width: "20%" }}>Tên CSYT</TableCell>
                                    <TableCell style={{ width: "15%" }}>Ngày tạo</TableCell>
                                    <TableCell style={{ width: "15%" }}>Trạng thái</TableCell>
                                    <TableCell style={{ width: "10%" }}>Hành động</TableCell>
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
                                                <TableCell>
                                                    <img src={item.user.image.absoluteUrl()} alt="" style={{ height: 45 }} />
                                                </TableCell>
                                                <TableCell>{index + stt}</TableCell>
                                                <TableCell>{item.user.username}</TableCell>
                                                <TableCell>{item.user.hospital && item.user.hospital.name}</TableCell>
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
                                            <TableCell colSpan="7">{this.state.name ? 'Không có kết quả phù hợp' :
                                                this.state.text ? 'Không có kết quả phù hợp' :
                                                    this.state.status ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
                                        </TableRow>
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow className="pagination-custom" >
                                    <TablePagination
                                        colSpan={7}
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
                {this.state.modalAdd && <ModalAddUpdate data={dataUserAdmin} listHospital={listHospital} callbackOff={this.closeModal.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(UserHospital));