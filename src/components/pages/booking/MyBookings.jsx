import { useEffect, useState } from 'react';

import Item from './Item.jsx';
import bookingService from '../../../services/bookingService.js';

function MyBookings() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));

                if (!user) {
                    console.log('User is not logged in');
                    return;
                }

                const res = await bookingService.getAllBookings(user.id);

                setBookings(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchBookings();
    }, []);
    return (
        <div>
            <h1 className='py-6 text-center text-3xl font-bold text-primary-dark'>
                Dịch vụ đã đặt
            </h1>
            <div className='relative mx-5 border-collapse overflow-x-auto border-2 shadow-md sm:rounded-lg'>
                <table className='w-full'>
                    <thead className='h-8 border-y-2 bg-primary-supper-light'>
                        <tr className='text-left'>
                            <th>Tên dịch vụ</th>
                            <th>Thời gian tạo yêu cầu</th>
                            <th>Thời gian cập nhật</th>
                            <th>Giá dịch vụ</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => {
                            return (
                                <Item
                                    key={index}
                                    data={booking}
                                    className={'hover:bg-gray-200'}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

MyBookings.propTypes = {};

export default MyBookings;
