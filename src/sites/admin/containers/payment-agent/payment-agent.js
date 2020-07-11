import React, { useState, useEffect } from 'react';
import { SelectText } from '../../../../components/select';
import { ButtonCreateUpdate } from '../../../../components/button';
import { InputText } from '../../../../components/input';
import paymentAgentProvider from '../../../../data-access/paymentAgent-provider';
import ModalAddUpdate from './create-update-payment-agent';
import ModalDetail from './detail-payment-agent';
import Table from '../../../../components/table';
import DataContants from '../../../../config/data-contants';
import './index.scss';
function PayMentAgent() {
    const [state, _setState] = useState({
        dataSearch: [],
        dataTypeSearch: [],
        page: 0,
        size: 9999,
        name: "",
        status: null,
        type: null
    });
    const setState = (_state) => {
        _setState((state) => ({
            ...state,
            ...(_state || {}),
        }));
    };
    useEffect(() => {
        loadPage();
    }, []);
    const loadPage = (action, item) => {
        let nameSearch = action === "name" ? item : state.name
        let statusSearch = action === "status" ? item : state.status
        let params = {
            page: Number(state.page) + 1,
            size: state.size,
            name: nameSearch.trim(),
            status: statusSearch,
            type: state.type
        }
        paymentAgentProvider.search(params).then(s => {
            if (s && s.code === 0 && s.data) {
                let listType1 = s.data.data.filter(x => { return x.paymentAgent.type === 1 })
                let listType2 = s.data.data.filter(x => { return x.paymentAgent.type === 2 })
                setState({
                    data: listType1,
                    dataType: listType2,
                    dataSearch: listType1,
                    dataTypeSearch: listType2
                })
            } else {
                setState({
                    data: []
                })
            }
        }).catch(e => {
        })
    }
    const getDetail = (item, type) => {
        paymentAgentProvider.getDetail(item.paymentAgent.id).then(s => {
            if (s && s.code === 0 && s.data) {
                setState({
                    listPaymentMethod: s.data.paymentAgent
                })
                if (type === "create") {
                    modalCreateUpdate(s.data)
                } else if (type === "detail") {
                    modalDetail(s.data)
                }

            }
            setState({ progress: false })
        }).catch(e => {
            setState({ progress: false })
        })
    }
    const modalCreateUpdate = (item) => {
        if (item) {
            setState({
                modalAdd: true,
                dataPaymentAgent: item,
                listPaymentMethod: state.listPaymentMethod
            })
        } else {
            setState({
                modalAdd: true,
                dataPaymentAgent: {},
                listPaymentMethod: []
            })
        }
    }
    const modalDetail = (item) => {
        setState({
            modalDetail: true,
            dataPaymentAgent: item,
        })
    }

    const closeModal = (item) => {
        loadPage(item);
        paymentAgentProvider.groupByMethod(item);
        setState({
            modalAdd: false,
            modalDetail: false
        });
    }
    const { dataSearch, dataPaymentAgent, dataTypeSearch, listPaymentMethod, status, name } = state;
    const setTplModal = () => {
        return (
            <>
                <InputText
                    title="Tên nhà cung cấp"
                    placeholder="Tên nhà cung cấp"
                    value={name}
                    onChange={(event) => {
                        setState({
                            name: event.target.value
                        });
                        if (state.clearTimeOutAffterRequest) {
                            try {
                                clearTimeout(state.clearTimeOutAffterRequest);
                            } catch (error) { }
                        }
                        let value = event.target.value
                        let data = setTimeout(() => {
                            loadPage("name", value)
                        }, 500)
                        setState({
                            clearTimeOutAffterRequest: data
                        })
                    }}
                />
                <SelectText
                    title="Trạng thái"
                    listOption={[{ id: "", name: "Tất cả" }, ...DataContants.listStatus]}
                    placeholder={'Tìm kiếm'}
                    selected={status}
                    getIdObject={(item) => {
                        return item.id;
                    }}
                    getLabelObject={(item) => {
                        return item.name
                    }}
                    onChangeSelect={(lists, ids) => {
                        setState({
                            status: ids
                        });
                        loadPage("status", ids)
                    }}
                />
            </>
        )
    }
    const button = () => {
        return (
            <ButtonCreateUpdate title="Thêm mới" onClick={() => modalCreateUpdate()} />
        );
    }
    const tableBodyNoTable = () => {
        return (
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
                                                <img src={item.paymentAgent.logo.absoluteUrl()} alt="" className="bank-img" onClick={() => modalDetail(item)} />
                                                <div className="bank-right">
                                                    <p onClick={() => { getDetail(item, "create") }}>
                                                        <img src="/images/edit.png" alt="" />
                                                    </p>
                                                    <p className="bank-type"><span className="bank-active">{item.paymentAgent.status === 1 ? "Đang hoạt động" : "Đã khóa"}</span></p>
                                                </div>
                                            </div>
                                            <div className="bank-info" onClick={() => { getDetail(item, "detail") }}>
                                                <h2 className="bank-title">{item.paymentAgent.nameAbb}</h2>
                                                <p className="bank-inner">Mã số: {item.paymentAgent.code}</p>
                                            </div>
                                        </div>
                                    )
                                }) :
                                    <div>
                                        {
                                            (state.name || state.status) ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
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
                                                <img src={item.paymentAgent.logo.absoluteUrl()} alt="" className="bank-img" onClick={() => { getDetail(item, "detail") }} />
                                                <div className="bank-right">
                                                    <span onClick={() => getDetail(item, "create")}>
                                                        <img src="/images/edit.png" alt="" />
                                                    </span>
                                                    <p className="bank-type"><span className="bank-active">{item.paymentAgent.status === 1 ? "Đang hoạt động" : "Đã khóa"}</span></p>
                                                </div>
                                            </div>
                                            <div className="bank-info" onClick={() => { getDetail(item, "detail") }}>
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
        )
    }
    return (
        <>
            <Table
                titlePage="Danh mục nhà cung cấp"
                setTplModal={setTplModal()}
                button={button()}
                tableBodyNoTable={tableBodyNoTable()}
            />
            {state.modalAdd && <ModalAddUpdate data={dataPaymentAgent} listPaymentMethod={listPaymentMethod} useCallback={closeModal} />}
            {state.modalDetail && <ModalDetail data={dataPaymentAgent} useCallback={closeModal} />}
        </>
    );
}


export default PayMentAgent;