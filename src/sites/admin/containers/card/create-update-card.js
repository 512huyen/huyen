import React, { useState } from 'react';
import { toast } from 'react-toastify';
import cardTransferHistoryProvider from '../../../../data-access/card-transfer-history-provider';
import moment from 'moment';
import { DateBox } from '../../../../components/date';
import Modal from '../../../../components/modal';
import { SelectModal } from '../../../../components/select';
import { InputModal, InputText, InputButton } from '../../../../components/input';
import { ButtonFooter, RadioButton } from '../../../../components/button';
function CreateUpdateCard({ useCallback, data, dataHospital, hospitalID, dataPaymentMethodsHospital, dataBank }) {
    const [open] = useState(true);
    const [checkValidate, setCheckValidate] = useState(false);
    const [checkButton, setCheckButton] = useState(false);
    const [hospitalId, setHospitalId] = useState(hospitalID);
    const [transferUser, setTransferUser] = useState(data && data.cardTransferHistory && data.cardTransferHistory.transferUser ? data.cardTransferHistory.transferUser : '');
    const [quantity, setQuantity] = useState(data && data.cardTransferHistory && data.cardTransferHistory.quantity ? data.cardTransferHistory.quantity : '');
    const [cardNoFrom, setCardNoFrom] = useState(data && data.cardTransferHistory && data.cardTransferHistory.cardNoFrom ? data.cardTransferHistory.cardNoFrom : '');
    const [cardNoTo, setCardNoTo] = useState(data && data.cardTransferHistory && data.cardTransferHistory.cardNoTo ? data.cardTransferHistory.cardNoTo : '');
    const [transferDate, setTransferDate] = useState(data && data.cardTransferHistory && data.cardTransferHistory.transferDate ? new Date(data.cardTransferHistory.transferDate) : null);
    const [bankId, setBankId] = useState(data && data.cardTransferHistory && data.cardTransferHistory.bank && data.cardTransferHistory.bank.id ? data.cardTransferHistory.bank.id.toString() : -1);
    const [paymentAgentId, setPaymentAgentId] = useState(data && data.cardTransferHistory && data.cardTransferHistory.paymentAgent && data.cardTransferHistory.paymentAgent.id ? data.cardTransferHistory.paymentAgent.id.toString() : -1);
    const [receiverUser, setReceiverUser] = useState(data && data.cardTransferHistory && data.cardTransferHistory.receiverUser ? data.cardTransferHistory.receiverUser : '');

    const create = () => {
        let id = data && data.cardTransferHistory ? data.cardTransferHistory.id : '';
        if (transferDate && bankId !== -1 && transferUser.length <= 255 && receiverUser.length <= 255 && hospitalId !== -1 && paymentAgentId !== -1 && quantity) {
            setCheckValidate(false)
        } else {
            setCheckValidate(true)
            return
        }
        let param = {
            transferUser: transferUser.trim(),
            receiverUser: receiverUser.trim(),
            hospitalId: hospitalId,
            paymentAgentId: paymentAgentId,
            quantity: quantity,
            cardNoFrom: cardNoFrom,
            cardNoTo: cardNoTo,
            transferDate: moment(transferDate).format("YYYY-MM-DD"),
            bankId: bankId
        }
        console.log(JSON.stringify(param));
        if (data && data.cardTransferHistory && data.cardTransferHistory.id) {
            cardTransferHistoryProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật lịch sử bàn giao thẻ thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        useCallback(hospitalId);
                        break
                    default:
                        toast.error("Cập nhật lịch sử bàn giao thẻ không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
            })
        } else {
            cardTransferHistoryProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Thêm mới lịch sử bàn giao thẻ thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        useCallback(hospitalId);
                        break
                    default:
                        toast.error("Thêm mới lịch sử bàn giao thẻ không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
            })
        }
    }
    const tpl = () => {
        return (
            <div className="row">
                {
                    dataBank && dataBank.length ? dataBank.map((item, index) => {
                        return (
                            <div className="col-md-6" key={index}>
                                <RadioButton
                                    title={item.name}
                                    checked={bankId === item.id.toString()}
                                    onClick={(event) => {
                                        setCheckButton(true)
                                        setBankId(event.target.value ? event.target.value : item.id.toString())
                                    }}
                                    value={item.id} />
                            </div>
                        )
                    }) : null
                }
            </div>
        )
    }
    const tplPaymentAgent = () => {
        return (
            <div className="row" style={{ marginBottom: -17 }}>
                {
                    dataPaymentMethodsHospital && dataPaymentMethodsHospital.paymentMethods && dataPaymentMethodsHospital.paymentMethods["1"] && dataPaymentMethodsHospital.paymentMethods["1"].length ? dataPaymentMethodsHospital.paymentMethods["1"].map((item, index) => {
                        return (
                            <div className="col-md-6" key={index} style={{ paddingBottom: 8 }}>
                                <RadioButton
                                    title={item.nameAbb}
                                    checked={paymentAgentId === item.id.toString()}
                                    onClick={(event) => {
                                        setCheckButton(true)
                                        setPaymentAgentId(event.target.value ? event.target.value : item.id.toString())
                                    }}
                                    value={item.id} />
                            </div>
                        )
                    }) : null
                }
            </div>
        )
    }
    const tplNumber = () => {
        return (
            <div className="row">
                <div className="col-md-6" style={{ display: "flex" }}>
                    <div>Từ</div>
                    <div className="card-no-input">
                        <InputText
                            placeholder="Nhập mã số"
                            value={cardNoFrom}
                            onChange={(event) => { setCheckButton(true); setCardNoFrom(event.target.value); }}
                            validation={checkValidate && !cardNoFrom.toString().uintTextBox() ? "Vui lòng chỉ nhập số!" : null}
                        />
                    </div>
                </div>
                <div className="col-md-6" style={{ display: "flex" }}>
                    <div>Đến</div>
                    <div className="card-no-input">
                        <InputText
                            placeholder="Nhập mã số"
                            value={cardNoTo}
                            onChange={(event) => { setCheckButton(true); setCardNoTo(event.target.value); }}
                            validation={checkValidate && !cardNoTo.toString().uintTextBox() ? "Vui lòng chỉ nhập số!" : null}
                        />
                    </div>
                </div>
            </div>
        )
    }
    const setTplModal = () => {
        return (
            <>
                <DateBox
                    title="Ngày bàn giao (*):"
                    width={4}
                    isInput={true} placeholder="Nhập ngày bàn giao (dd/mm/yyyy)"
                    value={transferDate}
                    onChange={(event) => {
                        setCheckButton(true); setTransferDate(event)
                    }}
                    validation={checkValidate && (transferDate === null || (transferDate && transferDate.length === 0)) ? "Vui lòng nhập ngày bàn giao!" : null}
                />
                <InputButton
                    width={4}
                    title="Ngân hàng (*): "
                    tpl={tpl()}
                    validation={checkValidate && bankId == -1 ? "Vui lòng chọn ngân hàng!" : null}
                />
                <InputButton
                    width={4}
                    title="Mã số thẻ: "
                    tpl={tplNumber()}
                />
                <InputModal
                    width={4}
                    title="Số lượng (*): "
                    placeholder="Nhập số lượng"
                    value={quantity}
                    onChange={(event) => { setCheckButton(true); setQuantity(event.target.value); }}
                    validation={checkValidate && quantity.toString().trim().length == 0 ? "Vui lòng nhập số lượng!" : (checkValidate && !quantity.toString().uintTextBox()) ? "Vui lòng chỉ nhập số!" : null}
                />
                <InputModal
                    width={4}
                    title="Tên người bàn giao (*): "
                    placeholder="Nhập tên người bàn giao"
                    value={transferUser}
                    onChange={(event) => { setCheckButton(true); setTransferUser(event.target.value); }}
                    validation={checkValidate && transferUser.trim().length == 0 ? "Vui lòng nhập tên người bàn giao!" : (checkValidate && transferUser.toString().length > 255) ? "Vui lòng nhập tên người bàn giao tối đa 255 ký tự!" : null}
                />
                <InputButton
                    width={4}
                    title="Bên bàn giao (*): "
                    tpl={tplPaymentAgent()}
                    validation={checkValidate && paymentAgentId == -1 ? "Vui lòng chọn bên bàn giao!" : null}
                />
                <InputModal
                    width={4}
                    title="Tên người nhận (*): "
                    placeholder="Nhập tên người nhận"
                    value={receiverUser}
                    onChange={(event) => { setCheckButton(true); setReceiverUser(event.target.value); }}
                    validation={checkValidate && receiverUser.trim().length == 0 ? "Vui lòng nhập tên người nhận!" : (checkValidate && receiverUser.toString().length > 255) ? "Vui lòng nhập tên người nhận tối đa 255 ký tự!" : null}
                />
                <SelectModal
                    title="Bên nhận (*):"
                    width={4}
                    listOption={[{ hospital: { id: -1, name: "Chọn bên nhận" } }, ...dataHospital]}
                    placeholder={'Chọn bên nhận'}
                    selected={hospitalId}
                    getIdObject={(item) => {
                        return item.hospital.id;
                    }}
                    getLabelObject={(item) => {
                        return item.hospital.name
                    }}
                    onChangeSelect={(lists, ids) => {
                        setCheckButton(true); setHospitalId(ids);
                    }}
                    validation={checkValidate && hospitalId === -1 ? "Vui lòng chọn bên nhận!" : null}
                />
            </>
        )
    }
    const buttonFooter = () => {
        return (
            <>
                <ButtonFooter title="Hủy" onClick={useCallback} />
                <ButtonFooter
                    title={data && data.cardTransferHistory ? "Cập nhật" : "Thêm mới"}
                    onClick={create}
                    disabled={!checkButton}
                />
            </>
        )
    }
    return (
        <Modal
            isOpen={open}
            toggle={useCallback}
            title={data && data.cardTransferHistory ? 'Sửa lịch sử bàn giao thẻ ' : 'Thêm lịch sử bàn giao thẻ'}
            Children={setTplModal()}
            buttonFooter={buttonFooter()}
            width={750}
            padding={50}
        />
    );
}
export default CreateUpdateCard;