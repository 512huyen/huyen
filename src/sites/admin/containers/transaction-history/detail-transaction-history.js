import React, { useState } from 'react';
import DataContants from '../../../../config/data-contants';
import moment from 'moment';
import Modal from '../../../../components/modal';
import { InputDetail } from '../../../../components/input';
import './index.scss';
function DetailTransactionHistoryHospital({ data, useCallback }) {
    const [open] = useState(true);
    const [detail] = useState({
        name: data && data.transaction && data.transaction.patient && data.transaction.patient.name ? data.transaction.patient.name : '',
        type: data && data.transaction && data.transaction.type ? data.transaction.type : -1,
        transactionId: data && data.transaction && data.transaction.transactionId ? data.transaction.transactionId : "",
        amount: data && data.transaction && data.transaction.amount ? data.transaction.amount : 0,
        status: data && data.transaction && (data.transaction.status || data.transaction.status === 0) ? data.transaction.status : -1,
        createdDate: data && data.transaction && data.transaction.createdDate ? data.transaction.createdDate : "",
        paymentMethod: data && data.transaction && data.transaction.paymentMethod ? data.transaction.paymentMethod : "",
        nameAbb: data && data.transaction && data.transaction.paymentAgent && data.transaction.paymentAgent.nameAbb ? data.transaction.paymentAgent.nameAbb : "",
        name: data && data.transaction && data.transaction.patient && data.transaction.patient.name ? data.transaction.patient.name : "",
        code: data && data.transaction && data.transaction.patient && data.transaction.patient.code ? data.transaction.patient.code : "",
        patientDocument: data && data.transaction && data.transaction.codeHS ? data.transaction.codeHS : "",
        nameHospital: data && data.transaction && data.transaction.hospital && data.transaction.hospital.name ? data.transaction.hospital.name : "",
    });

    const getTypeSearch = (item) => {
        var status = DataContants.listTypeSearch.filter((data) => {
            return parseInt(data.id) === item
        })
        if (status.length > 0)
            return status[0];
        return {};
    }
    const getStatusTransactionHistory = (item) => {
        var status = DataContants.listStatusTransactionHistory.filter((data) => {
            return parseInt(data.id) === item
        })
        if (status.length > 0)
            return status[0];
        return {};
    }
    const getPaymentMethod = (item) => {
        var status = DataContants.listPaymentMethod.filter((data) => {
            return parseInt(data.id) === item
        })
        if (status.length > 0)
            return status[0];
        return {};
    }
    const setTplModal = () => {
        return (
            <div className="row">
                <div className="col-md-6 color-border-user-card">
                    <div className="transaction-title-detail">
                        Thông tin giao dịch
                    </div>
                    <InputDetail
                        width={5}
                        title="Loại giao dịch: "
                        value={getTypeSearch(detail.type).name}
                    />
                    <InputDetail
                        width={5}
                        title="Mã giao dịch: "
                        value={detail.transactionId}
                    />
                    <InputDetail
                        width={5}
                        title="Số tiền: "
                        value={detail.amount.formatPrice()}
                        style={{ color: "#d0021b" }}
                    />
                    <InputDetail
                        width={5}
                        title="Trạng thái: "
                        value={getStatusTransactionHistory(detail.status).name}
                        style={{ color: "#27ad60" }}
                    />
                    <InputDetail
                        width={5}
                        title="Ngày giao dịch: "
                        value={moment(detail.createdDate).format("DD-MM-YYYY")}
                    />
                    <InputDetail
                        width={5}
                        title="Phương thức TT: "
                        value={getPaymentMethod(detail.paymentMethod).name}
                    />
                    <InputDetail
                        width={5}
                        title="Nhà cung cấp: "
                        value={detail.nameAbb}
                        style={{ color: "rgb(33,152,188)" }}
                    />
                </div>
                <div className="col-md-6">
                    <div className="transaction-title-detail">
                        Thông tin người bệnh
                    </div>
                    <InputDetail
                        width={5}
                        title="Tên người bệnh: "
                        value={detail.name}
                    />
                    <InputDetail
                        width={5}
                        title="Mã người bệnh: "
                        value={detail.code}
                    />
                    <InputDetail
                        width={5}
                        title="Mã hồ sơ: "
                        value={detail.patientDocument}
                    />
                    <InputDetail
                        width={5}
                        title="CSYT: "
                        value={detail.nameHospital}
                    />
                </div>
            </div>
        )
    }
    return (
        <Modal
            isOpen={open}
            toggle={useCallback}
            title={"Thông tin chi tiết giao dịch"}
            Children={setTplModal()}
            width={950}
            padding={50}
            popupDetail={true}
        />
    );
}

export default DetailTransactionHistoryHospital;