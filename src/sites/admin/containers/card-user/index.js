import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import cardProvider from '../../../../data-access/card-provider';
import moment from 'moment';
import Modal from '../../../../components/modal';
import { InputDetail, InputText } from '../../../../components/input';
import './index.scss';
import Button from '@material-ui/core/Button';
import { ButtonFooter, RadioButton } from '../../../../components/button';
function CreateUpdateHospital({ data, useCallback }) {
    const [open] = useState(true);
    const [detail] = useState({
        name: data && data.card && data.card.patient ? data.card.patient.name : '',
        nameCard: data && data.card && data.card ? data.card.name : '',
        code: data && data.card && data.card.patient ? data.card.patient.code : '',
        createdDate: data && data.card && data.card.patient ? data.card.patient.createdDate : '',
        dob: data && data.card && data.card.patient ? data.card.patient.dob : '',
        phone: data && data.card && data.card.patient ? data.card.patient.phone : '',
        gender: data && data.card && data.card.patient ? data.card.patient.gender : '',
        passport: data && data.card && data.card.patient ? data.card.patient.passport : '',
        issueDate: data && data.card && data.card.patient ? data.card.patient.issueDate : '',
        codeCard: data && data.card && data.card.code ? data.card.code : '',
        transactionId: data && data.card && data.card.transactionId ? data.card.transactionId : '',
        hospitalName: data && data.card && data.card.hospital ? data.card.hospital.name : '',
        hospitalCode: data && data.card && data.card.hospital ? data.card.hospital.code : '',
        bankReturnDTO: data && data.card && data.card.bankReturnDTO ? data.card.bankReturnDTO : '',
        address: data && data.card && data.card.patient ? data.card.patient.address : '',
    })
    const [value, setValue] = useState("");
    const [checkValidate, setCheckValidate] = useState(false);
    const formatCardNumber = (value) => {
        var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        var matches = v.match(/\d{4,16}/g);
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
    const payIn = () => {
        let { value, billId, codeCard, hospitalCode, transactionId } = detail;
        let param = {
            amount: Number(value),
            billId: billId,
            code: codeCard,
            hospitalCode: hospitalCode,
            transactionId: transactionId
        }
        console.log(JSON.stringify(param));
        cardProvider.payIn(param).then(s => {
            switch (s.code) {
                case 0:
                    toast.success("Nạp tiền vào thẻ thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.handleClose();
                    break
                default:
                    toast.error("Nạp tiền vào thẻ không thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
            }
        }).catch(e => {
            toast.error(e.message, {
                position: toast.POSITION.TOP_RIGHT
            });
        })
    }
    const setTplHeader = () => {
        return (
            <>
                <div className="recharge-title">Nạp tiền vào thẻ</div>
                <div className="isofh-pay-img-logo">
                    <img src="/images/logonapthe.png" alt="" />
                </div>
            </>
        )
    }
    const checkFrom = (item) => {
        if (Number(item) != 0 && item && item.uintTextBox()) {
            setCheckValidate(false)
        } else {
            setCheckValidate(true)
            return
        }
    }
    const setTplModal = () => {
        return (
            <div className="recharge-body-index">
                <div className="row">
                    <div className="col-md-6">
                        <div className="recharge-title-admin">Thông tin chung</div>
                        <div className="isofh-pay-recharge-index">
                            <InputDetail
                                width={5}
                                title="Số thẻ: "
                                value={formatCardNumber(detail.codeCard)}
                            />
                            <InputDetail
                                width={5}
                                title="Tên chủ thẻ: "
                                value={detail.name}
                            />
                            <InputDetail
                                width={5}
                                title="Bệnh viện: "
                                value={detail.hospitalName}
                            />
                            <InputDetail
                                width={5}
                                title="Ngân hàng: "
                                value={detail.bankReturnDTO.name}
                            />
                            <InputDetail
                                width={5}
                                title="Mã NB: "
                                value={detail.code}
                            />
                            <InputDetail
                                width={5}
                                title="Họ và tên: "
                                value={detail.name}
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
                    <div className="col-md-6">
                        <div className="recharge-title-admin">Thông tin nạp tiền</div>
                        <div className="recharge-body-right">
                            <div className="right-title">
                                Số tiền
                            </div>
                            <div className="right-input">
                                <InputText
                                    value={value}
                                    onChange={(event) => { setValue(event.target.value); checkFrom(event.target.value) }}
                                    validation={checkValidate && !value.toString().uintTextBox() ? "Vui lòng nhập đúng định dạng tiền tệ!" : (checkValidate && (Number(value) === 0 || value.length === 0)) ? "Vui lòng nhập số tiền!" : null}
                                />
                            </div>
                            <div className="right-content">Nội dung
                                <span className="content-item">Nap tien vao the {value && value.length > 0 ? Number(value).formatPrice() : " ... "}  VND</span>
                            </div>
                        </div>
                        <div className="margin-button">
                            <Button onClick={useCallback} variant="contained" className="recharge-button-cancel">Hủy bỏ</Button>
                            <Button variant="contained" onClick={payIn} className="recharge-button-submit color-rechange">Nạp tiền</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <Modal
            isOpen={open}
            toggle={useCallback}
            title={setTplHeader()}
            Children={setTplModal()}
            width={950}
            padding={65}
        />
    );
}
export default CreateUpdateHospital;