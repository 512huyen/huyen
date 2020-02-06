import React, { Component } from 'react';
import "../../css/Home_isofhPay.css";
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import userProvider from '../../../../data-access/user-provider';
import EnhancedTableToolbar from '../../../admin/components/table-toolbar';
import { DateTimeBoxSearch } from '../../../../components/input-field/InputField';
import TransactionHistory from "./detail-transaction-history"
import DetailCard from "./detail-card-user"
import Checkbox from '@material-ui/core/Checkbox';
class UserHome extends Component {
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
            dataUser: [],
            progress: false,
            confirmDialog: false,
            dob: '',
            createdUser: '',
            status: -1,
            type: 8,
            totalPage: 0,
            code: 100000
        }
    }

    componentWillMount() {
        this.getDetailUser();
        this.loadPage();
        this.checkUserLogin()
    }
    getDetailUser() {
        userProvider.getDetail((this.props.userApp.currentUser || {}).id).then(s => {
            if (s && s.data && s.code === 0) {
                this.setState({
                    dataUser: s.data.user
                })
            }
        }).catch(e => {

        })
    }
    checkUserLogin() {
        if (!this.props.userApp.isLogin) {
            window.location.href = "/dang-nhap"
        }
        if (this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.type !== 8) {
            window.location.href = "/admin"
        }
    }

    loadPage() {
        this.setState({ progress: true })
        let params = {
            page: Number(this.state.page) + 1,
            size: this.state.size,
            text: this.state.text.trim(),
            status: this.state.status,
            type: this.state.type,
            identification: this.state.identification,
            dob: this.state.dob ? moment(this.state.dob).format("YYYY-MM-DD") : ""
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
    closeModal() {
        this.setState({
            modelTransactionHistory: false,
            modelDetailCard: false
        })
        this.loadPage();
    }
    modelTransactionHistory() {
        this.setState({
            modelTransactionHistory: true
        })
    }
    modelDetailCard() {
        this.setState({
            modelDetailCard: true
        })
    }
    renderChirenToolbar() {
        const { classes } = this.props;
        const { dob } = this.state;
        return (
            <div className="header-search isofh-pay-table-user-home-title">
                <div className="search-type">
                    <div className="search-name user-color-title-search" style={{ marginBottom: -12 }}>Từ ngày</div>
                    <div className="date-picker-style-header select-style-user" style={{ marginRight: 14 }}>
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
                    <div className="search-name user-color-title-search" style={{ marginBottom: -12 }}>Đến ngày</div>
                    <div className="date-picker-style-header select-style-user">
                        <DateTimeBoxSearch
                            value={this.state.dob}
                            onChangeValue={(event) => {
                                this.setState({ dob: event }, () => this.loadPage())
                            }}
                            placeholder="Đến ngày"
                        />
                    </div>
                </div>
                <div className="search-type user-home-margin-left">
                    <div className="search-name user-color-title-search">Tìm kiếm</div>
                    <TextField
                        // style={{ marginTop: 7, minWidth: 230, maxWidth: 503 }}
                        id="outlined-textarea"
                        placeholder="Nhập nội dung"
                        multiline
                        className={classes.textField + ' search-input-custom select-style-user text-field-max'}
                        margin="normal"
                        variant="outlined"
                        value={dob}
                    // onChange={(event) => this.handleChangeFilter(event, 2)}
                    />
                </div>
                <div className="search-type user-home-margin-left search-type-check-box">
                    <span className="check-box-name">Tất cả giao dịch</span>
                    <Checkbox
                        // style={{ marginTop: 0 }}
                        checked={this.state.active}
                        onChange={(event) => { this.setState({ active: event.target.checked }) }}
                        value="active"
                    />
                </div>
            </div>
        )
    }
    render() {
        const { data, selected, code, dataHospital, dataUser } = this.state;
        return (
            <div>
                {
                    this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.type && this.props.userApp.currentUser.type === 8 ?
                        <div className="isofhPay-user-home">
                            <div className="row">
                                <div className="isofh-pay-main-left">
                                    <div className="infor">
                                        <p className="title_infor">THÔNG TIN CÁ NHÂN </p>
                                        <div className="div_avatar">
                                            {
                                                dataUser && dataUser.image ? <img src={dataUser.image.absoluteUrl()} className=" avatar img-responsive" alt="" /> : <img src="/images/avatar.png" className=" avatar img-responsive" alt="" />
                                            }
                                        </div>
                                        <p className="fullname"><b>{dataUser.name}</b></p>
                                        <div className="isofh-pay-table">
                                            <div className="user-home-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="user-home-index-1">Ngày sinh:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="user-home-index-2">{moment(dataUser.dob).format("DD/MM/YYYY")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="user-home-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="user-home-index-1">Giới tính:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="user-home-index-2">{dataUser.gender === 1 ? "Nam" : dataUser.gender === 0 ? "Nữ" : null}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="user-home-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="user-home-index-1">SĐT:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="user-home-index-2">{dataUser.phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="user-home-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="user-home-index-1">Số CMND:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="user-home-index-2">{dataUser.identification}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="user-home-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="user-home-index-1">Địa chỉ:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="user-home-index-2">{dataUser.address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mycard">
                                    <p id="mycard">THẺ CỦA TÔI</p>
                                    <div>
                                        <div className="div_card" onClick={() => this.modelDetailCard()}>
                                            <div className="isofh-pay-image-header">
                                                <div className="isofh-pay-image-style-1">
                                                    <img src="/images/logoIsofhPay01.png" alt="" className="logo_isofhpay" />
                                                    <img src="/images/bitmap2.png" alt="" className="logo_mb" />
                                                </div>
                                                <p className="name_hopital">Bệnh viện Đại học Y Hà Nội</p>
                                                <div className="num_card">
                                                    <p className="sothe">Số thẻ</p>
                                                    <p className="numbers">9704 7457 0799 9259</p>
                                                </div>
                                            </div>
                                            <div className="div_thongtin ">
                                                <p className="thongtinthe"><b>Xem lịch sử GD</b></p>
                                                {/* <p className="soduht">Số dư hiện tại:<br /><span style={{ color: "#27ae60", fontWeight: 700, fontSize: 16 }}>10.000.000 VND</span></p> */}
                                            </div>
                                        </div>
                                        <div className="div_card" onClick={() => this.modelDetailCard()}>
                                            <div className="isofh-pay-image-header">
                                                <div className="isofh-pay-image-style-1">
                                                    <img src="/images/logoIsofhPay01.png" alt="" className="logo_isofhpay" />
                                                    <img src="/images/bitmap2.png" alt="" className="logo_mb" />
                                                </div>
                                                <p className="name_hopital">Bệnh viện Đại học Y Hà Nội</p>
                                                <div className="num_card">
                                                    <p className="sothe">Số thẻ</p>
                                                    <p className="numbers">9704 7457 0799 9259</p>
                                                </div>
                                            </div>
                                            <div className="div_thongtin">
                                                <p className="thongtinthe"><b>Xem lịch sử GD</b></p>
                                                {/* <p className="xemsodu">Xem số dư</p> */}
                                            </div>
                                        </div>
                                        <div className="div_card" onClick={() => this.modelDetailCard()}>
                                            <div className="isofh-pay-image-header">
                                                <div className="isofh-pay-image-style-1">
                                                    <img src="/images/logoIsofhPay01.png" alt="" className="logo_isofhpay" />
                                                    <img src="/images/bitmap2.png" alt="" className="logo_mb" />
                                                </div>
                                                <p className="name_hopital">Bệnh viện Đại học Y Hà Nội</p>
                                                <div className="num_card">
                                                    <p className="sothe">Số thẻ</p>
                                                    <p className="numbers">9704 7457 0799 9259</p>
                                                </div>
                                            </div>
                                            <div className="div_thongtin">
                                                <p className="thongtinthe" ><b>Xem lịch sử GD</b></p>
                                                {/* <p className="xemsodu">Xem số dư</p> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="page-title isofh-pay-title-header">
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
                                    <div className="table-user-home">
                                        <Table aria-labelledby="tableTitle" className="isofh-pay-table-user-home">
                                            <TableBody>
                                                {
                                                    data && data.length ? data.map((item, index) => {
                                                        return (
                                                            <TableRow
                                                                hover
                                                                key={index}
                                                                tabIndex={-1}
                                                                className="user-home-tr">
                                                                <TableCell style={{ width: "10%" }} className="user-home-cell-1 user-home-cell"><img src="/images/back1.png" alt="" /></TableCell>
                                                                <TableCell style={{ width: "20%" }} className="user-home-cell">
                                                                    <div className="user-home-style-1">Ngày giao dịch</div>
                                                                    <div className="user-home-style-2">{moment(item.user.createdDate).format("HH:mm:ss - DD/MM/YYYY")}</div>
                                                                </TableCell>
                                                                <TableCell style={{ width: "20%" }} className="user-home-cell">
                                                                    <div className="user-home-style-1">Số tiền</div>
                                                                    <div className="user-home-style-2 user-home-color-green">{code.formatPrice()}</div>
                                                                </TableCell>
                                                                <TableCell style={{ width: "20%" }} className="user-home-cell">
                                                                    <div className="user-home-style-1">Tên người nhận</div>
                                                                    <div className="user-home-style-2">Bệnh viện Đại học Y Hà Nội</div>
                                                                </TableCell>
                                                                {/* <TableCell style={{ width: "30%" }} className="user-home-cell">
                                                                <div className="user-home-style-1">Nội dung thanh toán</div>
                                                                <div className="user-home-style-3">Nguyen Thi Lam thanh toán khám bệnh</div>
                                                            </TableCell> */}
                                                                <TableCell style={{ width: "15%" }} className="user-home-cell">
                                                                    <div className="user-home-style-1">Trạng thái</div>
                                                                    <div className="user-home-style-3 user-home-color-red">Không thành công</div>
                                                                </TableCell>
                                                                <TableCell style={{ width: "15%" }} className="user-home-cell">
                                                                    <img src="/images/bitmap2.png" alt="" className="user-home-image" />
                                                                    <div className="user-home-button" onClick={() => this.modelTransactionHistory()}>Xem chi tiết</div>
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
                                        </Table>
                                    </div>
                                </div>
                            </div>
                            {this.state.modelTransactionHistory && <TransactionHistory data={dataHospital} callbackOff={this.closeModal.bind(this)} />}
                            {this.state.modelDetailCard && <DetailCard data={dataHospital} callbackOff={this.closeModal.bind(this)} />}
                        </div> : null
                }
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

export default withStyles(styles)(connect(mapStateToProps)(UserHome));