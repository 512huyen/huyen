import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import EnhancedTableToolbar from '../../components/table-toolbar';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import userProvider from '../../../../data-access/user-provider';
import hospitalProvider from '../../../../data-access/hospital-provider';
import { withStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '../../components/pagination/pagination';
import moment from 'moment';
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
import DataContants from '../../../../config/data-contants';
import { SelectBox } from '../../../../components/input-field/InputField';
class TransactionHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            size: 10,
            text: '',
            title: '',
            index: '',
            info: '',
            name: '',
            data: [],
            total: 0,
            selected: [],
            progress: false,
            confirmDialog: false,
            tempDelete: [],
            listHospital: [],
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
        // this.loadPage();
        this.getHospital()
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
            dob: this.state.dob ? moment(this.state.dob).format("YYYY-MM-DD") : "",
            hospitalId: item ? item : this.state.hospitalId
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
    getHospital() {
        this.setState({ progress: true })
        let params = {
            page: 1,
            size: 99999
        }
        hospitalProvider.search(params).then(s => {
            if (s && s.data && s.code === 0) {
                this.setState({
                    listHospital: s.data.data
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({
                progress: false
            })
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
    checkHospital(item) {
        this.setState({
            data: [],
            hospitalId: item.hospital.id,
            name: item.hospital.name
        }, () => this.loadPage(item.hospital.id))
    }
    renderChirenToolbar() {
        const { classes } = this.props;
        const { type, identification, dob, status } = this.state;
        return (
            <div className="header-search">
                <div className="select-box-search">
                    <div className="search-name select-title-search">Phương thức thanh toán</div>
                    <SelectBox
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
                            this.handleChangeFilter(ids, 2)
                        }}
                    />
                </div>
                <div className="select-box-search">
                    <div className="search-name select-title-search">Nhà cung cấp</div>
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
                <div className="select-box-search">
                    <div className="search-name select-title-search">Loại giao dịch</div>
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
        const { data, page, progress, selected, listHospital, total, size, status, text, code, dataHospital, name } = this.state;
        return (
            <div>
                <Paper className={classes.root + " page-header"}>
                    <div className={classes.tableWrapper + ' page-wrapper'}>
                        <div className="page-title">
                            <h2 className="title-page">Lịch sử giao dịch</h2>
                            {/* <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} >Thêm mới</Button> */}
                        </div>
                        <Grid container spacing={16} className="card-main-left-hostory">
                            <Grid item xs={12} md={12} className="card-main-left">
                                <div className="div_content">
                                    <div className="chon">
                                        {
                                            listHospital && listHospital.length > 0 ? listHospital.map((item, index) => {
                                                return (
                                                    <div key={index} className="div_anh-hostory">
                                                        <input type="radio" id={"s-option" + index} name="selector" className="card-option" />
                                                        <label htmlFor={"s-option" + index} className="card-option-2" >
                                                            <div className="check check-history" onClick={() => this.checkHospital(item)}>
                                                                <img src={item.hospital && item.hospital.logo && item.hospital.logo.absoluteUrl()} className="logo_anh " />
                                                                <img src="/images/checked.png" className="check_box" />
                                                                <div className="inside"></div>
                                                            </div>
                                                        </label>
                                                    </div>
                                                )
                                            }) : null
                                        }
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        <div className="name-history">{name}</div>
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
                                    <TableCell style={{ width: "8%" }}>Tên người bệnh</TableCell>
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
                                            placeholder="Nhập tên NB"
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
                                                tabIndex={-1}
                                                className="transaction-history-tr">
                                                <TableCell className="transaction-history-index-1"><img src="/images/back1.png" alt="" /></TableCell>
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
                                                <TableCell>Nguyen Thi Lam thanh toán khám bệnh tại khoa khám bệnh</TableCell>
                                                <TableCell className="color-inActive">Không thành công</TableCell>
                                                <TableCell><img src="/images/logobvdhy_2.png" alt="" style={{ maxWidth: 50, maxHeight: 50 }} /></TableCell>
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

export default withStyles(styles)(connect(mapStateToProps)(TransactionHistory));