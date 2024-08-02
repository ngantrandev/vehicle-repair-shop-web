import { useEffect, useState } from 'react';

import adminBookingService from '../../../../services/admin.bookingService';
import configs from '../../../../configs';
import Item from './Item';
import Tippy from '@tippyjs/react';
import { useNavigate } from 'react-router-dom';

function BookingMagager() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    const handleClickDetail = (booking) => {
        navigate(`/users/${booking.user?.id}/bookings/${booking.id}`, {
            state: { from: window.location.pathname },
        });
    };

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
    return (
        <div className='flex w-full flex-col'>
            <h1 className='py-10 text-center text-3xl font-bold'>
                Danh sách lịch hẹn của khách
            </h1>
            <div className='relative m-5 border-collapse overflow-x-auto border-2 shadow-md sm:rounded-lg'>
                <table className='w-full table-auto'>
                    <thead className='h-8 border-y-2 bg-primary-supper-light'>
                        <tr className='text-left'>
                            <th>Khách hàng</th>
                            <th>Dịch vụ</th>
                            <th>SDT khách</th>
                            <th>Ngày tạo</th>
                            <th>Ghi chú</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => {
                            return (
                                <Tippy
                                    key={index}
                                    content='Xem chi tiết'
                                    animation='fade'
                                    hideOnClick={false}
                                >
                                    <Item
                                        data={booking}
                                        className={
                                            'hover:cursor-pointer hover:bg-gray-200'
                                        }
                                        onClick={() =>
                                            handleClickDetail(booking)
                                        }
                                    />
                                </Tippy>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

BookingMagager.propTypes = {};

export default BookingMagager;
