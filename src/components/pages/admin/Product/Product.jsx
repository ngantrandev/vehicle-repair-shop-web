import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import Button from '@/src/components/button';
import Input from '@/src/components/input/Input';
import ProductList from '@/src/components/pages/admin/Product/ProductList';
import configs from '@/src/configs';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import itemsService from '@/src/services/itemsService';
import statisticsService from '@/src/services/statisticService';
import ultils from '@/src/ultils';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import { Box, Modal } from '@mui/material';
import {
    BarPlot,
    ChartsGrid,
    ChartsTooltip,
    ChartsXAxis,
    ChartsYAxis,
    LinePlot,
    MarkPlot,
    ResponsiveChartContainer,
} from '@mui/x-charts';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const actionButtons = [
    {
        title: 'Tháng trước',
        mode: 'previous_month',
    },
    {
        title: 'Tháng này',
        mode: 'current_month',
    },
    {
        title: 'Năm nay',
        mode: 'current_year',
    },
];

const CreateItemForm = ({ open, onClose }) => {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');

    const handleClear = () => {
        setDescription('');
        setItemName('');
    };

    const handleCreateItem = async () => {
        if (itemName.trim() === '') {
            ultils.notifyError('Vui lòng nhập tên sản phẩm');
            return;
        }

        /**create item */
        const data = {
            name: itemName,
            description: description,
        };

        try {
            const res = await itemsService.createItem(data);

            if (res.status == configs.STATUS_CODE.OK) {
                ultils.notifySuccess('Tạo sản phẩm thành công');
                handleClear();
            } else {
                ultils.notifyError('Tạo sản phẩm thất bại');
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
                    Thêm mới sản phẩm
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
                            onClick={handleCreateItem}
                        >
                            Thêm mới
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

const RevenueComponent = ({ className }) => {
    const [selectedMode, setSelectedMode] = useState('current_month');

    const [xLabels, setXLabels] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [revenues, setRevenues] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await statisticsService.getTopItems({
                    mode: selectedMode,
                });
                const resData = data?.data;

                const topItemsData = resData?.data;

                setXLabels([]);

                const newPData = [];
                const newXLabels = [];

                const newQuantities = [];
                const newRevenue = [];

                topItemsData.forEach((item) => {
                    const { name, total_output, total_price } = item;

                    newQuantities.push(total_output);
                    newRevenue.push(total_price);

                    newPData.push(total_output);
                    newXLabels.push(name);
                });

                setQuantities(newQuantities);
                setRevenues(newRevenue);
                setXLabels(newXLabels);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [selectedMode]);

    return (
        <div className={`w-full ${className}`}>
            <div className='flex h-[56px] items-center justify-between px-4'>
                <h2 className='font-bold'>Thống kê số lượng xuất (Top 5)</h2>
                <div className='flex gap-2 hover:cursor-pointer'>
                    {actionButtons.map(({ title, mode }, index) => {
                        return (
                            <p
                                key={index}
                                className={`rounded-lg border-2 p-1 px-2 text-center ${mode === selectedMode ? 'border-0 bg-primary text-white' : ''}`}
                                onClick={() => setSelectedMode(mode)}
                            >
                                {title}
                            </p>
                        );
                    })}
                </div>
            </div>
            <div className={`flex w-full border-t-2 border-blue-200`}>
                {revenues.length == 0 || quantities.length == 0 ? (
                    <Box className='flex h-96 w-full items-center justify-center'>
                        Không có dữ liệu
                    </Box>
                ) : (
                    <Box sx={{ width: '100%', maxWidth: 600, maxHeight: 400 }}>
                        <ResponsiveChartContainer
                            xAxis={[
                                {
                                    scaleType: 'band',
                                    data: xLabels, // Tên các phụ tùng
                                    id: 'items',
                                    label: 'Items',
                                    valueFormatter: (value) => {
                                        return value;
                                    },
                                },
                            ]}
                            yAxis={[{ id: 'money' }, { id: 'quantities' }]}
                            series={[
                                {
                                    type: 'bar',
                                    id: 'quantities',
                                    yAxisId: 'quantities',
                                    data: quantities, // Số lượng xuất
                                    label: 'Số lượng xuất',
                                    valueFormatter: (value) => {
                                        return value + ' SP';
                                    },
                                },
                                {
                                    type: 'line',
                                    id: 'revenue',
                                    yAxisId: 'money',
                                    data: revenues, // Doanh thu
                                    color: 'red',
                                    curve: 'linear',
                                    label: 'Doanh thu',
                                    valueFormatter: (value) => {
                                        return ultils.getCurrencyFormat(value);
                                    },
                                },
                            ]}
                            height={400}
                            margin={{ left: 70, right: 70 }}
                            sx={{
                                [`.${axisClasses.left} .${axisClasses.label}`]:
                                    {
                                        transform: 'translate(-25px, 0)',
                                    },
                                [`.${axisClasses.right} .${axisClasses.label}`]:
                                    {
                                        transform: 'translate(30px, 0)',
                                    },
                            }}
                        >
                            <ChartsGrid horizontal />
                            <BarPlot
                                slotProps={{
                                    loadingOverlay: {
                                        message: 'Đang tải dữ liệu...',
                                    },

                                    noDataOverlay: {
                                        message: 'Không có dữ liệu',
                                    },
                                }}
                                barLabel={(item) => {
                                    return item.value + ' SP';
                                }}
                            />
                            <MarkPlot />
                            <LinePlot />
                            <ChartsXAxis
                                axisId='items'
                                label='Thống kê số lương xuất và doanh thu'
                                labelFontSize={18}
                            />
                            <ChartsYAxis
                                axisId='quantities'
                                label='Số lượng xuất'
                                sx={{ stroke: '#02B2AF' }}
                            />
                            <ChartsYAxis
                                axisId='money'
                                position='right'
                                sx={{ stroke: 'red' }}
                                stroke='red'
                                labelStyle={{ fill: 'red', color: 'red' }}
                                label='Doanh thu'
                            />
                            <ChartsTooltip />
                        </ResponsiveChartContainer>
                    </Box>
                )}
            </div>
        </div>
    );
};

function Product() {
    const [items, setItems] = useState([]);
    // const [csvData, setCsvData] = useState([]);
    const [filtedItems, setFiltedItems] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [conhang, setConhang] = useState('');
    const [slxuat, setSlxuat] = useState('');

    const { setBreadcrumbsData } = useBreadcrumbs();

    const [openCreateItemForm, setOpenCreateItemForm] = useState(false);

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
            if (item.name.toLowerCase().includes(searchValue)) {
                return item;
            }
        });

        setFiltedItems(filterData);
    }, [searchValue, items]);

    useEffect(() => {
        try {
            const res = itemsService.getAllItems();

            if (res.status !== configs.STATUS_CODE.OK) {
                return;
            }

            const resData = res.data;

            setItems(resData.data);

            setFiltedItems(resData.data);
        } catch (error) {
            console.log(error);
        }
    }, []);

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

    return (
        <div className='flex h-full flex-1 flex-col bg-white px-0 md:px-4'>
            <CreateItemForm
                open={openCreateItemForm}
                onClose={() => setOpenCreateItemForm(false)}
            />
            <div className='flex w-full justify-between py-5'>
                <Breadcrumbs />

                <Button
                    rounded
                    className='h-10'
                    onClick={() => setOpenCreateItemForm(true)}
                >
                    <svg
                        fill='currentColor'
                        className='w-6'
                        id='Layer_1'
                        version='1.1'
                        viewBox='0 0 512 512'
                        width='512px'
                        xmlSpace='preserve'
                        xmlns='http://www.w3.org/2000/svg'
                        xmlnsXlink='http://www.w3.org/1999/xlink'
                    >
                        <path d='M417.4,224H288V94.6c0-16.9-14.3-30.6-32-30.6c-17.7,0-32,13.7-32,30.6V224H94.6C77.7,224,64,238.3,64,256  c0,17.7,13.7,32,30.6,32H224v129.4c0,16.9,14.3,30.6,32,30.6c17.7,0,32-13.7,32-30.6V288h129.4c16.9,0,30.6-14.3,30.6-32  C448,238.3,434.3,224,417.4,224z' />
                    </svg>
                    <span>Thêm mới</span>
                </Button>
            </div>

            <div className='mb-8 flex w-full gap-4'>
                <div className='flex-1 overflow-hidden rounded-2xl pt-0 shadow-[rgba(0,5,0,0.15)_1px_1px_60px_1px]'>
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
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
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

                        <div className='col-span-3 col-start-1 flex flex-col'>
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
                        <div className='col-span-3 flex flex-col'>
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
                    </div>
                </div>

                <div className='w-1/2'>
                    <RevenueComponent className='overflow-hidden rounded-2xl pt-0 shadow-[rgba(0,5,0,0.15)_1px_1px_60px_1px]' />
                </div>
            </div>

            <ProductList
                data={filtedItems}
                className='w-full flex-1 border-collapse overflow-x-auto md:w-full'
            />
        </div>
    );
}

RevenueComponent.propTypes = {
    className: PropTypes.string,
    onTotalRevenueChange: PropTypes.func,
};

CreateItemForm.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
};

export default Product;
