import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import ultils from '../../ultils';
import bookingService from '../../services/bookingService';
import configs from '../../configs';
import GoongMap from '../map/GoongMap';
import Input from '../input';
import PlusIcon from '../../assets/icon/PlusIcon';
import Button from '../button';
import CameraIcon from '../../assets/icon/CameraIcon';
import Image from '../image/Image';
import useUser from '../../hooks/useUser';
import goongMapService from '../../services/goongMapService';
import useDebounce from '../../hooks/useDebounce';

const SearchResult = ({ data, onItemClick }) => {
    return (
        <div className='border-3 absolute z-10 h-36 w-full overflow-y-auto rounded-md border-0 border-gray-300 bg-white p-4 shadow-lg'>
            {data.map((item, index) => {
                return (
                    <div
                        key={index}
                        className='w-full cursor-pointer'
                        onClick={() => {
                            onItemClick(item);
                        }}
                    >
                        <div className='w-full font-semibold text-black'>
                            {item.address_name}
                        </div>
                        <div className='w-full'>{item.full_address}</div>
                        <p className='h-px w-full bg-red-200' />
                    </div>
                );
            })}
        </div>
    );
};

function FormCreateBooking({ service, onClose, onSuccess }) {
    const [addressInput, setAddressInput] = useState('');
    const [image, setImage] = useState(null);
    const debouncedInputSearch = useDebounce(addressInput, 500);
    const [isProgrammaticChange, setIsProgrammaticChange] = useState(false);

    const [isFirstRender, setIsFirstRender] = useState(true);

    // address
    const [showSearchResult, setShowSearchResult] = useState(false);
    const [suggestAddresses, setSuggestAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const [mapCenter, setMapcenter] = useState(null);
    const debouncedMapCenter = useDebounce(mapCenter, 1000);

    const mapRef = useRef();

    const { user } = useUser();

    const handleDraggingMap = useCallback((isDragging) => {
        setIsDragging(isDragging);
    }, []);

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
        if (isProgrammaticChange) {
            setIsProgrammaticChange(false);
            return;
        }

        setMapcenter(mapRef.current.center);
    }, [isDragging]);

    useEffect(() => {
        if (isProgrammaticChange || !debouncedMapCenter) {
            return;
        }

        const fetchReverseGeocode = async () => {
            const res = await goongMapService.getReverseGeocoding(
                debouncedMapCenter.latitude,
                debouncedMapCenter.longitude
            );

            setSuggestAddresses(res.data?.data || []);
            setShowSearchResult(true);
        };
        fetchReverseGeocode();
    }, [debouncedMapCenter]);

    useEffect(() => {
        if (
            isProgrammaticChange ||
            !debouncedInputSearch ||
            debouncedInputSearch.trim() === ''
        ) {
            return;
        }

        const fetchAddress = async () => {
            if (debouncedInputSearch.trim() === '') {
                setSelectedAddress(null);
                return;
            }

            const res = await goongMapService.autoCompleteAddress(
                debouncedInputSearch.trim()
            );

            setSuggestAddresses(res.data?.data || []);
            setShowSearchResult(true);
        };
        fetchAddress();
    }, [debouncedInputSearch]);

    const handleChooseAddressItem = (address) => {
        const fetchAddressDetail = async () => {
            const res = await goongMapService.getAddressInfoByPlaceId(
                address.place_id
            );

            const resData = res.data?.data || null;

            setAddressInput(resData.address_name + ', ' + resData.full_address);

            setSelectedAddress(resData);
            setIsProgrammaticChange(true);
            setShowSearchResult(false);
            mapRef.current.setCenter(resData.latitude, resData.longitude);
        };

        fetchAddressDetail();
    };

    const handleChooseImage = (e) => {
        const file = e.target.files[0];

        setImage({
            data: file,
            preview: URL.createObjectURL(file),
        });
    };

    useEffect(() => {
        return () => {
            image && URL.revokeObjectURL(image.preview);
        };
    }, [image]);

    const handleDeleteImage = () => {
        if (image) {
            URL.revokeObjectURL(image.preview);
            setImage(null);
        }
    };

    const handleCreateBooking = async () => {
        if (!user?.isLoggedin) {
            ultils.notifyError('Vui lòng đăng nhập để thực hiện chức năng này');
            return;
        }

        if (!selectedAddress) {
            ultils.notifyError('Vui lòng chọn địa chỉ nhà');
            return;
        }

        const { latitude, longitude } = mapRef.current.center;

        const bookingData = {
            service_id: service.id,
            address_name: selectedAddress?.address_name,
            full_address: selectedAddress?.full_address,
            place_id: selectedAddress?.place_id,
            latitude,
            longitude,
            file: image?.data,
        };

        try {
            const result = await bookingService.createBooking(bookingData);

            if (result.status === configs.STATUS_CODE.OK) {
                onSuccess();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeAddressInput = (e) => {
        if (isProgrammaticChange) {
            setIsProgrammaticChange(false);
            return;
        }

        setAddressInput(e.target.value);
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
                            <div className='relative col-span-3'>
                                <label
                                    htmlFor='ward'
                                    className='mb-2 block text-sm font-medium text-gray-900'
                                >
                                    Địa chỉ nhà
                                </label>

                                <Input
                                    rounded
                                    id='ward'
                                    type='text'
                                    placeholder='Nhập địa chỉ nhà, tên đường'
                                    className={'w-full bg-white p-2'}
                                    multiline
                                    value={addressInput}
                                    onChange={handleChangeAddressInput}
                                />

                                {suggestAddresses.length > 0 &&
                                    showSearchResult && (
                                        <SearchResult
                                            data={suggestAddresses}
                                            onItemClick={
                                                handleChooseAddressItem
                                            }
                                        />
                                    )}
                            </div>
                        </div>

                        <div className='relative mb-2 grid h-20 grid-cols-3 grid-rows-2'>
                            <div className='relative col-span-1 row-span-2 size-20 overflow-hidden border-2 border-primary-supper-light object-cover'>
                                {image && (
                                    <Image
                                        className='h-full w-full'
                                        src={image.preview || null}
                                        alt='Ảnh tình trạng phương tiện'
                                    />
                                )}

                                <label
                                    htmlFor='img'
                                    className='h-full w-full bg-primary hover:cursor-pointer'
                                >
                                    <CameraIcon
                                        className={
                                            'absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2'
                                        }
                                    />
                                </label>
                            </div>
                            <label
                                htmlFor='img'
                                className='col-span-2 row-span-1 text-sm lg:text-base'
                            >
                                Gửi ảnh tình trạng phương tiện
                            </label>

                            <input
                                type='file'
                                id='img'
                                name='img'
                                className='absolute hidden'
                                accept='image/*'
                                onChange={handleChooseImage}
                            />

                            {image && (
                                <Button
                                    type='button'
                                    className='rounded-lg'
                                    onClick={handleDeleteImage}
                                    outlined
                                >
                                    Xóa
                                </Button>
                            )}
                        </div>
                        <Button
                            type='button'
                            rounded
                            className='inline-flex items-center bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none dark:bg-blue-600'
                            onClick={() => handleCreateBooking()}
                        >
                            <PlusIcon className='mr-2 h-5 w-5' />
                            Đặt lịch
                        </Button>
                    </form>

                    <GoongMap
                        ref={mapRef}
                        className='h-56 w-full bg-primary'
                        onDragging={handleDraggingMap}
                    />
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

SearchResult.propTypes = {
    data: PropTypes.array,
    onItemClick: PropTypes.func,
};

export default FormCreateBooking;
