import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import cardProvider from '../../../../data-access/card-provider';
import Modal from '../../../../components/modal';
import { InputDetail } from '../../../../components/input';
import './index.scss';
function DetailCardUser({ data, useCallback }) {
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
        bankReturnDTO: data && data.card && data.card.bankReturnDTO ? data.card.bankReturnDTO : '',
        address: data && data.card && data.card.patient ? data.card.patient.address : '',
    })
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
    const cancel = () => {
        let params = {
            card: {
                code: data.patient.code,
                issueDate: data.issueDate,
                transactionId: data.transactionId
            }
        }
        cardProvider.cancel(params).then(s => {
            if (s && s.data && s.code === 0) {
                toast.success("Hủy map thẻ thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.handleClose();
            } else {
                toast.success("Hủy map thẻ không thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }).catch(e => {
            toast.error(e.message, {
                position: toast.POSITION.TOP_RIGHT
            });
        })
    }
    const setTplModal = () => {
        return (
            <div className="row">
                <div className="col-md-6 color-border-user-card">
                    <InputDetail
                        width={4}
                        title="Số thẻ: "
                        value={formatCardNumber(detail.codeCard)}
                    />
                    <InputDetail
                        width={4}
                        title="Tên chủ thẻ: "
                        value={detail.name}
                        style={{ color: "#d0021b", textTransform: "uppercase" }}
                    />
                    <InputDetail
                        width={4}
                        title="Ngân hàng: "
                        value={detail.bankReturnDTO.name}
                        style={{ textTransform: "uppercase" }}
                    />
                    <InputDetail
                        width={4}
                        title="CSYT: "
                        value={detail.hospitalName}
                    />
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
    const buttonFooter = () => {
        return (
            <div className="margin-button">
                <Button variant="contained" className="isofh-pay-button-card-user" onClick={cancel}>Xác nhận huỷ thẻ</Button>
                <Button variant="contained" color="inherit" className="isofh-pay-button-cancel" onClick={useCallback}>Không hủy</Button>
            </div>
        )
    }
    return (
        <Modal
            isOpen={open}
            toggle={useCallback}
            title={"Hủy thẻ"}
            Children={setTplModal()}
            buttonFooter={buttonFooter()}
            width={950}
            padding={50}
            popupDetail={true}
        />
    );
}

export default DetailCardUser;