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

import Button from '@/src/components/button';

const columns = [
    { id: 'stt', label: 'STT', minWidth: 20 },
    { id: 'id', label: 'Mã trạm', minWidth: 100 },
    { id: 'fullname', label: 'Tên trạm dịch vụ', minWidth: 100 },
    { id: 'address', label: 'Địa chỉ', minWidth: 100 },
    {
        id: 'staffCount',
        label: 'Số lượng nhân viên',
        minWidth: 100,
    },
];

function createData(stt, id, fullname, address, staffCount) {
    return { stt, id, fullname, address, staffCount };
}

function StationList({ data, className }) {
    const [stations, setStations] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rowDatas, setRowDatas] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setStations(data);
    }, [data]);

    useEffect(() => {
        const rows = [
            ...stations.map((station, index) => {
                const { address } = station;
                return createData(
                    index + 1,
                    station.id,
                    station.name,
                    address?.address_name + ' ' + address?.full_address,
                    station.staff_count
                );
            }),
        ];

        setRowDatas(rows);
    }, [stations]);

    const handleClickDetail = (station) => {
        navigate(`/admin/dashboard/stations/${station.id}/modify`, {
            state: { from: window.location.pathname },
        });
    };

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
                                            <Button
                                                rounded
                                                onClick={() =>
                                                    handleClickDetail(
                                                        stations[
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
                    <p className='font-bold'>{`${from} - ${to} trên ${count}`}</p>
                )}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}

StationList.propTypes = {
    data: PropTypes.array,
    className: PropTypes.string,
};

export default StationList;
