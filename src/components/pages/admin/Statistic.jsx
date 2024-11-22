import { BarChart, PieChart } from '@mui/x-charts';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@mui/material';
import { CSVLink } from 'react-csv';
import bookingsService from '@/src/services/bookingService';
import serviceService from '@/src/services/serviceService';
import statisticsService from '@/src/services/statisticService';
import ultils from '@/src/ultils/ultils';
import BookingList from '@/src/components/pages/admin/Booking/BookingList';
import configs from '@/src/configs';
import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';

const { RangePicker } = DatePicker;

const actionButtons = [
    {
        title: 'Ngày',
        mode: 'day',
    },
    {
        title: 'Tháng',
        mode: 'month',
    },
    {
        title: 'Năm',
        mode: 'year',
    },
];

const FamousServiceComponent = ({ className }) => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await serviceService.getListTopService();
                const resData = data?.data;
                const services = resData?.data;

                setServices(services);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={`mx-5 pb-5 ${className}`}>
            <div className='flex h-[56px] items-center justify-between'>
                <h2 className='font-bold'>Dịch vụ được yêu thích</h2>
                <div className='flex gap-2 hover:cursor-pointer'></div>
            </div>
            <div className='flex h-52 flex-col gap-5 overflow-auto border-t-2 border-blue-200'>
                {services.map((service) => (
                    <div
                        key={service.id}
                        className='flex flex-1 hover:cursor-pointer'
                    >
                        <div className='size-16'>
                            <img
                                src={ultils.getFormatedImageUrl(
                                    service.image_url
                                )}
                                alt={service.name}
                                className='h-full w-full rounded-md object-cover'
                            />
                        </div>
                        <div className='ml-2 flex-1'>
                            <Link
                                to={`/services/${service.id}/`}
                                state={{
                                    data: service,
                                    from: window.location.pathname,
                                }}
                            >
                                <p className='hover:text-primary'>
                                    {service.name}
                                </p>
                            </Link>
                            <p>{ultils.getCurrencyFormat(service.price)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PercentComponent = ({ className, percents }) => {
    return (
        <div className={className}>
            <div className='mx-4 flex h-[56px] items-center justify-between'>
                <h2 className='font-bold'>Tỉ lệ hoàn thành</h2>
            </div>
            <div className={`flex border-t-2 border-blue-200`}>
                <PieChart
                    height={200}
                    width={400}
                    series={[
                        {
                            data: [
                                {
                                    id: 0,
                                    value: percents.done,
                                    label: 'Hoàn thành',
                                    color: '#00C3F8',
                                },
                                {
                                    id: 1,
                                    value: percents.cancel,
                                    label: 'Đã hủy',
                                    color: 'red',
                                },
                                {
                                    id: 2,
                                    value: percents.pending,
                                    label: 'Đang xử lý',
                                    color: 'orange',
                                },
                            ],
                            valueFormatter: (v) => {
                                return `${v.data} %`;
                            },
                            arcLabel: (item) => `${item.value}%`,
                            arcLabelMinAngle: 35,
                            arcLabelRadius: '60%',
                        },
                    ]}
                />
            </div>
        </div>
    );
};

const ExportReport = ({ bookings }) => {
    const csvData = bookings.reduce((acc, booking) => {
        const data = {
            'Mã lịch hẹn': booking.id,
            'Tên khách hàng':
                booking.user.lastname + ' ' + booking.user.firstname,
            'Dich vụ': booking.service.name,
            'Phí dịch vụ': booking.service.price,
            'Ngày đặt': booking.created_at.toString(),
            'Địa chỉ khách hàng':
                booking.address.address_name +
                ' ' +
                booking.address.fulladdress,
            'Trạng thái': booking.status,
        };

        acc.push(data);

        return acc;
    }, []);

    const fileName = `report_${dayjs().format('YYYY-MM-DD')}.csv`;

    return (
        <div>
            <div className='mt-3'>
                <Button variant='contained'>
                    <CSVLink data={csvData} filename={fileName}>
                        Xuất báo cáo
                    </CSVLink>
                </Button>
            </div>
        </div>
    );
};

const RevenueComponent = ({ className, onTotalRevenueChange }) => {
    const [timeRange, setTimeRange] = useState(null);
    const [selectedMode, setSelectedMode] = useState('month');

    const handleChangeTime = (value) => {
        setTimeRange(value);
    };

    const [pData, setPData] = useState([]);
    const [xLabels, setXLabels] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let startDate = null;
            let endDate = null;
            if (timeRange) {
                startDate = dayjs(timeRange[0]).format('YYYY-MM-DD');
                endDate = dayjs(timeRange[1]).format('YYYY-MM-DD');
            }
            try {
                const data = await statisticsService.getRevenue({
                    start_date: startDate,
                    end_date: endDate,
                    mode: selectedMode,
                });
                const resData = data?.data;

                const revenues = resData?.data;

                setPData([]);
                setXLabels([]);

                const newPData = [];
                const newXLabels = [];
                let total = 0;

                revenues.map(({ date, revenue }) => {
                    newPData.push(revenue);
                    newXLabels.push(date);
                    total += revenue;
                });

                setPData(newPData);
                setXLabels(newXLabels);
                onTotalRevenueChange(total);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [selectedMode, timeRange, onTotalRevenueChange]);

    return (
        <div className={`mx-5 ${className}`}>
            <div className='flex h-[56px] items-center justify-between'>
                <h2 className='font-bold'>Biểu đồ doanh thu</h2>
                <div className='flex gap-2 hover:cursor-pointer'>
                    <RangePicker
                        value={timeRange}
                        onChange={handleChangeTime}
                        placeholder={['Từ ngày', 'Đến ngày']}
                    />

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
            <div className={`flex border-t-2 border-blue-200`}>
                <BarChart
                    width={700}
                    height={200}
                    className='rounded-lg'
                    series={[
                        {
                            data: pData,
                            label: 'Doanh thu',
                            valueFormatter: (v) => {
                                return ultils.getCurrencyFormat(v);
                            },
                        },
                    ]}
                    xAxis={[
                        {
                            scaleType: 'band',
                            data: xLabels,
                        },
                    ]}
                    slotProps={{
                        loadingOverlay: { message: 'Đang tải dữ liệu...' },

                        noDataOverlay: { message: 'Không có dữ liệu' },
                    }}
                />
            </div>
        </div>
    );
};

export default function Statistic() {
    const [bookings, setBookings] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [percents, setPercents] = useState({});
    const [todayBookings, setTodayBookings] = useState([]);
    const [pendingBookings, setPendingBookings] = useState([]);

    const { setBreadcrumbsData } = useBreadcrumbs();

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Dashboard',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.services,
                label: 'Danh sách dịch vụ',
            },
        ]);
    }, [setBreadcrumbsData]);

    useEffect(() => {
        const fetchTodayBooking = async () => {
            try {
                const date = dayjs().format('YYYY-MM-DD');
                const data = await bookingsService.getAllBookings({
                    start_date: date,
                    end_date: date,
                });
                const resData = data?.data;
                const todayBooking = resData?.data;

                setTodayBookings(todayBooking);
            } catch (error) {
                console.log(error);
            }
        };

        fetchTodayBooking();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await bookingsService.getAllBookings();
                const resData = data?.data;
                const bookings = resData?.data;

                setBookings(bookings);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const pendingBookings = [];
        bookings.map((booking) => {
            if (
                booking.status != 'done' &&
                booking.status != configs.BOOKING_STATE.cancelled
            ) {
                pendingBookings.push(booking);
            }
        });

        setPendingBookings(pendingBookings);
    }, [bookings]);

    useEffect(() => {
        const doneBookingPrice = [];
        const cancelBookingPrice = [];
        const pendingBookingPrice = [];

        bookings.map((booking) => {
            if (booking.status === 'done') {
                doneBookingPrice.push(booking?.service?.price);
            } else if (booking.status === 'canceled') {
                cancelBookingPrice.push(booking?.service?.price);
            } else {
                pendingBookingPrice.push(booking?.service?.price);
            }
        });

        const donePercent =
            Math.round(
                (doneBookingPrice.length / bookings.length) * 100 * 100
            ) / 100;
        const cancelPercent =
            Math.round(
                (cancelBookingPrice.length / bookings.length) * 100 * 100
            ) / 100;
        const pendingPercent =
            Math.round((100 - donePercent - cancelPercent) * 100) / 100;

        setPercents({
            done: donePercent,
            cancel: cancelPercent,
            pending: pendingPercent,
        });
    }, [bookings]);

    const handleOnTotalRevenueChange = useCallback((total) => {
        setTotalPrice(total);
    }, []);

    return (
        <div className='flex-1 bg-[#f1f1ee] px-4'>
            <div className='flex w-full flex-col justify-center py-5'>
                <Breadcrumbs />
            </div>

            <div className='grid w-full grid-cols-12 grid-rows-3 gap-4'>
                <div className='col-span-3 row-span-1 flex rounded-lg bg-white p-4'>
                    <div className='flex h-full flex-col justify-center gap-1'>
                        <p className='opacity-80'>Tổng doanh thu</p>
                        <p className='text-xl font-bold'>
                            {ultils.getCurrencyFormat(totalPrice)}
                        </p>
                    </div>
                </div>
                <div className='col-span-3 row-span-1 rounded-lg bg-white p-4'>
                    <div className='flex h-full flex-col justify-center gap-1'>
                        <p className='opacity-80'>Tổng lịch hẹn</p>
                        <p className='text-xl font-bold'>{bookings.length}</p>
                    </div>
                </div>
                <div className='col-span-3 row-span-1 rounded-lg bg-white p-4'>
                    <div className='flex h-full flex-col justify-center gap-2'>
                        <p className='opacity-80'>Lịch hẹn hôm nay</p>
                        <p className='font-bold'>{todayBookings.length}</p>
                    </div>
                </div>
                <div className='col-span-3 row-span-1 rounded-lg bg-white p-4'>
                    <div className='flex h-full flex-col justify-center gap-2'>
                        <p className='opacity-80'>Tổng lịch hẹn đang xử lý</p>
                        <p className='font-bold'>{pendingBookings.length}</p>
                    </div>
                </div>
                <div className='col-span-12 row-span-2 grid grid-cols-12 gap-4'>
                    <div className='col-span-8 rounded-lg bg-white'>
                        <RevenueComponent
                            className='h-full'
                            onTotalRevenueChange={handleOnTotalRevenueChange}
                        />
                    </div>
                    <div className='col-span-4 rounded-lg bg-white pb-2'>
                        {/* <FamousServiceComponent className='h-full' /> */}
                        <PercentComponent className='' percents={percents} />
                    </div>
                </div>
            </div>

            <ExportReport bookings={bookings} />

            <div className='mt-5 rounded-xl bg-white p-4'>
                <h2 className='mb-4 text-xl font-bold'>Lịch hẹn gần đây</h2>
                <BookingList data={pendingBookings} />
            </div>
        </div>
    );
}

RevenueComponent.propTypes = {
    className: PropTypes.string,
    onTotalRevenueChange: PropTypes.func,
};

FamousServiceComponent.propTypes = {
    className: PropTypes.string,
};

PercentComponent.propTypes = {
    className: PropTypes.string,
    percents: PropTypes.object,
};

ExportReport.propTypes = {
    bookings: PropTypes.array,
};
