import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
    { id: 'stt', label: 'Số TT', minWidth: 30 },
    { id: 'id', label: 'Mã phụ tùng', minWidth: 20 },
    { id: 'name', label: 'Tên phụ tùng', minWidth: 120 },
    {
        id: 'total_input',
        label: 'Số lượng nhập',
        minWidth: 120,
        align: 'left',
    },
    {
        id: 'total_output',
        label: 'Số lượng xuất',
        minWidth: 120,
        align: 'left',
    },

    {
        id: 'remaning',
        label: 'Số lượng tồn',
        minWidth: 120,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
];

function createData(stt, id, name, total_input, total_output, remaning) {
    return { stt, id, name, total_input, total_output, remaning };
}

function UserList({ className, data }) {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [rowDatas, setRowDatas] = useState([]);

    useEffect(() => {
        setItems(data);
    }, [data]);

    useEffect(() => {
        const rows = [
            ...items.map((item, index) => {
                return createData(
                    index + 1,
                    item.id,
                    item.name,
                    item.total_input,
                    item.total_output,
                    item.total_input - item.total_output
                );
            }),
        ];

        setRowDatas(rows);
    }, [items]);

    const handleChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }, []);

    return (
        <div className={className}>
            <TableContainer
                sx={{ maxHeight: 440, border: '1px solid #4a9eff' }}
            >
                <Table stickyHeader aria-label='sticky table'>
                    <TableHead
                        sx={{ background: 'red' }}
                        className='bg-red-100'
                    >
                        <TableRow
                            sx={{ background: 'red' }}
                            className='bg-red-100'
                        >
                            {columns.map((column, index) => (
                                <TableCell
                                    key={index}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowDatas
                            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        role='checkbox'
                                        tabIndex={-1}
                                        key={index}
                                    >
                                        {columns.map((column, index) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell
                                                    key={index}
                                                    align={column.align}
                                                >
                                                    {column.format &&
                                                    typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                className='mt-2 font-bold'
                rowsPerPageOptions={[5, 10, 25, 100]}
                component='div'
                count={rowDatas.length}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage={
                    <p className='font-bold'>Số hàng trên mỗi trang</p>
                }
                labelDisplayedRows={({ from, to, count }) => (
                    <p className='font-bold'>{`${from}-${to} của ${count}`}</p>
                )}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}

UserList.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
};

export default UserList;
