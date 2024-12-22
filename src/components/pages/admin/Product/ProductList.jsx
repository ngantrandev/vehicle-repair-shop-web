import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@/src/components/button';
import Input from '@/src/components/input/Input';
import { Box, Modal } from '@mui/material';
import ultils from '@/src/ultils';
import itemsService from '@/src/services/itemsService';
import configs from '@/src/configs';

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

const UpdateItemForm = ({ item, open, onClose }) => {
    const [itemName, setItemName] = useState(item?.name || '');
    const [description, setDescription] = useState(item?.description || '');

    const handleClear = () => {
        setDescription('');
        setItemName('');
    };

    useEffect(() => {
        if (item) {
            setItemName(item.name);
            setDescription(item.description);
        }
    }, [item]);

    const handleUpdateItem = async () => {
        if (itemName.trim() === '') {
            ultils.notifyError('Vui lòng nhập tên sản phẩm');
            return;
        }

        const data = {
            name: itemName,
            description: description,
        };

        try {
            const res = await itemsService.updateItem(item.id, data);

            if (res.status == configs.STATUS_CODE.OK) {
                ultils.notifySuccess('Cập nhật thành công');
            } else {
                ultils.notifyError('Cập nhật thất bại');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby='child-modal-title'
            aria-describedby='child-modal-description'
        >
            <Box className='absolute left-1/2 top-1/2 flex h-[300px] w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center bg-white pb-8'>
                <div className='w-full bg-green-500 py-2 text-center text-xl font-bold text-white'>
                    Cập nhật sản phẩm
                </div>

                <div className='w-full px-8 py-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label htmlFor='itemname'>Tên sản phẩm</label>
                            <Input
                                className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                                placeholder='Nhập tên sản phẩm'
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor='desc'>Mô tả</label>
                            <Input
                                className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                                placeholder='Nhập mô tả'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='mt-4 flex w-full gap-2'>
                        <Button
                            rounded
                            className='h-10 bg-primary text-white'
                            onClick={handleUpdateItem}
                        >
                            Cập nhật
                        </Button>
                        <Button
                            rounded
                            className='h-10 bg-primary text-white'
                            onClick={handleClear}
                        >
                            Xóa
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

function ProductList({ className, data }) {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [rowDatas, setRowDatas] = useState([]);
    const [open, setOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    const handleClose = () => {
        setOpen(false);
        setSelectedItem(null);
    };

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
            <UpdateItemForm
                open={open}
                onClose={handleClose}
                item={selectedItem}
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
                                        className='hover:cursor-pointer'
                                        onClick={() => {
                                            setSelectedItem(items[index]);
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

ProductList.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
};

UpdateItemForm.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    item: PropTypes.object,
};

export default ProductList;
