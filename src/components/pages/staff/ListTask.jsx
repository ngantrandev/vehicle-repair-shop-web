import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';

import bookingService from '../../../services/bookingService';
import configs from '../../../configs';
import TaskItem from './TaskItem';
import { useNavigate } from 'react-router-dom';
import ultils from '../../../ultils';

function ListTask() {
    const [bookings, setBookings] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        try {
            const user = ultils.getUserDataLogedin();

            if (!user) {
                return;
            }

            const fetchTask = async () => {
                try {
                    const res = await bookingService.getAllBookingsOfStaff(
                        user.id
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
    }, []);

    const handleClickDetail = (booking) => {
        navigate(`/users/${booking.user?.id}/bookings/${booking.id}`, {
            state: { from: window.location.pathname },
        });
    };

    return (
        <div className='flex w-full flex-col'>
            <h1 className='mt-4 text-center text-3xl font-bold'>
                Danh sách nhiệm vụ
            </h1>

            <div className='relative m-5 border-collapse overflow-x-auto border-2 shadow-md sm:rounded-lg'>
                <table className='w-full table-auto'>
                    <thead className='h-8 border-y-2 bg-primary-supper-light'>
                        <tr className='text-left'>
                            <th>Tên dịch vụ</th>
                            <th>Địa chỉ sửa</th>
                            <th>SDT khách</th>
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
                                    <TaskItem
                                        data={booking}
                                        className={`h-16 border-b-2 hover:cursor-pointer hover:bg-gray-200`}
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

ListTask.propTypes = {};

export default ListTask;
