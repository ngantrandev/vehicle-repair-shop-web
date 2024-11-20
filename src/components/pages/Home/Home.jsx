import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import HomeContent from '@/src/components/HomeContent/HomeContent';
import GoongMap from '@/src/components/map/GoongMap.jsx';
import ServiceCategory from '@/src/components/pages/Home/ServiceCategory';
import configs from '@/src/configs';
import useUser from '@/src/hooks/useUser.js';
import serviceService from '@/src/services/serviceService.js';
import Stations from './Stations';
import TopServices from './TopServices';

function Home() {
    const [serviceList, setServiceList] = useState([]);

    const user = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !navigate) {
            return;
        }

        if (user.user.role === configs.USER_ROLES.admin) {
            navigate(configs.routes.admin.dashboard.services);
        }
    }, [user, navigate]);
    const handleChooseServiceCategory = useCallback((categoryId) => {
        try {
            let params = {
                active: 1,
            };

            if (categoryId === '#') {
                // find all services
                params = { ...params };
            } else {
                params = {
                    ...params,
                    category_id: categoryId,
                };
            }

            const fetchServicesByCategory = async (params) => {
                const services = await serviceService.getListService(params);
                setServiceList(services.data.data);
            };

            fetchServicesByCategory(params);
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            const services = await serviceService.getListService({ active: 1 });

            if (services && services.data) {
                setServiceList(services.data?.data);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className='mx-20'>
            <div className='mt-4 flex flex-row'>
                <div className='h-full w-60'>
                    <ServiceCategory
                        onChooseServiceCategory={handleChooseServiceCategory}
                    />
                </div>
                <div className='mx-2 flex-1'>
                    <HomeContent data={serviceList} />
                </div>
                <div className='w-60'>
                    <Stations />

                    <div className='mt-8'>
                        <TopServices />
                    </div>
                </div>
            </div>

            <div className='mt-8'>
                <p className='inline bg-primary p-1 text-lg font-bold text-white'>
                    Giới thiệu cửa hàng
                </p>
                <div className='mt-8 grid h-[550px] w-full grid-cols-3 gap-2 overflow-hidden'>
                    <div className='col-span-2'>
                        <img
                            src='https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/10/15/1105357/311251702_4781739143.jpg'
                            alt='Ảnh bìa'
                            className='h-full w-full'
                        />
                    </div>
                    <div className='col-span-1 grid grid-rows-3 gap-2 overflow-hidden'>
                        <div className='row-span-1'>
                            <img
                                src='https://www.motosoft.vn/uploads/files/tin-tuc-phan-mem-motor-net/nghe-sua-xe-may.jpg'
                                alt=''
                                className='h-full w-full'
                            />
                        </div>
                        <div className='row-span-1'>
                            {' '}
                            <img
                                src='https://photo-cms-tpo.zadn.vn/w1000/Uploaded/2022/xqeioxdexq/2022_02_20/z3197941555722-735ad6924cfe61833ebd4e8d45b5937b-9501.jpg'
                                alt=''
                                className='h-full w-full'
                            />
                        </div>
                        <div className='row-span-1'>
                            {' '}
                            <img
                                src='https://cuuhonhanh24h.com/wp-content/uploads/2023/04/sua-xe-may-tai-nha.jpg'
                                alt=''
                                className='h-full w-full'
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='my-20 flex flex-col gap-y-8 text-center'>
                <h1 className='text-2xl font-bold lg:text-3xl'>
                    Địa chỉ trụ sở chính
                </h1>
                <GoongMap
                    className='h-96 w-full bg-primary'
                    originPoint={[106.62383478787928, 10.822608284821372]}
                />
            </div>
        </div>
    );
}

export default Home;
