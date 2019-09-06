import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import EnhancedTableToolbar from '../../components/table-toolbar';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import hospitalBankProvider from '../../../../data-access/hospital-bank-provider';
import paymentAgentProvider from '../../../../data-access/paymentAgent-provider';
import paymentMethodProvider from '../../../../data-access/payment-method-provider';
import hospitalProvider from '../../../../data-access/hospital-provider';
import { withStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '../../components/pagination/pagination';
import moment from 'moment';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ModalAddUpdate from './create-update-hospital-bank';
import ModalDetail from './detail-hosital-bank';
import TableFooter from '@material-ui/core/TableFooter';
import DataContants from '../../../../config/data-contants';
import Tooltip from '@material-ui/core/Tooltip';

class BankCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            size: 10,
            hospitalId: -1,
            paymentAgentId: -1,
            paymentMethod: -1,
            data: [],
            total: 0,
            selected: [],
            progress: false,
            confirmDialog: false,
            tempDelete: [],
            dataHospital: [],
            dataHospitalBank: [],
            listPaymentAgent: [],
            modalDetail: false,
            modalAdd: false,
            status: -1,
            type: -1,
            totalPage: 0
        }
    }

    componentWillMount() {
        this.loadPage();
        this.getHospital();
        this.getPaymentAgent();
    }
    loadPage() {
        this.setState({ progress: true })
        let params = {
            page: this.state.page === 0 ? this.state.page + 1 : Number(this.state.page) + 1,
            size: this.state.size,
            hospitalId: this.state.hospitalId,
            paymentAgentId: this.state.paymentAgentId,
            paymentMethod: this.state.paymentMethod,
            status: this.state.status,
            type: this.state.type
        }
        hospitalBankProvider.search(params).then(s => {
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
    getHospital() {
        this.setState({ progress: true })
        let params = {
            page: 1,
            size: 99999,
            status: 1
        }
        hospitalProvider.search(params).then(s => {
            if (s && s.code === 0 && s.data) {
                let dataTemplate = {
                    hospital: {
                        id: -1,
                        name: "Tất cả"
                    }
                }
                let dataList = s.data.data
                dataList.splice(0, 0, dataTemplate)
                this.setState({
                    dataHospital: dataList
                })
            } else {
                this.setState({
                    dataHospital: []
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }
    getPaymentAgent() {
        this.setState({ progress: true })
        let params = {
            page: 1,
            size: 99999,
            status: 1,
            paymentMethodId: this.state.paymentMethodId
        }
        paymentAgentProvider.search(params).then(s => {
            if (s && s.code === 0 && s.data) {
                let dataTemplate = {
                    paymentAgent: {
                        id: -1,
                        nameAbb: "Tất cả"
                    }
                }
                let listData = s.data.data
                listData.splice(0, 0, dataTemplate)
                this.setState({
                    listPaymentAgent: listData
                })
            } else {
                this.setState({
                    listPaymentAgent: []
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }
    
    modalDetail(item) {
        this.setState({
            modalDetail: true,
            dataHospitalBank: item,
        })
    }

    modalCreateUpdate(item) {
        if (item) {
            this.setState({
                modalAdd: true,
                dataHospitalBank: item,
            })
        } else {
            this.setState({
                modalAdd: true,
                dataHospitalBank: {},
            })
        }
    }
    getKeyMethod(item) {
        var status = DataContants.listPaymentMethod.filter((data) => {
            return parseInt(data.id) == item
        })
        if (status.length > 0)
            return status[0];
        return {};
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
        this.loadPage();
        this.setState({ modalDetail: false, modalAdd: false });
    }


    handlelogOut() {
        // let param = JSON.parse(localStorage.getItem('isofh'));
        localStorage.clear()
        window.location.href = '/dang-nhap';
    };
    handleChangeFilter(event, action) {
        if (action === 1) {
            this.setState({
                page: 0,
                hospitalId: event.target.value
            }, () => {
                this.loadPage();
            })
        }
        if (action === 2) {
            this.setState({
                page: 0,
                paymentMethod: event.target.value
            }, () => {
                this.loadPage();
            })
        }
        if (action === 3) {
            this.setState({
                page: 0,
                paymentAgentId: event.target.value
            }, () => {
                this.loadPage();
            })
        }
        if (action === 4) {
            this.setState({
                page: 0,
                type: event.target.value
            }, () => {
                this.loadPage();
            })
        }
        if (action === 5) {
            this.setState({
                page: 0,
                status: event.target.value
            }, () => {
                this.loadPage();
            })
        }
    }
    renderChirenToolbar() {
        const { classes } = this.props;
        const { hospitalId, type, status, dataHospital, listPaymentAgent, paymentAgentId, paymentMethod } = this.state;
        return (
            <div className="header-search">
                <div className="search-type">
                    <div className="search-name">Chọn CSYT</div>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <Select
                            className="select-style"
                            value={hospitalId}
                            onChange={(event) => this.handleChangeFilter(event, 1)}
                            input={
                                <OutlinedInput
                                    name="age"
                                    id="outlined-age-simple"
                                    labelWidth={0}
                                />
                            }>
                            {
                                dataHospital && dataHospital.length > 0 && dataHospital.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.hospital.id}>{item.hospital.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
                <div className="search-type">
                    <div className="search-name">PTTT</div>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <Select
                            className="select-style"
                            value={paymentMethod}
                            onChange={(event) => this.handleChangeFilter(event, 2)}
                            input={
                                <OutlinedInput
                                    name="age"
                                    id="outlined-age-simple"
                                    labelWidth={0}
                                />
                            }>
                           {
                                DataContants.listPaymentMethodSearch && DataContants.listPaymentMethodSearch.length > 0 && DataContants.listPaymentMethodSearch.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
                <div className="search-type">
                    <div className="search-name">Nhà cung cấp DV</div>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <Select
                            className="select-style"
                            value={paymentAgentId}
                            onChange={(event) => this.handleChangeFilter(event, 3)}
                            input={
                                <OutlinedInput
                                    name="age"
                                    id="outlined-age-simple"
                                    labelWidth={0}
                                />
                            }>
                            {
                                listPaymentAgent && listPaymentAgent.length > 0 && listPaymentAgent.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.paymentAgent.id}>{item.paymentAgent.nameAbb}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
                <div className="search-type">
                    <div className="search-name">Loại tài khoản</div>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <Select
                            className="select-style"
                            value={type}
                            onChange={(event) => this.handleChangeFilter(event, 4)}
                            input={
                                <OutlinedInput
                                    name="age"
                                    id="outlined-age-simple"
                                    labelWidth={0}
                                />
                            }>
                            <MenuItem value='-1'>Tất cả</MenuItem>
                            <MenuItem value='1'>Chuyên thu</MenuItem>
                            <MenuItem value='2'>Chuyên chi</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="search-type">
                    <div className="search-name">Trạng thái</div>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <Select
                            className="select-style"
                            value={status}
                            onChange={(event) => this.handleChangeFilter(event, 5)}
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

            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { data, page, progress, selected, stt, total, size, dataHospital, listPaymentAgent, dataHospitalBank } = this.state;
        return (
            <div>
                <Paper className={classes.root + " page-header"}>
                    <div className={classes.tableWrapper + ' page-wrapper'}>
                        <div className="page-title">
                            <h2 className="title-page">Danh sách thẻ ngân hàng CSYT</h2>
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
                                    <TableCell style={{ width: "5%" }}>STT</TableCell>
                                    <TableCell style={{ width: "12%" }}>Loại tài khoản</TableCell>
                                    <TableCell style={{ width: "15%" }}>Số thẻ</TableCell>
                                    <TableCell style={{ width: "15%" }}>Số tài khoản</TableCell>
                                    <TableCell style={{ width: "15%" }}>PTTT</TableCell>
                                    <TableCell style={{ width: "12%" }}>Nhà cung cấp DV</TableCell>
                                    <TableCell style={{ width: "12%" }}>Trạng thái</TableCell>
                                    <TableCell style={{ width: "12%" }}>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data && data.length ? data.map((item, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                key={index}
                                                tabIndex={-1}>
                                                <TableCell>{index + stt}</TableCell>
                                                <TableCell>{item.hospitalBank.type == 1 ? "Chuyên thu" : item.hospitalBank.type == 2 ? "Chuyên chi" : null}</TableCell>
                                                <TableCell>{item.hospitalBank.cardNo}</TableCell>
                                                <TableCell>{item.hospitalBank.accountNo}</TableCell>
                                                <TableCell>{this.getKeyMethod(item.hospitalBank.paymentMethod) ? this.getKeyMethod(item.hospitalBank.paymentMethod).name : ""}</TableCell>
                                                <TableCell>{item.hospitalBank.paymentAgent && item.hospitalBank.paymentAgent.nameAbb}</TableCell>
                                                <TableCell>{item.hospitalBank.status === 1 ? "Đang hoạt động" : item.hospitalBank.status === 2 ? "Đã khóa" : ""}</TableCell>
                                                <TableCell>
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton onClick={() => this.modalDetail(item)} color="primary" className={classes.button + " button-detail-user-card"} aria-label="EditIcon">
                                                            <img src="/images/detail.png" alt="" />
                                                        </IconButton>
                                                    </Tooltip>
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
                                            <TableCell colSpan="8">{this.state.name ? 'Không có kết quả phù hợp' :
                                                this.state.text ? 'Không có kết quả phù hợp' :
                                                    this.state.type ? 'Không có kết quả phù hợp' :
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
                {this.state.modalAdd && <ModalAddUpdate data={dataHospitalBank} dataHospital={dataHospital} listPaymentAgent={listPaymentAgent} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalDetail && <ModalDetail data={dataHospitalBank} dataHospital={dataHospital} listPaymentAgent={listPaymentAgent} callbackOff={this.closeModal.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(BankCard));