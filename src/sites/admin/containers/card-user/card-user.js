import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import cardProvider from '../../../../data-access/card-provider';
import { withStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '../../components/pagination/pagination';
import moment from 'moment';
import ModalDetail from './detail-card-user';
import ModalCancelCard from './cancel-card-user';
import ModalRechargelCard from './recharge-card-user';
import TableFooter from '@material-ui/core/TableFooter';
import Tooltip from '@material-ui/core/Tooltip';
import hospitalProvider from '../../../../data-access/hospital-provider';
import DataContants from '../../../../config/data-contants';
import { SelectBox } from '../../../../components/input-field/InputField';
import { listCard, listHospital } from '../../../../reducers/actions'
class CardUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 10,
            sizeSearch: 99999,
            number: '',
            hospital: -1,
            passport: '',
            patientCode: '',
            data: [],
            total: 0,
            confirmDialog: false,
            tempDelete: [],
            listHospital: [],
            modalDetail: false,
            modalCancelCard: false,
            createdDate: '',
            cancel: -1,
            type: 3,
            code: "",
            dataCheck: []
        }
    }
    componentWillMount() {
        this.loadPage();
        this.getHospital();
    }
    loadPage(item) {
        let params = {
            page: Number(this.state.page) + 1,
            size: this.state.sizeSearch,
            number: this.state.number,
            hospital: this.state.hospital,
            passport: this.state.passport,
            patientCode: this.state.patientCode,
            cancel: this.state.cancel,
            code: this.state.code,
        }
        if (this.props.userApp.listCard && this.props.userApp.listCard.length !== 0 && !item) {
            let dataPage = []
            let list = []
            if (this.state.cancel === -1) {
                list = this.props.userApp.listCard
            } else {
                list = this.props.userApp.listCard.filter(item => { return (item.card.cancel === this.state.cancel) })
            }
            for (let i = (params.page - 1) * this.state.size; i < params.page * this.state.size; i++) {
                if (list[i]) {
                    dataPage.push(list[i])
                }
            }
            this.setState({
                data: list,
                dataView: dataPage,
                total: list.length,
                stt: 1 + ((Number(this.state.page) >= 1 ? this.state.page : 1) - 1) * this.state.size,
                dataCheck: list
            })
        } else {
            cardProvider.search(params).then(s => {
                if (s && s.code === 0 && s.data) {
                    if (s.data.total > this.state.sizeSearch) {
                        this.loadPage(true)
                    } else {
                        this.props.dispatch(listCard(s.data.data))
                        let stt = 1 + (params.page - 1) * this.state.size;
                        let dataPage = []
                        let list = []
                        if (this.state.cancel === -1) {
                            list = s.data.data
                        } else {
                            list = s.data.data.filter(item => { return (item.card.cancel === this.state.cancel) })
                        }
                        for (let i = (params.page - 1) * this.state.size; i < params.page * this.state.size; i++) {
                            if (list[i]) {
                                dataPage.push(list[i])
                            }
                        }
                        this.setState({
                            dataView: dataPage,
                            data: list,
                            stt,
                            total: list.length,
                            dataCheck: list
                        })
                    }
                }
            }).catch(e => {
            })
        }
    }
    getHospital() {
        let object = {
            page: 1,
            size: 99999,
        }
        if (this.props.userApp.listHospital && this.props.userApp.listHospital.length !== 0) {
            this.setState({
                listHospital: this.props.userApp.listHospital.filter(item => { return (item.hospital.status === 1) })
            })
        } else {
            hospitalProvider.search(object).then(s => {
                if (s && s.data && s.code === 0) {
                    this.props.dispatch(listHospital(s.data.data))
                    this.setState({
                        listHospital: s.data.data.filter(item => { return (item.hospital.status === 1) })
                    })
                }
            }).catch(e => {

            })
        }
    }
    modalDetail(item) {
        this.setState({
            modalDetail: true,
            dataCardUser: item,
        })
    }
    modalCancelCard(item) {
        // window.location.href = '/admin/cancel-card-user/' + (item.card || {}).code + "&" + item.card && (item.card.patient || {}).code + "&" + (item.card || {}).transactionId;
        this.setState({
            modalCancelCard: true,
            dataCardUser: item,
        })
    }
    modalRechargeCard(item) {
        // window.location.href = '/admin/recharge-card-user/' + (item.card || {}).code + "&" + item.card && (item.card.patient || {}).code + "&" + (item.card || {}).transactionId;
        this.setState({
            modalRechargeCard: true,
            dataCardUser: item,
        })
    }
    handleChangePage = (event, action) => {
        let dataPage = []
        if (this.state.dataCheck.length > 0) {
            for (let i = action * this.state.size; i < (action + 1) * this.state.size; i++) {
                if (this.state.dataCheck[i]) {
                    dataPage.push(this.state.dataCheck[i])
                }
            }
            this.setState({
                page: action,
                dataView: dataPage,
                stt: 1 + action * this.state.size
            })
        } else {
            for (let i = action * this.state.size; i < (action + 1) * this.state.size; i++) {
                if (this.state.data[i]) {
                    dataPage.push(this.state.data[i])
                }
            }
            this.setState({
                page: action,
                dataView: dataPage,
                stt: 1 + action * this.state.size
            })
        }

    };
    handleChangeRowsPerPage = event => {
        let dataPage = []
        if (this.state.dataCheck.length > 0) {
            for (let i = 0; i < event.target.value; i++) {
                if (this.state.dataCheck[i]) {
                    dataPage.push(this.state.dataCheck[i])
                }
            }
            this.setState({
                size: event.target.value,
                dataView: dataPage,
                stt: 1,
                page: 0
            })
        } else {
            for (let i = 0; i < event.target.value; i++) {
                if (this.state.data[i]) {
                    dataPage.push(this.state.data[i])
                }
            }
            this.setState({
                size: event.target.value,
                dataView: dataPage,
                stt: 1,
                page: 0
            })
        }
    };
    closeModal() {
        this.loadPage();
        this.setState({ modalDetail: false, modalCancelCard: false, modalRechargeCard: false });
    }
    formatCardNumber(value) {
        var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        var matches = v.match(/\d{4,16}/g);
        var match = matches ? matches[0] : []
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
    handleChangeFilter(event, action) {
        if (action === 1) {
            this.setState({
                page: 0,
                hospital: event
            }, () => {
                this.loadPage(true);
            })
        }
        if (action === 2) {
            this.setState({
                page: 0,
                patientCode: event.target.value
            }, () => {
                if (this.clearTimeOutAffterRequest) {
                    try {
                        clearTimeout(this.clearTimeOutAffterRequest);
                    } catch (error) {
                    }
                }
                this.clearTimeOutAffterRequest = setTimeout(() => {
                    this.loadPage(true)
                }, 500)
            })
        }
        if (action === 3) {
            this.setState({
                page: 0,
                passport: event.target.value
            }, () => {
                if (this.clearTimeOutAffterRequest) {
                    try {
                        clearTimeout(this.clearTimeOutAffterRequest);
                    } catch (error) {
                    }
                }
                this.clearTimeOutAffterRequest = setTimeout(() => {
                    this.loadPage(true)
                }, 500)
            })
        }
        if (action === 4) {
            this.setState({
                page: 0,
                code: event.target.value ? event.target.value.replaceAllText(" ", "") : ""
            }, () => {
                this.loadPage(true)
            })
        }
        if (action === 5) {
            // this.setState({
            //     page: 0,
            //     cancel: event
            // }, () => {
            //     this.loadPage(true);
            // })
            let dataPage = [];
            let dataCheck = [];
            if (event === -1) {
                dataCheck = this.state.data
            } else {
                dataCheck = this.state.data.filter(item => { return (item.card.cancel === event) });
            }
            for (let i = this.state.page * this.state.size; i < (this.state.page + 1) * this.state.size; i++) {
                if (dataCheck[i]) {
                    dataPage.push(dataCheck[i])
                }
            }
            this.setState({
                page: 0,
                cancel: event,
                dataView: dataPage,
                dataCheck: dataCheck,
                stt: 1 + this.state.page * this.state.size,
                total: dataCheck.length
            })
        }
    }
    renderChirenToolbar() {
        const { classes } = this.props;
        const { hospital, patientCode, code, passport, listHospital, cancel } = this.state;
        return (
            <div className="header-search">
                <div className="select-box-search">
                    <div className="search-name select-title-search">CSYT</div>
                    <SelectBox
                        listOption={[{ hospital: { id: -1, name: "Tất cả" } }, ...listHospital]}
                        placeholder={'Tìm kiếm'}
                        selected={hospital}
                        getIdObject={(item) => {
                            return item.hospital.id;
                        }}
                        getLabelObject={(item) => {
                            return item.hospital.name
                        }}
                        onChangeSelect={(lists, ids) => {
                            this.handleChangeFilter(ids, 1)
                        }}
                    />
                </div>
                <div className="search-type">
                    <div className="search-name">Mã NB</div>
                    <TextField
                        style={{ marginTop: 7 }}
                        id="outlined-textarea"
                        placeholder="Họ tên/ Mã NB"
                        multiline
                        className={classes.textField + ' search-input-custom'}
                        margin="normal"
                        variant="outlined"
                        value={patientCode}
                        onChange={(event) => this.handleChangeFilter(event, 2)}
                    />
                </div>
                <div className="search-type">
                    <div className="search-name">CMND/HC</div>
                    <TextField
                        style={{ marginTop: 7 }}
                        id="outlined-textarea"
                        placeholder="Nhập CMND/HC"
                        multiline
                        className={classes.textField + ' search-input-custom'}
                        margin="normal"
                        variant="outlined"
                        value={passport}
                        onChange={(event) => this.handleChangeFilter(event, 3)}
                    />
                </div>
                <div className="search-type">
                    <div className="search-name">Số thẻ</div>
                    <TextField
                        style={{ marginTop: 7 }}
                        id="outlined-textarea"
                        placeholder="Nhập số thẻ"
                        multiline
                        className={classes.textField + ' search-input-custom'}
                        margin="normal"
                        variant="outlined"
                        value={code}
                        onChange={(event) => this.handleChangeFilter(event, 4)}
                    />
                </div>
                <div className="select-box-search">
                    <div className="search-name select-title-search">Trạng thái</div>
                    <SelectBox
                        listOption={[{ id: -1, name: "Tất cả" }, ...DataContants.listCancel]}
                        placeholder={'Tìm kiếm'}
                        selected={cancel}
                        getIdObject={(item) => {
                            return item.id;
                        }}
                        getLabelObject={(item) => {
                            return item.name
                        }}
                        onChangeSelect={(lists, ids) => {
                            this.handleChangeFilter(ids, 5)
                        }}
                    />
                </div>
            </div>
        )
    }
    getCancelStatus(item) {
        var status = DataContants.listCancel.filter((data) => {
            return parseInt(data.id) === item
        })
        if (status.length > 0)
            return status[0];
        return {};
    }
    render() {
        const { classes } = this.props;
        const { dataView, page, stt, total, size, dataCardUser } = this.state;
        return (
            <div className="color-background-control">
                <Paper className={classes.root + " page-header"}>
                    <div className={classes.tableWrapper + ' page-wrapper'}>
                        <div className="page-title">
                            <h2 className="title-page">Danh sách thẻ người bệnh</h2>
                        </div>
                        {this.renderChirenToolbar()}
                        <Table aria-labelledby="tableTitle" className="style-table-new">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: "3%" }}>STT</TableCell>
                                    <TableCell style={{ width: "12%" }}>Số thẻ</TableCell>
                                    <TableCell style={{ width: "10%" }}>Mã NB</TableCell>
                                    <TableCell style={{ width: "10%" }}>Họ và tên</TableCell>
                                    <TableCell style={{ width: "10%" }}>Ngày sinh</TableCell>
                                    <TableCell style={{ width: "9%" }}>Giới tính</TableCell>
                                    <TableCell style={{ width: "12%" }}>CMND/Hộ chiếu</TableCell>
                                    <TableCell style={{ width: "10%" }}>CSYT</TableCell>
                                    <TableCell style={{ width: "11%" }}>Trạng thái</TableCell>
                                    <TableCell style={{ width: "13%" }}>Hành động</TableCell>
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
                                                <TableCell>{this.formatCardNumber(item.card.code)}</TableCell>
                                                <TableCell>{item.card.patient && item.card.patient.code}</TableCell>
                                                <TableCell>{item.card.patient && item.card.patient.name}</TableCell>
                                                <TableCell>{moment(item.card.patient.dob).format("DD-MM-YYYY")}</TableCell>
                                                <TableCell>{item.card.patient.gender === 0 ? "Nữ" : item.card.patient.gender === 1 ? "Nam" : ""}</TableCell>
                                                <TableCell>{item.card.patient.passport}</TableCell>
                                                <TableCell>{item.card.hospital && item.card.hospital.name}</TableCell>
                                                <TableCell>
                                                    {this.getCancelStatus(item.card.cancel) ? this.getCancelStatus(item.card.cancel).name : ""}
                                                </TableCell>
                                                {
                                                    item.card.cancel === 0 ?
                                                        <TableCell>
                                                            <Tooltip title="Xem chi tiết">
                                                                <IconButton onClick={() => this.modalDetail(item)} color="primary" className={classes.button + " button-detail-user-card"}>
                                                                    <img src="/images/detail.png" alt="" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Nạp tiền">
                                                                <IconButton onClick={() => this.modalRechargeCard(item)} className="button-home">
                                                                    <img src="/images/nap-tien.png" alt="" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Hủy thẻ">
                                                                <IconButton onClick={() => this.modalCancelCard(item)} className="button-home">
                                                                    <img src="/images/huy-the.png" alt="" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell> :
                                                        <TableCell>
                                                            <Tooltip title="Xem chi tiết">
                                                                <IconButton onClick={() => this.modalDetail(item)} color="primary" className={classes.button + " button-detail-user-card"}>
                                                                    <img src="/images/detail.png" alt="" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <IconButton disabled>
                                                                <img src="/images/nap-tien-inactive.png" alt="" className="button-home" />
                                                            </IconButton>
                                                            <IconButton disabled>
                                                                <img src="/images/huy-the-inactive.png" alt="" className="button-home" />
                                                            </IconButton>
                                                        </TableCell>
                                                }
                                            </TableRow>
                                        );
                                    })
                                        :
                                        <TableRow>
                                            <TableCell colSpan="10">
                                                {
                                                    (this.state.hospital || this.state.patientCode || this.state.passport || this.state.code || this.state.cancel) ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
                                                }
                                            </TableCell>
                                        </TableRow>
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow className="pagination-custom" >
                                    <TablePagination
                                        colSpan={10}
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
                {this.state.modalDetail && <ModalDetail data={dataCardUser} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalCancelCard && <ModalCancelCard data={dataCardUser} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalRechargeCard && <ModalRechargelCard data={dataCardUser} callbackOff={this.closeModal.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(CardUser));