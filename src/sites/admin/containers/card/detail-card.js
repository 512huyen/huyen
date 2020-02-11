import React, { useState } from 'react';
import moment from 'moment';
import Modal from '../../../../components/modal';
import { InputDetail } from '../../../../components/input';
function DetailPaymentAgent({ data, useCallback }) {
    const [open] = useState(true);
    const [detail] = useState({
        transferUser: data && data.cardTransferHistory && data.cardTransferHistory.transferUser ? data.cardTransferHistory.transferUser : '',
        hospitalId: data && data.cardTransferHistory && data.cardTransferHistory.hospital ? data.cardTransferHistory.hospital.name : '',
        quantity: data && data.cardTransferHistory && data.cardTransferHistory.quantity ? data.cardTransferHistory.quantity : '',
        transferDate: data && data.cardTransferHistory && data.cardTransferHistory.transferDate ? new Date(data.cardTransferHistory.transferDate) : "",
        paymentAgentId: data && data.cardTransferHistory.paymentAgent && data.cardTransferHistory.paymentAgent.name ? data.cardTransferHistory.paymentAgent.name : "",
        paymentAgentNameAbb: data && data.cardTransferHistory.paymentAgent && data.cardTransferHistory.paymentAgent.nameAbb ? data.cardTransferHistory.paymentAgent.nameAbb : "",
        receiverUser: data && data.cardTransferHistory && data.cardTransferHistory.receiverUser ? data.cardTransferHistory.receiverUser : '',
        bankId: data && data.cardTransferHistory && data.cardTransferHistory.bank && data.cardTransferHistory.bank.name ? data.cardTransferHistory.bank.name : "",
        cardNoFrom: data && data.cardTransferHistory && data.cardTransferHistory.cardNoFrom ? data.cardTransferHistory.cardNoFrom : "",
        cardNoTo: data && data.cardTransferHistory && data.cardTransferHistory.cardNoTo ? data.cardTransferHistory.cardNoTo : "",
    });
    const setTplModal = () => {
        return (
            <>
                <InputDetail
                    width={4}
                    title="Ngày bàn giao: "
                    value={moment(detail.transferDate).format("DD-MM-YYYY")}
                />
                <InputDetail
                    width={4}
                    title="Ngân hàng: "
                    value={detail.bankId}
                />
                <InputDetail
                    width={4}
                    title="Mã số thẻ: "
                    value={"Từ " + detail.cardNoFrom + " đến " + detail.cardNoTo}
                />
                <InputDetail
                    width={4}
                    title="Số lượng: "
                    value={detail.quantity}
                    style={{color: "#d0021b"}}
                />
                <InputDetail
                    width={4}
                    title="Tên người bàn giao: "
                    value={detail.transferUser}
                />
                <InputDetail
                    width={4}
                    title="Bên bàn giao: "
                    value={detail.paymentAgentNameAbb}
                />
                <InputDetail
                    width={4}
                    title="Tên người nhận: "
                    value={detail.receiverUser}
                />
                <InputDetail
                    width={4}
                    title="Bên nhận: "
                    value={detail.hospitalId}
                />
            </>
        )
    }
    return (
        <Modal
            isOpen={open}
            toggle={useCallback}
            title={"Chi tiết lịch sử bàn giao thẻ"}
            Children={setTplModal()}
            width={750}
            padding={50}
            popupDetail={true}
        />
    );
}

export default DetailPaymentAgent;