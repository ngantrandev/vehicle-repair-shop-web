import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import { useNavigate } from 'react-router-dom';

import adminBookingService from '../../../../services/admin.bookingService';
import configs from '../../../../configs';
import Item from './Item';
import ArrowFilterIcon from '../../../../assets/icon/ArrowFilterIcon';

function BookingMagager() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const [isSortedByDate, setIsSortedByDate] = useState(false);

    const handleClickDetail = (booking) => {
        navigate(`/users/${booking.user?.id}/bookings/${booking.id}`, {
            state: { from: window.location.pathname },
        });
    };

    const handleSortByDate = () => {
        // sort by date
        if (isSortedByDate) {
            setBookings((prevBookings) => {
                return prevBookings.sort((a, b) => {
                    return new Date(a.created_at) - new Date(b.created_at);
                });
            });
        } else {
            setBookings((prevBookings) => {
                return prevBookings.sort((a, b) => {
                    return new Date(b.created_at) - new Date(a.created_at);
                });
            });
        }

        setIsSortedByDate(!isSortedByDate);
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
        <div className='flex w-full flex-col items-center px-0 md:px-4'>
            <h1 className='py-10 text-center text-3xl font-bold'>
                Danh sách lịch hẹn của khách
            </h1>
            <div className='m-5 w-max bg-white md:w-full'>
                <div className='left-0 top-0 -translate-y-full'></div>
                <table className='w-full table-auto border-collapse border-2 border-primary-light p-8'>
                    <thead className='h-8 bg-primary-supper-light'>
                        <tr className='text-left'>
                            <th>Khách hàng</th>
                            <th className='flex items-center justify-center'>
                                Dịch vụ
                            </th>
                            <th>SDT khách</th>
                            <th className='flex items-center justify-center'>
                                <p>Ngày tạo</p>
                                <ArrowFilterIcon
                                    className={
                                        'h-6 w-6 hover:cursor-pointer hover:text-white active:text-primary-dark'
                                    }
                                    onClick={handleSortByDate}
                                />
                            </th>
                            <th>Ghi chú</th>
                            <th className='flex items-center justify-center'>
                                <p>Trạng thái</p>
                            </th>
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
