import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import EnhancedTableToolbar from '../../components/table-toolbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import paymentAgentProvider from '../../../../data-access/paymentAgent-provider';
import { withStyles } from '@material-ui/core/styles';
import ModalAddUpdate from './create-update-payment-agent';
import ModalDetail from './detail-payment-agent';
import DataContants from '../../../../config/data-contants';
import { SelectBox } from '../../../../components/input-field/InputField';
import { listPaymentAgent } from '../../../../reducers/actions'
class PayMentAgent extends Component {
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
            type: -1,
            totalPage: 0,
            listPaymentMethod: []
        }
    }
    componentWillMount() {
        this.loadPage();
    }
    loadPage(item) {
        this.setState({ progress: true })
        let params = {
            page: Number(this.state.page) + 1,
            size: this.state.size,
            name: this.state.name.trim(),
            status: this.state.status,
            type: this.state.type
        }
        if (this.props.userApp.listPaymentAgent && this.props.userApp.listPaymentAgent.length !== 0 && !item) {
            let listType1 = this.props.userApp.listPaymentAgent.filter(x => { return x.paymentAgent.type === 1 })
            let listType2 = this.props.userApp.listPaymentAgent.filter(x => { return x.paymentAgent.type === 2 })
            this.setState({
                data: listType1,
                dataType: listType2,
                dataSearch: listType1,
                dataTypeSearch: listType2
            })
        } else {
            paymentAgentProvider.search(params).then(s => {
                if (s && s.code === 0 && s.data) {
                    this.props.dispatch(listPaymentAgent(s.data.data))
                    let listType1 = s.data.data.filter(x => { return x.paymentAgent.type === 1 })
                    let listType2 = s.data.data.filter(x => { return x.paymentAgent.type === 2 })
                    this.setState({
                        data: listType1,
                        dataType: listType2,
                        dataSearch: listType1,
                        dataTypeSearch: listType2
                    })
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
    }
    getDetail(item, type) {
        this.setState({ progress: true })
        paymentAgentProvider.getDetail(item.paymentAgent.id).then(s => {
            if (s && s.code === 0 && s.data) {
                this.setState({
                    listPaymentMethod: s.data.paymentAgent
                })
                if (type === "create") {
                    this.modalCreateUpdate(s.data)
                } else if (type === "detail") {
                    this.modalDetail(s.data)
                }

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
                dataPaymentAgent: item,
                listPaymentMethod: this.state.listPaymentMethod
            })
        } else {
            this.setState({
                modalAdd: true,
                dataPaymentAgent: {},
                listPaymentMethod: []
            })
        }
    }
    modalDetail(item) {
        this.setState({
            modalDetail: true,
            dataPaymentAgent: item,
        })
    }

    closeModal(item) {
        this.loadPage(item);
        paymentAgentProvider.groupByMethod(item)
        this.setState({
            modalAdd: false,
            modalDetail: false
        })
    }
    handleChangeFilter(event, action) {
        const { data, dataType, status, name } = this.state;
        let dataSearch = []
        let dataTypeSearch = []
        if (action === 2) {
            let text = event.target.value
            text = text.trim().toLocaleLowerCase().unsignText();
            let dataSearchStatus = []
            let dataSearchStatusType = []
            if (status !== -1) {
                dataSearchStatus = (data || []).filter(item => {
                    if (item.paymentAgent.status === Number(status))
                        return item
                    return item
                })
                dataSearchStatusType = (dataType || []).filter(item => {
                    if (item.paymentAgent.status === Number(status))
                        return item
                    return item
                })
            } else {
                dataSearchStatus = data
                dataSearchStatusType = dataType
            }
            let dataSearch = (dataSearchStatus || []).filter(item => {
                return item.paymentAgent.name.toLocaleLowerCase().unsignText().indexOf(text) !== -1 || item.paymentAgent.nameAbb.toLocaleLowerCase().unsignText().indexOf(text) !== -1
            })
            let dataTypeSearch = (dataSearchStatusType || []).filter(item => {
                return item.paymentAgent.name.toLocaleLowerCase().unsignText().indexOf(text) !== -1 || item.paymentAgent.nameAbb.toLocaleLowerCase().unsignText().indexOf(text) !== -1
            })
            this.setState({
                name: event.target.value,
                dataSearch: dataSearch,
                dataTypeSearch: dataTypeSearch
            })
        }
        if (action === 1) {
            let text = event
            let dataSearchStatus = []
            let dataSearchStatusType = []
            if (name && name.length > 0) {
                let textName = name.trim().toLocaleLowerCase().unsignText();
                dataSearchStatus = (data || []).filter(item => {
                    return item.paymentAgent.name.toLocaleLowerCase().unsignText().indexOf(textName) !== -1 || item.paymentAgent.nameAbb.toLocaleLowerCase().unsignText().indexOf(textName) !== -1
                })
                dataSearchStatusType = (dataType || []).filter(item => {
                    return item.paymentAgent.name.toLocaleLowerCase().unsignText().indexOf(textName) !== -1 || item.paymentAgent.nameAbb.toLocaleLowerCase().unsignText().indexOf(textName) !== -1
                })
            } else {
                dataSearchStatus = data
                dataSearchStatusType = dataType
            }
            if (event === -1) {
                dataSearch = dataSearchStatus
                dataTypeSearch = dataSearchStatusType
            } else {
                dataSearch = (dataSearchStatus || []).filter(item => {
                    if (item.paymentAgent.status === Number(text)) 
                        return item
                    return item
                })
                dataTypeSearch = (dataSearchStatusType || []).filter(item => {
                    if (item.paymentAgent.status === Number(text)) {
                        return item
                    }
                    return item   
                })
            }
            this.setState({
                status: event,
                dataSearch: dataSearch,
                dataTypeSearch: dataTypeSearch
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
                            this.handleChangeFilter(ids, 1)
                        }}
                    />
                </div>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { dataSearch, selected, dataPaymentAgent, dataTypeSearch, listPaymentMethod } = this.state;
        return (
            <div className="color-background-control">
                <Paper className={classes.root + " page-header"} style={{ minHeight: 850 }}>
                    <div className={classes.tableWrapper + ' page-wrapper'}>
                        <div className="page-title">
                            <h2 className="title-page">Danh mục nhà cung cấp</h2>
                            <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} >Thêm mới</Button>
                        </div>
                        <EnhancedTableToolbar
                            numSelected={selected.length}
                            actionsChiren={
                                this.renderChirenToolbar()
                            }
                        />
                    </div>
                    <div className="payment-agent">
                        <div className="main-info">
                            <div className="main-info-item">
                                <h1 className="main-title">Danh mục ngân hàng</h1>
                                <div className="list-bank">
                                    {
                                        dataSearch && dataSearch.length > 0 ? dataSearch.map((item, index) => {
                                            return (
                                                <div key={index} className={item.paymentAgent.status === 1 ? "bank-item" : "bank-item bank-inactive"}>
                                                    <div className="bank-top">
                                                        <img src={item.paymentAgent.logo.absoluteUrl()} alt="" className="bank-img" onClick={() => this.modalDetail(item)} />
                                                        <div className="bank-right">
                                                            <p onClick={() => { this.getDetail(item, "create") }}>
                                                                <img src="/images/edit.png" alt="" />
                                                            </p>
                                                            <p className="bank-type"><span className="bank-active">{item.paymentAgent.status === 1 ? "Đang hoạt động" : "Đã khóa"}</span></p>
                                                        </div>
                                                    </div>
                                                    <div className="bank-info" onClick={() => { this.getDetail(item, "detail") }}>
                                                        <h2 className="bank-title">{item.paymentAgent.nameAbb}</h2>
                                                        <p className="bank-inner">Mã số: {item.paymentAgent.code}</p>
                                                    </div>
                                                </div>
                                            )
                                        }) :
                                            <div>
                                                {
                                                    (this.state.name || this.state.status) ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
                                                }
                                            </div>
                                    }
                                </div>
                            </div>
                            <div className="main-info-item">
                                <h1 className="main-title">Danh mục nhà cung cấp khác</h1>
                                <div className="list-bank">
                                    {
                                        dataTypeSearch && dataTypeSearch.length > 0 ? dataTypeSearch.map((item, index) => {
                                            return (
                                                <div key={index} className={item.paymentAgent.status === 1 ? "bank-item" : "bank-item bank-inactive"}>
                                                    <div className="bank-top">
                                                        <img src={item.paymentAgent.logo.absoluteUrl()} alt="" className="bank-img" onClick={() => { this.getDetail(item, "detail") }} />
                                                        <div className="bank-right">
                                                            <span onClick={() => this.getDetail(item, "create") }>
                                                                <img src="/images/edit.png" alt="" />
                                                            </span>
                                                            <p className="bank-type"><span className="bank-active">{item.paymentAgent.status === 1 ? "Đang hoạt động" : "Đã khóa"}</span></p>
                                                        </div>
                                                    </div>
                                                    <div className="bank-info" onClick={() => { this.getDetail(item, "detail") }}>
                                                        <h2 className="bank-title">{item.paymentAgent.nameAbb}</h2>
                                                        <p className="bank-inner">Mã số: {item.paymentAgent.code}</p>
                                                    </div>
                                                </div>
                                            )
                                        }) : null
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </Paper>
                {this.state.modalAdd && <ModalAddUpdate data={dataPaymentAgent} listPaymentMethod={listPaymentMethod} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalDetail && <ModalDetail data={dataPaymentAgent} callbackOff={this.closeModal.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(PayMentAgent));