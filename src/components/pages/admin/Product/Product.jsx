import { useCallback, useEffect, useState } from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import Button from '@/src/components/button';
import Input from '@/src/components/input/Input';
import ProductList from '@/src/components/pages/admin/Product/ProductList';
import configs from '@/src/configs';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import itemsService from '@/src/services/itemsService';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import dayjs from 'dayjs';

function User() {
    const [items, setItems] = useState([]);
    // const [csvData, setCsvData] = useState([]);
    const [filtedItems, setFiltedItems] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [conhang, setConhang] = useState('');
    const [slxuat, setSlxuat] = useState('');
    const [timeRange, setTimeRange] = useState(null);

    const { setBreadcrumbsData } = useBreadcrumbs();

    useEffect(() => {
        if (conhang === '#') {
            setFiltedItems(items);
            return;
        }

        const filterData = items.filter((item) => {
            if (conhang === '1' && item.total_input - item.total_output > 0) {
                return item;
            }

            if (conhang === '0' && item.total_input - item.total_output <= 0) {
                return item;
            }
        });

        setFiltedItems(filterData);
    }, [conhang, items]);

    useEffect(() => {
        if (slxuat === '#') {
            setFiltedItems(items);
            return;
        }

        // Tạo bản sao và sắp xếp
        const sortedItems = [...items].sort((a, b) => {
            return slxuat === '1'
                ? b.total_output - a.total_output // Giảm dần
                : a.total_output - b.total_output; // Tăng dần
        });

        setFiltedItems(sortedItems);
    }, [slxuat, items]);

    useEffect(() => {
        if (searchValue.trim() === '') {
            setFiltedItems(items);
            return;
        }
    }, [searchValue, items]);

    const handleSearch = useCallback(async () => {
        if (searchValue.trim() === '') {
            setFiltedItems(items);
            return;
        }

        const filterData = items.filter((item) => {
            if (item.name.includes(searchValue)) {
                return item;
            }
        });

        setFiltedItems(filterData);
    }, [searchValue, items]);

    const handleChangeTime = (value) => {
        setTimeRange(value);
    };

    useEffect(() => {
        try {
            let startDate = null;
            let endDate = null;
            if (timeRange) {
                startDate = dayjs(timeRange[0]).format('YYYY-MM-DD');
                endDate = dayjs(timeRange[1]).format('YYYY-MM-DD');
            }

            const params = {
                start_date: startDate,
                end_date: endDate,
            };

            const res = itemsService.getAllItems(params);

            if (res.status !== configs.STATUS_CODE.OK) {
                return;
            }

            const resData = res.data;

            setItems(resData.data);

            setFiltedItems(resData.data);
        } catch (error) {
            console.log(error);
        }
    }, [timeRange]);

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Home',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.users,
                label: 'Danh sách phụ tùng',
            },
        ]);
    }, [setBreadcrumbsData]);

    useEffect(() => {
        const fetItems = async () => {
            try {
                const res = await itemsService.getAllItems();

                if (res.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                const resData = res.data;

                setItems(resData.data);
                setFiltedItems(resData.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetItems();
    }, []);

    // useEffect(() => {
    //     const exportData = items.reduce((acc, user, index) => {
    //         const data = {
    //             STT: index + 1,
    //             'Mã khách hàng': user.id,
    //             'Tên khách hàng': user.lastname + ' ' + user.firstname,
    //             Email: user.email,
    //             'Số điện thoại': '' + user.phone,
    //             'Địa chỉ':
    //                 user?.address &&
    //                 user?.address?.address_name +
    //                     ' ' +
    //                     user?.address?.full_address,
    //             'Ngày tạo': '' + ultils.getFormatedTime(user.created_at),
    //             'Trạng thái': user.active == 1 ? 'Hoạt động' : 'Khóa',
    //         };

    //         acc.push(data);

    //         return acc;
    //     }, []);

    //     setCsvData(exportData);
    // }, [items]);

    // const fileName = `user_list_${dayjs().format('YYYY-MM-DD')}.csv`;

    return (
        <div className='flex h-full flex-1 flex-col items-center bg-white px-0 md:px-4'>
            <div className='flex w-full justify-between py-5'>
                <Breadcrumbs />

                {/* <Button rounded className='h-10'>
                    <CSVLink data={csvData} filename={fileName}>
                        Xuất excel
                    </CSVLink>
                </Button> */}
            </div>

            <div className='mb-8 w-full overflow-hidden rounded-2xl pt-0 shadow-[rgba(0,5,0,0.15)_1px_1px_60px_1px]'>
                <h2 className='border-b-2 px-4 py-2 font-bold'>
                    Bộ lọc tìm kiếm
                </h2>
                <div className='grid w-full grid-cols-6 gap-4 p-8'>
                    <div className='col-span-3 flex w-full gap-2'>
                        <div className='flex-1'>
                            <Input
                                className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                                placeholder='Bạn cần tìm kiếm gì?'
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                        <Button
                            rounded
                            className='h-full'
                            onClick={handleSearch}
                        >
                            Tìm kiếm
                        </Button>
                    </div>

                    <div className='col-span-2 col-start-1 flex flex-col'>
                        <label htmlFor='state'>Tồn kho</label>
                        <select
                            name=''
                            id='state'
                            className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                            value={conhang}
                            onChange={(e) => setConhang(e.target.value)}
                        >
                            <option value='#'>Tất cả</option>
                            <option value='1'>Còn hàng</option>
                            <option value='0'>Hết hàng</option>
                            <option value='2'>Nhiều tới ít</option>
                            <option value='3'>Ít tới nhiều</option>
                        </select>
                    </div>
                    <div className='col-span-2 flex flex-col'>
                        <label htmlFor='state'>Số lượng xuất kho</label>
                        <select
                            name=''
                            id='state'
                            className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                            value={slxuat}
                            onChange={(e) => setSlxuat(e.target.value)}
                        >
                            <option value='#'>Tất cả</option>
                            <option value='1'>Nhiều nhất</option>
                            <option value='0'>Ít nhất</option>
                        </select>
                    </div>
                    <div className='col-span-2 flex flex-col'>
                        <label htmlFor='state'>Thời gian</label>
                        <RangePicker
                            className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                            value={timeRange}
                            onChange={handleChangeTime}
                            placeholder={['Từ ngày', 'Đến ngày']}
                        />
                    </div>
                </div>
            </div>

            <ProductList
                data={filtedItems}
                className='w-full flex-1 border-collapse overflow-x-auto md:w-full'
            />
        </div>
    );
}

export default User;
