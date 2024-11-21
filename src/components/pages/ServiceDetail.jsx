import { Breadcrumbs } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ultils from '@/src//ultils';
import Button from '@/src/components/button';
import FormCreateBooking from '@/src/components/form/FormCreateBooking';
import Image from '@/src/components/image/Image';
import SuccessPopup from '@/src/components/popup/SuccessPopup';
import configs from '@/src/configs';
import useUser from '@/src/hooks/useUser';
import serviceService from '@/src/services/serviceService';

function ServiceDetail() {
    const { service_id: serviceId } = useParams();

    const [breadcrumbs, setBreadcrumbs] = useState([
        {
            to: '/home',
            label: 'Trang chủ',
        },
    ]);

    const { user } = useUser();

    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [service, setService] = useState({});

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await serviceService.getServiceById(serviceId);

                if (res.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                const resData = res.data;

                setService(resData.data);

                setBreadcrumbs([
                    {
                        to: '/home',
                        label: 'Trang chủ',
                    },
                    {
                        label: resData.data.name,
                    },
                ]);
                window.scrollTo(0, 0);
            } catch (error) {
                console.log(error);
            }
        };

        fetchService();
    }, [serviceId]);

    const handleOnCloseForm = () => {
        setShowForm(false);
    };

    const handleOnSuccess = () => {
        setShowForm(false);
        setIsSuccessPopupOpen(true);
    };

    const handleShowForm = useCallback(() => {
        if (!user || user.role !== configs.USER_ROLES.customer) {
            ultils.notifyError('Vui lòng đăng nhập để đặt lịch');
            return;
        }
        setShowForm(true);
    }, [user]);

    return (
        <div className='w-full'>
            <div className='flex h-8 items-center bg-[rgb(233,233,233)] pl-4'>
                <Breadcrumbs aria-label='breadcrumb'>
                    {breadcrumbs.map(({ to, label }, idx) => {
                        if (idx === breadcrumbs.length - 1) {
                            return (
                                <p key={idx} className='text-primary-light'>
                                    {label}
                                </p>
                            );
                        }
                        return (
                            <Link key={idx} underline='hover' to={to}>
                                <p className='text-black hover:underline'>
                                    {label}
                                </p>
                            </Link>
                        );
                    })}
                </Breadcrumbs>
            </div>

            <div className='mt-4 grid w-full grid-cols-5 gap-4'>
                <div className='col-span-2 bg-red-200'>
                    <Image
                        src={ultils.getFormatedImageUrl(service.image_url)}
                        alt={'Ảnh dịch vụ'}
                        className='h-full w-full object-cover'
                    />
                </div>
                <div id='service detail' className='col-span-3 flex flex-col'>
                    <div className='flex flex-col gap-y-2'>
                        <div>
                            <span className='text-base font-bold sm:text-4xl'>
                                {service.name}
                            </span>
                        </div>
                        {service.description && (
                            <>
                                <span className='text-xl font-bold'>
                                    Mô tả:{' '}
                                </span>
                                <div className='text-xl'>
                                    {service?.description &&
                                        service.description
                                            .split('-')
                                            .map((item, index) => {
                                                if (item.trim() === '')
                                                    return null;
                                                return (
                                                    <p key={index}>- {item}</p>
                                                );
                                            })}
                                </div>
                            </>
                        )}

                        {service.active === 0 && (
                            <h3 className='mt-4'>
                                Trạng thái:{' '}
                                <span className='font-bold text-red-500'>
                                    Dịch vụ tạm ngưng phục vụ
                                </span>
                            </h3>
                        )}
                    </div>
                </div>

                <div className='col-span-3 col-end-6 flex flex-col gap-4 bg-green-200 px-4 py-2 text-lg'>
                    <h3>
                        Chi phí tạm tính:
                        <span className='text-3xl font-bold'>
                            {` ${ultils.getCurrencyFormat(service.price)}`}
                        </span>
                    </h3>
                    <h3>Thời gian ước tính: {service.estimated_time}</h3>

                    <Button rounded className='w-full' onClick={handleShowForm}>
                        Đặt lịch
                    </Button>
                </div>
            </div>

            {showForm && (
                <FormCreateBooking
                    service={service}
                    onClose={handleOnCloseForm}
                    onSuccess={handleOnSuccess}
                />
            )}

            {isSuccessPopupOpen && (
                <SuccessPopup
                    title='Đặt lịch thành công'
                    content='Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất'
                    onClosed={() => setIsSuccessPopupOpen(false)}
                />
            )}
        </div>
    );
}

export default ServiceDetail;
