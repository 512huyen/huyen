import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import EnhancedTableToolbar from '../../components/table-toolbar';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import transactionProvider from '../../../../data-access/transaction-provider';
import hospitalProvider from '../../../../data-access/hospital-provider';
import { withStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '../../components/pagination/pagination';
import moment from 'moment';
import { DateTimeBoxSearch } from '../../../../components/input-field/InputField';
import ModalDetail from './detail-transaction-history';
import { Grid } from '@material-ui/core';
import '../../css/SLBanGiaoThe.css';
import TableFooter from '@material-ui/core/TableFooter';
import Tooltip from '@material-ui/core/Tooltip';
import DataContants from '../../../../config/data-contants';
import { SelectBox } from '../../../../components/input-field/InputField';
import { listHospital } from '../../../../reducers/actions'
class TransactionHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            size: 10,
            fromDate: '',
            hospitalId: this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.hospital && this.props.userApp.currentUser.hospital.id ? this.props.userApp.currentUser.hospital.id : -1,
            paymentAgentId: '',
            paymentMethod: '',
            amount: '',
            codeHS: '',
            patientName: '',
            patientvalue: '',
            status: '',
            toDate: '',
            type: '',
            data: [],
            listPaymentMethod: [],
            total: 0,
            selected: [],
            progress: false,
            confirmDialog: false,
            tempDelete: [],
            listHospital: [],
            listPaymentAgent: [],
            modalAdd: false,
            modalDetail: false,
            totalPage: 0,
        }
    }

    componentWillMount() {
        if (this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.hospital && this.props.userApp.currentUser.hospital.id) {
            this.loadPage();
            this.getDetail(this.props.userApp.currentUser.hospital.id)
        }
        this.getHospital();
    }
    loadPage(item, type) {
        this.setState({ progress: true })
        let params = {
            page: Number(this.state.page) + 1,
            size: this.state.size,
            paymentAgentId: this.state.paymentAgentId,
            paymentMethod: this.state.paymentMethod,
            amount: this.state.amount,
            codeHS: this.state.codeHS,
            patientName: this.state.patientName,
            patientvalue: this.state.patientvalue,
            status: this.state.status,
            type: this.state.type,
            fromDate: this.state.fromDate ? moment(this.state.fromDate).format("YYYY-MM-DD") : "",
            toDate: this.state.toDate ? moment(this.state.toDate).format("YYYY-MM-DD") : "",
            hospitalId: item ? item : this.state.hospitalId,
        }
        if (params.page === 0) {
            this.setState({
                data: [],
                stt: 0,
                total: 0,
            })
        } else {
            transactionProvider.search(params).then(s => {
                if (s && s.code === 0 && s.data) {
                    let stt = 1 + (params.page - 1) * params.size;
                    this.setState({
                        data: s.data.data,
                        stt,
                        total: s.data.total,
                    })
                }
                this.setState({ progress: false })
            }).catch(e => {
                this.setState({ progress: false })
            })
        }
    }
    getDetail(item) {
        hospitalProvider.getDetail(item).then(s => {
            if (s && s.data && s.code === 0) {
                let paymentMethod = Object.keys(s.data.hospital.paymentMethods)
                let data = []
                let dataPaymentAgent = []
                paymentMethod.map(index => {
                    DataContants.listPaymentMethod.filter(index2 => {
                        if (index2.id === Number(index)) {
                            data.push(index2)
                        }
                    })
                })
                paymentMethod.map(option => {
                    s.data.hospital.paymentMethods[option.toString()].map(item => {
                        dataPaymentAgent.push(item)
                    })
                })
                let ids = dataPaymentAgent.map((item) => {
                    return item.id
                }).filter((item, index, self) => {
                    return self.indexOf(item) === index;
                })
                let listDataPaymentAgent = []
                ids.map(item => {
                    let abc = dataPaymentAgent.filter(option => {
                        return option.id === item
                    })
                    listDataPaymentAgent.push(abc[0])
                })
                this.setState({
                    listPaymentMethod: data,
                    listPaymentAgent: listDataPaymentAgent,
                })
            }
        }).catch(e => {

        })
    }
    getHospital() {
        this.setState({ progress: true })
        let params = {
            page: 1,
            size: 99999
        }
        if (this.props.userApp.listHospital && this.props.userApp.listHospital.length !== 0) {
            this.setState({
                listHospital: this.props.userApp.listHospital.filter(item => { return (item.hospital.status === 1) })
            })
        } else {
            hospitalProvider.search(params).then(s => {
                if (s && s.data && s.code === 0) {
                    this.props.dispatch(listHospital(s.data.data))
                    this.setState({
                        listHospital: s.data.data.filter(item => { return (item.hospital.status === 1) })
                    })
                }
                this.setState({ progress: false })
            }).catch(e => {
                this.setState({
                    progress: false
                })
            })
        }
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

    handleChangeFilter(event, action) {
        if (action === 1) {
            this.setState({
                page: 1,
                paymentMethod: event
            }, () => {
                this.loadPage()
            })
        }
        if (action === 2) {
            this.setState({
                page: 1,
                paymentAgentId: event
            }, () => {
                this.loadPage()
            })
        }
        if (action === 3) {
            this.setState({
                page: 1,
                type: event
            }, () => {
                this.loadPage()
            })
        }
        if (action === 4) {
            this.setState({
                page: 1,
                amount: event
            }, () => {
                this.loadPage()
            })
        }
        if (action === 5) {
            this.setState({
                page: 1,
                [event.target.name]: event.target.value
            }, () => {
                this.loadPage()
            })
        }
        if (action === 6) {
            this.setState({
                page: 1,
                status: event
            }, () => {
                this.loadPage()
            })
        }
    }
    modalDetail(item) {
        this.setState({
            modalDetail: true,
            dataHospital: item,
        })
    }
    checkHospital(item) {
        let paymentMethod = Object.keys(item.hospital.paymentMethods)
        let data = []
        let dataPaymentAgent = []
        paymentMethod.map(index => {
            DataContants.listPaymentMethod.filter(index2 => {
                if (index2.id === Number(index)) {
                    data.push(index2)
                }
            })
        })
        paymentMethod.map(option => {
            item.hospital.paymentMethods[option.toString()].map(item => {
                dataPaymentAgent.push(item)
            })
        })
        let ids = dataPaymentAgent.map((item) => {
            return item.id
        }).filter((item, index, self) => {
            return self.indexOf(item) === index;
        })
        let listDataPaymentAgent = []
        ids.map(item => {
            let abc = dataPaymentAgent.filter(option => {
                return option.id === item
            })
            listDataPaymentAgent.push(abc[0])
        })
        this.setState({
            hospitalId: item.hospital.id,
            nameHospital: item.hospital.name,
            listPaymentMethod: data,
            listPaymentAgent: listDataPaymentAgent,
        }, () => this.loadPage(item.hospital.id))
    }
    renderChirenToolbar() {
        const { listPaymentAgent, paymentMethod, paymentAgentId, listPaymentMethod, type } = this.state;
        return (
            <div className="header-search">
                <div className="select-box-search">
                    <div className="search-name select-title-search">Phương thức thanh toán</div>
                    <SelectBox
                        listOption={[{ id: -1, name: "Tất cả" }, ...listPaymentMethod]}
                        placeholder={'Tìm kiếm'}
                        selected={paymentMethod}
                        getIdObject={(item) => {
                            return item.id;
                        }}
                        getLabelObject={(item) => {
                            return item.name
                        }}
                        onChangeSelect={(lists, ids) => {
                            this.handleChangeFilter(ids, 1)
                        }}
                    />
                </div>
                <div className="select-box-search">
                    <div className="search-name select-title-search">Nhà cung cấp</div>
                    <SelectBox
                        listOption={[{ id: -1, nameAbb: "Tất cả" }, ...listPaymentAgent]}
                        placeholder={'Tìm kiếm'}
                        selected={paymentAgentId}
                        getIdObject={(item) => {
                            return item.id;
                        }}
                        getLabelObject={(item) => {
                            return item.nameAbb
                        }}
                        onChangeSelect={(lists, ids) => {
                            this.handleChangeFilter(ids, 2)
                        }}
                    />
                </div>
                <div className="select-box-search">
                    <div className="search-name select-title-search">Loại giao dịch</div>
                    <SelectBox
                        listOption={[{ id: -1, name: "Tất cả" }, ...DataContants.listTypeSearch]}
                        placeholder={'Tìm kiếm'}
                        selected={type}
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
                            value={this.state.fromDate}
                            onChangeValue={(event) => {
                                this.setState({ fromDate: event }, () => this.loadPage())
                            }}
                            placeholder="Từ ngày"
                        />
                    </div>
                </div>
                <div className="search-type">
                    <div className="search-name" style={{ marginBottom: -12 }}>Đến ngày</div>
                    <div className="date-picker-style-header">
                        <DateTimeBoxSearch
                            value={this.state.toDate}
                            onChangeValue={(event) => {
                                this.setState({ toDate: event }, () => this.loadPage())
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
        const { data, page, progress, selected, listHospital, total, size, status, amount, patientvalue, dataHospital, patientName, nameHospital, codeHS } = this.state;
        return (
            <div className="color-background-control">
                <Paper className={classes.root + " page-header"}>
                    <div className={classes.tableWrapper + ' page-wrapper'}>
                        <div className="page-title">
                            <h2 className="title-page">Lịch sử giao dịch</h2>
                        </div>
                        {
                            this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.hospital && this.props.userApp.currentUser.hospital.id ?
                                null :
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
                        }
                        {
                            this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.hospital && this.props.userApp.currentUser.hospital.id ? null : <div className="name-history">{nameHospital}</div>
                        }
                        <div className="list-search-top">
                            <EnhancedTableToolbar
                                numSelected={selected.length}
                                actionsChiren={
                                    this.renderChirenToolbar()
                                }
                            />
                        </div>
                        {/* {progress ? <LinearProgress /> : null} */}
                        <Table aria-labelledby="tableTitle" className="style-table-new">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: "6%", textAlign: "center" }}></TableCell>
                                    <TableCell style={{ width: "20%", textAlign: "center" }}>Ngày giao dịch</TableCell>
                                    <TableCell style={{ width: "12%", textAlign: "center" }}>Số tiền</TableCell>
                                    <TableCell style={{ width: "10%", textAlign: "center" }}>Mã NB</TableCell>
                                    <TableCell style={{ width: "8%", textAlign: "center" }}>Mã hồ sơ</TableCell>
                                    <TableCell style={{ width: "14%", textAlign: "center" }}>Tên người bệnh</TableCell>
                                    {/* <TableCell style={{ width: "12%", textAlign: "center" }}>Nội dung thanh toán</TableCell> */}
                                    <TableCell style={{ width: "10%", textAlign: "center" }}>Trạng thái</TableCell>
                                    <TableCell style={{ width: "12%", textAlign: "center" }}></TableCell>
                                    <TableCell style={{ width: "8%", textAlign: "center" }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className="select-box-search search-history">
                                        <SelectBox
                                            listOption={[{ id: -1, name: "Tất cả" }, ...DataContants.listNumberSearch]}
                                            placeholder={'Tìm kiếm'}
                                            selected={amount}
                                            getIdObject={(item) => {
                                                return item.id;
                                            }}
                                            getLabelObject={(item) => {
                                                return item.name
                                            }}
                                            onChangeSelect={(lists, ids) => {
                                                this.handleChangeFilter(ids, 4)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            style={{ marginTop: 7 }}
                                            id="outlined-textarea"
                                            placeholder="Mã NB"
                                            multiline
                                            name="patientvalue"
                                            className={classes.textField + ' search-input-custom search-input-custom-width'}
                                            margin="normal"
                                            variant="outlined"
                                            value={patientvalue}
                                            onChange={(event) => this.handleChangeFilter(event, 5)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            style={{ marginTop: 7 }}
                                            id="outlined-textarea"
                                            placeholder="Mã hồ sơ"
                                            multiline
                                            name="codeHS"
                                            className={classes.textField + ' search-input-custom search-input-custom-width'}
                                            margin="normal"
                                            variant="outlined"
                                            value={codeHS}
                                            onChange={(event) => this.handleChangeFilter(event, 5)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            style={{ marginTop: 7 }}
                                            id="outlined-textarea"
                                            placeholder="Nhập tên NB"
                                            multiline
                                            name="patientName"
                                            className={classes.textField + ' search-input-custom search-input-custom-width'}
                                            margin="normal"
                                            variant="outlined"
                                            value={patientName}
                                            onChange={(event) => this.handleChangeFilter(event, 5)}
                                        />
                                    </TableCell>
                                    {/* <TableCell>
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
                                    </TableCell> */}
                                    <TableCell className="select-box-search search-history">
                                        <SelectBox
                                            listOption={[{ id: -1, name: "Tất cả" }, ...DataContants.listStatusTransactionHistory]}
                                            placeholder={'Tìm kiếm'}
                                            selected={status}
                                            getIdObject={(item) => {
                                                return item.id;
                                            }}
                                            getLabelObject={(item) => {
                                                return item.name
                                            }}
                                            onChangeSelect={(lists, ids) => {
                                                this.handleChangeFilter(ids, 6)
                                            }}
                                        />
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
                                                <TableCell className="transaction-history-index-1">
                                                    {
                                                        item.transaction && (item.transaction.type === 2 || item.transaction.type === 3) ?
                                                            <img src="/images/back1.png" alt="" /> :
                                                            item.transaction && (item.transaction.type === 1 || item.transaction.type === 4) ? <img src="/images/path.png" alt="" /> : null
                                                    }
                                                </TableCell>
                                                <TableCell>{moment(item.transaction && item.transaction.createdDate).format("HH:mm:ss - DD/MM/YYYY")}</TableCell>
                                                <TableCell className="history-font" style={{ textAlign: "center" }}>
                                                    {/* {
                                                        item.transaction && (item.transaction.type === 2 || item.transaction.type === 3) ?
                                                            <span className="color-active"> + {item.transaction.amount.formatPrice()}</span> :
                                                            item.transaction && (item.transaction.type === 1 || item.transaction.type === 4) ? <span className="color-inActive"> - {item.transaction.amount.formatPrice()}</span> : null
                                                    } */}
                                                    {item.transaction.amount.formatPrice()}
                                                </TableCell>
                                                <TableCell style={{ textAlign: "center" }}>{item.transaction.patient && item.transaction.patient.code}</TableCell>
                                                <TableCell style={{ textAlign: "center" }}>{item.transaction && item.transaction.codeHS}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div>{item.transaction.patient && item.transaction.patient.name}</div>
                                                        {/* <div className="name-user">{item.transaction.patient && item.transaction.patient.name}</div> */}
                                                        {/* <div>{this.formatCardNumber(item.transaction.patient && item.transaction.patient.code)}</div> */}
                                                    </div>
                                                </TableCell>
                                                {/* <TableCell>Nguyen Thi Lam thanh toán khám bệnh tại khoa khám bệnh</TableCell> */}
                                                {/* <TableCell className="color-inActive" style={{ textAlign: "center" }}>{this.getStatusTransactionHistory(item.transaction.status).name}</TableCell> */}
                                                <TableCell className="color-inActive" style={{ textAlign: "center" }}>
                                                    {item.transaction.status === 1 ? <span style={{ color: "#27ad60" }}>Thành công</span> : item.transaction.status === 0 ? <span>Thất bại</span> : item.transaction.status === 3 ? <span>Đang xử lý</span> : null}
                                                </TableCell>
                                                <TableCell style={{ textAlign: "center" }}><img src={item.transaction.paymentAgent && item.transaction.paymentAgent.logo.absoluteUrl()} alt="" style={{ maxWidth: 50, maxHeight: 50 }} /></TableCell>
                                                <TableCell style={{ textAlign: "center" }}>
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
                                            <TableCell colSpan="9">
                                                {
                                                    this.state.hospitalId === -1 ? 'Vui lòng chọn CSYT' :
                                                        (this.state.amount || this.state.fromDate || this.state.codeHS || this.state.patientName || this.state.patientvalue ||
                                                            this.state.paymentAgentId || this.state.paymentMethod || this.state.status || this.state.toDate || this.state.type) ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
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