import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Button from '../button';
import SuccessPopup from '../popup/SuccessPopup';
import ultils from '../../ultils';
import FormCreateBooking from '../form/FormCreateBooking';
import configs from '../../configs';

function ServiceDetail() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [role, setRole] = useState('');

    const { from, data } = location.state;
    const { name, description, price, estimated_time: time } = data;

    const handleOnCloseForm = () => {
        setIsSubmitting(false);
    };

    const handleOnSuccess = () => {
        setIsSubmitting(false);
        setIsSuccessPopupOpen(true);
    };

    useEffect(() => {
        try {
            const role = ultils.getUserRole();

            if (role && role.trim().length > 0) {
                setRole(role);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <div className='relative'>
            <div className='relative flex h-screen w-full flex-col items-center justify-center'>
                <Button
                    rounded
                    onClick={() => navigate(from)}
                    className='absolute left-0 top-0 m-5'
                >
                    Quay lại
                </Button>
                <h1 className='mt-12 text-3xl font-bold'>Thông tin dịch vụ</h1>
                <div className='mt-12 flex h-full w-3/5 flex-col'>
                    <div className='flex h-1/2 w-full flex-col items-center justify-center rounded-md border-2 border-primary-light'>
                        <div className='flex flex-col gap-y-2 px-4'>
                            <div>
                                <span>Tên dịch vụ: </span>
                                <span className='text-3xl font-bold'>
                                    {name}
                                </span>
                            </div>
                            <h3>Mô tả: {description}</h3>
                            <h3>
                                Phí dịch vụ:
                                <span className='font-bold'>
                                    {' '}
                                    {ultils.getCurrencyFormat(price)}
                                </span>
                            </h3>
                            <h3>Thời gian ước tính: {time}</h3>{' '}
                        </div>
                        {role === configs.USER_ROLES.customer && (
                            <div className='mt-16 flex gap-2'>
                                <Button
                                    rounded
                                    className='px-10'
                                    onClick={() => setIsSubmitting(true)}
                                >
                                    Đặt lịch
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isSubmitting && (
                <FormCreateBooking
                    service={data}
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
