import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import ultils from '@/src/ultils';
import configs from '@/src/configs';
import {
    CanceledIcon,
    DoneIcon,
    DotIcon,
    FixingIcon,
} from '@/src/assets/icon/Icon';

const TaskItem = forwardRef(function TaskItem(
    { data, className, onClick },
    ref
) {
    const { created_at: createdAt, service, user } = data;

    return (
        <tr className={className} ref={ref} onClick={onClick}>
            <td>{user.lastname + ' ' + user.firstname}</td>
            <td>{service.name}</td>
            <td>{user.phone}</td>
            <td>{ultils.convertTimeToGMT7(createdAt)}</td>
            <td>
                <div className='flex items-center gap-2'>
                    {data.status === configs.BOOKING_STATE.pending ? (
                        <>
                            <DotIcon className='w-[1.3rem] rounded-full border-2 border-yellow-500 text-yellow-500' />
                            <span>{'Chờ xác nhận'}</span>
                        </>
                    ) : data.status === configs.BOOKING_STATE.done ? (
                        <>
                            <DoneIcon className='w-6 text-green-500' />
                            <span>{'Hoàn thành'}</span>
                        </>
                    ) : data.status === configs.BOOKING_STATE.fixing ? (
                        <>
                            <FixingIcon className='w-6 text-blue-500' />
                            <span>{'Đang sửa chữa'}</span>
                        </>
                    ) : data.status === configs.BOOKING_STATE.cancelled ? (
                        <>
                            <CanceledIcon className='w-6 text-red-500' />
                            <span>{'Đã hủy'}</span>
                        </>
                    ) : (
                        <>
                            <DotIcon className='w-6 rounded-full border-2 border-green-500 text-green-500' />
                            <span>{'Chuẩn bị sửa'}</span>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
});

TaskItem.propTypes = {
    data: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default TaskItem;
