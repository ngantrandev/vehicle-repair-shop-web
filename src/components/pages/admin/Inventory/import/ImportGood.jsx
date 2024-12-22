import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import Button from '@/src/components/button';
import Input from '@/src/components/input/Input';
import configs from '@/src/configs';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import adminInventoryService from '@/src/services/admin.inventories.service';
import itemsService from '@/src/services/itemsService';
import ultils from '@/src/ultils';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function ImportGood() {
    const { setBreadcrumbsData } = useBreadcrumbs();
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedImportItem, setSelectedImportItem] = useState(null);
    const [importItems, setImportItems] = useState([]);

    const [count, setCount] = useState(0);
    const [inputPrice, setInputPrice] = useState(0);
    const [outputPrice, setOutputPrice] = useState(0);

    // Giả lập dữ liệu (thay thế bằng dữ liệu thực từ API)
    useEffect(() => {
        const getItems = async () => {
            const res = await itemsService.getAllItems();

            if (res.status == configs.STATUS_CODE.OK) {
                const resData = res.data;

                setItems(resData.data);
            }
        };

        getItems();
    }, []);

    const totalMoney = useMemo(() => {
        return importItems.reduce((total, item) => {
            return total + item.count * item.inputPrice;
        }, 0);
    }, [importItems]);

    const handleAddItem = useCallback(() => {
        if (!selectedItem) {
            ultils.notifyError('Vui lòng chọn phụ tùng');
            return;
        }

        if (!count || count == 0) {
            ultils.notifyError('Vui lòng nhập số lượng');
            return;
        }

        if (!inputPrice || inputPrice == 0) {
            ultils.notifyError('Vui lòng nhập giá nhập vào');
            return;
        }

        if (!outputPrice || outputPrice == 0) {
            ultils.notifyError('Vui lòng nhập giá bán ra');
            return;
        }

        let flag = false;
        importItems.forEach((item) => {
            if (item.item.id == selectedItem.id) {
                flag = true;
                return;
            }
        });

        if (flag) {
            ultils.notifyError('Phụ tùng đã tồn tại trong danh sách nhập hàng');
            return;
        }

        const newItem = {
            item: selectedItem,
            count: count,
            inputPrice: inputPrice,
            outputPrice: outputPrice,
        };

        setImportItems([...importItems, newItem]);
    }, [count, inputPrice, outputPrice, selectedItem, importItems]);

    const handleDeleteItem = useCallback(() => {
        if (!selectedImportItem) {
            ultils.notifyError('Vui lòng chọn phụ tùng cần xóa');
            return;
        }

        const newImportItems = importItems.filter(
            (item) => item.item.id != selectedImportItem.id
        );

        setImportItems(newImportItems);
    }, [importItems, selectedImportItem]);

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Home',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.services,
                label: 'Nhập hàng',
            },
        ]);
    }, [setBreadcrumbsData]);

    const handleImport = useCallback(() => {
        const importGoods = async () => {
            try {
                if (importItems.length == 0) {
                    ultils.notifyError('Vui lòng chọn ít nhất một phụ tùng');
                    return;
                }

                const data = importItems.map(
                    ({ item, count, inputPrice, outputPrice }) => {
                        return {
                            item_id: item.id,
                            count,
                            input_price: inputPrice,
                            output_price: outputPrice,
                        };
                    }
                );

                const res = await adminInventoryService.importGoods(data);

                if (res.status == configs.STATUS_CODE.OK) {
                    ultils.notifySuccess('Nhập hàng thành công');
                    setImportItems([]);
                } else {
                    ultils.notifyError('Nhập hàng thất bại');
                }
            } catch (error) {
                console.log(error);
            }
        };

        importGoods();
    }, [importItems]);

    return (
        <div className='relative flex h-full flex-1 flex-col items-center bg-white px-0 md:px-4'>
            <div className='flex w-full justify-between py-5'>
                <Breadcrumbs />
            </div>
            <div className='grid w-full flex-1 grid-cols-2 gap-8'>
                <div className='flex flex-col pb-5'>
                    <div className='flex flex-1 flex-col'>
                        <div
                            className='overflow-y-auto'
                            style={{ maxHeight: '400px' }}
                        >
                            <table className='w-full table-auto border-2'>
                                <thead className='sticky top-0 z-10 bg-white'>
                                    <tr>
                                        <th className='py-2 pl-2 text-left'>
                                            STT
                                        </th>
                                        <th className='text-left'>
                                            Mã phụ tùng
                                        </th>
                                        <th className='text-left'>
                                            Tên phụ tùng
                                        </th>
                                        <th className='text-left'>
                                            Số lượng tồn
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => {
                                        const {
                                            id,
                                            name,
                                            total_input,
                                            total_output,
                                        } = item;

                                        return (
                                            <tr
                                                key={id}
                                                className={`border-b hover:cursor-pointer ${selectedItem?.id == id ? 'bg-blue-200' : ''}`}
                                                onClick={() => {
                                                    if (
                                                        selectedItem?.id == id
                                                    ) {
                                                        setSelectedItem(null);
                                                    } else {
                                                        setSelectedItem(item);
                                                    }
                                                }}
                                            >
                                                <td className='py-2 pl-2'>
                                                    {index + 1}
                                                </td>
                                                <td className='py-2'>{id}</td>
                                                <td className='max-w-60 py-2'>
                                                    {name}
                                                </td>

                                                <td className='py-2'>
                                                    {total_input - total_output}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-4'>
                        <div className='flex w-full justify-between'>
                            <div className='flex gap-2'>
                                <span>Số lượng nhập</span>
                                <Input
                                    className='h-8 w-[90px] rounded-none text-center'
                                    type='number'
                                    value={count}
                                    onChange={(e) => setCount(e.target.value)}
                                />
                            </div>
                            <div className='flex gap-2'>
                                <span>Giá nhập vào</span>
                                <Input
                                    className='h-8 w-[90px] rounded-none text-center'
                                    type='number'
                                    value={inputPrice}
                                    onChange={(e) =>
                                        setInputPrice(e.target.value)
                                    }
                                />
                            </div>
                            <div className='flex gap-2'>
                                <span>Giá bán ra</span>
                                <Input
                                    className='h-8 w-[90px] rounded-none text-center'
                                    type='number'
                                    value={outputPrice}
                                    onChange={(e) =>
                                        setOutputPrice(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <Button
                            rounded
                            className='w-20'
                            onClick={handleAddItem}
                        >
                            Thêm
                        </Button>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-center text-xl font-bold'>
                        Thông tin nhập hàng
                    </h1>
                    <div className='flex-1'>
                        <div
                            className='overflow-y-auto'
                            style={{ maxHeight: '300px' }}
                        >
                            <table className='w-full table-auto border-2'>
                                <thead className='sticky top-0 z-10 bg-white'>
                                    <tr>
                                        <th className='py-2 pl-2 text-left'>
                                            STT
                                        </th>
                                        <th className='text-left'>MPT</th>
                                        <th className='text-left'>
                                            Tên phụ tùng
                                        </th>
                                        <th className='text-left'>Số lượng</th>
                                        <th className='text-left'>Giá nhập</th>
                                        <th className='text-left'>Giá xuất</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {importItems.map(
                                        (
                                            {
                                                item,
                                                count,
                                                inputPrice,
                                                outputPrice,
                                            },
                                            index
                                        ) => (
                                            <tr
                                                key={index}
                                                className={`border-b hover:cursor-pointer ${selectedImportItem?.id == item.id ? 'bg-blue-200' : ''}`}
                                                onClick={() => {
                                                    if (
                                                        selectedImportItem?.id ==
                                                        item.id
                                                    ) {
                                                        setSelectedImportItem(
                                                            null
                                                        );
                                                    } else {
                                                        setSelectedImportItem(
                                                            item
                                                        );
                                                    }
                                                }}
                                            >
                                                <td className='py-2 pl-2'>
                                                    {index + 1}
                                                </td>
                                                <td className='py-2'>
                                                    {item.id}
                                                </td>
                                                <td className='max-w-20 py-2'>
                                                    {item.name}
                                                </td>
                                                <td className='py-2'>
                                                    {count}
                                                </td>
                                                <td className='py-2'>
                                                    {ultils.getCurrencyFormat(
                                                        inputPrice
                                                    )}
                                                </td>
                                                <td className='py-2'>
                                                    {ultils.getCurrencyFormat(
                                                        outputPrice
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='mx-20 mb-4 flex flex-col gap-8'>
                        <div className='w-full'>
                            {importItems.length > 0 && (
                                <Button
                                    outlined
                                    className='items-end'
                                    onClick={handleDeleteItem}
                                >
                                    Xóa
                                </Button>
                            )}
                        </div>
                        <div className='flex w-full items-center justify-between'>
                            <div>
                                <span>Tổng tiền</span>
                                <span className='ml-4 font-bold'>
                                    {ultils.getCurrencyFormat(totalMoney)}
                                </span>
                            </div>
                            <Button rounded onClick={handleImport}>
                                Nhập hàng
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
