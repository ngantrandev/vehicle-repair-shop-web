import { useEffect, useState } from 'react';

import adminBookingService from '@/src/services/admin.bookingService';
import configs from '@/src/configs';
import BookingList from './BookingList';
import Button from '@/src/components/button';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';

import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';

function BookingMagager() {
    const [bookings, setBookings] = useState([]);
    const [csvData, setCsvData] = useState([]);

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
                label: 'Danh sách lịch hẹn',
            },
        ]);
    }, [setBreadcrumbsData]);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await adminBookingService.getAllBooking();

                if (res.status !== configs.STATUS_CODE.OK) {
                    throw new Error(res.data.message);
                }

                const resData = res.data;

                setBookings(resData.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchBooking();
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

            <BookingList
                data={bookings}
                className={
                    'w-full flex-1 border-collapse overflow-x-auto md:w-full'
                }
            />
        </div>
    );
}

BookingMagager.propTypes = {};

export default BookingMagager;
