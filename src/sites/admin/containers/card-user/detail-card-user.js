import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import Modal from '../../../../components/modal';
import { InputDetail, InputButton } from '../../../../components/input';
import './index.scss';
function DetailCardUser({ data, useCallback }) {
    const [open] = useState(true);
    const [detail] = useState({
        name: data && data.card && data.card.patient ? data.card.patient.name : '',
        nameCard: data && data.card && data.card ? data.card.name : '',
        code: data && data.card && data.card.patient ? data.card.patient.code : '',
        dob: data && data.card && data.card.patient ? data.card.patient.dob : '',
        phone: data && data.card && data.card.patient ? data.card.patient.phone : '',
        gender: data && data.card && data.card.patient ? data.card.patient.gender : '',
        passport: data && data.card && data.card.patient ? data.card.patient.passport : '',
        codeCard: data && data.card && data.card.code ? data.card.code : 0,
        transactionId: data && data.card && data.card.transactionId ? data.card.transactionId : '',
        cancel: data && data.card && (data.card.cancel || data.card.cancel === 0) ? data.card.cancel : '',
        hospitalName: data && data.card && data.card.hospital ? data.card.hospital.name : '',
        bankReturnDTO: data && data.card && data.card.bankReturnDTO ? data.card.bankReturnDTO : '',
        address: data && data.card && data.card.patient ? data.card.patient.address : '',
        createdDate: data && data.card && data.card.createdDate ? data.card.createdDate : '',
    });
    const formatCardNumber = (value) => {
        var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        var matches = v.match(/\d{4,16}/g);
        // var match = matches && matches[0] || ''
        var match = matches ? matches[0] : []
        var parts = []
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }
        if (parts.length) {
            return parts.join(' ')
        } else {
            return value
        }
    }
    const tplButton = ()=>{
        return(
            <Button variant="contained" color="secondary">Hủy thẻ</Button>
        )
    }
    const setTplModal = () => {
        return (
            <div className="row">
                <div className="col-md-6">
                    <InputDetail
                        width={5}
                        title="Số thẻ: "
                        value={formatCardNumber(detail.codeCard)}
                    />
                    <InputDetail
                        width={5}
                        title="Ngày phát hành: "
                        value={moment(detail.createdDate).format("DD-MM-YYYY")}
                    />
                    <InputDetail
                        width={5}
                        title="Ngân hàng: "
                        value={detail.bankReturnDTO.name}
                        style={{ textTransform: "uppercase" }}
                    />
                    <InputDetail
                        width={5}
                        title="CSYT: "
                        value={detail.hospitalName}
                    />
                    <InputDetail
                        width={5}
                        title="Trạng thái thẻ: "
                        value={
                            detail.cancel === 0 ? "Đang hoạt động" :
                                detail.cancel === 1 ? "Đã khóa" : null
                        }
                    />
                    {
                        detail.cancel === 0 ?
                            <InputButton
                                width={5}
                                title="Hành động: "
                                tpl={tplButton()}
                            />
                            : <InputDetail
                                width={5}
                                title="Ngày hủy thẻ: "
                                value={moment(data.card && data.card.updatedDate).format("DD-MM-YYYY")}
                            />
                    }
                </div>
                <div className="col-md-6">
                    <InputDetail
                        width={5}
                        title="Tên NB: "
                        value={detail.name}
                    />
                    <InputDetail
                        width={5}
                        title="Mã NB: "
                        value={detail.code}
                        style={{ color: "#d0021b" }}
                    />
                    <InputDetail
                        width={5}
                        title="Ngày sinh: "
                        value={moment(detail.dob).format("DD-MM-YYYY")}
                    />
                    <InputDetail
                        width={5}
                        title="Giới tính: "
                        value={detail.gender === 1 ? "Nam" : detail.gender === 0 ? "Nữ" : ""}
                    />
                    <InputDetail
                        width={5}
                        title="SĐT: "
                        value={detail.phone}
                    />
                    <InputDetail
                        width={5}
                        title="Số CMND/Hộ chiếu: "
                        value={detail.passport}
                    />
                    <InputDetail
                        width={5}
                        title="Địa chỉ: "
                        value={detail.address}
                    />
                </div>
            </div>
        )
    }
    return (
        <Modal
            isOpen={open}
            toggle={useCallback}
            title={"Thông tin thẻ"}
            Children={setTplModal()}
            width={950}
            padding={50}
            popupDetail={true}
        />
    );
}

export default DetailCardUser;