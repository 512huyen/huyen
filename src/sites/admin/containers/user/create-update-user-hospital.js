import React, { useState } from 'react';
import { toast } from 'react-toastify';
import userProvider from '../../../../data-access/user-provider';
import Modal from '../../../../components/modal';
import { InputModal, InputDisabled, InputButton } from '../../../../components/input';
import { ButtonFooter, CheckBox } from '../../../../components/button';
import { SelectModal } from '../../../../components/select';
import Image from '../../../../components/image';
function CreateUpdateUserHospital({ data, useCallback, dataHospital }) {
    const [open] = useState(true);
    const [username, setUsername] = useState(data && data.user && data.user.username ? data.user.username : '');
    const [image, setImage] = useState(data && data.user && data.user.image ? data.user.image : "");
    const [hospitalId, setHospitalId] = useState(data && data.user && data.user.hospital ? data.user.hospital.id : -1);
    const [statusActive, setStatusActive] = useState(data && data.user && data.user.status === 1 ? true : false);
    const [password, setPassword] = useState("");
    const [checkValidate, setCheckValidate] = useState(false);
    const [dataUserHospital] = useState(data);
    const [checkButton, setCheckButton] = useState(false);
    const create = () => {
        let id = dataUserHospital && dataUserHospital.user ? dataUserHospital.user.id : '';
        if (!id) {
            if (password && password.length >= 6 && hospitalId !== -1 && username && username.isNickname()) {
                setCheckValidate(false)
            } else {
                setCheckValidate(true)
                return
            }
        }
        let param = {
            hospitalId: hospitalId,
            password: password,
            type: 4,
            username: username,
            status: id ? statusActive ? 1 : 2 : null,
            image: image
        }
        console.log(JSON.stringify(param));
        if (dataUserHospital && dataUserHospital.user && dataUserHospital.user.id) {
            userProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật tài khoản thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        useCallback(true)
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
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        } else {
            userProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Thêm mới tài khoản thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        useCallback(true)
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
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        }
    }
    const dataImage = (item) => {
        setImage(item);
    }
    const tpl = () => {
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
                <Image
                    title="Logo"
                    width={3}
                    dataImage={dataImage}
                />
                {
                    dataUserHospital && dataUserHospital.user && dataUserHospital.user.id ?
                        <>
                            <InputDisabled
                                width={3}
                                title="Username: "
                                value={dataUserHospital.user && dataUserHospital.user.username}
                            />
                            <InputDisabled
                                width={3}
                                title="Tên CSYT: "
                                value={dataUserHospital.user && dataUserHospital.user.hospital && dataUserHospital.user.hospital.name}
                            />
                            <InputButton
                                title="Trạng thái:"
                                tpl={tpl()}
                                width={3}
                            />
                        </> :
                        <>
                            <SelectModal
                                title="Tên CSYT"
                                width={3}
                                listOption={[{ hospital: { id: -1, name: "--- Chọn CSYT (*) ---" } }, ...dataHospital]}
                                placeholder={'Tìm kiếm'}
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
                                validation={checkValidate && hospitalId === -1 ? "Vui lòng chọn CSYT!" : null}
                            />
                            <InputModal
                                width={3}
                                title="Username (*)"
                                placeholder="Nhập username"
                                value={username}
                                onChange={(event) => { setCheckButton(true); setUsername(event.target.value); }}
                                validation={checkValidate && username.trim().length === 0 ? "Vui lòng nhập username!" : (checkValidate && !username.isNickname()) ? "Vui lòng nhập đúng định dạng username!" : null}
                            />
                            <InputModal
                                width={3}
                                title="Mật khẩu (*)"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                type="password"
                                onChange={(event) => { setCheckButton(true); setPassword(event.target.value); }}
                                validation={checkValidate && password.trim().length === 0 ? "Vui lòng nhập password!" : (checkValidate && password.trim().length < 6) ? "Vui lòng nhập password ít nhất 6 ký tự!" : null}
                            />
                        </>
                }
            </>
        )
    }
    const buttonFooter = () => {
        return (
            <>
                <ButtonFooter title="Hủy" onClick={useCallback} />
                <ButtonFooter
                    title={dataUserHospital && dataUserHospital.user ? "Cập nhật" : "Thêm mới"}
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
            title={dataUserHospital && dataUserHospital.user ? "Sửa thông tin tài khoản" : "Thêm mới tài khoản"}
            Children={setTplModal()}
            buttonFooter={buttonFooter()}
            width={600}
            padding={50}
        />
    );
}
export default CreateUpdateUserHospital;