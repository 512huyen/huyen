import React, { useState } from 'react';
import { toast } from 'react-toastify';
import userProvider from '../../../../data-access/user-provider';
import moment from 'moment';
import { DateBox } from '../../../../components/date';
import Modal from '../../../../components/modal';
import { InputModal, InputDisabled, InputButton } from '../../../../components/input';
import { ButtonFooter, RadioButton, CheckBox } from '../../../../components/button';
const CreateUpdateUserAdmin = ({ data, classes, useCallback }) => {
    const [open] = useState(true);
    const [name, setName] = useState(data && data.user && data.user.name ? data.user.name : '');
    const [username, setUsername] = useState(data && data.user && data.user.username ? data.user.username : '');
    const [email, setEmail] = useState(data && data.user && data.user.email ? data.user.email : "");
    const [dob, setDob] = useState(data && data.user && data.user.dob ? new Date(data.user.dob) : null);
    const [type, setType] = useState(data && data.user && data.user.type ? data.user.type.toString() : -1);
    const [statusActive, setStatusActive] = useState(data && data.user && data.user.status === 1 ? true : false);
    const [password, setPassword] = useState("");
    const [checkValidate, setCheckValidate] = useState(false);
    const [dataUserAdmin] = useState(data);
    const [checkButton, setCheckButton] = useState(false);

    const create = async () => {
        let id = dataUserAdmin && dataUserAdmin.user ? dataUserAdmin.user.id : '';
        if (id) {
            if (name.length <= 255 && dob && type !== -1 && email && email.isEmail()) {
                setCheckValidate(false)
            } else {
                setCheckValidate(true)
                return
            }
        } else {
            if (name.length <= 255 && dob && username && username.isNickname() && password.length >= 6 && type !== -1 && email && email.isEmail()) {
                setCheckValidate(false)
            } else {
                setCheckValidate(true)
                return
            }
        }
        let param = {
            name: name.trim(),
            email: email.trim(),
            password: password,
            type: type,
            username: username,
            dob: moment(dob).format("YYYY-MM-DD"),
            status: id ? statusActive ? 1 : 2 : null
        }
        console.log(JSON.stringify(param));
        if (dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id) {
            userProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật tài khoản thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        useCallback(true);
                        break
                    case 1:
                        toast.error("Username đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    case 2:
                        toast.error("Email đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    default:
                        toast.error("Cập nhật tài khoản không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
            })
        } else {
            userProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Thêm mới tài khoản thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        useCallback(true);
                        break
                    case 1:
                        toast.error("Username đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    case 2:
                        toast.error("Email đã tồn tại trên hệ thống, vui lòng kiểm tra lại!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    default:
                        toast.error("Thêm mới tài khoản không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
            })
        }
    }
    const tpl = () => {
        return (
            <>
                <RadioButton
                    title="Admin"
                    checked={type === '1'}
                    onChange={(event) => { setCheckButton(true); setType(event.target.value) }}
                    value={1} />
                <RadioButton
                    title="Nhân viên"
                    checked={type === '2'}
                    onChange={(event) => { setCheckButton(true); setType(event.target.value) }}
                    value={2} />
            </>
        )
    }
    const tplCheckbox = () => {
        return (
            <CheckBox
                title="Đang hoạt động"
                checked={statusActive}
                onChange={(event) => { setCheckButton(true); setStatusActive(event.target.checked) }}
            />
        )
    }
    const setTplModal = () => {
        return (
            <>
                {
                    dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                        <InputDisabled
                            width={3}
                            title="Username (*): "
                            value={dataUserAdmin.user.username}
                        /> : null
                }
                <InputModal
                    width={3}
                    title="Họ và tên (*): "
                    placeholder="Nhập họ và tên"
                    value={name}
                    onChange={(event) => { setCheckButton(true); setName(event.target.value); }}
                    validation={(checkValidate && name.trim().length === 0) ? "Vui lòng nhập họ và tên!" : (checkValidate && name.trim().length > 255) ? "Vui lòng nhập họ và tên nhỏ hơn 255 ký tự!" : null}
                />
                <DateBox
                    title="Ngày sinh (*):"
                    width={3}
                    isInput={true} placeholder="Nhập ngày sinh (dd/mm/yyyy)"
                    value={dob}
                    onChange={(event) => {
                        setCheckButton(true); setDob(event)
                    }}
                    validation={checkValidate && (dob === null || (dob && dob.length === 0)) ? "Vui lòng nhập ngày sinh!" : null}
                />
                <InputModal
                    width={3}
                    title="Email (*): "
                    placeholder="Nhập email"
                    value={email}
                    onChange={(event) => { setCheckButton(true); setEmail(event.target.value); }}
                    validation={checkValidate && email.trim().length == 0 ? "Vui lòng nhập email!" : (checkValidate && !email.isEmail()) ? "Vui lòng nhập đúng định dạng Email!" : null}
                />
                <InputButton
                    width={3}
                    title="Loại tài khoản (*): "
                    tpl={tpl()}
                    validation={checkValidate && type == -1 ? "Vui lòng chọn loại tài khoản!" : null}
                />
                {
                    dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                        <InputDisabled
                            width={3}
                            title="Ngày tạo: "
                            value={moment(dataUserAdmin.user.createdDate).format("DD-MM-YYYY")}
                        /> :
                        <InputModal
                            width={3}
                            title="Username (*)"
                            placeholder="Nhập username"
                            value={username}
                            onChange={(event) => { setCheckButton(true); setUsername(event.target.value); }}
                            validation={checkValidate && username.trim().length === 0 ? "Vui lòng nhập username!" : (checkValidate && !username.isNickname()) ? "Vui lòng nhập đúng định dạng username!" : null}
                        />
                }
                {
                    dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                        <InputButton
                            title="Trạng thái:"
                            tpl={tplCheckbox()}
                            width={3}
                        /> :
                        <InputModal
                            width={3}
                            title="Mật khẩu (*): "
                            placeholder="Nhập mật khẩu"
                            value={password}
                            type="password"
                            onChange={(event) => { setCheckButton(true); setPassword(event.target.value); }}
                            validation={checkValidate && password.trim().length === 0 ? "Vui lòng nhập password!" : (checkValidate && password.trim().length < 6) ? "Vui lòng nhập password ít nhất 6 ký tự!" : null}
                        />
                }

            </>
        )
    }
    const buttonFooter = () => {
        return (
            <>
                <ButtonFooter title="Hủy" onClick={useCallback} />
                <ButtonFooter
                    title={dataUserAdmin && dataUserAdmin.user ? "Cập nhật" : "Thêm mới"}
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
            title={dataUserAdmin && dataUserAdmin.user ? "Sửa thông tin tài khoản" : "Thêm mới tài khoản"}
            Children={setTplModal()}
            buttonFooter={buttonFooter()}
            width={650}
            padding={50}
        />
    );
}
export default CreateUpdateUserAdmin;