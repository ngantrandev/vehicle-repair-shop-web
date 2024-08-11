import PropTypes from 'prop-types';

import MyBookingItem from './MyBookingItem.jsx';

function BookingList({ className, data }) {
    return (
        <div className={className}>
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
                    {data.map((booking, index) => {
                        return (
                            <MyBookingItem
                                key={index}
                                data={booking}
                                className={'h-10 hover:bg-gray-200'}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

BookingList.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
};

export default BookingList;
