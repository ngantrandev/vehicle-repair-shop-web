import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Button from '../button';
import SuccessPopup from '../popup/SuccessPopup';
import Input from '../input';

import loadData from '../../services/loadData';
import bookingService from '../../services/bookingService';
import ultils from '../../ultils';
import configs from '../../configs';

function ServiceDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { from, data } = location.state;

    const { name, description, price, estimated_time: time } = data;
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedWard, setSelectedWard] = useState(null);
    const [street, setStreet] = useState('');

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const getProvinces = async () => {
        const provinces = await loadData.getListProvince();
        setProvinces(provinces.data);
    };

    const getDistricts = async (provinceId) => {
        const districts = await loadData.getListDistrict(provinceId);
        setDistricts(districts.data);
    };

    const getWards = async (districtId) => {
        const wards = await loadData.getListWard(districtId);
        setWards(wards.data);
    };

    const handleCreateBooking = async () => {
        if (!selectedWard || !ultils.isValidInteger(selectedWard)) {
            return;
        }

        const user = ultils.getUserDataLogedin();

        if (!user) {
            return;
        }

        const bookingData = {
            service_id: data.id,
            ward_id: selectedWard,
            street: street,
        };

        try {
            const result = await bookingService.createBooking(
                user.id,
                bookingData
            );

            if (result.status === configs.STATUS_CODE.OK) {
                setIsSubmitting(false);
                setIsSuccessPopupOpen(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProvinces();
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
                        <div className='mt-16 flex gap-2'>
                            {/* <Button rounded>Thêm vào giỏ hàng</Button> */}
                            <Button
                                rounded
                                className='px-10'
                                onClick={() => setIsSubmitting(true)}
                            >
                                Đặt lịch
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                id='crud-modal'
                tabIndex='-1'
                className={`fixed left-0 right-0 top-0 z-50 h-screen max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-400 bg-opacity-50 md:inset-0 ${isSubmitting ? 'flex' : 'hidden'}`}
            >
                <div className='relative max-h-full w-full max-w-md p-4'>
                    <div className='relative rounded-lg bg-white text-black shadow'>
                        <div className='flex items-center justify-between rounded-t border-b border-primary p-4 md:p-5'>
                            <h3 className='w-full text-center text-xl font-bold capitalize text-gray-900'>
                                Tạo lịch hẹn
                            </h3>
                            <button
                                type='button'
                                className='ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-primary-light hover:text-white active:bg-primary-dark'
                                data-modal-toggle='crud-modal'
                                onClick={() => setIsSubmitting(false)}
                            >
                                <svg
                                    className='h-3 w-3'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 14 14'
                                >
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                                    />
                                </svg>
                                <span className='sr-only'>Close modal</span>
                            </button>
                        </div>
                        <form className='p-4 md:p-5'>
                            <div className='mb-4 grid grid-cols-3 gap-4'>
                                <div className='col-span-3'>
                                    <label
                                        htmlFor='ward'
                                        className='mb-2 block text-sm font-medium text-gray-900'
                                    >
                                        Địa chỉ nhà
                                    </label>
                                    <Input
                                        rounded
                                        id='ward'
                                        type='password'
                                        placeholder='Nhập địa chỉ nhà, tên đường'
                                        className={'w-full bg-white p-2'}
                                        multiline
                                        value={street}
                                        onChange={(e) =>
                                            setStreet(e.target.value)
                                        }
                                    />
                                </div>

                                <div className='col-span-3 sm:col-span-1'>
                                    <label
                                        htmlFor='province'
                                        className='mb-2 block text-sm font-medium text-gray-900'
                                    >
                                        Tỉnh thành
                                    </label>
                                    <select
                                        id='province'
                                        className='block w-full rounded-lg border-2 border-primary-light p-2.5 text-sm focus:border-primary-light'
                                        onChange={(e) =>
                                            getDistricts(e.target.value)
                                        }
                                        defaultValue=''
                                    >
                                        <option className='p-5'>
                                            Tỉnh thành
                                        </option>

                                        {provinces.map(({ id, name }) => {
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
                                        htmlFor='district'
                                        className='mb-2 block text-sm font-medium text-gray-900'
                                    >
                                        Quận huyện
                                    </label>
                                    <select
                                        id='district'
                                        className='block w-full rounded-lg border-2 border-primary-light p-2.5 text-sm focus:border-primary-light'
                                        onChange={(e) =>
                                            getWards(e.target.value)
                                        }
                                        defaultValue=''
                                    >
                                        <option className='p-5'>
                                            Quận huyện
                                        </option>
                                        {districts.map(({ id, name }) => {
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
                                        htmlFor='ward'
                                        className='mb-2 block text-sm font-medium text-gray-900'
                                    >
                                        Phường xã
                                    </label>
                                    <select
                                        id='ward'
                                        className='block w-full rounded-lg border-2 border-primary-light p-2.5 text-sm focus:border-primary-light'
                                        onChange={(e) =>
                                            setSelectedWard(e.target.value)
                                        }
                                        defaultValue=''
                                    >
                                        <option className='p-5'>
                                            Phường xã
                                        </option>
                                        {wards.map(({ id, name }) => {
                                            return (
                                                <option key={id} value={id}>
                                                    {name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                            <button
                                type='button'
                                className='inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                                onClick={() => handleCreateBooking()}
                            >
                                <svg
                                    className='-ms-1 me-1 h-5 w-5'
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                                        clipRule='evenodd'
                                    ></path>
                                </svg>
                                Đặt lịch
                            </button>
                        </form>
                    </div>
                </div>
            </div>

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
