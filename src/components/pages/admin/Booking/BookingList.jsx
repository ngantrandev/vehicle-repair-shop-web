import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react';
import { useNavigate } from 'react-router-dom';

import Item from './Item';
import ArrowFilterIcon from '../../../../assets/icon/ArrowFilterIcon';

function BookingList({ className, data }) {
    const [bookings, setBookings] = useState([]);

    const [isSortedByDate, setIsSortedByDate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setBookings(data);
    }, [data]);

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

    return (
        <table className={className}>
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
                                onClick={() => handleClickDetail(booking)}
                            />
                        </Tippy>
                    );
                })}
            </tbody>
        </table>
    );
}

BookingList.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
};

export default BookingList;
