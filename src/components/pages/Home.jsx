import { useEffect, useState } from 'react';

import 'tippy.js/dist/tippy.css'; // optional

import Button from '../button';
import PaginatedItems from '../paginateditems';
import ServiceList from '../servicelist';

import loadData from '../../services/loadData.js';
import GoongMap from '../map/GoongMap.jsx';
import serviceService from '../../services/serviceService.js';

function Home() {
    const [serviceList, setServiceList] = useState([]);
    const [serviceCategories, setServiceCategories] = useState([]);
    const [motorcycleBrands, setMotorcycleBrands] = useState([]);

    const [selectedServiceCategory, setSelectedServiceCategory] = useState('');
    const [selectedMotorcycleBrand, setSelectedMotorcycleBrand] = useState('');

    useEffect(() => {
        try {
            if (selectedServiceCategory === '') {
                return;
            }

            let params = {
                active: 1,
            };

            if (selectedServiceCategory !== '#') {
                params = {
                    ...params,
                    category_id: selectedServiceCategory,
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
    }, [selectedServiceCategory]);

    useEffect(() => {
        try {
            if (selectedMotorcycleBrand === '') {
                return;
            }

            let params = {
                active: 1,
            };

            if (selectedMotorcycleBrand !== '#') {
                params = {
                    ...params,
                    motorcycle_brand: selectedMotorcycleBrand,
                };
            }

            const fetchServicesByCategory = async (params) => {
                const services = await serviceService.getListService({
                    ...params,
                });
                setServiceList(services.data.data);
            };

            fetchServicesByCategory(params);
        } catch (error) {
            console.log(error);
        }
    }, [selectedMotorcycleBrand]);

    useEffect(() => {
        const fetchServices = async () => {
            const services = await serviceService.getListService({ active: 1 });
            const serviceCategories =
                await serviceService.getServiceCategories();
            const motorcycleBrands = await loadData.getMotorcycleBrands();

            if (services && services.data) {
                setServiceList(services.data?.data);
            }

            if (serviceCategories && serviceCategories.data) {
                setServiceCategories(serviceCategories.data.data);
            }

            if (motorcycleBrands && motorcycleBrands.data) {
                setMotorcycleBrands(motorcycleBrands.data.data);
            }
        };

        fetchServices();
    }, []);

    return (
        <>
            <div id='banner' className='mt-4 h-56 w-full'>
                <div className='relative h-full w-full rounded-xl bg-primary-light p-[2rem] font-bold text-white'>
                    <div
                        id='title'
                        className='text-2xl font-bold lg:ml-[2rem] lg:text-[2rem]'
                    >
                        Bảo dưỡng xe
                    </div>
                    <div
                        id='subtitle'
                        className='mt-3 text-xs lg:ml-[4rem] lg:mr-[10rem] lg:mt-4 lg:text-sm'
                    >
                        Chúng tôi cung cấp dịch vụ bảo dưỡng xe cao cấp, áp dụng
                        đối với nhiều dòng xe. Cam kết bảo đảm chất lượng cho
                        quý khách hàng.
                    </div>
                    <Button
                        outlined
                        className='absolute bottom-0 mb-8 border-white text-xs text-white hover:bg-white hover:text-primary active:bg-opacity-0 active:text-white lg:mb-5 lg:ml-[4rem] lg:mr-[8rem] lg:text-sm'
                    >
                        Tìm dịch vụ
                    </Button>
                </div>
            </div>

            <div id='services-container'>
                <div
                    id='action-button'
                    className='mb-8 mt-10 grid w-3/4 grid-cols-2 flex-wrap gap-4 px-4 sm:w-96'
                >
                    <div className='col-span-3 sm:col-span-1'>
                        <label
                            htmlFor='province'
                            className='mb-2 block text-sm font-medium text-gray-900'
                        >
                            Loại dịch vụ
                        </label>
                        <select
                            id='province'
                            className='block w-full rounded-lg border-2 border-primary-light p-2.5 text-sm focus:border-primary-light'
                            defaultValue=''
                            onChange={(e) =>
                                setSelectedServiceCategory(e.target.value)
                            }
                        >
                            <option className='p-5' value={'#'}>
                                Tất cả
                            </option>

                            {serviceCategories.map(({ id, name }) => {
                                return (
                                    <option key={id} value={id}>
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className='col-span-3 sm:col-span-1'>
                        <label
                            htmlFor='province'
                            className='mb-2 block text-sm font-medium text-gray-900'
                        >
                            Loại xe
                        </label>
                        <select
                            id='province'
                            className='block w-full rounded-lg border-2 border-primary-light p-2.5 text-sm focus:border-primary-light'
                            defaultValue=''
                            onChange={(e) =>
                                setSelectedMotorcycleBrand(e.target.value)
                            }
                        >
                            <option className='p-5' value={'#'}>
                                Tất cả
                            </option>

                            {motorcycleBrands.map(({ id, name }) => {
                                return (
                                    <option key={id} value={id}>
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                <PaginatedItems data={serviceList} itemsPerPage={6} size={8}>
                    <ServiceList />
                </PaginatedItems>
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
        </>
    );
}

export default Home;
