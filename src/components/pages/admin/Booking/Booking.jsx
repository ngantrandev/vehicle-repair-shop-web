import { useCallback, useEffect, useState } from 'react';

import adminBookingService from '@/src/services/admin.bookingService';
import configs from '@/src/configs';
import BookingList from './BookingList';
import Button from '@/src/components/button';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';

import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import Input from '@/src/components/input/Input';
import loadData from '@/src/services/loadData';

const bookingStates = [
    {
        value: configs.BOOKING_STATE.pending,
        label: 'Chờ xác nhận',
    },
    {
        value: configs.BOOKING_STATE.done,
        label: 'Hoàn thành',
    },
    {
        value: configs.BOOKING_STATE.fixing,
        label: 'Đang sửa chữa',
    },
    {
        value: configs.BOOKING_STATE.cancelled,
        label: 'Đã hủy',
    },
    {
        value: configs.BOOKING_STATE.accepted,
        label: 'Chuẩn bị sửa',
    },
];

function BookingMagager() {
    const [bookings, setBookings] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [stations, setStations] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const { setBreadcrumbsData } = useBreadcrumbs();

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Home',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.services,
                label: 'Danh sách lịch hẹn',
            },
        ]);
    }, [setBreadcrumbsData]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                getBookings({
                    search: searchInput,
                });
            }
        },
        [searchInput]
    );

    const handleSearchInputChange = useCallback((e) => {
        setSearchInput(e.target.value);
    }, []);

    const getBookings = useCallback(async (params) => {
        try {
            const res = await adminBookingService.getAllBooking(params);

            if (res.status == configs.STATUS_CODE.OK) {
                const resData = res.data;

                setBookings(resData.data);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stationsRes = await loadData.getListServiceStation();

                await getBookings({});

                if (stationsRes.status == configs.STATUS_CODE.OK) {
                    setStations(stationsRes.data.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const exportData = bookings.reduce((acc, booking, index) => {
            const { user, service, address } = booking;

            const data = {
                STT: index + 1,
                'Tên khách hàng': user.lastname + ' ' + user.firstname,
                'Mã khách hàng': user.id,
                'Tên dịch vụ': service.name,
                'Mã dịch vụ': service.id,
                'Số điện thoại': '' + user.phone,
                'Ngày tạo': '' + dayjs(booking.created_at).format('DD/MM/YYYY'),
                'Ghi chú': booking.note,
                'Trạng thái':
                    booking.status === configs.BOOKING_STATE.pending
                        ? 'Chờ xác nhận'
                        : booking.status === configs.BOOKING_STATE.done
                          ? 'Hoàn thành'
                          : booking.status === configs.BOOKING_STATE.fixing
                            ? 'Đang sửa chữa'
                            : booking.status === configs.BOOKING_STATE.cancelled
                              ? 'Đã hủy'
                              : 'Chuẩn bị sửa',
                'Địa chỉ': address?.address_name + ' ' + address?.full_address,
            };

            acc.push(data);

            return acc;
        }, []);

        setCsvData(exportData);
    }, [bookings]);

    const fileName = `booking_list_${dayjs().format('YYYY-MM-DD')}.csv`;

    return (
        <div className='flex h-full flex-1 flex-col items-center bg-white px-0 md:px-4'>
            <div className='flex w-full justify-between py-5'>
                <Breadcrumbs />

                <Button rounded className='h-10'>
                    <CSVLink data={csvData} filename={fileName}>
                        Xuất excel
                    </CSVLink>
                </Button>
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
                                value={searchInput}
                                onChange={handleSearchInputChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <Button
                            rounded
                            className='h-full'
                            onClick={() => {
                                getBookings({
                                    search: searchInput,
                                });
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </div>

                    <div className='col-span-2 col-start-1 flex flex-col'>
                        <label htmlFor='time'>Sắp xếp theo thời gian</label>
                        <select
                            name=''
                            id='time'
                            className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                            onChange={async (e) => {
                                await getBookings({
                                    sort: e.target.value,
                                });
                            }}
                        >
                            <option value='desc'>Mới nhất</option>
                            <option value='asc'>Cũ nhất</option>
                        </select>
                    </div>
                    <div className='col-span-2 flex flex-col'>
                        <label htmlFor='state'>Sắp xếp theo trạng thái</label>
                        <select
                            name=''
                            id='state'
                            className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                            onChange={async (e) => {
                                await getBookings({
                                    status: e.target.value,
                                });
                            }}
                        >
                            <option value=''>Tất cả</option>
                            {bookingStates.map((state) => (
                                <option key={state.value} value={state.value}>
                                    {state.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='col-span-2 col-start-1 flex flex-col'>
                        <label htmlFor='station'>Chi nhánh</label>
                        <select
                            name='station'
                            id='station'
                            className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                            onChange={async (e) => {
                                await getBookings({
                                    station: e.target.value,
                                });
                            }}
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

            <BookingList
                data={bookings}
                className={
                    'w-full flex-1 border-collapse overflow-x-auto bg-white md:w-full'
                }
            />
        </div>
    );
}

BookingMagager.propTypes = {};

export default BookingMagager;
