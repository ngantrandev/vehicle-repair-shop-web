import { useEffect, useState } from 'react';

import bookingService from '../../../services/bookingService.js';
import useUser from '../../../hooks/useUser.js';
import BookingList from './BookingList.jsx';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                if (!user?.isLoggedin) {
                    return;
                }

                const res = await bookingService.getAllBookings();

                setBookings(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchBookings();
    }, [user?.data?.id, user?.isLoggedin]);
    return (
        <div className='flex flex-1 flex-col items-center px-0 md:px-10'>
            <div className='flex w-full justify-between py-10'>
                <h1 className='text-center text-3xl font-bold w-full'>
                    Danh sách lịch hẹn
                </h1>
            </div>

            <BookingList
                data={bookings}
                className='w-full flex-1 border-collapse overflow-x-auto md:w-full'
            />
        </div>
    );
}

MyBookings.propTypes = {};

export default MyBookings;
