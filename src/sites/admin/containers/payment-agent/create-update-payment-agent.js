import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import paymentAgentProvider from '../../../../data-access/paymentAgent-provider';
import moment from 'moment';
import imageProvider from '../../../../data-access/image-provider';
import DataContants from '../../../../config/data-contants';
import Modal from '../../../../components/modal';
import { InputModal, InputButton } from '../../../../components/input';
import { ButtonFooter, CheckBox } from '../../../../components/button';
import { SelectModal } from '../../../../components/select';
import './index.scss';
import { DateBox } from '../../../../components/date';
function CreateUpdatePaymentAgen(props) {
    const myRef = useRef()
    const [state, _setState] = useState({
        open: true,
        dataPaymentAgent: props.data,
        id: props.data && props.data.paymentAgent && props.data.paymentAgent.id,
        name: props.data && props.data.paymentAgent && props.data.paymentAgent.name ? props.data.paymentAgent.name : '',
        issueDate: props.data && props.data.paymentAgent && props.data.paymentAgent.issueDate ? new Date(props.data.paymentAgent.issueDate) : null,
        taxCode: props.data && props.data.paymentAgent && props.data.paymentAgent.taxCode ? props.data.paymentAgent.taxCode : "",
        code: props.data && props.data.paymentAgent && props.data.paymentAgent.code ? props.data.paymentAgent.code : "",
        phone: props.data && props.data.paymentAgent && props.data.paymentAgent.phone ? props.data.paymentAgent.phone : "",
        fax: props.data && props.data.paymentAgent && props.data.paymentAgent.fax ? props.data.paymentAgent.fax : "",
        address: props.data && props.data.paymentAgent && props.data.paymentAgent.address ? props.data.paymentAgent.address : "",
        nameExchange: props.data && props.data.paymentAgent && props.data.paymentAgent.nameExchange ? props.data.paymentAgent.nameExchange : "",
        nameAbb: props.data && props.data.paymentAgent && props.data.paymentAgent.nameAbb ? props.data.paymentAgent.nameAbb : "",
        type: props.data && props.data.paymentAgent && props.data.paymentAgent.type ? props.data.paymentAgent.type : -1,
        paymentMethodId: props.data && props.data.paymentAgent && props.data.paymentAgent.type ? props.data.paymentAgent.type : -1,
        logo: props.data && props.data.paymentAgent && props.data.paymentAgent.logo ? props.data.paymentAgent.logo : '',
        status: props.data && props.data.paymentAgent && props.data.paymentAgent.status === 1 ? true : false,
        listPaymentMethodIds: [],
        listPaymentMethod: props.listPaymentMethod,
        listCheckMethod: [],
    });
    const setState = (_state) => {
        _setState((state) => ({
            ...state,
            ...(_state || {}),
        }));
    };
    useEffect(() => {
        checkPaymentMethod();
    }, []);
    const checkPaymentMethod = () => {
        if (state.listPaymentMethod && state.listPaymentMethod.paymentMethods && state.listPaymentMethod.paymentMethods.length > 0) {
            for (let i = 0; i < state.listPaymentMethod.paymentMethods.length; i++) {
                DataContants.listPaymentMethod.map(item => {
                    if (item.id === state.listPaymentMethod.paymentMethods[i]) {
                        item.checked = true
                    }
                    return item
                })
            }
        }
        setState({
            listCheckMethod: [...DataContants.listPaymentMethod]
        })
    }
    const handleClose = (item) => {
        reLoadDate(item)
    };
    const reLoadDate = (item) => {
        let arr = DataContants.listPaymentMethod.map(item => {
            item.checked = false;
            return item
        })
        if (arr && arr.length > 0) {
            setState({
                listCheckMethod: arr
            });
            props.useCallback(item)
        } else {
            return
        }
    }
    const create = async () => {
        let id = state.dataPaymentAgent && state.dataPaymentAgent.paymentAgent ? state.dataPaymentAgent.paymentAgent.id : '';
        if (id) {
            if (state.logo && state.nameAbb.length <= 255 && state.name.length <= 255 && state.nameExchange.length <= 255 && state.address.length <= 255 && state.phone && state.fax && state.taxCode && state.issueDate) {
                setState({
                    checkValidate: false
                })
            } else {
                setState({
                    checkValidate: true
                })
                return
            }
        } else {
            if (state.type !== -1 && state.logo && state.code.length <= 255 && state.nameAbb.length <= 255 && state.name.length <= 255 && state.nameExchange.length <= 255 && state.address.length <= 255 && state.phone && state.fax && state.taxCode && state.issueDate) {
                setState({
                    checkValidate: false
                })
            } else {
                setState({
                    checkValidate: true
                })
                return
            }
        }
        let { dataPaymentAgent, name, issueDate, taxCode, code, phone, fax, address, nameExchange, nameAbb, type, logo, status, listCheckMethodCreate, listCheckMethod } = state;
        let ids = []
        if (listCheckMethodCreate) {
            ids = listCheckMethodCreate && listCheckMethodCreate.filter(item => {
                return item.checked
            }).map(item => {
                return item.id;
            })
        } else {
            ids = listCheckMethod && listCheckMethod.filter(item => {
                return item.checked
            }).map(item => {
                return item.id;
            })
        }
        let param = {
            name: name.trim(),
            taxCode: taxCode.trim(),
            address: address,
            code: code,
            phone: phone,
            fax: fax,
            nameExchange: nameExchange,
            nameAbb: nameAbb,
            issueDate: moment(issueDate).format("YYYY-MM-DD"),
            type: type,
            logo: logo,
            status: status ? 1 : 2,
            paymentMethods: ids
        }
        console.log(JSON.stringify(param));
        if (dataPaymentAgent && dataPaymentAgent.paymentAgent && dataPaymentAgent.paymentAgent.id) {
            paymentAgentProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật nhà cung cấp thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        handleClose(true);
                        break
                    case 1:
                        toast.error("Mã số đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    case 2:
                        toast.error("Phương thức thanh toán đã được sử dụng, vui lòng không thay đổi!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    default:
                        toast.error("Cập nhật nhà cung cấp không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        } else {
            paymentAgentProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Thêm mới nhà cung cấp thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        handleClose(true);
                        break
                    case 1:
                        toast.error("Mã số đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    default:
                        toast.error("Thêm mới nhà cung cấp không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        }
    }
    const uploadImage = (event) => {
        let selector = event.target;
        let fileName = selector.value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
        let sizeImage = (event.target.files[0] || {}).size / 1048576;
        if (sizeImage) {
            if (fileName.endsWith(".jpg") ||
                fileName.endsWith(".png") ||
                fileName.endsWith(".gif") ||
                fileName.endsWith(".Gif")) {
                if (sizeImage > 2) {
                    toast.error("Ảnh không vượt quá dung lượng 2MB", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    imageProvider.upload(event.target.files[0]).then(s => {
                        if (s && s.data.code === 0 && s.data.data) {
                            setState({
                                logo: s.data.data.image.image,
                            })
                        } else {
                            toast.error("Vui lòng thử lại !", {
                                position: toast.POSITION.TOP_LEFT
                            });
                        }
                        setState({ progress: false })
                    }).catch(e => {
                        setState({ progress: false })
                    })
                }

            } else {
                toast.error("Vui lòng chọn đúng định dạng file ảnh", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }
    const listCheckMethod = (event, item) => {
        item.checked = !item.checked;
        setState({
            listCheckMethodCreate: [...state.listCheckMethod]
        })
    }
    const handleClick = (e) => {
        e.preventDefault();
        return myRef.current.click();
    }
    const tplImage = () => {
        return (
            <>
                <input
                    accept="image/png"
                    style={{ display: 'none' }}
                    id="upload_logo_header"
                    ref={(input) => myRef.current = input}
                    onChange={(event) => { uploadImage(event) }}
                    type="file"
                />
                <label htmlFor="upload_logo_header" style={{ marginTop: 2, marginBottom: "auto" }}>
                    {
                        state.logo ?
                            <div>
                                <img style={{ maxHeight: 150, maxWidth: 200, cursor: "pointer" }}
                                    alt="" src={state.logo ? state.logo.absoluteUrl() : ""} />
                            </div> :
                            <img className="upload-image-create" onClick={(e) => handleClick(e)} alt=""
                                src="/image-icon.png" />
                    }
                </label>
                {state.checkValidate && state.logo.toString().length === 0 ? <div className="error-dob">Vui lòng chọn logo!</div> : null}
            </>
        )
    }
    const setTplModal = () => {
        return (
            <div className="row user-create-header">
                <div className="col-md-6 payment-agent-title">
                    <InputButton
                        title="Logo (*)"
                        tpl={tplImage()}
                        width={5}
                    />
                    <SelectModal
                        title="Loại nhà cung cấp (*):"
                        width={5}
                        listOption={[{ id: -1, name: "Chọn nhà cung cấp" }, ...DataContants.listTypePaymentAgent]}
                        placeholder={'Tìm kiếm'}
                        selected={state.type}
                        getIdObject={(item) => {
                            return item.id;
                        }}
                        getLabelObject={(item) => {
                            return item.name
                        }}
                        onChangeSelect={(lists, ids) => {
                            setState({
                                type: ids,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && state.type === -1 ? "Vui lòng chọn nhà cung cấp!" : null}
                    />
                    <InputButton
                        title="Phương thức thanh toán"
                        tpl={
                            <div className="row paymentMethod-title">
                                {
                                    state.listCheckMethod && state.listCheckMethod.length && state.listCheckMethod.map((item, index) => {
                                        return (
                                            <div key={index} className="col-md-6 paymentMethod-index">
                                                <div className="paymentMethod-item">
                                                    {
                                                        item.checked ?
                                                            <CheckBox
                                                                title={item.name}
                                                                checked={true}
                                                                value={item.id.toString()}
                                                                onChange={(event) => {
                                                                    listCheckMethod(event, item);
                                                                    setState({
                                                                        checkButton: true
                                                                    })
                                                                }}
                                                            /> :
                                                            <CheckBox
                                                                title={item.name}
                                                                checked={false}
                                                                value={item.id.toString()}
                                                                onChange={(event) => {
                                                                    listCheckMethod(event, item);
                                                                    setState({
                                                                        checkButton: true
                                                                    })
                                                                }}
                                                            />
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                        width={12}
                    />
                </div>
                <div className="col-md-6 payment-agent-title">
                    <InputModal
                        width={4}
                        title="Mã số:"
                        placeholder="Nhập mã số nhà cung cấp"
                        value={state.code}
                        disabled={state.id ? true : false}
                        onChange={(event) => {
                            setState({
                                code: event.target.value,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && state.code.toString().length === 0 ? "Vui lòng nhập mã số nhà cung cấp!" :
                            (state.checkValidate && state.code.toString().length > 255) ? "Vui lòng nhập Mã số nhà cung cấp tối đa 255 ký tự!" : null}
                    />
                    <InputModal
                        width={4}
                        title="Tên viết tắt (*):"
                        placeholder="Nhập tên viết tắt"
                        value={state.nameAbb}
                        onChange={(event) => {
                            setState({
                                nameAbb: event.target.value,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && state.nameAbb.toString().length === 0 ? "Vui lòng nhập tên viết tắt!" :
                            (state.checkValidate && state.nameAbb.toString().length > 255) ? "Vui lòng nhập tên viết tắt tối đa 255 ký tự!" : null}
                    />
                    <InputModal
                        width={4}
                        title="Tên chính thức (*):"
                        placeholder="Nhập tên chính thức"
                        value={state.name}
                        disabled={state.id ? true : false}
                        onChange={(event) => {
                            setState({
                                name: event.target.value,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && state.name.toString().length === 0 ? "Vui lòng nhập tên chính thức!" :
                            (state.checkValidate && state.name.toString().length > 255) ? "Vui lòng nhập tên chính thức tối đa 255 ký tự!" : null}
                    />
                    <InputModal
                        width={4}
                        title="Tên giao dịch (*):"
                        placeholder="Nhập tên giao dịch"
                        value={state.nameExchange}
                        onChange={(event) => {
                            setState({
                                nameExchange: event.target.value,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && state.nameExchange.toString().length === 0 ? "Vui lòng nhập tên giao dịch!" :
                            (state.checkValidate && state.nameExchange.toString().length > 255) ? "Vui lòng nhập tên giao dịch tối đa 255 ký tự!" : null}
                    />
                    <InputModal
                        width={4}
                        title="Địa chỉ (*):"
                        placeholder="Nhập địa chỉ CSYT"
                        value={state.address}
                        onChange={(event) => {
                            setState({
                                address: event.target.value,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && state.address.toString().length === 0 ? "Vui lòng nhập địa chỉ CSYT!" :
                            (state.checkValidate && state.address.toString().length > 255) ? "Vui lòng nhập địa chỉ CSYT tối đa 255 ký tự!" : null}
                    />
                    <InputModal
                        width={4}
                        title="SĐT (*):"
                        placeholder="Nhập số điện thoại"
                        value={state.phone}
                        onChange={(event) => {
                            setState({
                                phone: event.target.value,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && state.phone.toString().length === 0 ? "Vui lòng nhập số điện thoại!" :
                            (state.checkValidate && !state.phone.uintTextBox()) ? "Vui lòng nhập đúng định dạng số điện thoại!" : null}
                    />
                    <InputModal
                        width={4}
                        title="Fax (*):"
                        placeholder="Nhập số fax"
                        value={state.fax}
                        onChange={(event) => {
                            setState({
                                fax: event.target.value,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && state.fax.toString().length === 0 ? "Vui lòng nhập số Fax!" :
                            (state.checkValidate && !state.fax.isPhoneNumber()) ? "Vui lòng chỉ nhập số!" : null}
                    />
                    <InputModal
                        width={4}
                        title="Mã số thuế (*):"
                        placeholder="Nhập mã số thuế"
                        value={state.taxCode}
                        onChange={(event) => {
                            setState({
                                taxCode: event.target.value,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && state.taxCode.toString().length === 0 ? "Vui lòng nhập mã số thuế!" :
                            (state.checkValidate && !state.taxCode.isPhoneNumber()) ? "Vui lòng chỉ nhập số!" : null}
                    />
                    <DateBox
                        title="Ngày cấp (*):"
                        width={4}
                        isInput={true}
                        placeholder="Nhập ngày bàn giao (dd/mm/yyyy)"
                        value={state.issueDate}
                        onChange={(event) => {
                            setState({
                                issueDate: event,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && (state.issueDate === null || (state.issueDate && state.issueDate.length === 0)) ? "Vui lòng chọn ngày cấp!" : null}
                    />
                    {state.id ? <InputButton
                        title="Trạng thái:"
                        tpl={
                            <CheckBox
                                title="Đang hoạt động"
                                checked={state.status}
                                onChange={(event) => {
                                    setState({
                                        status: event.target.checked,
                                        checkButton: true
                                    })
                                }}
                            />
                        }
                        width={4}
                    /> : null}
                </div>
            </div>
        )
    }
    const buttonFooter = () => {
        return (
            <>
                <ButtonFooter title="Hủy" onClick={props.useCallback} />
                <ButtonFooter
                    title={state.id ? "Cập nhật" : "Thêm mới"}
                    onClick={create}
                    disabled={!state.checkButton}
                />
            </>
        )
    }
    return (
        <Modal
            isOpen={state.open}
            toggle={props.useCallback}
            title={state.id ? 'Sửa thông tin nhà cung cấp ' : 'Thêm mới nhà cung cấp'}
            Children={setTplModal()}
            buttonFooter={buttonFooter()}
            width={950}
            padding={50}
        />
    );
}

export default CreateUpdatePaymentAgen;