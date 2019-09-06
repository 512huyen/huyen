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

class CardUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            size: 10,
            number: '',
            hospital: -1,
            passport: '',
            patientCode: '',
            data: [],
            total: 0,
            selected: [],
            progress: false,
            confirmDialog: false,
            tempDelete: [],
            listHospital: [],
            modalDetail: false,
            modalCancelCard: false,
            createdDate: '',
            status: -1,
            type: 3,
            totalPage: 0
        }
    }

    componentWillMount() {
        this.loadPage();
        this.getHospital();
    }


    loadPage() {
        this.setState({ progress: true })
        let params = {
            page: this.state.page === 0 ? this.state.page + 1 : Number(this.state.page) + 1,
            size: this.state.size,
            number: this.state.number,
            hospital: this.state.hospital,
            passport: this.state.passport,
            patientCode: this.state.patientCode,
            status: this.state.status,
        }
        cardProvider.search(params).then(s => {
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
        let params = {
            page: 1,
            size: 99999,
            status: 1
        }
        hospitalProvider.search(params, false).then(s => {
            if (s && s.data && s.code === 0) {
                this.setState({
                    listHospital: s.data.data
                })
            }
        }).catch(e => {

        })
    }
    modalDetail(item) {
        this.setState({
            modalDetail: true,
            dataCardUser: item,
        })
    }
    modalCancelCard(item) {
        this.setState({
            modalCancelCard: true,
            dataCardUser: item,
        })
    }
    modalRechargeCard(item) {
        this.setState({
            modalRechargeCard: true,
            dataCardUser: item,
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
        this.loadPage();
        this.setState({ modalDetail: false, modalCancelCard: false, modalRechargeCard: false });
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
                hospital: event
            }, () => {
                this.loadPage();
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
                    this.loadPage()
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
                    this.loadPage()
                }, 500)
            })
        }
        if (action === 4) {
            this.setState({
                page: 0,
                number: event.target.value
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
        if (action === 5) {
            this.setState({
                page: 0,
                status: event
            }, () => {
                this.loadPage();
            })
        }
    }
    renderChirenToolbar() {
        const { classes } = this.props;
        const { hospital, patientCode, number, passport, listHospital, status } = this.state;
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
                        value={number}
                        onChange={(event) => this.handleChangeFilter(event, 4)}
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
                            this.handleChangeFilter(ids, 5)
                        }}
                    />
                </div>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { data, page, progress, selected, stt, total, size, dataCardUser } = this.state;
        return (
            <div>
                <Paper className={classes.root + " page-header"}>
                    <div className={classes.tableWrapper + ' page-wrapper'}>
                        <div className="page-title">
                            <h2 className="title-page">Danh sách thẻ người bệnh</h2>
                            {/* <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} >Thêm mới</Button> */}
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
                                    <TableCell style={{ width: "3%" }}>STT</TableCell>
                                    <TableCell style={{ width: "12%" }}>Số thẻ</TableCell>
                                    <TableCell style={{ width: "10%" }}>Mã NB</TableCell>
                                    <TableCell style={{ width: "10%" }}>Họ và tên</TableCell>
                                    <TableCell style={{ width: "10%" }}>Ngày sinh</TableCell>
                                    <TableCell style={{ width: "10%" }}>Giới tính</TableCell>
                                    <TableCell style={{ width: "12%" }}>CMND/Hộ chiếu</TableCell>
                                    <TableCell style={{ width: "10%" }}>CSYT</TableCell>
                                    <TableCell style={{ width: "11%" }}>Trạng thái</TableCell>
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
                                                <TableCell>{item.card.number}</TableCell>
                                                <TableCell>{item.card.number}</TableCell>
                                                <TableCell>{item.card.patient.name}</TableCell>
                                                <TableCell>{moment(item.card.patient.dob).format("DD-MM-YYYY")}</TableCell>
                                                <TableCell>{item.card.patient.gender === 1 ? "Nữ" : item.card.patient.gender === 2 ? "Nam" : ""}</TableCell>
                                                <TableCell>{item.card.patient.passport}</TableCell>
                                                <TableCell>{item.card.hospital}</TableCell>
                                                <TableCell>{item.card.deleted === 0 ? "Đang hoạt động" : item.card.deleted === 1 ? "Đã khóa" : null}</TableCell>
                                                {
                                                    item.card.deleted === 0 ?
                                                        <TableCell>
                                                            <Tooltip title="Xem chi tiết">
                                                                <IconButton onClick={() => this.modalDetail(item)} color="primary" className={classes.button + " button-detail-user-card"}>
                                                                    <img src="/images/detail.png" alt="" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Nạp tiền">
                                                                <IconButton onClick={() => this.modalRechargeCard(item)}>
                                                                    <img src="/images/nap-tien.png" alt="" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Hủy thẻ">
                                                                <IconButton onClick={() => this.modalCancelCard(item)}>
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
                                                                <img src="/images/nap-tien-inactive.png" alt="" />
                                                            </IconButton>
                                                            <IconButton disabled>
                                                                <img src="/images/huy-the-inactive.png" alt="" />
                                                            </IconButton>
                                                        </TableCell>
                                                }
                                            </TableRow>
                                        );
                                    })
                                        :
                                        <TableRow>
                                            <TableCell colSpan="10">{this.state.name ? 'Không có kết quả phù hợp' :
                                                this.state.text ? 'Không có kết quả phù hợp' :
                                                    this.state.type ? 'Không có kết quả phù hợp' :
                                                        this.state.status ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
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