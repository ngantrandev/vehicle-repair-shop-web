import { useEffect, useState } from 'react';
import Item from './item/Item';

function Service() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        //get services from api

        setServices([
            {
                id: 1,
                name: 'Sửa xe honda',
                estimated_time: '00:02',
                description: 'Sửa xe honda',
                price: '1.29',
                category: {
                    id: 1,
                },
                active: 1,
            },
        ]);
    }, []);
    return (
        <div className='relative m-5 w-full border-collapse overflow-x-auto border-2 shadow-md sm:rounded-lg'>
            <table className='w-full table-auto'>
                <thead className='h-8 border-y-2 bg-primary-supper-light'>
                    <tr className='text-left'>
                        <th>Tên dịch vụ</th>
                        <th>Thời gian</th>
                        <th>Giá dịch vụ</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((service, index) => {
                        return (
                            <Item
                                key={index}
                                data={service}
                                className={'hover:bg-gray-200'}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

Service.propTypes = {};

export default Service;
