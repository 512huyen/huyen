import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '../../../../components/table';
import { InputText } from '../../../../components/input';
import { SelectText } from '../../../../components/select';
import { ButtonCreateUpdate } from '../../../../components/button';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import userProvider from '../../../../data-access/user-provider';
import { withStyles } from '@material-ui/core/styles';
import PageSize from '../../components/pagination/pageSize';
import moment from 'moment';
import DataContants from '../../../../config/data-contants';
import { listUserUser } from '../../../../reducers/actions'
class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 10,
            sizeSearch: 99999,
            text: '',
            title: '',
            index: '',
            info: '',
            data: [],
            total: 0,
            identification: '',
            phone: '',
            selected: [],
            confirmDialog: false,
            tempDelete: [],
            modalAdd: false,
            dob: '',
            createdUser: '',
            status: -1,
            type: 8,
            tableHeader: [
                {
                    width: "7%",
                    name: "STT"
                },
                {
                    width: "16%",
                    name: "Username"
                },
                {
                    width: "13%",
                    name: "Họ và tên"
                },
                {
                    width: "12%",
                    name: "Ngày sinh"
                },
                {
                    width: "12%",
                    name: "Giới tính"
                },
                {
                    width: "13%",
                    name: "CMND/Hộ chiếu"
                },
                {
                    width: "13%",
                    name: "SĐT"
                },
                {
                    width: "14%",
                    name: "Ngày tạo"
                },
            ]
        }
    }
    componentWillMount() {
        this.loadPage(true);
    }
    loadPage(item) {
        let params = {
            page: Number(this.state.page) + 1,
            size: this.state.sizeSearch,
            text: this.state.text.trim(),
            status: this.state.status,
            type: this.state.type,
            identification: this.state.identification,
            dob: this.state.dob ? moment(this.state.dob).format("YYYY-MM-DD") : ""
        }
        if (this.props.userApp.listUserUser && this.props.userApp.listUserUser.length !== 0) {
            let dataPage = []
            for (let i = (params.page - 1) * this.state.size; i < params.page * this.state.size; i++) {
                if (this.props.userApp.listUserUser[i]) {
                    dataPage.push(this.props.userApp.listUserUser[i])
                }
            }
            this.setState({
                data: this.props.userApp.listUserUser,
                dataSearch: this.props.userApp.listUserUser,
                dataView: dataPage,
                total: this.props.userApp.listUserUser.length,
                stt: 1 + ((Number(this.state.page) >= 1 ? this.state.page : 1) - 1) * this.state.size
            })
        } else {
            userProvider.search(params, item ? true : false).then(s => {
                if (s && s.code === 0 && s.data) {
                    this.props.dispatch(listUserUser(s.data.data))
                    let stt = 1 + (params.page - 1) * this.state.size;
                    let dataPage = []
                    for (let i = (params.page - 1) * this.state.size; i < params.page * this.state.size; i++) {
                        if (s.data.data[i]) {
                            dataPage.push(s.data.data[i])
                        }
                    }
                    this.setState({
                        data: s.data.data,
                        dataSearchList: s.data.data,
                        dataView: dataPage,
                        stt,
                        total: s.data.total,
                    })
                }
            }).catch(e => {
            })
        }
    }

    handleChangePage = (event, action) => {
        this.setState({
            page: action,
            selected: []
        }, () => {
            this.handleChangeFilter("", "page", action)
        });
    };
    handleChangeRowsPerPage = event => {
        this.setState({ size: event.target.value }, () => {
            this.handleChangeFilter("", "size", event.target.value)
        });
    };
    closeModal() {
        this.loadPage();
    }
    handleChangeFilter(event, action, pageSize) {
        const { text, identification, phone, data, page, size } = this.state;
        let phoneSearch = phone
        phoneSearch = phoneSearch.trim().toLocaleLowerCase().unsignText()
        let identificationSearch = identification
        identificationSearch = identification.trim().toLocaleLowerCase().unsignText()
        let textSearch = text
        textSearch = textSearch.trim().toLocaleLowerCase().unsignText()
        let dataSearchList = []
        if (action === 1) {
            let index = event.target.value
            index = index.trim().toLocaleLowerCase().unsignText()
            let dataSearch = []
            let dataView = []
            if (phone.length === 0) {
                if (identification.length === 0) {
                    dataSearch = data
                } else {
                    dataSearch = (data || []).filter(item => {
                        return (item.user.identification || "").toLocaleLowerCase().unsignText().indexOf(identificationSearch) !== -1
                    })
                }
            } else {
                if (identification.length === 0) {
                    dataSearch = (data || []).filter(item => {
                        return (item.user.phone || "").toLocaleLowerCase().unsignText().indexOf(phoneSearch) !== -1
                    })
                } else {
                    let dataSearchIdentification = (data || []).filter(item => {
                        return (item.user.identification || "").toLocaleLowerCase().unsignText().indexOf(identificationSearch) !== -1
                    })
                    dataSearch = (dataSearchIdentification || []).filter(item => {
                        return (item.user.phone || "").toLocaleLowerCase().unsignText().indexOf(phoneSearch) !== -1
                    })
                }
            }
            dataSearchList = (dataSearch || []).filter(item => {
                return (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(index) !== -1 || item.user.username.toLocaleLowerCase().unsignText().indexOf(index) !== -1
            })
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (dataSearchList[i]) {
                    dataView.push(dataSearchList[i])
                }
            }
            this.setState({
                text: event.target.value,
                dataSearchList: dataSearchList,
                dataView: dataView,
                total: dataSearchList.length,
            })
        }
        if (action === 2) {
            let index = event.target.value
            index = index.trim().toLocaleLowerCase().unsignText()
            let dataSearch = []
            let dataView = []
            if (phone.length === 0) {
                if (text.length === 0) {
                    dataSearch = data
                } else {
                    dataSearch = (data || []).filter(item => {
                        return (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1
                    })
                }
            } else {
                if (text.length === 0) {
                    dataSearch = (data || []).filter(item => {
                        return (item.user.phone || "").toLocaleLowerCase().unsignText().indexOf(phoneSearch) !== -1
                    })
                } else {
                    let dataSearchText = (data || []).filter(item => {
                        return (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1
                    })
                    dataSearch = (dataSearchText || []).filter(item => {
                        return (item.user.phone || "").toLocaleLowerCase().unsignText().indexOf(phoneSearch) !== -1
                    })
                }
            }
            dataSearchList = (dataSearch || []).filter(item => {
                return (item.user.identification || "").trim().toLocaleLowerCase().unsignText().indexOf(index) !== -1
            })
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (dataSearchList[i]) {
                    dataView.push(dataSearchList[i])
                }
            }
            this.setState({
                identification: event.target.value,
                dataSearchList: dataSearchList,
                dataView: dataView,
                total: dataSearchList.length,
            })
        }
        if (action === 3) {
            let index = event.target.value
            index = index.trim().toLocaleLowerCase().unsignText()
            let dataSearch = []
            let dataView = []
            if (identification.length === 0) {
                if (text.length === 0) {
                    dataSearch = data
                } else {
                    dataSearch = (data || []).filter(item => {
                        return (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1
                    })
                }
            } else {
                if (text.length === 0) {
                    dataSearch = (data || []).filter(item => {
                        return (item.user.identification || "").toLocaleLowerCase().unsignText().indexOf(identificationSearch) !== -1
                    })
                } else {
                    let dataSearchText = (data || []).filter(item => {
                        return (item.user.name || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1 || (item.user.username || "").toLocaleLowerCase().unsignText().indexOf(textSearch) !== -1
                    })
                    dataSearch = (dataSearchText || []).filter(item => {
                        return (item.user.identification || "").toLocaleLowerCase().unsignText().indexOf(identificationSearch) !== -1
                    })
                }
            }
            dataSearchList = (dataSearch || []).filter(item => {
                return (item.user.phone || "").trim().toLocaleLowerCase().unsignText().indexOf(index) !== -1
            })
            for (let i = page * size; i < (page + 1) * size; i++) {
                if (dataSearchList[i]) {
                    dataView.push(dataSearchList[i])
                }
            }
            this.setState({
                phone: event.target.value,
                dataSearchList: dataSearchList,
                dataView: dataView,
                total: dataSearchList.length,
            })
        }
        if (action === "page") {
            let dataView = []
            for (let i = pageSize * size; i < (pageSize + 1) * size; i++) {
                if (this.state.dataSearchList[i]) {
                    dataView.push(this.state.dataSearchList[i])
                }
            }
            this.setState({
                dataView: dataView,
                page: pageSize,
                stt: 1 + pageSize * this.state.size
            })
        }
        if (action === "size") {
            let dataView = []
            for (let i = page * pageSize; i < (page + 1) * pageSize; i++) {
                if (this.state.dataSearchList[i]) {
                    dataView.push(this.state.dataSearchList[i])
                }
            }
            this.setState({
                dataView: dataView,
                size: pageSize
            })
        }
    }
    setTplModal() {
        const { identification, text, phone, type } = this.state;
        return (
            <>
                <InputText
                    title="Họ và tên"
                    placeholder="Username/Họ và tên"
                    value={text}
                    onChangeValue={(event) => this.handleChangeFilter(event, 1)}
                />
                <InputText
                    title="CMND/Hộ chiếu"
                    placeholder="Nhập sổ"
                    value={identification}
                    onChangeValue={(event) => this.handleChangeFilter(event, 2)}
                />
                <InputText
                    title="Số điện thoại"
                    placeholder="Nhập sổ"
                    value={phone}
                    onChangeValue={(event) => this.handleChangeFilter(event, 3)}
                />
                <SelectText
                    title="Loại tài khoản"
                    listOption={[{ id: 3, name: "Tất cả" }, ...DataContants.listUser]}
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
            </>
        )
    }
    tableBody() {
        const { dataView, stt } = this.state;
        return (
            <>
                {
                    dataView && dataView.length ? dataView.map((item, index) => {
                        return (
                            <TableRow
                                hover
                                key={index}
                                tabIndex={-1}>
                                <TableCell>{index + stt}</TableCell>
                                <TableCell>{item.user.username}</TableCell>
                                <TableCell>{item.user.name}</TableCell>
                                <TableCell>{moment(item.user.dob).format("DD-MM-YYYY")}</TableCell>
                                <TableCell>{item.user.gender === 0 ? "Nữ" : item.user.gender === 1 ? "Nam" : ""}</TableCell>
                                <TableCell>{item.user.identification}</TableCell>
                                <TableCell>{item.user.phone}</TableCell>
                                <TableCell>{moment(item.user.createdDate).format("DD-MM-YYYY HH:mm:ss")}</TableCell>
                            </TableRow>
                        );
                    })
                        :
                        <TableRow>
                            <TableCell colSpan="8">
                                {
                                    (this.state.text || this.state.identification || this.state.phone) ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
                                }
                            </TableCell>
                        </TableRow>
                }
            </>
        )
    }
    pagination() {
        const { total, size, page } = this.state;
        return (
            <PageSize
                colSpan={8}
                total={total}
                size={size}
                page={page}
                handleChangePage={this.handleChangePage}
                handleChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
        )
    }
    render() {
        const { tableHeader } = this.state;
        return (
            <Table
                titlePage="Tài khoản người bệnh"
                setTplModal={this.setTplModal()}
                tableHeader={tableHeader}
                tableBody={this.tableBody()}
                pagination={this.pagination()}
            />
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

export default withStyles(styles)(connect(mapStateToProps)(User));