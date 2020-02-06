import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';

class TablePaginationActions extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    handleFirstPageButtonClick = event => {
        this.props.onChangePage(event, 0);
    };

    handleBackButtonClick = event => {
        this.props.onChangePage(event, this.props.page - 1);
    };

    handleNextButtonClick = event => {
        this.props.onChangePage(event, this.props.page + 1);
    };
    handleUpdatePage = event => {
        this.props.onChangePage(event, Number(event.target.value) - 1);
    }

    handleLastPageButtonClick = event => {
        this.props.onChangePage(event, Math.ceil(this.props.count / this.props.rowsPerPage) - 1);
    };

    render() {
        const { classes, count, page, rowsPerPage, theme } = this.props;
        let totalPage = 0;
        if (count > 0) {
            let temp = count / rowsPerPage;
            let _totalpage = Math.round(temp);
            totalPage = (temp > _totalpage) ? (_totalpage + 1) : _totalpage;
        } else {
            totalPage = 0
        }
        return (
            <div className={classes.root}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="First Page"
                    className="css-page"
                >
                    {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Previous Page"
                    className="css-page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <input className="input-page" type="text" value={page + 1} onChange={this.handleUpdatePage} />
                <span className="page-size">/{totalPage}</span>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                    className="css-page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                    className="css-page"
                >
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </div>
        );
    }
}

TablePaginationActions.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired,

};
const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
});
const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
    TablePaginationActions,
);

export default TablePaginationActionsWrapped;