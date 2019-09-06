import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import stringUtils from 'mainam-react-native-string-utils';
import userProvider from '../../../../data-access/user-provider';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class SetPassword extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataUser: this.props.data,
            newPassword: '',
            confirmPassword: '',
            oldPassword: ''
        };
    }

    componentDidMount() {
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.newPassword) {
                return false;
            }
            return true;
        });
        ValidatorForm.addValidationRule('minPassword', (value) => {
            if (value.length < 6)
                return false
            return true
        });
        ValidatorForm.addValidationRule('checkSpace', (value) => {
            if (value.trim() == "")
                return false
            return true
        });
    }

    handleClose = () => {
        this.props.callbackOff()
    };
    handlelogOut() {
        let param = JSON.parse(localStorage.getItem('isofh'));
        localStorage.clear()
        window.location.href = '/dang-nhap';
    };
    updatePassword = () => {
        const { dataUser, newPassword, oldPassword } = this.state;
        let id = dataUser && dataUser ? dataUser.id : '';
        let object = {
            oldPassword: oldPassword,
            newPassword: newPassword
        }
        console.log(JSON.stringify(object))
        userProvider.updatePassword(id, object).then(s => {
            if (s && s.code == 0) {
                toast.success("Thiết lập mật khẩu thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.handlelogOut();
            }
            if (s.code == 1) {
                toast.error("Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra lại!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            if (s.code == 97) {
                this.handlelogOut();
            }
        }).catch(e => {
            toast.error("Thiết lập mật khẩu không thành công!", {
                position: toast.POSITION.TOP_RIGHT
            });
        })
    }

    render() {
        const { classes } = this.props;
        const { dataUser, newPassword, confirmPassword, oldPassword } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm onSubmit={this.updatePassword}>
                        <DialogTitle id="alert-dialog-slide-title" className="change-password-index">
                            <span className="change-password-title">Thay đổi mật khẩu</span>
                            <IconButton onClick={() => this.handleClose()} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                                <Clear />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent className="change-password-content">
                            <Grid container spacing={16} className="change-password-body">
                                <Grid item xs={12} md={5} className="title-index-password">Mật khẩu hiện tại (*)</Grid>
                                <Grid item xs={12} md={7} className="user-info-input-item user-info-input-item-2">
                                    <TextValidator
                                        type="password"
                                        value={oldPassword} id="oldPassword" name="oldPassword"
                                        className={classes.textField + " color-text-validator"}
                                        placeholder="Nhập mật khẩu hiện tại"
                                        onChange={(event) => { this.setState({ oldPassword: event.target.value.trim() }) }}
                                        margin="normal" variant="outlined"
                                        validators={['required', 'checkSpace', 'minPassword']}
                                        errorMessages={['Vui lòng nhập mật khẩu hiện tại!', 'Vui lòng nhập mật khẩu hiện tại!', 'Vui lòng nhập mật khẩu lớn hơn hoặc bằng 6 ký tự!']}
                                    />
                                </Grid>
                                <Grid item xs={12} md={5} className="title-index-password">Mật khẩu mới (*)</Grid>
                                <Grid item xs={12} md={7} className="user-info-input-item user-info-input-item-2">
                                    <TextValidator
                                        type="password"
                                        value={newPassword} id="password" name="password"
                                        className={classes.textField + " color-text-validator"}
                                        placeholder="Nhập mật khẩu mới"
                                        onChange={(event) => { this.setState({ newPassword: event.target.value.trim() }) }}
                                        margin="normal" variant="outlined"
                                        validators={['required', 'checkSpace', 'minPassword']}
                                        errorMessages={['Vui lòng nhập mật khẩu mới!', 'Vui lòng nhập mật khẩu mới!', 'Vui lòng nhập mật khẩu mới lớn hơn hoặc bằng 6 ký tự!']}
                                    />
                                </Grid>
                                <Grid item xs={12} md={5} className="title-index-password">Xác nhận mật khẩu mới (*)</Grid>
                                <Grid item xs={12} md={7} className="user-info-input-item user-info-input-item-2">
                                    <TextValidator
                                        type="password"
                                        value={confirmPassword}
                                        id="confirm-password" name="confirmPassword"
                                        className={classes.textField + " color-text-validator"}
                                        placeholder="Xác nhận mật khẩu mới"
                                        onChange={(event) => { this.setState({ confirmPassword: event.target.value.trim() }) }}
                                        margin="normal" variant="outlined"
                                        validators={['checkSpace', 'isPasswordMatch', 'required', 'minPassword', 'checkSpace']}
                                        errorMessages={['Vui lòng nhập Xác nhận mật khẩu mới!', 'Xác nhận mật khẩu mới không trùng khớp!', 'Vui lòng nhập Xác nhận mật khẩu mới!', 'Vui lòng nhập Xác nhận mật khẩu mới lớn hơn hoặc bằng 6 ký tự!']}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions className="margin-button">
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Hủy</Button>
                            <Button variant="contained" color="primary" type="submit">Lưu</Button>
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
            </div >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
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
        color: 'red'
    },
});

export default withStyles(styles)(connect(mapStateToProps)(SetPassword));