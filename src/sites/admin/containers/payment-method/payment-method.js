import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import paymentMethodProvider from '../../../../data-access/payment-method-provider';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ModalAddUpdate from './create-update-payment-method';

class PayMentMethod extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            size: 10,
            name: '',
            title: '',
            index: '',
            info: '',
            data: [],
            dataType: [],
            total: 0,
            selected: [],
            progress: false,
            confirmDialog: false,
            modalDetail: false,
            tempDelete: [],
            modalAdd: false,
            createdDate: '',
            createdUser: '',
            status: -1,
            code: "",
            totalPage: 0
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
            name: this.state.name.trim(),
            status: this.state.status,
            code: this.state.code,
        }
        paymentMethodProvider.search(params).then(s => {
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

    modalCreateUpdate(item) {
        if (item) {
            this.setState({
                modalAdd: true,
                dataPaymentMethod: item,
            })
        } else {
            this.setState({
                modalAdd: true,
                dataPaymentMethod: {},
            })
        }
    }
    modalDetail(item) {
        this.setState({
            modalDetail: true,
            dataPaymentMethod: item,
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
        this.setState({
            modalAdd: false,
            modalDetail: false
        })
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
                type: event.target.value
            }, () => {
                this.loadPage();
            })
        }
        if (action === 2) {
            this.setState({
                page: 0,
                name: event.target.value
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
                status: event.target.value
            }, () => {
                this.loadPage();
            })
        }
    }
    renderChirenToolbar() {
        const { classes } = this.props;
        const { status, name } = this.state;
        return (
            <div className="header-search">
                <div className="search-type">
                    <div className="search-name">Tên nhà cung cấp</div>
                    <TextField
                        style={{ marginTop: 7 }}
                        id="outlined-textarea"
                        placeholder="Tên nhà cung cấp"
                        multiline
                        className={classes.textField + ' search-input-custom'}
                        margin="normal"
                        variant="outlined"
                        value={name}
                        onChange={(event) => this.handleChangeFilter(event, 2)}
                    />
                </div>
                <div className="search-type">
                    <div className="search-name">Trạng thái</div>
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

            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { data, dataPaymentMethod } = this.state;
        return (
            <div>
                <Paper className={classes.root + " page-header"} style={{ minHeight: 850 }}>
                    <div className={classes.tableWrapper + ' page-wrapper'}>
                        <div className="page-title">
                            <h2 className="title-page">Danh mục Phương thức thanh toán</h2>
                            <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} >Thêm mới</Button>
                        </div>
                    </div>
                    <div className="payment-agent">
                        <div className="main-info">
                            <div className="main-info-item">
                                <div className="list-bank">
                                    {
                                        data && data.length > 0 ? data.map((item, index) => {
                                            return (
                                                <div key={index} className={item.paymentMethod.status === 1 ? "bank-item-method" : "bank-item-method bank-inactive"} onClick={() => this.modalDetail(item)}>
                                                    <div className="bank-top-method">
                                                        <img src={item.paymentMethod.logo.absoluteUrl()} className="bank-img" alt="" />
                                                        <div className="bank-type">{item.paymentMethod.name}</div>
                                                        <div className="bank-right">
                                                            <a href="#" onClick={() => this.modalCreateUpdate(item)}>
                                                                <img src="/images/editWhite.png" alt="" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="bank-info">
                                                        <h2 className="bank-title">Nhà cung cấp:</h2>

                                                        <p className="bank-inner">
                                                            {
                                                                item && item.paymentAgents && item.paymentAgents.length > 0 ? item.paymentAgents.map((item2, index) => {
                                                                    return (
                                                                        <span key={index}>
                                                                            {item2.nameAbb}
                                                                            {
                                                                                item && item.paymentAgents && item.paymentAgents.length > 1 && (index+1) < item.paymentAgents.length ? <span>, </span> : null
                                                                            }
                                                                        </span>
                                                                    )
                                                                }) : null
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        }) :
                                            <div>
                                                {
                                                    this.state.name ? 'Không có kết quả phù hợp' :
                                                        this.state.type !== -1 ? 'Không có kết quả phù hợp' :
                                                            this.state.status !== -1 ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
                                                }
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Paper>
                {this.state.modalAdd && <ModalAddUpdate data={dataPaymentMethod} callbackOff={this.closeModal.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(PayMentMethod));