import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import hospitalProvider from '../../../../data-access/hospital-provider';
import moment from 'moment';
import imageProvider from '../../../../data-access/image-provider';
import { DateBox } from '../../../../components/date';
import DataContants from '../../../../config/data-contants';
import Modal from '../../../../components/modal';
import { InputModal, InputButton } from '../../../../components/input';
import { ButtonFooter, CheckBox } from '../../../../components/button';
import { Button } from 'antd';
function CreateUpdateHospital(props) {
    const myRef = useRef()
    const [state, _setState] = useState({
        open: true,
        id: props.data && props.data.hospital && props.data.hospital.id,
        dataHospital: props.data,
        name: props.data && props.data.hospital && props.data.hospital.name ? props.data.hospital.name : '',
        issueDateTaxNo: props.data && props.data.hospital && props.data.hospital.issueDateTaxNo ? new Date(props.data.hospital.issueDateTaxNo) : null,
        fileAccount: props.data && props.data.hospital && props.data.hospital.fileAccount ? props.data.hospital.fileAccount : "",
        code: props.data && props.data.hospital && props.data.hospital.code ? props.data.hospital.code : "",
        phone: props.data && props.data.hospital && props.data.hospital.phone ? props.data.hospital.phone : "",
        fax: props.data && props.data.hospital && props.data.hospital.fax ? props.data.hospital.fax : "",
        address: props.data && props.data.hospital && props.data.hospital.address ? props.data.hospital.address : "",
        paymentMethods: props.data && props.data.hospital && props.data.hospital.paymentMethods ? props.data.hospital.paymentMethods : "",
        taxNo: props.data && props.data.hospital && props.data.hospital.taxNo ? props.data.hospital.taxNo : "",
        logo: props.data && props.data.hospital && props.data.hospital.logo ? props.data.hospital.logo : '',
        status: props.data && props.data.hospital && props.data.hospital.status === 1 ? true : false,
        listPaymentMethod: props.dataPaymentMethod,
        listKeyMethod: Object.keys(props.dataPaymentMethod),
        listMethodCheckBox: [],
        fileNames: props.data && props.data.hospital && props.data.hospital.fileName ? props.data.hospital.fileName : ""
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
        const { dataHospital, listKeyMethod, listPaymentMethod } = state;
        let paymentMethods = dataHospital && dataHospital.hospital && dataHospital.hospital.paymentMethods
        if (paymentMethods) {
            listKeyMethod.map((option, index) => {
                listPaymentMethod[listKeyMethod[index]].length && listPaymentMethod[listKeyMethod[index]].map(item => {
                    let a = paymentMethods[listKeyMethod[index]] && paymentMethods[listKeyMethod[index]].length && paymentMethods[listKeyMethod[index]].find(item2 => {
                        return item2.id === item.id
                    })
                    if (a && a.id) {
                        item.checked = true
                    } else {
                        item.checked = false
                    }
                    return item;
                })
            })
            setState({
                listPaymentMethod: listPaymentMethod
            })
        }
    }
    const handleClose = (item) => {
        setState({
            checkMethodValidate: true
        })
        reLoadDate(item)
    };
    const reLoadDate = (item) => {
        let arr = []
        for (let i = 0; i < state.listKeyMethod.length; i++) {
            arr = state.listPaymentMethod[state.listKeyMethod[i]].map(item => {
                item.checked = false;
                return item
            })
        }
        if (arr && arr.length) {
            setState({
                listCheckMethod: arr
            })
            props.useCallback(item)
        } else {
            debugger
            return
        }
    }
    const checkValidateMethod = () => {
        const { listPaymentMethod } = state;
        let data = {}
        let data3 = []
        for (let i = 0; i < state.listKeyMethod.length; i++) {
            let method = listPaymentMethod[state.listKeyMethod[i]].length && listPaymentMethod[state.listKeyMethod[i]].filter(item => {
                return item.checked
            }).map(item => {
                return item.id;
            })
            data[state.listKeyMethod[i].toString()] = method
            if (method && method.length) {
                data3.push(method.length)
            }
        }
        setState({
            checkMethodValidate: data3.length ? false : true
        })
    }
    const create = async () => {
        let { dataHospital, name, fileNames, issueDateTaxNo, code, phone, fax, address, taxNo, logo, status, listPaymentMethod, fileAccount } = state;
        let data = {}
        let data3 = []
        let id = state.dataHospital && state.dataHospital.hospital ? state.dataHospital.hospital.id : '';
        for (let i = 0; i < state.listKeyMethod.length; i++) {
            let method = listPaymentMethod[state.listKeyMethod[i]].length > 0 && listPaymentMethod[state.listKeyMethod[i]].filter(item => {
                return item.checked
            }).map(item => {
                return item.id;
            })
            data[state.listKeyMethod[i].toString()] = method
            if (method && method.length) {
                data3.push(method.length)
            }
        }
        if (id) {
            if (state.logo && state.name.length <= 255 && state.address.length <= 255 && state.phone && state.fax && state.taxNo && state.issueDateTaxNo && data3 && data3.length > 0) {
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
            if (state.logo && state.name.length <= 255 && state.code.length <= 255 && state.address.length <= 255 && state.phone && state.fax && state.taxNo && state.issueDateTaxNo) {
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
        if (data3 && data3.length === 0) {
            toast.error("Vui lòng chọn phương thức thanh toán!", {
                position: toast.POSITION.TOP_RIGHT
            });
            return
        }
        let param = {
            address: address.trim(),
            code: code.trim(),
            fax: fax.trim(),
            name: name.trim(),
            logo: logo,
            issueDateTaxNo: moment(issueDateTaxNo).format("YYYY-MM-DD"),
            paymentMethods: data,
            phone: phone.trim(),
            taxNo: taxNo.trim(),
            status: status ? 1 : 2,
            fileAccount: fileAccount ? fileAccount : null,
            fileName: fileNames ? fileNames : null
        }
        console.log(JSON.stringify(param));
        if (dataHospital && dataHospital.hospital && dataHospital.hospital.id) {
            hospitalProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật CSYT thành công!", {
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
                        toast.error("Nhà cung cấp đã được sử dụng. Vui lòng không thay đổi!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    default:
                        toast.error("Cập nhật CSYT không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        } else {
            hospitalProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Thêm mới CSYT thành công!", {
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
                        toast.error("Nhà cung cấp đã được sử dụng. Vui lòng không thay đổi!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    default:
                        toast.error("Thêm mới CSYT không thành công!", {
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
    const uploadFile = (event) => {
        let selector = event.target;
        let fileName = selector.value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
        if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
            imageProvider.uploadFile(event.target.files[0]).then(s => {
                if (s && s.data.code === 0 && s.data.data) {
                    setState({
                        fileAccount: s.data.data.file.file,
                        fileNames: s.data.data.file.name
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
        } else {
            toast.error("Vui lòng chọn đúng định dạng file .txt", {
                position: toast.POSITION.TOP_RIGHT
            });
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
    const getKeyMethod = (item) => {
        var status = DataContants.listPaymentMethod.filter((data) => {
            return parseInt(data.id) === Number(item)
        })
        if (status && status.length)
            return status[0];
        return {};
    }
    const tplCheckbox = () => {
        return (
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
        )
    }
    const handleClick = (e) => {
        e.preventDefault();
        return myRef.current.click();
    }
    const tplListHIS = () => {
        return (
            <><input
                accept="file_extension"
                style={{ display: 'none' }}
                id="upload_file_header"
                onChange={(event) => { uploadFile(event) }}
                ref={(input) => myRef.current = input}
                type="file"
            />
                <label htmlFor="upload_file_header">
                    {state.fileNames ?
                        <div className="name-file">
                            {state.fileNames}
                        </div> :
                        <Button component="span" className="button-upload" onClick={(e) => handleClick(e)}> Upload </Button>}
                </label></>
        )
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
                            <div style={{ marginLeft: 20 }}>
                                <img style={{ maxHeight: 150, maxWidth: 250, cursor: "pointer" }}
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
            <div className="row hospital-title-header">
                <div className="col-md-6 hospital-header">
                    <div className="hospital-title">Thông tin chung</div>
                    <InputButton
                        title="Trạng thái:"
                        tpl={tplImage()}
                        width={4}
                    />
                    <InputModal
                        width={4}
                        title="Mã CSYT (*):"
                        placeholder="Nhập mã CSYT"
                        value={state.code}
                        onChange={(event) => {
                            setState({
                                code: event.target.value,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && state.code.toString().length === 0 ? "Vui lòng nhập mã số CSYT!" :
                            (state.checkValidate && state.code.toString().length > 255) ? "Vui lòng nhập Mã số CSYT tối đa 255 ký tự!" : null}
                    />
                    <InputModal
                        width={4}
                        title="Tên CSYT (*):"
                        placeholder="Nhập tên CSYT"
                        value={state.name}
                        onChange={(event) => {
                            setState({
                                name: event.target.value,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && state.name.toString().length === 0 ? "Vui lòng nhập tên CSYT!" :
                            (state.checkValidate && state.name.toString().length > 255) ? "Vui lòng nhập tên CSYT tối đa 255 ký tự!" : null}
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
                        value={state.taxNo}
                        onChange={(event) => {
                            setState({
                                taxNo: event.target.value,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && state.taxNo.toString().length === 0 ? "Vui lòng nhập mã số thuế!" :
                            (state.checkValidate && !state.taxNo.isPhoneNumber()) ? "Vui lòng chỉ nhập số!" : null}
                    />
                    <DateBox
                        title="Ngày cấp (*):"
                        width={4}
                        isInput={true}
                        placeholder="Nhập ngày bàn giao (dd/mm/yyyy)"
                        value={state.issueDateTaxNo}
                        onChange={(event) => {
                            setState({
                                issueDateTaxNo: event,
                                checkButton: true
                            })
                        }}
                        validation={state.checkValidate && (state.issueDateTaxNo === null || (state.issueDateTaxNo && state.issueDateTaxNo.length === 0)) ? "Vui lòng chọn ngày cấp!" : null}
                    />
                    {state.id ? <InputButton
                        title="Trạng thái:"
                        tpl={tplCheckbox()}
                        width={4}
                    /> : null}
                    <InputButton
                        title="Trạng thái:"
                        tpl={tplListHIS()}
                        width={4}
                    />
                </div>
                <div className="col-md-6 hospital-header" style={{ borderLeft: "2px solid rgb(33,152,188)" }}>
                    <div className="hospital-title">Phương thức thanh toán (*):</div>
                    {
                        state.listKeyMethod && state.listKeyMethod.length > 0 ? state.listKeyMethod.map((item, index) => {
                            return (
                                <div className="hospital-padding" key={index}>
                                    <span className="hospital-name">
                                        {getKeyMethod(item) ? getKeyMethod(item).name : ""}
                                    </span>
                                    <div className="row hospital-body" >
                                        {
                                            state.listPaymentMethod[item] && state.listPaymentMethod[item].length > 0 ? state.listPaymentMethod[item].map((item2, index2) => {
                                                return (
                                                    <div className="col-md-6 hospital-padding hospital-padding-style-1" key={index2}>
                                                        {item2.checked ?
                                                            <CheckBox
                                                                title={item2.nameAbb}
                                                                checked={true}
                                                                value={item2.id.toString()}
                                                                onChange={() => {
                                                                    item2.checked = !item2.checked;
                                                                    setState({
                                                                        listPaymentMethodCreate: [...state.listPaymentMethod[item]],
                                                                        checkButton: true
                                                                    });
                                                                    checkValidateMethod(item2)
                                                                }}
                                                            /> :
                                                            <CheckBox
                                                                title={item2.nameAbb}
                                                                checked={false}
                                                                value={item2.id.toString()}
                                                                onChange={() => {
                                                                    item2.checked = !item2.checked;
                                                                    setState({
                                                                        listPaymentMethodCreate: [...state.listPaymentMethod[item]],
                                                                        checkButton: true
                                                                    });
                                                                    checkValidateMethod(item2)
                                                                }}
                                                            />
                                                        }
                                                    </div>
                                                )
                                            }) : null
                                        }
                                    </div>
                                </div>
                            )
                        }) : null
                    }
                    {state.checkValidate && state.checkMethodValidate ? <div className="error-dob">Vui lòng chọn phương thức thanh toán!</div> : null}
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
            title={state.id ? 'Sửa thông tin CSYT ' : 'Thêm mới CSYT'}
            Children={setTplModal()}
            buttonFooter={buttonFooter()}
            width={900}
            padding={50}
        />
    );
}
export default CreateUpdateHospital;