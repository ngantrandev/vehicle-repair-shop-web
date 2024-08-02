import { useEffect, useState } from 'react';

import 'tippy.js/dist/tippy.css'; // optional

import Button from '../button';
import PaginatedItems from '../paginateditems';
import ServiceList from '../servicelist';
import DropDown from '../dropdown';

import loadData from '../../services/loadData.js';
import GoongMap from '../map/GoongMap.jsx';

function Home() {
    const [serviceList, setServiceList] = useState([]);
    const [dropdownOpenId, setDropdownOpenId] = useState(null);
    const [serviceCategories, setServiceCategories] = useState([]);
    const [motorcycleBrands, setMotorcycleBrands] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            const services = await loadData.getListService();
            const serviceCategories = await loadData.getServiceCategories();
            const motorcycleBrands = await loadData.getMotorcycleBrands();

            setMotorcycleBrands([
                { id: -1, name: 'Tất cả' },
                ...motorcycleBrands.data,
            ]);
            setServiceCategories([
                { id: -1, name: 'Tất cả' },
                ...serviceCategories.data,
            ]);
            setServiceList(services.data.data);
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
                    className='mx-4 mb-8 mt-10 flex flex-wrap gap-3'
                >
                    <DropDown
                        id='service-type'
                        name='Loại dịch vụ'
                        data={serviceCategories}
                        inputPlaceHolder='Tìm kiếm dịch vụ'
                        dropdownOpenId={dropdownOpenId}
                        setDropdownOpenId={setDropdownOpenId}
                        onItemSelect={(id) => console.log(id)}
                        visibleSearch
                    />
                    <DropDown
                        id='vehicle-type'
                        name='Loại xe'
                        data={motorcycleBrands}
                        className='w-'
                        inputPlaceHolder='Tìm kiếm dịch vụ'
                        dropdownOpenId={dropdownOpenId}
                        setDropdownOpenId={setDropdownOpenId}
                        visibleSearch
                    />
                </div>

                <PaginatedItems data={serviceList} itemsPerPage={5} size={8}>
                    <ServiceList />
                </PaginatedItems>
            </div>

            <div className='my-20 flex flex-col gap-y-8 text-center'>
                <h1 className='text-2xl font-bold lg:text-3xl'>
                    Địa chỉ trụ sở chính
                </h1>
                <GoongMap className='h-72 w-full bg-primary' />
            </div>
        </>
    );
}

export default Home;
