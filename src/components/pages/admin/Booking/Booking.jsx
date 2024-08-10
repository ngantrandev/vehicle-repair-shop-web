import { useEffect, useState } from 'react';

import adminBookingService from '../../../../services/admin.bookingService';
import configs from '../../../../configs';
import Paginateditems from '../../../paginateditems';
import BookingList from './BookingList';

function BookingMagager() {
    const [bookings, setBookings] = useState([]);

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

                <Paginateditems data={bookings} itemsPerPage={5} size={8}>
                    <BookingList
                        className={
                            'w-full table-auto border-collapse border-2 border-primary-light p-8'
                        }
                    />
                </Paginateditems>
            </div>
        </div>
    );
}

BookingMagager.propTypes = {};

export default BookingMagager;
