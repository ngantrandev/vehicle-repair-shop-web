import PropTypes, { func } from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import { Box, Modal } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import ultils from '@/src/ultils';

const columns = [
    { id: 'stt', label: 'Số TT', minWidth: 30 },
    { id: 'id', label: 'Mã đơn nhập', minWidth: 20 },
    { id: 'date_input', label: 'Ngày nhập', minWidth: 120 },
    {
        id: 'total_price',
        label: 'Tổng giá trị',
        minWidth: 120,
        format: (value) => {
            return ultils.getCurrencyFormat(value);
        },
    },
];

function createData(stt, id, date_input, total_price) {
    return { stt, id, date_input, total_price };
}

function NoteDetail({ selectedNote, onClose, open }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='child-modal-title'
            aria-describedby='child-modal-description'
        >
            <Box className='absolute left-1/2 top-1/2 flex h-[470px] w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center bg-white pb-8'>
                <h2
                    id='child-modal-title'
                    className='w-full bg-green-500 py-4 text-center text-xl font-bold text-white'
                >
                    Chi tiết phiếu nhập
                </h2>
                <div className='grid w-full grid-cols-2 px-4'>
                    <div className='p-4'>
                        <p className='font-bold'>
                            Mã phiếu nhập: {selectedNote?.id}
                        </p>
                        <p className='font-bold'>
                            Ngày nhập: {selectedNote?.date_input}
                        </p>
                    </div>
                    <div className='p-4'>
                        <p className='font-bold'>
                            Tổng giá trị:{' '}
                            {ultils.getCurrencyFormat(
                                selectedNote?.total_price
                            )}
                        </p>
                    </div>
                </div>

                {/**danh sach item */}
                <div className='flex-1 px-8'>
                    <TableContainer
                        sx={{
                            maxHeight: 300,
                            border: '1px solid #4a9eff',
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <Table stickyHeader aria-label='sticky table'>
                            <TableHead className=''>
                                <TableRow sx={{}} className=''>
                                    <TableCell>Số TT</TableCell>
                                    <TableCell>Mã sản phẩm</TableCell>
                                    <TableCell>Tên sản phẩm</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Giá nhập</TableCell>
                                    <TableCell>Giá xuất</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedNote?.items?.map((item, index) => {
                                    const {
                                        item_id,
                                        item_name,
                                        count,
                                        input_price,
                                        output_price,
                                    } = item;
                                    return (
                                        <TableRow
                                            hover
                                            role='checkbox'
                                            tabIndex={-1}
                                            key={index}
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item_id}</TableCell>
                                            <TableCell>{item_name}</TableCell>
                                            <TableCell>{count}</TableCell>
                                            <TableCell>
                                                {ultils.getCurrencyFormat(
                                                    input_price
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {ultils.getCurrencyFormat(
                                                    output_price
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Box>
        </Modal>
    );
}

function NoteList({ className, data }) {
    const [notes, setNotes] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [rowDatas, setRowDatas] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    const handleClose = () => {
        setOpen(false);
        setSelectedNote(null);
    };

    useEffect(() => {
        setNotes(data);
    }, [data]);

    useEffect(() => {
        const rows = [
            ...notes.map((item, index) => {
                const { id, date_input, total_price } = item;

                return createData(index + 1, id, date_input, total_price);
            }),
        ];

        setRowDatas(rows);
    }, [notes]);

    const handleChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }, []);

    return (
        <div className={className}>
            <NoteDetail
                open={open}
                onClose={handleClose}
                selectedNote={selectedNote}
            />
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
                                        className='cursor-pointer'
                                        onClick={() => {
                                            setSelectedNote(notes[index]);
                                            setOpen(true);
                                        }}
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

NoteList.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
};

NoteDetail.propTypes = {
    selectedNote: PropTypes.object,
    onClose: func,
    open: PropTypes.bool,
};

export default NoteList;
