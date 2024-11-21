import { useEffect, useState } from 'react';

import bookingService from '@/src/services/bookingService';
import configs from '@/src/configs';

import useUser from '@/src/hooks/useUser';
import Paginateditems from '@/src/components/paginateditems';
import ListTask from './ListTask';

function MyTasks() {
    const [bookings, setBookings] = useState([]);

    const { user } = useUser();

    useEffect(() => {
        try {
            if (!user?.isLoggedin) {
                return;
            }

            const fetchTask = async () => {
                try {
                    const res = await bookingService.getAllBookingsOfStaff(
                        user?.data?.id
                    );

                    if (!res) {
                        return;
                    }

                    if (res.status !== configs.STATUS_CODE.OK) {
                        return;
                    }

                    const resData = res.data;

                    setBookings(resData.data);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchTask();
        } catch (error) {
            console.log(error);
        }
    }, [user?.data?.id, user?.isLoggedin]);

    return (
        <div className='flex w-full flex-col'>
            <h1 className='mt-4 text-center text-3xl font-bold'>
                Danh sách nhiệm vụ
            </h1>

            <Paginateditems data={bookings} itemsPerPage={6} size={8}>
                <ListTask className='relative m-5 border-collapse overflow-x-auto border-2 shadow-md sm:rounded-lg' />
            </Paginateditems>
        </div>
    );
}

MyTasks.propTypes = {};

export default MyTasks;
