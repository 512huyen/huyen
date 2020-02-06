import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import EnhancedTableToolbar from '../../components/table-toolbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import hospitalProvider from '../../../../data-access/hospital-provider';
import { withStyles } from '@material-ui/core/styles';
import ModalDetail from './detail-hospital';
import ModalDetailHIS from './HIS-hospital';
import paymentAgentProvider from '../../../../data-access/paymentAgent-provider';
import ModalAddUpdate from './create-update-hospital';
import DataContants from '../../../../config/data-contants';
import { SelectBox } from '../../../../components/input-field/InputField';
import { listHospital, listPaymentAgent, listPaymentAgentMethod } from '../../../../reducers/actions'
class Hospital extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 99999,
            name: '',
            title: '',
            index: '',
            info: '',
            data: [],
            selected: [],
            listPaymentMethod: [],
            listKeyMethod: [],
            confirmDialog: false,
            modalAdd: false,
            modalDetail: false,
            modalDetailHIS: false,
            tempDelete: [],
            status: -1,
            statuS: '',
            type: -1,
            agentId: -1,
            paymentMethod: -1
        }
    }
    componentWillMount() {
        this.loadPage();
        this.getPaymentAgent();
        this.getPaymentMethod()
    }
    loadPage(item) {
        let params = {
            page: Number(this.state.page) + 1,
            size: this.state.size,
            name: this.state.name.trim(),
            status: this.state.status,
            agentId: this.state.agentId,
            paymentMethod: this.state.paymentMethod
        }
        if (this.props.userApp.listHospital && this.props.userApp.listHospital.length !== 0 && !item) {
            let listStatus = []
            if (this.state.status === -1) {
                listStatus = this.props.userApp.listHospital
            } else {
                listStatus = this.props.userApp.listHospital.filter(x => { return x.hospital.status === this.state.status })
            }
            this.setState({
                data: listStatus
            })
        } else {
            hospitalProvider.search(params).then(s => {
                if (s && s.code === 0 && s.data) {
                    this.props.dispatch(listHospital(s.data.data))
                    this.setState({
                        data: s.data.data
                    })
                }
            }).catch(e => {
            })
        }
    }
    getPaymentAgent() {
        let params = {
            page: 1,
            size: 99999
        }
        if (this.props.userApp.listPaymentAgent && this.props.userApp.listPaymentAgent.length !== 0) {
            this.setState({
                listPaymentAgent: this.props.userApp.listPaymentAgent.filter(item => { return (item.paymentAgent.status === 1) })
            })
        } else {
            paymentAgentProvider.search(params).then(s => {
                this.props.dispatch(listPaymentAgent(s.data.data))
                if (s && s.data && s.code === 0) {
                    this.setState({
                        listPaymentAgent: s.data.data.filter(item => { return (item.paymentAgent.status === 1) })
                    })
                }
            })
        }
    }
    getPaymentMethod() {
        if (this.props.userApp.listPaymentAgentMethod && this.props.userApp.listPaymentAgentMethod.length !== 0) {
            this.setState({
                listPaymentAgentMethod: this.props.userApp.listPaymentAgentMethod
            })
        } else {
            paymentAgentProvider.groupByMethod().then(s => {
                if (s && s.code === 0 && s.data) {
                    this.props.dispatch(listPaymentAgentMethod(s.data.methods))
                    this.setState({
                        listPaymentAgentMethod: s.data.methods
                    })
                } else {
                    this.setState({
                        listPaymentAgentMethod: []
                    })
                }
            }).catch(e => {
            })
        }
    }
    modalCreateUpdate(item) {
        if (item) {
            this.setState({
                modalAdd: true,
                dataHospital: item,
            })
        } else {
            this.setState({
                modalAdd: true,
                dataHospital: {},
            })
        }
    }
    modalDetail(item) {
        this.setState({
            modalDetail: true,
            dataHospital: item,
        })
    }
    modalDetailHIS(item) {
        hospitalProvider.getHisAccount(item.hospital.id).then(s => {
            if (s && s.data && s.code === 0) {
                this.setState({
                    dataHisHospital: s.data.hisAccounts,
                    modalDetailHIS: true,
                    dataHospital: item
                })
            }
        }).catch(e => {

        })
    }
    closeModal(item) {
        this.loadPage(item);
        this.setState({
            modalAdd: false,
            modalDetail: false,
            modalDetailHIS: false
        })
    }
    handleChangeFilter(event, action) {
        if (action === 1) {
            this.setState({
                page: 0,
                name: event.target.value
            }, () => {
                this.loadPage(true);
            })
        }
        if (action === 2) {
            this.setState({
                page: 0,
                paymentMethod: event
            }, () => {
                this.loadPage(true);
            })
        }
        if (action === 3) {
            this.setState({
                page: 0,
                agentId: event
            }, () => {
                this.loadPage(true);
            })
        }
        if (action === 4) {
            this.setState({
                page: 0,
                status: event
            }, () => {
                this.loadPage(true);
            })
        }
    }
    renderChirenToolbar() {
        const { classes } = this.props;
        const { paymentMethod, status, name, agentId, listPaymentAgent } = this.state;
        return (
            <div className="header-search">
                <div className="search-type">
                    <div className="search-name">Tên CSYT</div>
                    <TextField
                        style={{ marginTop: 7 }}
                        id="outlined-textarea"
                        placeholder="Tên CSYT"
                        multiline
                        className={classes.textField + ' search-input-custom'}
                        margin="normal"
                        variant="outlined"
                        value={name}
                        onChange={(event) => this.handleChangeFilter(event, 1)}
                    />
                </div>
                <div className="select-box-search">
                    <div className="search-name select-title-search">Phương thức thanh toán</div>
                    <SelectBox
                        listOption={[{ id: -1, name: "Tất cả" }, ...DataContants.listPaymentMethod]}
                        placeholder={'Tìm kiếm'}
                        selected={paymentMethod}
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
                    {
                        listPaymentAgent &&
                        <SelectBox
                            listOption={[{ paymentAgent: { id: -1, nameAbb: "Tất cả" } }, ...listPaymentAgent]}
                            placeholder={'Tìm kiếm'}
                            selected={agentId}
                            getIdObject={(item) => {
                                return item.paymentAgent.id;
                            }}
                            getLabelObject={(item) => {
                                return item.paymentAgent.nameAbb
                            }}
                            onChangeSelect={(lists, ids) => {
                                this.handleChangeFilter(ids, 3)
                            }}
                        />
                    }
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
                            this.handleChangeFilter(ids, 4)
                        }}
                    />
                </div>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { data, selected, dataHospital, listPaymentAgentMethod, dataHisHospital } = this.state;
        return (
            <div className="color-background-control">
                <Paper className={classes.root + " page-header"} style={{ minHeight: 850 }}>
                    <div className={classes.tableWrapper + ' page-wrapper'}>
                        <div className="page-title">
                            <h2 className="title-page">Quản lý CSYT</h2>
                            <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} >Thêm mới</Button>
                        </div>
                        <EnhancedTableToolbar
                            className="ahihi"
                            numSelected={selected.length}
                            actionsChiren={
                                this.renderChirenToolbar()
                            }
                        />
                    </div>
                    <div className="hospital">
                        <div className="main-info">
                            <div className="list-bank">
                                {
                                    data && data.length > 0 ? data.map((item, index) => {
                                        return (
                                            <div key={index} className={item.hospital && item.hospital.status === 1 ? "bank-item" : "bank-item bank-inactive"}>
                                                <div className="bank-top">
                                                    <div className="bank-top-header">
                                                        <img src={item.hospital && item.hospital.logo && item.hospital.logo.absoluteUrl()} alt="" className="bank-img" onClick={() => this.modalDetail(item)} />
                                                        <div className="bank-right">
                                                            <span onClick={() => this.modalCreateUpdate(item)}>
                                                                <img src="/images/edit.png" alt="" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="bank-type-name">
                                                        <p className="bank-type"><span className="bank-name">{item.hospital && item.hospital.name}</span></p>
                                                        <p className="bank-type">Trạng thái: <span className="bank-active">{item.hospital && item.hospital.status === 1 ? "Đang hoạt động" : "Đã khóa"}</span></p>
                                                    </div>
                                                </div>
                                                <div className="bank-info" onClick={() => this.modalDetail(item)}>
                                                    <h2 className="bank-title">Phương thức thanh toán:</h2>
                                                    {
                                                        item.hospital && item.hospital.paymentMethods ?
                                                            Object.keys(item.hospital && item.hospital.paymentMethods).map((item2, index2) => {
                                                                return (
                                                                    <div className="hospital-bank-item" key={index2}>
                                                                        {
                                                                            DataContants.listPaymentMethod.map((item3, index3) => {
                                                                                return (
                                                                                    <div className="bank-inner" key={index3}>
                                                                                        {
                                                                                            item3.id === Number(item2) && index2 <= 2 ? " + " + item3.name : index2 === 3 && item3.id === Number(item2) ? <div className="hospital-bank-index" >Xem thêm</div> : null
                                                                                        }
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                )
                                                            }
                                                            ) : null
                                                    }

                                                </div>
                                                <div className="bank-footer" onClick={() => this.modalDetailHIS(item)}>Danh sách tài khoản HIS</div>
                                            </div>
                                        )
                                    }) :
                                        <div>
                                            {
                                                this.state.name || this.state.paymentMethod || this.state.status || this.state.agentId ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
                                            }
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </Paper>
                {this.state.modalAdd && <ModalAddUpdate data={dataHospital} listPaymentMethod={listPaymentAgentMethod} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalDetail && <ModalDetail data={dataHospital} listPaymentMethod={listPaymentAgentMethod} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalDetailHIS && <ModalDetailHIS data={dataHisHospital} dataHospital={dataHospital} callbackOff={this.closeModal.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(Hospital));