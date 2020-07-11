import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import DataContants from '../../../../config/data-contants';
import Modal from '../../../../components/modal';
import { InputDetail } from '../../../../components/input';

function DetailPaymentAgent(props) {
    const [state, _setState] = useState({
        open: true,
        dataPaymentAgent: props.data,
        name: props.data && props.data.paymentAgent && props.data.paymentAgent.name ? props.data.paymentAgent.name : '',
        issueDate: props.data && props.data.paymentAgent && props.data.paymentAgent.issueDate ? props.data.paymentAgent.issueDate : null,
        taxCode: props.data && props.data.paymentAgent && props.data.paymentAgent.taxCode ? Number(props.data.paymentAgent.taxCode) : 0,
        code: props.data && props.data.paymentAgent && props.data.paymentAgent.code ? props.data.paymentAgent.code : "",
        phone: props.data && props.data.paymentAgent && props.data.paymentAgent.phone ? props.data.paymentAgent.phone : "",
        fax: props.data && props.data.paymentAgent && props.data.paymentAgent.fax ? props.data.paymentAgent.fax : "",
        address: props.data && props.data.paymentAgent && props.data.paymentAgent.address ? props.data.paymentAgent.address : "",
        nameExchange: props.data && props.data.paymentAgent && props.data.paymentAgent.nameExchange ? props.data.paymentAgent.nameExchange : "",
        nameAbb: props.data && props.data.paymentAgent && props.data.paymentAgent.nameAbb ? props.data.paymentAgent.nameAbb : "",
        type: props.data && props.data.paymentAgent && props.data.paymentAgent.type ? props.data.paymentAgent.type : -1,
        logo: props.data && props.data.paymentAgent && props.data.paymentAgent.logo ? props.data.paymentAgent.logo : '',
        status: props.data && props.data.paymentAgent && props.data.paymentAgent.status ? props.data.paymentAgent.status : '',
    });
    const setState = (_state) => {
        _setState((state) => ({
            ...state,
            ...(_state || {}),
        }));
    };
    const { dataPaymentAgent, status, nameAbb, nameExchange, name, address, fax, phone, code, taxCode, issueDate } = state;
    const getKeyMethod = (item) => {
        let status = DataContants.listPaymentMethod.filter(x => {
            return x.id === item
        })
        if (status && status.length)
            return status[0]
        return {}
    }
    const setTplModal = () => {
        return (
            <div className="row">
                <div className="col-md-7 detail-payment-agent">
                    <InputDetail
                        width={4}
                        title="Mã số: "
                        value={code}
                    />
                    <InputDetail
                        width={4}
                        title="Tên viết tắt: "
                        value={nameAbb}
                        style={{ color: "#d0021b" }}
                    />
                    <InputDetail
                        width={4}
                        title="Tên chính thức: "
                        value={name}
                    />
                    <InputDetail
                        width={4}
                        title="Tên giao dịch: "
                        value={nameExchange}
                    />
                    <InputDetail
                        width={4}
                        title="Địa chỉ: "
                        value={address}
                    />
                    <InputDetail
                        width={4}
                        title="SĐT: "
                        value={phone}
                    />
                    <InputDetail
                        width={4}
                        title="Fax: "
                        value={fax}
                    />
                    <InputDetail
                        width={4}
                        title="Mã số thuế: "
                        value={taxCode}
                    />
                    <InputDetail
                        width={4}
                        title="Ngày cấp: "
                        value={moment(issueDate).format("DD-MM-YYYY")}
                    />
                    {
                        status === 1 ?
                            <InputDetail
                                width={4}
                                title="Trạng thái: "
                                value="Đang hoạt động"
                                style={{ color: "rgb(39,174,96)" }}
                            /> : status === 2 ?
                                <InputDetail
                                    width={4}
                                    title="Trạng thái: "
                                    value="Đã khóa"
                                    style={{ color: "#d0021b" }}
                                /> : null
                    }
                </div>
                <div className="col-md-5 detail-payment-agent">
                    <div className="group-detail-colx2">
                        <div className="detail-item">
                            <div className="row">
                                <div className="col-md-12">
                                    <span className="content-detail">Phương thức thanh toán:</span>
                                </div>
                            </div>
                        </div>
                        <div className="detail-item">
                            <div className="row">
                                <div className="col-md-12">
                                    {
                                        dataPaymentAgent && dataPaymentAgent.paymentAgent && dataPaymentAgent.paymentAgent.paymentMethods && dataPaymentAgent.paymentAgent.paymentMethods.map((option, index) => {
                                            return (
                                                <p key={index} className="label-detail  detail-index">{getKeyMethod(option) ? "+ " + getKeyMethod(option).name : ""}</p>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <Modal
            isOpen={state.open}
            toggle={props.useCallback}
            title={"Thông tin CSYT"}
            Children={setTplModal()}
            width={950}
            padding={50}
            popupDetail={true}
        />
    );
}

export default DetailPaymentAgent;