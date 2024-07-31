import { useEffect, useState } from 'react';

import Item from './Item';
import loadData from '../../../../services/loadData';
import configs from '../../../../configs';

function Service() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await loadData.getListService();

                if (res.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                const resData = res.data;

                setServices(resData.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className='flex w-full flex-col'>
            <h1 className='py-10 text-center text-3xl font-bold'>
                Danh sách dịch vụ của cửa hàng
            </h1>
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
        </div>
    );
}

Service.propTypes = {};

export default Service;
