import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import Search from '../search';
import './index.scss';
function TableHome({ titlePage, nameHospital, button, tableHeader, tableBody, pagination, setTplModal }) {
    return (
        <>
            <div className="page-title">
                <h2 className="title-page color-header-card">
                    {titlePage}
                    {nameHospital ? <span style={{ textTransform: "none" }} > ({nameHospital})</span> : null}
                </h2>
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
        </>
    );
}

export default TableHome;