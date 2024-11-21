import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import ultils from '@/src/ultils/ultils';
import Button from '@/src/components/button';
import userService from '@/src/services/userService';
import configs from '@/src/configs';

const columns = [
    { id: 'fullname', label: 'Họ tên', minWidth: 100 },
    { id: 'id', label: 'Mã khách hàng', minWidth: 20 },
    { id: 'username', label: 'Tên đăng nhập', minWidth: 120 },
    {
        id: 'email',
        label: 'Email',
        minWidth: 120,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'phone',
        label: 'Số điện thoại',
        minWidth: 120,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'created_at',
        label: 'Ngày tạo',
        minWidth: 120,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'active',
        label: 'Trạng thái',
        minWidth: 120,
        align: 'left',
        format: (value) =>
            value == 1 ? (
                <div className='flex items-center justify-around rounded-2xl bg-success-50 p-1 text-center text-success-500'>
                    <div className='size-2 rounded-full bg-success-500' />
                    Hoạt động
                </div>
            ) : (
                <div className='flex items-center justify-around rounded-2xl bg-red-50 p-1 text-center text-red-500'>
                    <div className='size-2 rounded-full bg-red-500' />
                    Bị khóa
                </div>
            ),
    },
];

function createData(id, username, fullname, email, phone, created_at, active) {
    return { id, username, fullname, email, phone, created_at, active };
}

function UserList({ className, data }) {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rowDatas, setRowDatas] = useState([]);

    useEffect(() => {
        setUsers(data);
    }, [data]);

    useEffect(() => {
        const rows = [
            ...users.map((user) => {
                return createData(
                    user.id,
                    user.username,
                    user.lastname + ' ' + user.firstname,
                    user.email,
                    user.phone,
                    ultils.getFormatedTime(user.created_at),
                    user.active
                );
            }),
        ];

        setRowDatas(rows);
    }, [users]);

    const handleChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }, []);

    const handleActive = useCallback((id) => {
        const activeUsers = async (id) => {
            try {
                const res = await userService.activeUser(id);

                if (res.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                ultils.notifySuccess('Mở khóa tài khoản thành công!');

                setUsers((preUsers) => {
                    return preUsers.map((user) => {
                        if (user.id === id) {
                            return { ...user, active: 1 };
                        }
                        return user;
                    });
                });
            } catch (error) {
                throw new Error(error);
            }
        };

        activeUsers(id);
    }, []);

    const handleInActive = useCallback((id) => {
        const inactiveUsers = async (id) => {
            try {
                const res = await userService.inactiveUser(id);

                if (res.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                ultils.notifySuccess('Khóa tài khoản thành công!');

                setUsers((preUsers) => {
                    return preUsers.map((user) => {
                        if (user.id === id) {
                            return { ...user, active: 0 };
                        }
                        return user;
                    });
                });
            } catch (error) {
                throw new Error(error);
            }
        };

        inactiveUsers(id);
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
                                                    {column.format &&
                                                    typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}

                                        <TableCell align='left'>
                                            {row.active == 1 ? (
                                                <Button
                                                    rounded
                                                    className='bg-red-500 hover:bg-red-600 active:bg-red-500'
                                                    onClick={() =>
                                                        handleInActive(row.id)
                                                    }
                                                >
                                                    <p className='text-white'>
                                                        Khóa
                                                    </p>
                                                </Button>
                                            ) : (
                                                <Button
                                                    rounded
                                                    className='bg-green-500 hover:bg-green-600 active:bg-green-500'
                                                    onClick={() =>
                                                        handleActive(row.id)
                                                    }
                                                >
                                                    <p className='text-white'>
                                                        Mở khóa
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

UserList.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
};

export default UserList;
