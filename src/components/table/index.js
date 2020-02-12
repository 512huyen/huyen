import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { withStyles } from '@material-ui/core/styles';
import TableFooter from '@material-ui/core/TableFooter';
import Search from '../search';
import './index.scss';
function TableComponent({ classes, setTplModal, button, titlePage, tableHeader, tableBody, pagination }) {
  return (
    <div className="color-background-control">
      <Paper className={classes.root + " page-header"}>
        <div className={classes.tableWrapper + ' page-wrapper'}>
          <div className="page-title">
            {
              titlePage ? <h2 className="title-page">{titlePage} </h2> : null
            }
            {button}
          </div>
          <Search
            tpl={setTplModal} />
          <Table aria-labelledby="tableTitle" className="style-table-new">
            <TableHead>
              <TableRow>
                {
                  tableHeader && tableHeader.length ? tableHeader.map((item, index) => {
                    return (
                      <TableCell key={index} style={{ width: item.width }}>{item.name}</TableCell>
                    )
                  }) : null
                }
              </TableRow>
            </TableHead>
            <TableBody>{tableBody}</TableBody>
            <TableFooter>
              <TableRow className="pagination-custom">{pagination}</TableRow>
            </TableFooter>
          </Table>
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

export default withStyles(styles)(TableComponent);