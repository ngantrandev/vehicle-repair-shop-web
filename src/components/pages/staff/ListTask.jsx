import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react';

import TaskItem from './TaskItem';

function ListTask({ className, data }) {
    const navigate = useNavigate();

    const handleClickDetail = (booking) => {
        navigate(`/users/${booking.user?.id}/bookings/${booking.id}`, {
            state: { from: window.location.pathname },
        });
    };

    return (
        <div className={className}>
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
                    {data.map((booking, index) => {
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
                                    onClick={() => handleClickDetail(booking)}
                                />
                            </Tippy>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

ListTask.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
};

export default ListTask;
