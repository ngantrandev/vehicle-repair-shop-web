import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import {
    CanceledIcon,
    DoneIcon,
    DotIcon,
    FixingIcon,
} from '@/src/assets/icon/Icon.jsx';
import configs from '@/src/configs/index.js';
import ultils from '@/src/ultils/ultils.js';
import Button from '@/src/components/button/Button.jsx';
import bookingService from '@/src/services/bookingService.js';

const columns = [
    { id: 'fullname', label: 'Họ tên', minWidth: 80 },
    { id: 'id', label: 'Mã khách hàng', minWidth: 50 },

    { id: 'service', label: 'Tên dịch vụ', minWidth: 100 },
    {
        id: 'phone',
        label: 'Số điện thoại',
        minWidth: 80,
        align: 'left',
    },
    {
        id: 'created_at',
        label: 'Ngày tạo',
        minWidth: 120,
        align: 'left',
    },
    {
        id: 'note',
        label: 'Ghi chú',
        minWidth: 120,
        align: 'left',
    },
    {
        id: 'status',
        label: 'Trạng thái',
        minWidth: 120,
        align: 'left',
        format: (value) => {
            return value === configs.BOOKING_STATE.pending ? (
                <>
                    <DotIcon className='w-[1.3rem] rounded-full border-2 border-yellow-500 text-yellow-500' />
                    <span>{'Chờ xác nhận'}</span>
                </>
            ) : value === configs.BOOKING_STATE.done ? (
                <>
                    <DoneIcon className='w-6 text-green-500' />
                    <span>{'Hoàn thành'}</span>
                </>
            ) : value === configs.BOOKING_STATE.fixing ? (
                <>
                    <FixingIcon className='w-6 text-blue-500' />
                    <span>{'Đang sửa chữa'}</span>
                </>
            ) : value === configs.BOOKING_STATE.cancelled ? (
                <>
                    <CanceledIcon className='w-6 text-red-500' />
                    <span>{'Đã hủy'}</span>
                </>
            ) : (
                <>
                    <DotIcon className='w-6 rounded-full border-2 border-green-500 text-green-500' />
                    <span>{'Chuẩn bị sửa'}</span>
                </>
            );
        },
    },
];

function createData(fullname, id, service, phone, created_at, note, status) {
    return { fullname, id, service, phone, created_at, note, status };
}

function BookingList({ className, data, onRequestRefresh }) {
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rowDatas, setRowDatas] = useState([]);

    useEffect(() => {
        setBookings(data);
    }, [data]);

    useEffect(() => {
        const rows = [
            ...bookings.map((booking) => {
                const { user, service } = booking;
                return createData(
                    user.lastname + ' ' + user.firstname,
                    user.id,
                    service.name,
                    user.phone,
                    ultils.getFormatedTime(booking.created_at),
                    booking.note,
                    booking.status
                );
            }),
        ];

        setRowDatas(rows);
    }, [bookings]);

    const handleChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }, []);

    const handleCancel = useCallback(
        (bookingId) => {
            const cancelBooking = async (bookingId) => {
                try {
                    const res = await bookingService.cancelBooking(bookingId);

                    if (res.status !== configs.STATUS_CODE.OK) {
                        ultils.notifyError('Hủy đặt lịch thất bại');
                        return;
                    }

                    ultils.notifySuccess('Hủy đặt lịch thành công');
                    const newBookings = bookings.map((booking) => {
                        if (booking.id == bookingId) {
                            booking.status = configs.BOOKING_STATE.cancelled;
                        }

                        return booking;
                    });
                    setBookings(newBookings);
                } catch (error) {
                    ultils.notifyError('Có lỗi xảy ra');
                    console.log(error);
                }
            };

            cancelBooking(bookingId);
        },
        [bookings]
    );

    const handleUndoCancel = useCallback(
        (bookingId) => {
            const undoCancelBooking = async (bookingId) => {
                try {
                    const res =
                        await bookingService.userUndoCancelBooking(bookingId);

                    if (res.status !== configs.STATUS_CODE.OK) {
                        ultils.notifyError('Có lỗi xảy ra');
                        return;
                    }

                    onRequestRefresh();
                } catch (error) {
                    ultils.notifyError('Có lỗi xảy ra');
                    console.log(error);
                }
            };

            undoCancelBooking(bookingId);
        },
        [onRequestRefresh]
    );

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

                            <TableCell
                                align='left'
                                style={{ minWidth: 120, fontWeight: 'bold' }}
                            >
                                <div>Hành động</div>
                            </TableCell>
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
                                                    {column.format
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}

                                        <TableCell align='left'>
                                            {row.status ===
                                                configs.BOOKING_STATE
                                                    .pending && (
                                                <Button
                                                    rounded
                                                    className='bg-red-500 hover:bg-red-600 active:bg-red-500'
                                                    onClick={() => {
                                                        handleCancel(
                                                            bookings[
                                                                page *
                                                                    rowsPerPage +
                                                                    index
                                                            ].id
                                                        );
                                                    }}
                                                >
                                                    <p className='text-white'>
                                                        Hủy
                                                    </p>
                                                </Button>
                                            )}

                                            {row.status ===
                                                configs.BOOKING_STATE
                                                    .cancelled && (
                                                <Button
                                                    rounded
                                                    className='bg-green-500 hover:bg-green-600 active:bg-green-500'
                                                    onClick={() => {
                                                        handleUndoCancel(
                                                            bookings[
                                                                page *
                                                                    rowsPerPage +
                                                                    index
                                                            ].id
                                                        );
                                                    }}
                                                >
                                                    <p className='text-white'>
                                                        Hoàn tác
                                                    </p>
                                                </Button>
                                            )}
                                        </TableCell>
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

BookingList.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
    onRequestRefresh: PropTypes.func,
};

export default BookingList;
