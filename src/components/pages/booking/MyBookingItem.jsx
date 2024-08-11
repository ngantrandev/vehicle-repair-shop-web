import { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../../button/index.js';
import {
    DotIcon,
    FixingIcon,
    CanceledIcon,
    DoneIcon,
} from '../../../assets/icon/Icon.jsx';
import configs from '../../../configs/index.js';
import bookingService from '../../../services/bookingService.js';
import ultils from '../../../ultils/ultils.js';
import useUser from '../../../hooks/useUser.js';

function Item({ data, className }) {
    const {
        id: bookingId,
        created_at: createdAt,
        modified_at: modified_at,
        service,
    } = data;

    const { user } = useUser();

    const [status, setStatus] = useState(data.status);

    const handleCancel = async () => {
        try {
            if (!user?.isLoggedin) {
                ultils.notifyError('Bạn chưa đăng nhập');

                setTimeout(() => {
                    ultils.notifyWarning(
                        'Vui lòng đăng nhập để thực hiện chức năng'
                    );
                }, 500);

                return;
            }

            const res = await bookingService.cancelBooking(
                user?.data?.id,
                bookingId,
                {
                    note: 'Hủy bởi',
                }
            );

            if (res.status !== configs.STATUS_CODE.OK) {
                ultils.notifyError('Hủy đặt lịch thất bại');
            }

            setStatus(configs.BOOKING_STATE.cancelled);
            ultils.notifySuccess('Hủy đặt lịch thành công');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <tr className={className}>
            <td>{service.name}</td>
            <td>{createdAt}</td>
            <td>{modified_at}</td>
            <td>{ultils.getCurrencyFormat(service.price)}</td>
            <td>
                <div className='flex items-center gap-2'>
                    {status === configs.BOOKING_STATE.pending ? (
                        <>
                            <DotIcon className='h-6 w-6 rounded-full border-2 border-yellow-500 text-yellow-500' />
                            <span>{'Chờ xác nhận'}</span>
                        </>
                    ) : status === configs.BOOKING_STATE.done ? (
                        <>
                            <DoneIcon className='h-6 w-6 text-green-500' />
                            <span>{'Hoàn thành'}</span>
                        </>
                    ) : status === configs.BOOKING_STATE.fixing ? (
                        <>
                            <FixingIcon className='h-6 w-6 text-blue-500' />
                            <span>{'Đang sửa chữa'}</span>
                        </>
                    ) : status === configs.BOOKING_STATE.cancelled ? (
                        <>
                            <CanceledIcon className='h-6 w-6 text-red-500' />
                            <span>{'Đã hủy'}</span>
                        </>
                    ) : (
                        <>
                            <DotIcon className='h-6 w-6 rounded-full border-2 border-green-500 text-green-500' />
                            <span>{'Chuẩn bị sửa'}</span>
                        </>
                    )}
                </div>
            </td>
            <td>
                {/**
                 * add disabled attribute to button when status is cancelled
                 */}
                {/* <Button rounded className={`w-full `}  >
                    {status === 'cancelled' ? 'Đã hủy' : 'Hủy'}
                </Button> */}
                {status === configs.BOOKING_STATE.cancelled ? (
                    <Button rounded className={`w-full`} disabled>
                        {'Đã hủy'}
                    </Button>
                ) : status === configs.BOOKING_STATE.done ? (
                    <Button rounded className={`w-full`} disabled>
                        {'Đã xong'}
                    </Button>
                ) : (
                    <Button
                        rounded
                        className={`w-full`}
                        onClick={() => handleCancel()}
                    >
                        {'Hủy'}
                    </Button>
                )}
            </td>
        </tr>
    );
}

Item.propTypes = {
    data: PropTypes.object,
    className: PropTypes.string,
};

export default Item;
