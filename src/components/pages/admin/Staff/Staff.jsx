import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
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

import configs from '@/src/configs';
import staffService from '@/src/services/staffService';

import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import Button from '@/src/components/button';
import Input from '@/src/components/input/Input';
import StaffList from '@/src/components/pages/admin/Staff/StaffList';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import loadData from '@/src/services/loadData';
import statisticsService from '@/src/services/statisticService';
import ultils from '@/src/ultils';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';

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

const RevenueComponent = ({ className }) => {
    const [selectedMode, setSelectedMode] = useState('current_year');

    const [xLabels, setXLabels] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [revenues, setRevenues] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await statisticsService.getTopStaffs({
                    mode: selectedMode,
                });
                const resData = data?.data;

                const topItemsData = resData?.data;

                const newXLabels = [];

                const newQuantities = [];
                const newRevenue = [];

                topItemsData.forEach((item) => {
                    const { fullname, total_booking, total_revenue, staff_id } =
                        item;

                    newQuantities.push(total_booking);
                    newRevenue.push(total_revenue);

                    newXLabels.push(fullname + ' MSNV: ' + staff_id);
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
                <h2 className='font-bold'>
                    Thống kê năng suất làm việc (Top 5)
                </h2>
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
                                    label: 'Nhiệm vụ hoàn thành',
                                    valueFormatter: (value) => {
                                        return value + ' nhiệm vụ';
                                    },
                                },
                                {
                                    type: 'line',
                                    id: 'revenue',
                                    yAxisId: 'money',
                                    data: revenues, // Doanh thu
                                    color: 'red',
                                    curve: 'linear',
                                    label: 'Doanh thu đem lại',
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
                                    return item.value + ' nhiệm vụ';
                                }}
                            />
                            <MarkPlot />
                            <LinePlot />
                            <ChartsXAxis
                                axisId='items'
                                label='Thống kê số lượng nhiệm vụ và doanh thu'
                                labelFontSize={18}
                            />
                            <ChartsYAxis
                                axisId='quantities'
                                label='Số lượng nhiệm vụ'
                                sx={{ stroke: '#02B2AF' }}
                            />
                            <ChartsYAxis
                                axisId='money'
                                position='right'
                                sx={{ stroke: 'red' }}
                                stroke='red'
                                labelStyle={{ fill: 'red', color: 'red' }}
                                label='Doanh thu đem lại'
                            />
                            <ChartsTooltip />
                        </ResponsiveChartContainer>
                    </Box>
                )}
            </div>
        </div>
    );
};

function Staff() {
    const [staffs, setStaffs] = useState([]);
    const [stations, setStations] = useState([]);
    // const [csvData, setCsvData] = useState([]);

    const { setBreadcrumbsData } = useBreadcrumbs();

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Home',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.staffs,
                label: 'Danh sách nhân viên',
            },
        ]);
    }, [setBreadcrumbsData]);

    useEffect(() => {
        const fetchStaffs = async () => {
            try {
                const res = await staffService.getAllStaffs();
                const resStations = await loadData.getListServiceStation();

                if (resStations.status == configs.STATUS_CODE.OK) {
                    setStations(resStations.data.data);
                }

                if (res.status == configs.STATUS_CODE.OK) {
                    const resData = res.data;

                    setStaffs(resData.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchStaffs();
    }, []);

    // useEffect(() => {
    //     const exportData = staffs.reduce((acc, user, index) => {
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
    // }, [staffs]);

    // const fileName = `user_list_${dayjs().format('YYYY-MM-DD')}.csv`;

    return (
        <div className='flex h-full flex-1 flex-col items-center bg-white px-0 md:px-4'>
            <div className='flex w-full justify-between py-5'>
                <Breadcrumbs />

                <Button rounded className='h-10'>
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
                                />
                            </div>
                            <Button rounded className='h-full'>
                                Tìm kiếm
                            </Button>
                        </div>
                        <div className='col-span-2 col-start-1 flex flex-col'>
                            <label htmlFor='time'>Ngày tạo tài khoản</label>
                            <select
                                name=''
                                id='time'
                                className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                            >
                                <option value=''>Mới nhất</option>
                                <option value=''>Cũ nhất</option>
                            </select>
                        </div>
                        <div className='col-span-2 flex flex-col'>
                            <label htmlFor='state'>
                                Sắp xếp theo trạng thái
                            </label>
                            <select
                                name=''
                                id='state'
                                className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                            >
                                <option value=''>Tất cả</option>
                                <option value=''>Hoạt động</option>
                                <option value=''>Khóa</option>
                            </select>
                        </div>
                        <div className='col-span-2 col-start-1 flex flex-col'>
                            <label htmlFor='station'>Chi nhánh</label>
                            <select
                                name='station'
                                id='station'
                                className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                            >
                                <option value=''>Tất cả</option>
                                {stations.map((station) => (
                                    <option key={station.id} value={station.id}>
                                        {station.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className='w-1/2'>
                    <RevenueComponent className='overflow-hidden rounded-2xl pt-0 shadow-[rgba(0,5,0,0.15)_1px_1px_60px_1px]' />
                </div>
            </div>

            <StaffList
                data={staffs}
                className='w-full flex-1 border-collapse overflow-x-auto md:w-full'
            />
        </div>
    );
}

RevenueComponent.propTypes = {
    className: PropTypes.string,
};

export default Staff;
