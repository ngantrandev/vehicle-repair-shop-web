import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Item from './Item';

function ServiceList({ data, className }) {
    const [services, setServices] = useState([]);

    useEffect(() => {
        setServices(data);
    }, [data]);

    return (
        <div className={className}>
            <table className='w-full table-auto border-2 border-primary-light p-8'>
                <thead className='h-8 border-y-2 bg-primary-supper-light'>
                    <tr className='text-left'>
                        <th>Tên dịch vụ</th>
                        <th>Thời gian</th>
                        <th>Giá dịch vụ</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((service, index) => {
                        return (
                            <Item
                                key={index}
                                data={service}
                                className={
                                    'hover:cursor-pointer hover:bg-gray-200'
                                }
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

ServiceList.propTypes = {
    data: PropTypes.array,
    className: PropTypes.string,
};

export default ServiceList;
