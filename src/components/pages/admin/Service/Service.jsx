import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/src/components/button';
import Paginateditems from '@/src/components/paginateditems';
import ServiceList from '@/src/components/pages/admin/Service/ServiceList';
import configs from '@/src/configs';
import serviceService from '@/src/services/serviceService';
import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import Input from '@/src/components/input/Input';

function Service() {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');

    const { setBreadcrumbsData } = useBreadcrumbs();

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Home',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.services,
                label: 'Danh sách dịch vụ',
            },
        ]);
    }, [setBreadcrumbsData]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                getServices({
                    key: searchInput,
                });
            }
        },
        [searchInput]
    );

    const getServices = useCallback(async (params) => {
        const res = await serviceService.getListService(params);

        if (res.status == configs.STATUS_CODE.OK) {
            const resData = res.data;

            setServices(resData.data);
        }
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await serviceService.getListService({});
                const resCategories =
                    await serviceService.getServiceCategories();

                if (resCategories.status == configs.STATUS_CODE.OK) {
                    setCategories(resCategories.data.data);
                }

                if (res.status == configs.STATUS_CODE.OK) {
                    const resData = res.data;

                    setServices(resData.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className='relative flex h-full flex-1 flex-col items-center bg-white px-0 md:px-4'>
            <div className='flex w-full justify-between py-5'>
                <Breadcrumbs />
                <Button
                    rounded
                    className='h-10'
                    onClick={() =>
                        navigate(configs.routes.service.create, {
                            state: {
                                from: window.location.pathname,
                            },
                        })
                    }
                >
                    <svg
                        fill='currentColor'
                        className='w-6'
                        id='Layer_1'
                        version='1.1'
                        viewBox='0 0 512 512'
                        width='512px'
                        xmlSpace='preserve'
                        xmlns='http://www.w3.org/2000/svg'
                        xmlnsXlink='http://www.w3.org/1999/xlink'
                    >
                        <path d='M417.4,224H288V94.6c0-16.9-14.3-30.6-32-30.6c-17.7,0-32,13.7-32,30.6V224H94.6C77.7,224,64,238.3,64,256  c0,17.7,13.7,32,30.6,32H224v129.4c0,16.9,14.3,30.6,32,30.6c17.7,0,32-13.7,32-30.6V288h129.4c16.9,0,30.6-14.3,30.6-32  C448,238.3,434.3,224,417.4,224z' />
                    </svg>
                    <span>Thêm mới</span>
                </Button>
            </div>

            <div className='mb-8 w-full overflow-hidden rounded-2xl pt-0 shadow-[rgba(0,5,0,0.15)_1px_1px_60px_1px]'>
                <h2 className='border-b-2 px-4 py-2 font-bold'>
                    Bộ lọc tìm kiếm
                </h2>
                <div className='grid w-full grid-cols-6 gap-4 p-8'>
                    <div className='col-span-3 flex w-full gap-2'>
                        <div className='flex-1'>
                            <Input
                                className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                                placeholder='Bạn cần tìm kiếm gì?'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <Button
                            rounded
                            className='h-full'
                            onClick={() => {
                                getServices({
                                    key: searchInput,
                                });
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </div>

                    <div className='col-span-2 col-start-1 flex flex-col'>
                        <label htmlFor='price'>Sắp xếp theo phí dịch vụ</label>
                        <select
                            name=''
                            id='price'
                            className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                        >
                            <option value=''>Tất cả</option>
                            <option value=''>Thấp tới cao</option>
                            <option value=''>Cao tới thấp</option>
                        </select>
                    </div>
                    <div className='col-span-2 flex flex-col'>
                        <label htmlFor='state'>Sắp xếp theo trạng thái</label>
                        <select
                            name=''
                            id='state'
                            className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                        >
                            <option value=''>Tất cả</option>
                            <option value=''>Đang cung cấp</option>
                            <option value=''>Ngừng cung cấp</option>
                        </select>
                    </div>
                    <div className='col-span-2 col-start-1 flex flex-col'>
                        <label htmlFor='type'>Sắp xếp theo loại dịch vụ</label>
                        <select
                            name='type'
                            id='type'
                            className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                        >
                            <option value=''>Tất cả</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className='relative w-full flex-1 pb-3'>
                <Paginateditems
                    data={services}
                    itemsPerPage={10}
                    size={8}
                    className={'flex h-full flex-1 flex-col justify-between'}
                >
                    <ServiceList className='relative w-max border-collapse overflow-x-auto pb-10 md:w-full' />
                </Paginateditems>
            </div>
        </div>
    );
}

Service.propTypes = {};

export default Service;
