import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/modal';
import { InputDetail } from '../../../../components/input';
import moment from 'moment';
import hospitalProvider from '../../../../data-access/hospital-provider';
import DataContants from '../../../../config/data-contants';
import ModalDetailHIS from './HIS-hospital';
function DetailHospital({ data, dataPaymentMethod, useCallback }) {
    const [open] = useState(true);
    const [detail] = useState({
        name: data && data.hospital && data.hospital.name ? data.hospital.name : '',
        issueDateTaxNo: data && data.hospital && data.hospital.issueDateTaxNo ? data.hospital.issueDateTaxNo : null,
        taxNo: data && data.hospital && data.hospital.taxNo ? data.hospital.taxNo : "",
        code: data && data.hospital && data.hospital.code ? data.hospital.code : "",
        phone: data && data.hospital && data.hospital.phone ? data.hospital.phone : "",
        fax: data && data.hospital && data.hospital.fax ? data.hospital.fax : "",
        address: data && data.hospital && data.hospital.address ? data.hospital.address : "",
        logo: data && data.hospital && data.hospital.logo ? data.hospital.logo : '',
        status: data && data.hospital && data.hospital.status ? data.hospital.status : '',
        fileAccount: data && data.hospital && data.hospital.fileAccount ? data.hospital.fileAccount : '',
        fileNames: data && data.hospital && data.hospital.fileName ? data.hospital.fileName : ""
    });
    const [dataHospital, setDataHospital] = useState(data);
    const [dataHisHospital, setDataHisHospital] = useState({});
    const [listPaymentMethod] = useState(dataPaymentMethod);
    const [checkedPaymentMethod, setCheckedPaymentMethod] = useState([]);
    const [listKeyMethod] = useState(Object.keys(dataPaymentMethod))
    const [openDetail, setOpenDetail] = useState(false);
    useEffect(() => {
        checkPaymentMethod();
    }, []);
    const checkPaymentMethod = () => {
        let paymentMethods = dataHospital && dataHospital.hospital && dataHospital.hospital.paymentMethods
        if (paymentMethods) {
            for (let i = 0; i < listKeyMethod.length; i++) {
                listPaymentMethod[listKeyMethod[i]].length > 0 && listPaymentMethod[listKeyMethod[i]].map(item => {
                    paymentMethods[listKeyMethod[i]] && paymentMethods[listKeyMethod[i]].length > 0 && paymentMethods[listKeyMethod[i]].map(item2 => {
                        if (item2.id === item.id) {
                            item.checked = true
                        }
                    })
                    return item;
                })
            }
            setCheckedPaymentMethod(listPaymentMethod);
        }
    }
    const reLoadDate = () => {
        let arr = []
        for (let i = 0; i < listKeyMethod.length; i++) {
            arr = listPaymentMethod[listKeyMethod[i]].map(item => {
                item.checked = false;
                return item
            })
        }
        if (arr && arr.length > 0) {
            useCallback()
        } else {
            return
        }
    }
    const closeModal = () => {
        reLoadDate();
    }
    const getKeyMethod = (item) => {
        var status = DataContants.listPaymentMethod.filter((data) => {
            return parseInt(data.id) === Number(item)
        })
        if (status.length > 0)
            return status[0];
        return {};
    }
    const modalDetail = (item) => {
        hospitalProvider.getHisAccount(item.hospital.id).then(s => {
            if (s && s.data && s.code === 0) {
                setDataHisHospital(s.data.hisAccounts);
                setOpenDetail(true);
                setDataHospital(item);
            }
        }).catch(e => {
        })
    }
    const setTplModal = () => {
        return (
            <div className="row">
                <div className="col-md-6 color-border-user-card">
                    <InputDetail
                        width={4}
                        title="Mã CSYT: "
                        value={detail.code}
                    />
                    <InputDetail
                        width={4}
                        title="Tên CSYT: "
                        value={detail.name}
                        style={{ color: "#d0021b" }}
                    />
                    <InputDetail
                        width={4}
                        title="Địa chỉ: "
                        value={detail.address}
                    />
                    <InputDetail
                        width={4}
                        title="SĐT: "
                        value={detail.phone}
                    />
                    <InputDetail
                        width={4}
                        title="Fax: "
                        value={detail.fax}
                    />
                    <InputDetail
                        width={4}
                        title="Mã số thuế: "
                        value={detail.taxNo}
                    />
                    <InputDetail
                        width={4}
                        title="Ngày cấp: "
                        value={moment(detail.issueDateTaxNo).format("DD-MM-YYYY")}
                    />
                    {
                        detail.status === 1 ?
                            <InputDetail
                                width={4}
                                title="Trạng thái: "
                                value="Đang hoạt động"
                                style={{ color: "rgb(39,174,96)" }}
                            /> : detail.status === 2 ?
                                <InputDetail
                                    width={4}
                                    title="Trạng thái: "
                                    value="Đã khóa"
                                    style={{ color: "#d0021b" }}
                                /> : null
                    }
                    <InputDetail
                        width={4}
                        title="DS TK HIS:: "
                        value={detail.fileNames}
                        onClick={() => modalDetail(dataHospital)}
                        style={{ paddingRight: 18, color: "#2198bc", fontWeight: 600, wordBreak: "break-all", textDecoration: "underline", cursor: "pointer" }}
                    />
                </div>
                <div className="col-md-6 hospital-detail-paymentMethed">
                    <div className="hospital-title-index">
                        Phương thức thanh toán
                    </div>
                    {
                        listKeyMethod && listKeyMethod.length > 0 && listKeyMethod.map((item, index) => {
                            return (
                                <div className="detail-item" key={index}>
                                    <div className="col-md-12">
                                        {
                                            checkedPaymentMethod[item] && checkedPaymentMethod[item].length > 0 && checkedPaymentMethod[item].filter(x => x.checked).length > 0 ?
                                                <span className="content-detail">
                                                    {getKeyMethod(item) ? getKeyMethod(item).name : ""}
                                                </span> : null
                                        }
                                    </div>
                                    <div className="detail-item-left">
                                        {
                                            checkedPaymentMethod[item] && checkedPaymentMethod[item].length > 0 && checkedPaymentMethod[item].map((item2, index2) => {
                                                return (
                                                    <div key={index2}>
                                                        {
                                                            item2.checked ?
                                                                <div className="col-md-5" key={index2}>
                                                                    <p className="label-detail"> + {item2.nameAbb}</p>

                                                                </div>
                                                                : null
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
    return (
        <>
            <Modal
                isOpen={open}
                toggle={useCallback}
                title={"Thông tin CSYT"}
                Children={setTplModal()}
                width={950}
                padding={50}
                popupDetail={true}
            />
            {openDetail && <ModalDetailHIS data={dataHisHospital} dataHospital={dataHospital} useCallback={useCallback.bind(this)} />}
        </>
    );
}
export default DetailHospital;