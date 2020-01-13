import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import userProvider from '../../../../data-access/user-provider';
import moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import { DateBox } from '../../../../components/input-field/InputField';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import Radio from '@material-ui/core/Radio';

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
    const [checkButton, setCheckButton] = useState(false)

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
    return (
        <div style={{ backgroundColor: 'red' }}>
            <Dialog
                disableEnforceFocus={true}
                keepMounted
                open={open}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description">
                <ValidatorForm onSubmit={create}>
                    <DialogTitle id="alert-dialog-slide-title" className="title-popup">
                        {dataUserAdmin.user && dataUserAdmin.user.id ? 'Sửa thông tin tài khoản ' : 'Thêm mới tài khoản'}
                        <IconButton onClick={useCallback} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                            <Clear />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={16} className="user-create-header">
                            {
                                dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                                    <>
                                        <Grid item xs={12} md={4} className="grid-title-2">
                                            Username (*):
                                        </Grid>
                                        <Grid item xs={12} md={8} className="grid-title-2-disabled trim-text">
                                            {dataUserAdmin.user.username}
                                        </Grid>
                                    </>
                                    : null
                            }
                            <Grid item xs={12} md={4} className="grid-title-2">
                                Họ và tên (*):
                            </Grid>
                            <Grid item xs={12} md={8} className="news-title">
                                <TextValidator
                                    value={name}
                                    id="name" name="name"
                                    variant="outlined"
                                    placeholder="Nhập họ và tên"
                                    className={classes.textField + " color-text-validator"}
                                    onChange={(event) => { setCheckButton(true); setName(event.target.value); }}
                                    margin="normal"
                                />
                                {
                                    checkValidate && name.trim().length === 0 ? <div className="error-dob">Vui lòng nhập họ và tên</div> :
                                        checkValidate && name.trim().length > 255 ? <div className="error-dob">Vui lòng nhập họ và tên nhỏ hơn 255 ký tự!</div> : null
                                }
                            </Grid>
                            <Grid item xs={12} md={4} className="grid-title-2">
                                Ngày sinh (*):
                                </Grid>
                            <Grid item xs={12} md={8} className="news-title-date">
                                <DateBox
                                    isInput={true} placeholder="Nhập ngày sinh (dd/mm/yyyy)"
                                    value={dob}
                                    onChangeValue={(event) => {
                                        setCheckButton(true); setDob(event)
                                    }}
                                />
                                {
                                    checkValidate && (dob === null || (dob && dob.length === 0)) ? <div className="error-dob dob-user-admin">Vui lòng nhập ngày sinh</div> : null
                                }
                            </Grid>
                            <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: -9 }}>
                                Email (*):
                                </Grid>
                            <Grid item xs={12} md={8} className="news-title" style={{ marginTop: -9 }}>
                                <TextValidator
                                    value={email}
                                    id="email" name="email"
                                    variant="outlined"
                                    placeholder="Nhập email"
                                    className={classes.textField + " color-text-validator"}
                                    onChange={(event) => { setCheckButton(true); setEmail(event.target.value); }}
                                    margin="normal"
                                />
                                {
                                    checkValidate && email.trim().length == 0 ? <div className="error-dob">Vui lòng nhập email</div> :
                                        checkValidate && !email.isEmail() ? <div className="error-dob">Vui lòng nhập đúng định dạng Email</div> : null
                                }
                            </Grid>
                            <Grid item xs={12} md={4} className="grid-title-2">
                                Loại tài khoản (*):
                                </Grid>
                            <Grid item xs={12} md={8} style={{ marginLeft: -18, marginTop: -18 }}>
                                <Radio
                                    checked={type === '1'}
                                    onChange={(event) => { setCheckButton(true); setType(event.target.value) }}
                                    value={1}
                                    name="radio-button-demo"
                                    inputProps={{ 'aria-label': '1' }}
                                /> Admin
                                    <Radio
                                    checked={type === '2'}
                                    onChange={(event) => { setCheckButton(true); setType(event.target.value) }}
                                    value={2}
                                    name="radio-button-demo"
                                    inputProps={{ 'aria-label': '2' }}
                                /> Nhân viên
                                </Grid>
                            <Grid item xs={12} md={4}></Grid>
                            <Grid item xs={12} md={8} style={{ marginTop: -22, marginBottom: 14 }}>
                                {
                                    checkValidate && type == -1 ? <div className="error-dob">Vui lòng chọn loại tài khoản</div> : null
                                }
                            </Grid>
                            {
                                dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                                    <>
                                        <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: -6 }}>
                                            Ngày tạo:
                                        </Grid>
                                        <Grid item xs={12} md={8} className="grid-title-2-disabled" style={{ marginTop: -20 }}>
                                            {moment(dataUserAdmin.user.createdDate).format("DD-MM-YYYY")}
                                        </Grid>
                                    </>
                                    :
                                    <>
                                        <Grid item xs={12} md={4} className="grid-title-2" style={{ marginTop: -16 }}>
                                            Username (*):
                                        </Grid>
                                        <Grid item xs={12} md={8} className="news-title" style={{ marginTop: -14 }}>
                                            <TextValidator
                                                value={username}
                                                id="username" name="username"
                                                variant="outlined"
                                                placeholder="Nhập username"
                                                className={classes.textField + " color-text-validator"}
                                                onChange={(event) => { setCheckButton(true); setUsername(event.target.value); }}
                                                margin="normal"
                                            />
                                            {
                                                checkValidate && username.trim().length === 0 ? <div className="error-dob">Vui lòng nhập username</div> :
                                                    checkValidate && !username.isNickname() ? <div className="error-dob">Vui lòng nhập đúng định dạng username</div> : null
                                            }
                                        </Grid>
                                    </>
                            }
                            {
                                dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                                    <>
                                        <Grid item xs={12} md={4} className="grid-title-2">
                                            Trạng thái:
                                        </Grid>
                                        <Grid item xs={12} md={8} className="checkbox-popup">
                                            <Checkbox
                                                checked={statusActive}
                                                onChange={(event) => { setCheckButton(true); setStatusActive(event.target.checked) }}
                                                value="hot"
                                            />
                                            <a>Đang hoạt động</a>
                                        </Grid>
                                    </> :
                                    <>
                                        <Grid item xs={12} md={4} className="grid-title-2">
                                            Mật khẩu (*):
                                        </Grid>
                                        <Grid item xs={12} md={8} className="news-title">
                                            <TextValidator
                                                value={password}
                                                id="password" name="password"
                                                variant="outlined"
                                                type="password"
                                                placeholder="Nhập password"
                                                className={classes.textField + " color-text-validator"}
                                                onChange={(event) => { setCheckButton(true); setPassword(event.target.value); }}
                                                margin="normal"
                                            />
                                            {
                                                checkValidate && password.trim().length === 0 ?
                                                    <div className="error-dob">Vui lòng nhập password</div> :
                                                    checkValidate && password.trim().length < 6 ? <div className="error-dob">Vui lòng nhập password ít nhất 6 ký tự!</div> : null
                                            }
                                        </Grid>
                                    </>
                            }
                        </Grid>
                    </DialogContent>
                    <DialogActions className="margin-button">
                        <Button onClick={() => useCallback(false)} variant="contained" color="inherit">Hủy</Button>
                        {
                            dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id && checkButton ?
                                <Button variant="contained" color="primary" type="submit" className="button-new-submit">Cập nhật</Button> :
                                checkButton ?
                                    <Button variant="contained" color="primary" type="submit" className="button-new-submit">Thêm mới</Button> :
                                    dataUserAdmin && dataUserAdmin.user && dataUserAdmin.user.id ?
                                        <Button variant="contained" color="primary" disabled>Cập nhật</Button> :
                                        <Button variant="contained" color="primary" disabled>Thêm mới</Button>
                        }
                    </DialogActions>
                </ValidatorForm>
            </Dialog>
        </div >
    );
}


const styles = theme => ({
    row: {
        display: 'flex',
        justifyContent: 'center',
    }, textField: {
        width: '100%'
    }, avatar: {
        margin: 10,
    }, bigAvatar: {
        width: 60,
        height: 60,
    }, helpBlock: {
        color: 'red',
    }
});

export default withStyles(styles)(CreateUpdateUserAdmin);