import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
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
import userProvider from '../../../../data-access/user-provider';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '../../components/pagination/pagination';
import moment from 'moment';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { DateTimeBoxSearch } from '../../../../components/input-field/InputField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ModalDetail from './detail-transaction-history';
import { Grid } from '@material-ui/core';
import '../../css/SLBanGiaoThe.css';
import TableFooter from '@material-ui/core/TableFooter';
import Tooltip from '@material-ui/core/Tooltip';


class TransactionHistoryHospital extends Component {
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
            selected: [],
            progress: false,
            confirmDialog: false,
            tempDelete: [],
            modalAdd: false,
            modalDetail: false,
            dob: '',
            createdUser: '',
            status: -1,
            type: 8,
            totalPage: 0,
            code: 100000
        }
    }

    componentWillMount() {
        this.loadPage();
    }


    loadPage() {
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
        userProvider.search(params).then(s => {
            if (s && s.code == 0 && s.data) {
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
            } else if (s && s.code == 97) {
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
            this.loadPage()
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ size: event.target.value }, () => {
            this.loadPage()
        });
    };

    closeModal() {
        this.setState({
            modalDetail: false
        })
        this.loadPage();
    }

    handlelogOut() {
        // let param = JSON.parse(localStorage.getItem('isofh'));
        localStorage.clear()
        window.location.href = '/dang-nhap';
    };
    handleChangeFilter(event, action) {
        if (action == 1) {
            this.setState({
                page: 0,
                text: event.target.value
            }, () => {
                if (this.clearTimeOutAffterRequest) {
                    try {
                        clearTimeout(this.clearTimeOutAffterRequest);

                    } catch (error) {

                    }
                }
                this.clearTimeOutAffterRequest = setTimeout(() => {
                    this.loadPage()
                }, 500)
            })
        }
        if (action == 2) {
            this.setState({
                page: 0,
                identification: event.target.value
            }, () => {
                if (this.clearTimeOutAffterRequest) {
                    try {
                        clearTimeout(this.clearTimeOutAffterRequest);

                    } catch (error) {

                    }
                }
                this.clearTimeOutAffterRequest = setTimeout(() => {
                    this.loadPage()
                }, 500)
            })
        }
    }
    modalDetail(item) {
        this.setState({
            modalDetail: true,
            dataHospital: item,
        })
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
            if (s && s.code == 0 && s.data) {
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
            } else if (s && s.code == 97) {
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
    formatCardNumber(value) {
        var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        var matches = v.match(/\d{4,16}/g);
        var match = matches && matches[0] || ''
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
    renderChirenToolbar() {
        const { classes } = this.props;
        const { type, identification, dob, status } = this.state;
        return (
            <div className="header-search">
                <div className="search-type">
                    <div className="search-name">Phương thức thanh toán</div>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <Select
                            className="select-style"
                            value={status}
                            onChange={(event) => this.handleChangeFilter(event, 3)}
                            input={
                                <OutlinedInput
                                    name="age"
                                    id="outlined-age-simple"
                                    labelWidth={0}
                                />
                            }>
                            <MenuItem value='-1'>Tất cả</MenuItem>
                            <MenuItem value='1'>Đang hoạt động</MenuItem>
                            <MenuItem value='2'>Đã khóa</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="search-type">
                    <div className="search-name">Nhà cung cấp</div>
                    <TextField
                        id="outlined-textarea"
                        placeholder="Tên nhà cung cấp"
                        multiline
                        className={classes.textField + ' search-input-custom'}
                        margin="normal"
                        variant="outlined"
                        value={status}
                        onChange={(event) => this.handleChangeFilter(event, 2)}
                    />
                </div>
                <div className="search-type">
                    <div className="search-name">Loại giao dịch</div>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <Select
                            className="select-style"
                            value={status}
                            onChange={(event) => this.handleChangeFilter(event, 3)}
                            input={
                                <OutlinedInput
                                    name="age"
                                    id="outlined-age-simple"
                                    labelWidth={0}
                                />
                            }>
                            <MenuItem value='-1'>Tất cả</MenuItem>
                            <MenuItem value='1'>Đang hoạt động</MenuItem>
                            <MenuItem value='2'>Đã khóa</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="search-type">
                    <div className="search-name" style={{ marginBottom: -12 }}>Từ ngày</div>
                    <div className="date-picker-style-header" style={{ marginRight: 14 }}>
                        <DateTimeBoxSearch
                            value={this.state.dob}
                            onChangeValue={(event) => {
                                this.setState({ dob: event }, () => this.loadPage())
                            }}
                            placeholder="Từ ngày"
                        />
                    </div>
                </div>
                <div className="search-type">
                    <div className="search-name" style={{ marginBottom: -12 }}>Đến ngày</div>
                    <div className="date-picker-style-header">
                        <DateTimeBoxSearch
                            value={this.state.dob}
                            onChangeValue={(event) => {
                                this.setState({ dob: event }, () => this.loadPage())
                            }}
                            placeholder="Đến ngày"
                        />
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { data, page, progress, selected, stt, total, size, totalPage, status, text, code, dataHospital } = this.state;
        return (
            <div>
                <Paper className={classes.root + " page-header"}>
                    <div className={classes.tableWrapper + ' page-wrapper'}>
                        <div className="page-title">
                            <h2 className="title-page">Lịch sử giao dịch</h2>
                        </div>
                        <div>
                            <EnhancedTableToolbar
                                numSelected={selected.length}
                                actionsChiren={
                                    this.renderChirenToolbar()
                                }
                            />
                        </div>
                        {progress ? <LinearProgress /> : null}
                        <Table aria-labelledby="tableTitle" className="style-table-new">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: "4%" }}></TableCell>
                                    <TableCell style={{ width: "20%" }}>Ngày giao dịch</TableCell>
                                    <TableCell style={{ width: "8%" }}>Số tiền</TableCell>
                                    <TableCell style={{ width: "8%" }}>Mã NB</TableCell>
                                    <TableCell style={{ width: "8%" }}>Mã hồ sơ</TableCell>
                                    <TableCell style={{ width: "8%" }}>Tên người gửi</TableCell>
                                    <TableCell style={{ width: "8%" }}>Tên người nhận</TableCell>
                                    <TableCell style={{ width: "12%" }}>Nội dung thanh toán</TableCell>
                                    <TableCell style={{ width: "8%" }}>Trạng thái</TableCell>
                                    <TableCell style={{ width: "10%" }}></TableCell>
                                    <TableCell style={{ width: "6%" }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <Select
                                                className="select-style-search-down select-style-width"
                                                value={status}
                                                onChange={(event) => this.handleChangeFilter(event, 3)}
                                                input={
                                                    <OutlinedInput
                                                        name="age"
                                                        id="outlined-age-simple"
                                                        labelWidth={0}
                                                    />
                                                }>
                                                <MenuItem value='-1'>Tất cả</MenuItem>
                                                <MenuItem value='1'>Đang hoạt động</MenuItem>
                                                <MenuItem value='2'>Đã khóa</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            style={{ marginTop: 7 }}
                                            id="outlined-textarea"
                                            placeholder="Mã NB"
                                            multiline
                                            className={classes.textField + ' search-input-custom search-input-custom-width'}
                                            margin="normal"
                                            variant="outlined"
                                            value={text}
                                            onChange={(event) => this.handleChangeFilter(event, 1)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            style={{ marginTop: 7 }}
                                            id="outlined-textarea"
                                            placeholder="Mã hồ sơ"
                                            multiline
                                            className={classes.textField + ' search-input-custom search-input-custom-width'}
                                            margin="normal"
                                            variant="outlined"
                                            value={text}
                                            onChange={(event) => this.handleChangeFilter(event, 1)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            style={{ marginTop: 7 }}
                                            id="outlined-textarea"
                                            placeholder="Nhập tên"
                                            multiline
                                            className={classes.textField + ' search-input-custom search-input-custom-width-2'}
                                            margin="normal"
                                            variant="outlined"
                                            value={text}
                                            onChange={(event) => this.handleChangeFilter(event, 1)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            style={{ marginTop: 7 }}
                                            id="outlined-textarea"
                                            placeholder="Nhập tên"
                                            multiline
                                            className={classes.textField + ' search-input-custom search-input-custom-width-2'}
                                            margin="normal"
                                            variant="outlined"
                                            value={text}
                                            onChange={(event) => this.handleChangeFilter(event, 1)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            style={{ marginTop: 7 }}
                                            id="outlined-textarea"
                                            placeholder="Nhập nội dung thanh toán"
                                            multiline
                                            className={classes.textField + ' search-input-custom search-input-custom-width-3'}
                                            margin="normal"
                                            variant="outlined"
                                            value={text}
                                            onChange={(event) => this.handleChangeFilter(event, 1)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <Select
                                                className="select-style-search-down select-style-width-2"
                                                value={status}
                                                onChange={(event) => this.handleChangeFilter(event, 3)}
                                                input={
                                                    <OutlinedInput
                                                        name="age"
                                                        id="outlined-age-simple"
                                                        labelWidth={0}
                                                    />
                                                }>
                                                <MenuItem value='-1'>Tất cả</MenuItem>
                                                <MenuItem value='1'>Đang hoạt động</MenuItem>
                                                <MenuItem value='2'>Đã khóa</MenuItem>
                                            </Select>
                                        </FormControl>
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
                                                tabIndex={-1}>
                                                <TableCell><img src="/images/back1.png" alt="" style={{ marginLeft: 15 }} /></TableCell>
                                                <TableCell>{moment(item.user.createdDate).format("HH:mm:ss - DD/MM/YYYY")}</TableCell>
                                                <TableCell className="history-font color-active">+ {code.formatPrice()}</TableCell>
                                                <TableCell>{item.user.code}</TableCell>
                                                <TableCell>{item.user.code}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="name-user">{item.user.name}</div>
                                                        <div>{this.formatCardNumber(item.user.code)}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="name-user">{item.user.name}</div>
                                                        <div>{this.formatCardNumber(item.user.code)}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell style={{ width: 263 }}>Nguyen Thi Lam thanh toán khám bệnh tại khoa khám bệnh</TableCell>
                                                <TableCell className="color-inActive">Không thành công</TableCell>
                                                <TableCell><img src="/images/logo.png" alt="" style={{ maxWidth: 50, maxHeight: 50 }} /></TableCell>
                                                <TableCell>
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton onClick={() => this.modalDetail(item)} color="primary" className={classes.button + " button-detail-user-card font-size-hospital"} aria-label="EditIcon">
                                                            <img src="/images/detail.png" alt="" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                        :
                                        <TableRow>
                                            <TableCell colSpan="11">{this.state.name ? 'Không có kết quả phù hợp' :
                                                this.state.text ? 'Không có kết quả phù hợp' :
                                                    this.state.dob ? 'Không có kết quả phù hợp' :
                                                        this.state.status ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
                                        </TableRow>
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow className="pagination-custom" >
                                    <TablePagination
                                        colSpan={11}
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
                {this.state.modalDetail && <ModalDetail data={dataHospital} callbackOff={this.closeModal.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(TransactionHistoryHospital));