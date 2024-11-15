import { useCallback, useEffect, useState } from 'react';

import 'tippy.js/dist/tippy.css'; // optional

import PaginatedItems from '../paginateditems';
import ServiceList from '../servicelist';

import GoongMap from '../map/GoongMap.jsx';
import serviceService from '../../services/serviceService.js';
import useUser from '../../hooks/useUser.js';
import { Link, useNavigate } from 'react-router-dom';
import configs from '../../configs';
import loadData from '../../services/loadData.js';
import ultils from '../../ultils/ultils.js';

function Home() {
    const [serviceList, setServiceList] = useState([]);
    const [topServices, setTopServices] = useState([]);
    const [serviceCategories, setServiceCategories] = useState([]);
    const [stations, setStations] = useState([]);

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
            const topServices = await serviceService.getListTopService();
            const serviceCategories =
                await serviceService.getServiceCategories();
            const stations = await loadData.getListServiceStation();

            if (services && services.data) {
                setServiceList(services.data?.data);
            }

            if (serviceCategories && serviceCategories.data) {
                setServiceCategories(serviceCategories.data.data);
            }

            if (stations && stations.data) {
                setStations(stations.data.data);
            }

            if (topServices && topServices.data) {
                setTopServices(topServices.data.data);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className='mx-20'>
            <div className='mt-4 flex flex-row'>
                <div className='h-full w-60'>
                    <div className='w-full bg-[#484848] py-1 text-center text-white'>
                        Danh mục dịch vụ
                    </div>
                    <div className='text-md mt-2 flex cursor-pointer flex-col gap-y-2 px-2 font-bold text-[#555]'>
                        <p
                            className='hover:text-primary-supper-light'
                            onClick={() => handleChooseServiceCategory('#')}
                        >
                            Tất cả
                        </p>
                        {serviceCategories.map(({ id, name }) => {
                            return (
                                <p
                                    key={id}
                                    className='hover:text-primary-supper-light'
                                    onClick={() =>
                                        handleChooseServiceCategory(id)
                                    }
                                >
                                    {name}
                                </p>
                            );
                        })}
                    </div>
                </div>
                <div className='mx-2 flex-1'>
                    <div id='banner' className='h-56'>
                        <div className='relative h-full rounded-xl bg-primary-light p-[2rem] font-bold text-white'>
                            <div
                                id='title'
                                className='text-2xl font-bold lg:ml-[2rem] lg:text-[2rem]'
                            >
                                Bảo dưỡng xe
                            </div>
                            <div
                                id='subtitle'
                                className='mt-3 text-xs lg:ml-[4rem] lg:mr-[10rem] lg:mt-10 lg:text-base'
                            >
                                Chúng tôi cung cấp dịch vụ bảo dưỡng xe cao cấp,
                                áp dụng đối với nhiều dòng xe. Cam kết bảo đảm
                                chất lượng cho quý khách hàng.
                            </div>
                            {/* <Button
                            outlined
                            className='absolute bottom-0 mb-8 border-white text-xs text-white hover:bg-white hover:text-primary active:bg-opacity-0 active:text-white lg:mb-5 lg:ml-[4rem] lg:mr-[8rem] lg:text-sm'
                        >
                            Tìm dịch vụ
                        </Button> */}
                        </div>
                    </div>
                    <div id='services-container'>
                        {serviceList.length > 0 && (
                            <PaginatedItems
                                data={serviceList}
                                itemsPerPage={6}
                                size={8}
                            >
                                <ServiceList />
                            </PaginatedItems>
                        )}
                    </div>
                </div>
                <div className='w-60'>
                    <div className=''>
                        <div className='w-full bg-[#484848] py-1 text-center text-white'>
                            Địa chỉ trạm dịch vụ
                        </div>
                        <div className='mt-2 flex flex-col gap-y-2 px-2 hover:cursor-pointer'>
                            {stations.map(({ id, name, address }) => {
                                const {
                                    latitude,
                                    longitude,
                                    address_name,
                                    full_address,
                                } = address;
                                return (
                                    <div key={id} className='group'>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            <p className='text-md font-bold text-primary'>
                                                {name}
                                            </p>
                                            <p className='text-xs'>
                                                {address_name +
                                                    ' ' +
                                                    full_address}
                                            </p>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className='mt-8'>
                        <p className='mb-8 inline p-1 text-lg font-bold uppercase text-black'>
                            Được quan tâm nhiều
                        </p>
                        <div className='mt-2 flex flex-col gap-2 border-2 p-2'>
                            {topServices.map((service) => (
                                <div
                                    key={service.id}
                                    className='flex hover:cursor-pointer'
                                >
                                    <div className='size-20'>
                                        <img
                                            src={ultils.getFormatedImageUrl(
                                                service.image_url
                                            )}
                                            alt={service.name}
                                            className='h-full w-full object-cover'
                                        />
                                    </div>
                                    <div className='ml-2 flex-1'>
                                        <Link
                                            to={`/services/${service.id}/`}
                                            state={{
                                                data: service,
                                                from: window.location.pathname,
                                            }}
                                        >
                                            <p className='hover:text-primary'>
                                                {service.name}
                                            </p>
                                        </Link>
                                        <p>
                                            {ultils.getCurrencyFormat(
                                                service.price
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
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
