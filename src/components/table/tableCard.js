import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Search from '../search';
import './index.scss';
function TableCard({ classes, tableBody }) {
    return (
        <div className="color-background-control">
            <Paper className={classes.root + " page-header"}>
                <div className={classes.tableWrapper + ' page-wrapper'}>
                    <>{tableBody}</>
                </div>
            </Paper>
        </div>
    );
}
const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 2048,
    },
    tableWrapper: {
        overflowX: 'auto',
    }
});

export default withStyles(styles)(TableCard);