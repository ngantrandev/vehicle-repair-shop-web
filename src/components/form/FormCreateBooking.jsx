import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import ultils from '../../ultils';
import loadData from '../../services/loadData';
import bookingService from '../../services/bookingService';
import configs from '../../configs';
import GoongMap from '../map/GoongMap';
import Input from '../input';

function FormCreateBooking({ service, onClose, onSuccess }) {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [street, setStreet] = useState('');

    const mapRef = useRef();

    useEffect(() => {
        const getProvinces = async () => {
            const provinces = await loadData.getListProvince();
            setProvinces(provinces.data);
        };

        getProvinces();
    }, []);

    useEffect(() => {
        if (!selectedProvince || selectedProvince.trim().length === 0) {
            return;
        }

        const getDistricts = async (provinceId) => {
            const districts = await loadData.getListDistrict(provinceId);
            setDistricts(districts.data);
        };

        getDistricts(selectedProvince);
    }, [selectedProvince]);

    useEffect(() => {
        if (!selectedDistrict || selectedDistrict.trim().length === 0) {
            return;
        }

        const getWards = async (districtId) => {
            const wards = await loadData.getListWard(districtId);
            setWards(wards.data);
        };

        getWards(selectedDistrict);
    }, [selectedDistrict]);

    const handleCreateBooking = async () => {
        if (!selectedWard || !ultils.isValidInteger(selectedWard)) {
            return;
        }

        const user = ultils.getUserDataLogedin();

        if (!user) {
            return;
        }

        const { latitude, longitude } = mapRef.current.center;

        const bookingData = {
            service_id: service.id,
            ward_id: selectedWard,
            street: street,
            latitude: latitude,
            longitude: longitude,
        };

        try {
            const result = await bookingService.createBooking(
                user.id,
                bookingData
            );

            if (result.status === configs.STATUS_CODE.OK) {
                onSuccess();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            id='crud-modal'
            tabIndex='-1'
            className={`fixed left-0 right-0 top-0 z-50 flex h-screen max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-400 bg-opacity-50 md:inset-0`}
        >
            <div className='relative max-h-full w-full max-w-md p-4'>
                <div className='relative overflow-hidden rounded-lg bg-white text-black shadow'>
                    <div className='flex items-center justify-between rounded-t border-b border-primary p-4 md:p-5'>
                        <h3 className='w-full text-center text-xl font-bold capitalize text-gray-900'>
                            Tạo lịch hẹn
                        </h3>
                        <button
                            type='button'
                            className='ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-primary-light hover:text-white active:bg-primary-dark'
                            data-modal-toggle='crud-modal'
                            onClick={onClose}
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
                                    onChange={(e) => setStreet(e.target.value)}
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
                                        setSelectedProvince(e.target.value)
                                    }
                                    defaultValue=''
                                >
                                    <option className='p-5'>Tỉnh thành</option>

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
                                        setSelectedDistrict(e.target.value)
                                    }
                                    defaultValue=''
                                >
                                    <option className='p-5'>Quận huyện</option>
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
                                    <option className='p-5'>Phường xã</option>
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

                    <GoongMap ref={mapRef} className='h-56 w-full bg-primary' />
                </div>
            </div>
        </div>
    );
}

FormCreateBooking.propTypes = {
    service: PropTypes.object,
    onClose: PropTypes.func,
    onSuccess: PropTypes.func,
};

export default FormCreateBooking;
