import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import hospitalProvider from '../../../../data-access/hospital-provider';
import ModalDetail from './detail-hospital';
import ModalAddUpdate from './create-update-hospital';
import ModalDetailHIS from './HIS-hospital';
import paymentAgentProvider from '../../../../data-access/paymentAgent-provider';
import DataContants from '../../../../config/data-contants';
import { listPaymentAgent, listPaymentAgentMethod } from '../../../../reducers/actions';
import Table from '../../../../components/table';
import { SelectText } from '../../../../components/select';
import { ButtonCreateUpdate } from '../../../../components/button';
import { InputText } from '../../../../components/input';
import './index.scss';
function Hospital() {
    const [state] = useState({
        page: 0,
        size: 9999,
    });
    const [name, setName] = useState("");
    const [status, setStatus] = useState(-1);
    const [agentId, setAgentId] = useState(-1);
    const [paymentMethod, setPaymentMethod] = useState(-1);
    const [data, setData] = useState([]);
    const [dataHospital, setDataHospital] = useState({});
    const [dataHisHospital, setDataHisHospital] = useState({});
    const [dataPaymentAgentMethod, setDataPaymentAgentMethod] = useState([]);
    const [dataPaymentAgent, setDataPaymentAgent] = useState([]);
    const [openDetail, setOpenDetail] = useState(false);
    const [openDetailHIS, setOpenDetailHIS] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const userApp = useSelector(state => state.userApp);
    const dispatch = useDispatch();
    useEffect(() => {
        loadPage();
        getPaymentAgent();
        getPaymentMethod();
    }, []);
    const loadPage = (action, item) => {
        let page = action === "page" ? item : action === "size" ? 0 : state.page
        let size = action === "size" ? item : state.size
        let nameSearch = action === "name" ? item : name
        let agentIdSearch = action === "agentId" ? item : agentId
        let paymentMethodSearch = action === "paymentMethod" ? item : paymentMethod
        let statusSearch = action === "status" ? item : status
        let params = {
            page: Number(page) + 1,
            size: size,
            name: nameSearch.trim(),
            status: statusSearch,
            agentId: agentIdSearch,
            paymentMethod: paymentMethodSearch
        }
        hospitalProvider.search(params).then(s => {
            if (s && s.code === 0 && s.data) {
                setData(s.data.data);
            }
        }).catch(e => {
        })
    }
    const getPaymentAgent = () => {
        let params = {
            page: 1,
            size: 99999
        }
        if (userApp.listPaymentAgent && userApp.listPaymentAgent.length !== 0) {
            let arr = userApp.listPaymentAgent.filter(item => { return (item.paymentAgent.status === 1) });
            setDataPaymentAgent(arr);
        } else {
            paymentAgentProvider.search(params).then(s => {
                dispatch(listPaymentAgent(s.data.data))
                if (s && s.data && s.code === 0) {
                    let arr = s.data.data.filter(item => { return (item.paymentAgent.status === 1) });
                    setDataPaymentAgent(arr);
                }
            })
        }
    }
    const getPaymentMethod = () => {
        if (userApp.listPaymentAgentMethod && userApp.listPaymentAgentMethod.length !== 0) {
            setDataPaymentAgentMethod(userApp.listPaymentAgentMethod);
        } else {
            paymentAgentProvider.groupByMethod().then(s => {
                if (s && s.code === 0 && s.data) {
                    dispatch(listPaymentAgentMethod(s.data.methods));
                    setDataPaymentAgentMethod(s.data.methods);
                } else {
                    setDataPaymentAgentMethod([])
                }
            }).catch(e => {
            })
        }
    }
    const modalCreateUpdate = (item) => {
        if (item) {
            setOpenAdd(true);
            setDataHospital(item);
        } else {
            setOpenAdd(true);
            setDataHospital({});
        }
    }
    const modalDetail = (item) => {
        setOpenDetail(true);
        setDataHospital(item);
    }
    const modalDetailHIS = (item) => {
        hospitalProvider.getHisAccount(item.hospital.id).then(s => {
            if (s && s.data && s.code === 0) {
                setDataHisHospital(s.data.hisAccounts);
                setDataHospital(item);
                setOpenDetailHIS(true);
            }
        }).catch(e => {

        })
    }
    const closeModal = (item) => {
        loadPage("", "", item);
        reLoadDate();
        setOpenDetailHIS(false);
        setPaymentMethod(false);
        setOpenDetail(false);
        setOpenAdd(false);
    }
    const reLoadDate = () => {
        let arr = []
        let listKeyMethod = Object.keys(dataPaymentAgentMethod)
        for (let i = 0; i < listKeyMethod.length; i++) {
            arr = dataPaymentAgentMethod[listKeyMethod[i]].map(item => {
                item.checked = false;
                return item
            })
        }
    }
    const button = () => {
        return (
            <ButtonCreateUpdate title="Thêm mới" onClick={() => modalCreateUpdate()} />
        );
    }
    const setTplModal = () => {
        return (
            <>
                <InputText
                    title="Tên CSYT"
                    placeholder="Tên CSYT"
                    value={name}
                    onChange={(event) => { setName(event.target.value); loadPage("name", event.target.value) }}
                />
                <SelectText
                    title="Phương thức thanh toán"
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
                        setPaymentMethod(ids); loadPage("paymentMethod", ids)
                    }}
                />
                <SelectText
                    title="Nhà cung cấp"
                    listOption={[{ paymentAgent: { id: -1, name: "Tất cả" } }, ...dataPaymentAgent]}
                    placeholder={'Tìm kiếm'}
                    selected={agentId}
                    getIdObject={(item) => {
                        return item.paymentAgent.id;
                    }}
                    getLabelObject={(item) => {
                        return item.paymentAgent.name
                    }}
                    onChangeSelect={(lists, ids) => {
                        setAgentId(ids); loadPage("agentId", ids)
                    }}
                />
                <SelectText
                    title="Trạng thái"
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
                        setStatus(ids); loadPage("status", ids)
                    }}
                />
            </>
        )
    }
    const tableBodyNoTable = () => {
        return (
            <div className="hospital">
                <div className="main-info">
                    <div className="list-bank">
                        {data && data.length > 0 ? data.map((item, index) => {
                            return (
                                <div key={index} className={item.hospital && item.hospital.status === 1 ? "bank-item" : "bank-item bank-inactive"}>
                                    <div className="bank-top">
                                        <div className="bank-top-header">
                                            <img src={item.hospital && item.hospital.logo && item.hospital.logo.absoluteUrl()} alt="" className="bank-img" onClick={() => modalDetail(item)} />
                                            <div className="bank-right">
                                                <span onClick={() => modalCreateUpdate(item)}>
                                                    <img src="/images/edit.png" alt="" />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bank-type-name">
                                            <p className="bank-type"><span className="bank-name">{item.hospital && item.hospital.name}</span></p>
                                            <p className="bank-type">Trạng thái: <span className="bank-active">{item.hospital && item.hospital.status === 1 ? "Đang hoạt động" : "Đã khóa"}</span></p>
                                        </div>
                                    </div>
                                    <div className="bank-info" onClick={() => modalDetail(item)}>
                                        <h2 className="bank-title">Phương thức thanh toán:</h2>
                                        {item.hospital && item.hospital.paymentMethods ?
                                            Object.keys(item.hospital && item.hospital.paymentMethods).map((item2, index2) => {
                                                return (
                                                    <div className="hospital-bank-item" key={index2}>
                                                        {DataContants.listPaymentMethod.map((item3, index3) => {
                                                            return (
                                                                <div className="bank-inner" key={index3}>
                                                                    {item3.id === Number(item2) && index2 <= 2 ? " + " + item3.name : index2 === 3 && item3.id === Number(item2) ? <div className="hospital-bank-index" >Xem thêm</div> : null}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )
                                            }
                                            ) : null}
                                    </div>
                                    <div className="bank-footer" onClick={() => modalDetailHIS(item)}>Danh sách tài khoản HIS</div>
                                </div>
                            )
                        }) :
                            <div> {name || paymentMethod || status || agentId ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</div>}
                    </div>
                </div>
            </div>
        )
    }
    return (
        <>
            <Table
                titlePage="Quản lý CSYT"
                setTplModal={setTplModal()}
                button={button()}
                tableBodyNoTable={tableBodyNoTable()}
            />
            {openAdd && <ModalAddUpdate data={dataHospital} dataPaymentMethod={dataPaymentAgentMethod} useCallback={closeModal} />}
            {openDetail && <ModalDetail data={dataHospital} dataPaymentMethod={dataPaymentAgentMethod} useCallback={closeModal} />}
            {openDetailHIS && dataHospital && dataHisHospital && <ModalDetailHIS data={dataHisHospital} dataHospital={dataHospital} useCallback={closeModal} />}
        </>
    );
}

export default Hospital;