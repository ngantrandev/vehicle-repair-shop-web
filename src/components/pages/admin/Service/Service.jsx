import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import serviceService from '../../../../services/serviceService';
import configs from '../../../../configs';
import Button from '../../../button';
import Paginateditems from '../../../paginateditems';
import ServiceList from './ServiceList';

function Service() {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await serviceService.getListService({});

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
        <div className='relative flex w-full flex-col items-center px-0 md:px-4'>
            <h1 className='py-10 text-center text-3xl font-bold'>
                Danh sách dịch vụ của cửa hàng
            </h1>
            <div className='relative w-full'>
                <div className='absolute left-0 top-0 flex -translate-y-full items-center gap-2'>
                    <Button
                        circle
                        className='bg-primary text-white hover:bg-primary-dark active:bg-primary'
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
                    </Button>
                    <span>Thêm mới</span>
                </div>
                <Paginateditems data={services} itemsPerPage={10} size={8}>
                    <ServiceList className='relative w-max border-collapse overflow-x-auto md:w-full' />
                </Paginateditems>
            </div>
        </div>
    );
}

Service.propTypes = {};

export default Service;
