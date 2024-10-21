import { useEffect, useState } from 'react';

import bookingService from '../../../services/bookingService.js';
import useUser from '../../../hooks/useUser.js';
import PaginatedItems from '../../paginateditems/PaginatedItems.jsx';
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
        <div className='mb-10 flex w-full flex-col items-center'>
            <h1 className='py-6 text-center text-3xl font-bold text-primary-dark'>
                Dịch vụ đã đặt
            </h1>
            <PaginatedItems data={bookings} itemsPerPage={6} size={8}>
                <BookingList className='relative mx-5 w-max border-collapse overflow-x-auto border-2 shadow-md sm:rounded-lg' />
            </PaginatedItems>
        </div>
    );
}

MyBookings.propTypes = {};

export default MyBookings;
