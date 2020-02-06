import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import EnhancedTableToolbar from '../../components/table-toolbar';
import Button from '@material-ui/core/Button';
import cardTransferHistoryProvider from '../../../../data-access/card-transfer-history-provider';
import paymentAgentProvider from '../../../../data-access/paymentAgent-provider';
import hospitalProvider from '../../../../data-access/hospital-provider';
import { withStyles } from '@material-ui/core/styles';
import ModalAddUpdate from './create-update-card';
import ModalDetail from './detail-card';
import { Grid } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '../../components/pagination/pagination';
import Table from '@material-ui/core/Table';
import moment from 'moment';
import '../../css/SLBanGiaoThe.css';
import TableFooter from '@material-ui/core/TableFooter';
import Tooltip from '@material-ui/core/Tooltip';
import ConfirmDialog from '../../components/confirm/';
import { toast } from 'react-toastify';
import { DateTimeBoxSearch } from '../../../../components/input-field/InputField';
import bankProvider from '../../../../data-access/bank-provider';
import { SelectBox } from '../../../../components/input-field/InputField';
import { listHospital } from '../../../../reducers/actions';
class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 10,
            fromDate: '',
            toDate: '',
            paymentAgentId: -1,
            bankId: -1,
            hospitalId: this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.hospital && this.props.userApp.currentUser.hospital.id ? this.props.userApp.currentUser.hospital.id : '',
            data: [],
            listHospital: [],
            listHospitalCreate: [],
            listPaymentAgent: [],
            listPaymentMethodsHospital: [],
            listBankHospital: [],
            tempDelete: [],
            listBank: [],
            total: 0,
            selected: [],
            confirmDialog: false,
            tempDelete: [],
            modalAdd: false,
        }
    }
    componentWillMount() {
        if (this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.hospital && this.props.userApp.currentUser.hospital.id) {
            this.loadPage();
            this.getBankHospital(this.props.userApp.currentUser.hospital.id);
        }
        this.getHospital();
        this.getBank();
    }
    loadPage(item) {
        let params = {
            page: Number(this.state.page) + 1,
            size: this.state.size,
            bankId: this.state.bankId,
            fromDate: this.state.fromDate ? moment(this.state.fromDate).format("YYYY-MM-DD") : "",
            toDate: this.state.toDate ? moment(this.state.toDate).format("YYYY-MM-DD") : "",
            paymentAgentId: this.state.paymentAgentId,
            hospitalId: item ? item : this.state.hospitalId
        }
        if (params.page === 0) {
            this.setState({
                data: [],
                stt: 0,
                total: 0,
            })
        } else {
            cardTransferHistoryProvider.search(params).then(s => {
                if (s && s.code === 0 && s.data) {
                    let stt = 1 + (params.page - 1) * params.size;
                    let data = s.data.data.filter(x => {
                        return x.cardTransferHistory.deleted === 0
                    })
                    this.setState({
                        data: data,
                        stt,
                        total: s.data.total,
                    })
                } else {
                    this.setState({
                        data: []
                    })
                }
            }).catch(e => {
            })
        }
    }
    getHospital() {
        let object = {
            page: 1,
            size: 99999
        }
        if (this.props.userApp.listHospital && this.props.userApp.listHospital.length !== 0) {
            let dataTemplateCreate = {
                hospital: {
                    id: -1,
                    name: "Chọn bên nhận"
                }
            }
            let listData = this.props.userApp.listHospital.filter(item => { return (item.hospital.status === 1) })
            listData.splice(0, 0, dataTemplateCreate)
            this.setState({
                listHospital: this.props.userApp.listHospital.filter(item => { return (item.hospital.status === 1) }),
                listHospitalCreate: listData
            })
        } else {
            hospitalProvider.search(object).then(s => {
                if (s && s.data && s.code === 0) {
                    this.props.dispatch(listHospital(s.data.data))
                    let dataTemplateCreate = {
                        hospital: {
                            id: -1,
                            name: "Chọn bên nhận"
                        }
                    }
                    let listData = s.data.data.filter(item => { return (item.hospital.status === 1) })
                    listData.splice(0, 0, dataTemplateCreate)
                    this.setState({
                        listHospital: s.data.data.filter(item => { return (item.hospital.status === 1) }),
                        listHospitalCreate: listData
                    })
                }
            }).catch(e => {

            })
        }
    }
    getBank() {
        bankProvider.getAll().then(s => {
            this.setState({
                listBank: s,
            })
        }).catch(e => {
        })
    }
    getBankHospital(item) {
        hospitalProvider.getBank(item).then(s => {
            if (s && s.data && s.code === 0) {
                this.setState({
                    listBankHospital: s.data.paymentAgents
                })
            }
        }).catch(e => {

        })
    }
    getPaymentMethodsHospital(item) {
        hospitalProvider.getDetail(item).then(s => {
            if (s && s.data && s.code === 0) {
                this.setState({
                    listPaymentMethodsHospital: s.data.hospital
                })
            }
        }).catch(e => {

        })
    }
    modalCreateUpdate(item) {
        if (item) {
            this.setState({
                modalAdd: true,
                dataCard: item,
                listBank: this.state.listBank
            })
        } else {
            this.setState({
                modalAdd: true,
                listBank: this.state.listBank,
                dataCard: {},
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
    closeModal(hospitalId) {
        this.loadPage();
        this.getBankHospital(hospitalId)
        this.setState({
            modalAdd: false,
            modalDetail: false
        })
    }
    handleChangeFilter(event, action) {
        if (action === 1) {
            this.setState({
                page: 0,
                fromDate: event.target.value
            }, () => {
                this.loadPage();
            })
        }
        if (action === 2) {
            this.setState({
                page: 0,
                toDate: event.target.value
            }, () => {
                this.loadPage();
            })
        }
        if (action === 3) {
            this.setState({
                page: 0,
                bankId: event
            }, () => {
                this.loadPage();
            })
        }
    }
    checkHospital(item) {
        this.setState({
            data: [],
            hospitalId: item.hospital.id,
            name: item.hospital.name
        })
        this.loadPage(item.hospital.id);
        this.getBankHospital(item.hospital.id);
        this.getPaymentMethodsHospital(item.hospital.id)
    }
    modalDelete(item) {
        this.setState({
            confirmDialog: true,
            tempDelete: item
        })
    }
    modalDetail(item) {
        this.setState({
            modalDetail: true,
            dataCard: item
        })
    }
    delete(type) {
        this.setState({ confirmDialog: false })
        if (type === 1) {
            cardTransferHistoryProvider.delete(this.state.tempDelete.cardTransferHistory.id).then(s => {
                if (s && s.code === 0 && s.data) {
                    toast.success(" Xóa lịch sử bàn giao thẻ thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.loadPage();
                } else {
                    toast.error(" Xóa lịch sử bàn giao thẻ không thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            })
        }
    }
    renderChirenToolbar() {
        const { bankId, listBank } = this.state;
        return (
            <div className="header-search">
                <div className="search-type search-card-date-box">
                    <div className="search-name" style={{ marginBottom: -12 }}>Từ ngày</div>
                    <div className="date-picker-style-header" style={{ marginRight: 15 }}>
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
                    <div className="date-picker-style-header" style={{ marginRight: 15 }}>
                        <DateTimeBoxSearch
                            value={this.state.toDate}
                            onChangeValue={(event) => {
                                this.setState({ toDate: event }, () => this.loadPage())
                            }}
                            placeholder="Đến ngày"
                        />
                    </div>
                </div>
                <div className="select-box-search">
                    <div className="search-name select-title-search">Ngân hàng</div>
                    <SelectBox
                        listOption={[{ id: -1, name: "Tất cả" }, ...listBank]}
                        placeholder={'Tìm kiếm'}
                        selected={bankId}
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
        const { data, page, stt, total, size, dataCard, listHospital, name, listHospitalCreate, listPaymentAgent, listBank, hospitalId, listBankHospital, listPaymentMethodsHospital } = this.state;
        return (
            <div className="color-background-control">
                <Paper className={classes.root + " page-header card-header"}>
                    <Grid container spacing={16} >
                        <Grid item xs={12} lg={4} md={5} className="card-main-left">
                            <div className="div_content">
                                {
                                    this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.hospital && this.props.userApp.currentUser.hospital.id ? null :
                                        <div className="chon">
                                            <p className="title_left">CHỌN CSYT</p>
                                            {
                                                listHospital && listHospital.length > 0 ? listHospital.map((item, index) => {
                                                    return (
                                                        <div key={index} className="div_anh">
                                                            <input type="radio" id={"s-option" + index} name="selector" className="card-option" />
                                                            <label htmlFor={"s-option" + index} className="card-option-2" >
                                                                <div className="check check-history" onClick={() => this.checkHospital(item)}>
                                                                    <img src={item.hospital && item.hospital.logo && item.hospital.logo.absoluteUrl()} alt="" className="logo_anh " />
                                                                    <img src="/images/checked.png" alt="" className="check_box" />
                                                                    <div className="inside"></div>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    )
                                                }) : null
                                            }
                                        </div>
                                }
                                <div className="chon">
                                    <p className="title_left title-left-card-top">KHO THẺ</p>
                                    <div className="khothe-inner">
                                        {
                                            listBankHospital && listBankHospital.map((item, index) => {
                                                return (
                                                    <div className="khothe_detail" key={index}>
                                                        <div className="khothe-item">
                                                            <p className="bank_name">{item.nameAbb}</p>
                                                            <div className="khothe-body-card">
                                                                <div className="detail_the color-item-card">
                                                                    <div className="row">
                                                                        <div className="col-md-7">
                                                                            <span className="label-detail-bold">Tổng thẻ</span>
                                                                        </div>
                                                                        <div className="col-md-5">
                                                                            <p className="content-detail-card">{item.totalCard}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="detail_the color-item-while">
                                                                    <div className="row">
                                                                        <div className="col-md-7">
                                                                            <span className="label-detail">Đã sử dụng</span>
                                                                        </div>
                                                                        <div className="col-md-5">
                                                                            <p className="content-detail-card">{item.usedCard}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="detail_the color-item-while">
                                                                    <div className="row">
                                                                        <div className="col-md-7">
                                                                            <span className="label-detail">Chưa sử dụng</span>
                                                                        </div>
                                                                        <div className="col-md-5">
                                                                            <p className="content-detail-card">{item.totalCard - item.usedCard}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="detail_the color-item-card-2">
                                                                    <div className="row">
                                                                        <div className="col-md-7">
                                                                            <span className="label-detail-bold">Đang sử dụng</span>
                                                                        </div>
                                                                        <div className="col-md-5">
                                                                            <p className="content-detail-card">{item.usedCard - item.cancelCard}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="detail_the color-item-while">
                                                                    <div className="row">
                                                                        <div className="col-md-7">
                                                                            <span className="label-detail">Đã Hủy</span>
                                                                        </div>
                                                                        <div className="col-md-5">
                                                                            <p className="content-detail-card">{item.cancelCard}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} lg={8} md={7}>
                            <div className={classes.tableWrapper + ' page-wrapper page-wrapper-card'}>
                                <div className="page-title">
                                    <h2 className="title-page color-header-card">Lịch sử bàn giao thẻ
                                    {
                                            this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.hospital && this.props.userApp.currentUser.hospital.id ? null :
                                                this.state.hospitalId ? <span className="title-page color-header-card" style={{ textTransform: "none" }} > ({name})</span> : null
                                        }
                                    </h2>
                                    {
                                        this.state.hospitalId ? <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} >Thêm mới</Button> : null
                                    }
                                </div>
                                {this.renderChirenToolbar()}
                                <Table aria-labelledby="tableTitle" className="style-table-new">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ width: "3%" }}>STT</TableCell>
                                            <TableCell style={{ width: "14%" }}>Ngày bàn giao</TableCell>
                                            <TableCell style={{ width: "10%" }}>Số lượng</TableCell>
                                            <TableCell style={{ width: "14%" }}>Người bàn giao</TableCell>
                                            <TableCell style={{ width: "14%" }}>Bên bàn giao</TableCell>
                                            <TableCell style={{ width: "13%" }}>Người nhận</TableCell>
                                            <TableCell style={{ width: "18%" }}>Ngân hàng</TableCell>
                                            <TableCell style={{ width: "14%" }}>Hành động</TableCell>
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
                                                        <TableCell>{moment(item.cardTransferHistory && item.cardTransferHistory.transferDate).format("DD-MM-YYYY")}</TableCell>
                                                        <TableCell>{item.cardTransferHistory && item.cardTransferHistory.quantity}</TableCell>
                                                        <TableCell>{item.cardTransferHistory && item.cardTransferHistory.transferUser}</TableCell>
                                                        <TableCell>{item.cardTransferHistory && item.cardTransferHistory.paymentAgent && item.cardTransferHistory.paymentAgent.nameAbb}</TableCell>
                                                        <TableCell>{item.cardTransferHistory && item.cardTransferHistory.receiverUser}</TableCell>
                                                        <TableCell>{item.cardTransferHistory && item.cardTransferHistory.bank && item.cardTransferHistory.bank.name}</TableCell>
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
                                                            <Tooltip title="Xóa">
                                                                <IconButton color="primary" onClick={() => this.modalDelete(item)} className={classes.button + " button-detail-user-card"} aria-label="EditIcon">
                                                                    <img src="/images/delete.png" alt="" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                                :
                                                <TableRow>
                                                    <TableCell colSpan="8">
                                                        {
                                                            (this.state.bankId || this.state.toDate || this.state.fromDate)  ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
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
                        </Grid>
                    </Grid>
                </Paper>
                {this.state.modalAdd && <ModalAddUpdate data={dataCard} listHospitalCreate={listHospitalCreate} listPaymentMethodsHospital={listPaymentMethodsHospital} listBank={listBank} hospitalId={hospitalId} listPaymentAgent={listPaymentAgent} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalDetail && <ModalDetail data={dataCard} callbackOff={this.closeModal.bind(this)} />}
                {this.state.confirmDialog && <ConfirmDialog title="Xác nhận" content={"Bạn chắc chắn muốn xóa lịch sử bàn giao thẻ này?"} btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.delete.bind(this)} />}
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
export default withStyles(styles)(connect(mapStateToProps)(Card));