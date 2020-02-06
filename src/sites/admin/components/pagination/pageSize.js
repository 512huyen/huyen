import React from 'react';
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '../../components/pagination/pagination';

function PageSize({ classes, total, size, page, handleChangePage, handleChangeRowsPerPage, colSpan }) {
    return (
        <TablePagination
            colSpan={colSpan}
            labelRowsPerPage="Số dòng trên trang"
            rowsPerPageOptions={[10, 20, 50, 100]}
            count={total}
            rowsPerPage={size}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
        />
    )
}

export default PageSize;
