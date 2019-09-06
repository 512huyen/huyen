import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { ValidatorForm } from 'react-material-ui-form-validator';
import hospitalProvider from '../../../../data-access/hospital-provider';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class HisHospital extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataHisHospital: this.props.data,
            dataHospital: this.props.dataHospital,
            name: this.props.dataHospital && this.props.dataHospital.hospital && this.props.dataHospital.hospital.name ? this.props.dataHospital.hospital.name : null
        };
    }
    handleClose = () => {
        this.props.callbackOff()
    };
    render() {
        const { classes } = this.props;
        const { dataHospital, dataHisHospital, name } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }} >
                <Dialog
                    className="his-hospital-width"
                    disableEnforceFocus={true}
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth={true}
                    maxWidth="md"
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title" className="title-popup">
                        <IconButton onClick={() => this.handleClose()} color="primary" className={classes.button + " close-button"} aria-label="CancelIcon">
                            <Clear />
                        </IconButton>
                        {dataHospital.hospital && dataHospital.hospital.id ? 'Danh sách các tài khoản HIS' : ''}
                        <div className="title-header-hospital">({name})</div>
                    </DialogTitle>
                    <DialogContent>
                        <Paper className={classes.root + " page-header header-box"}>
                            <div className={classes.tableWrapper + ' page-wrapper'}>
                                <Table aria-labelledby="tableTitle" className="style-table-new style-table-new-his-hospital">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ width: "10%" }}>STT</TableCell>
                                            <TableCell style={{ width: "20%" }}>Mã số</TableCell>
                                            <TableCell style={{ width: "20%" }}>Username</TableCell>
                                            <TableCell style={{ width: "20%" }}>Họ và tên</TableCell>
                                            <TableCell style={{ width: "15%" }}>Khoa</TableCell>
                                            <TableCell style={{ width: "15%" }}>Nhà</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            dataHisHospital && dataHisHospital.length ? dataHisHospital.map((item, index) => {
                                                return (
                                                    <TableRow
                                                        hover
                                                        key={index}
                                                        tabIndex={-1}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{item.code}</TableCell>
                                                        <TableCell>{item.username}</TableCell>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell>{item.department}</TableCell>
                                                        <TableCell>{item.location}</TableCell>
                                                    </TableRow>
                                                );
                                            })
                                                :
                                                <TableRow>
                                                    <TableCell colSpan="6">Không có dữ liệu</TableCell>
                                                </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        </Paper>
                    </DialogContent>
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
        color: 'red',
    }
});

export default withStyles(styles)(connect(mapStateToProps)(HisHospital));