import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import ultils from '@/src/ultils/ultils';
import configs from '@/src/configs';
import {
    CanceledIcon,
    DoneIcon,
    DotIcon,
    FixingIcon,
} from '@/src/assets/icon/Icon';
import Button from '@/src/components/button';

const columns = [
    { id: 'bookingId', label: 'Mã lịch hẹn', minWidth: 50 },
    { id: 'fullname', label: 'Tên khách hàng', minWidth: 80 },
    { id: 'userId', label: 'Mã khách hàng', minWidth: 50 },
    {
        id: 'phone',
        label: 'Số điện thoại',
        minWidth: 80,
        align: 'left',
    },
    { id: 'service', label: 'Tên dịch vụ', minWidth: 100 },
    {
        id: 'created_at',
        label: 'Ngày tạo',
        minWidth: 120,
        align: 'left',
    },
    {
        id: 'note',
        label: 'Ghi chú',
        minWidth: 80,
        align: 'left',
    },
    {
        id: 'station',
        label: 'Chi nhánh',
        minWidth: 120,
        align: 'left',
    },
    {
        id: 'status',
        label: 'Trạng thái',
        minWidth: 100,
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

function createData(
    bookingId,
    fullname,
    userId,
    service,
    phone,
    created_at,
    note,
    station,
    status
) {
    return {
        bookingId,
        fullname,
        userId,
        service,
        phone,
        created_at,
        note,
        station,
        status,
    };
}

function BookingList({ className, data }) {
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rowDatas, setRowDatas] = useState([]);

    // const [isSortedByDate, setIsSortedByDate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setBookings(data);
    }, [data]);

    useEffect(() => {
        const rows = [
            ...bookings.map((booking) => {
                const { user, service, id: bookingId, staff } = booking;
                return createData(
                    bookingId,
                    user.lastname + ' ' + user.firstname,
                    user.id,
                    service.name,
                    user.phone,
                    ultils.getFormatedTime(booking.created_at),
                    booking.note,
                    staff?.station?.name,
                    booking.status
                );
            }),
        ];

        setRowDatas(rows);
    }, [bookings]);

    const handleClickDetail = (booking) => {
        navigate(`/users/${booking.user?.id}/bookings/${booking.id}`, {
            state: { from: window.location.pathname },
        });
    };

    // const handleSortByDate = () => {
    //     // sort by date
    //     if (isSortedByDate) {
    //         setBookings((prevBookings) => {
    //             return prevBookings.sort((a, b) => {
    //                 return new Date(a.created_at) - new Date(b.created_at);
    //             });
    //         });
    //     } else {
    //         setBookings((prevBookings) => {
    //             return prevBookings.sort((a, b) => {
    //                 return new Date(b.created_at) - new Date(a.created_at);
    //             });
    //         });
    //     }

    //     setIsSortedByDate(!isSortedByDate);
    // };

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

                            <TableCell
                                align='left'
                                style={{ minWidth: 100, fontWeight: 'bold' }}
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
                                            <Button
                                                rounded
                                                onClick={() =>
                                                    handleClickDetail(
                                                        bookings[
                                                            page * rowsPerPage +
                                                                index
                                                        ]
                                                    )
                                                }
                                            >
                                                <span>Chi tiết</span>
                                            </Button>
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
};

export default BookingList;
