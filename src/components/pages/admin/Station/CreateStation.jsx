import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from '../../../button';
import stationsService from '../../../../services/stationsService';
import configs from '../../../../configs';
import Input from '../../../input';
import GoongMap from '../../../map/GoongMap';
import ultils from '../../../../ultils';
import goongMapService from '../../../../services/goongMapService';
import useDebounce from '../../../../hooks/useDebounce';

const SearchResult = ({ data, onItemClick }) => {
    return (
        <div className='border-3 absolute z-10 h-36 overflow-y-auto rounded-md border-0 border-gray-300 bg-white p-4 shadow-lg'>
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

function CreateStation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { from } = location.state || { from: '/' };

    const [stationName, setStationName] = useState('');
    const [addressStationInput, setStationAddressInput] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [isProgrammaticChange, setIsProgrammaticChange] = useState(false);

    const [suggestAddresses, setSuggestAddresses] = useState([]);
    const [showSearchResult, setShowSearchResult] = useState(false);

    const addressInputDebounce = useDebounce(addressStationInput, 500);

    const mapRef = useRef(null);

    const handleChangeAddressInput = useCallback((e) => {
        const value = e.target.value;

        setStationAddressInput(value);
    }, []);

    const handleChangeStationName = useCallback((e) => {
        const value = e.target.value;

        setStationName(value);
    }, []);

    useEffect(() => {
        if (
            isProgrammaticChange ||
            !addressInputDebounce ||
            addressInputDebounce.trim() === ''
        ) {
            return;
        }

        const fetchAddress = async () => {
            if (addressInputDebounce.trim() === '') {
                setSelectedAddress(null);
                return;
            }

            const res = await goongMapService.autoCompleteAddress(
                addressInputDebounce.trim()
            );

            setSuggestAddresses(res.data?.data || []);
            setShowSearchResult(true);
        };
        fetchAddress();
    }, [addressInputDebounce]);

    const handleChooseAddressItem = useCallback((address) => {
        const fetchAddressDetail = async () => {
            const res = await goongMapService.getAddressInfoByPlaceId(
                address.place_id
            );

            const resData = res.data?.data || null;

            setStationAddressInput(
                resData.address_name + ', ' + resData.full_address
            );

            setSelectedAddress(resData);
            setIsProgrammaticChange(true);
            setShowSearchResult(false);
            mapRef.current.setCenter(resData.latitude, resData.longitude);
        };
        fetchAddressDetail();
    }, []);

    const handleCreateStation = async () => {
        const createStation = async () => {
            if (!stationName || stationName.trim().length === 0) {
                ultils.notifyWarning('Vui lòng nhập tên trạm dịch vụ');
                return;
            }

            if (!selectedAddress) {
                ultils.notifyWarning('Vui lòng chọn địa chỉ trạm dịch vụ');
                return;
            }

            const { longitude, latitude } = mapRef.current.center;

            const data = {
                name: stationName,
                place_id: selectedAddress.place_id,
                longitude,
                latitude,
                address_name: selectedAddress.address_name,
                full_address: selectedAddress.full_address,
            };
            const response = await stationsService.createStation(data);
            if (response.status === configs.STATUS_CODE.OK) {
                ultils.notifySuccess('Tạo trạm dịch vụ thành công');

                setStationName('');
                setStationAddressInput('');
            } else {
                ultils.notifyError('Tạo trạm dịch vụ thất bại');
            }
        };

        createStation();
    };

    return (
        <div className='relative mx-2 flex flex-1 flex-col justify-center'>
            <div className='absolute top-6 flex w-full'>
                <Button
                    className='absolute'
                    rounded
                    onClick={() => navigate(from)}
                >
                    Quay lại
                </Button>
                <h1 className='w-full text-center text-2xl font-bold'>
                    Tạo trạm dịch vụ mới
                </h1>
            </div>
            <div className='mx-2 mb-10 mt-32 grid grid-cols-3 gap-1 rounded-md border-2 border-primary-light p-3 md:mx-40'>
                <div className='col-span-3'>
                    <h3>Tên trạm dịch vụ</h3>
                    <Input
                        className={'w-full border-2 border-primary p-2'}
                        value={stationName}
                        onChange={handleChangeStationName}
                    />
                </div>
                <div className='relative col-span-3'>
                    <h3>Địa chỉ</h3>
                    <Input
                        className={'w-full border-2 border-primary p-2'}
                        value={addressStationInput}
                        onChange={handleChangeAddressInput}
                    />

                    {suggestAddresses.length > 0 && showSearchResult && (
                        <SearchResult
                            data={suggestAddresses}
                            onItemClick={handleChooseAddressItem}
                        />
                    )}
                </div>

                <div className='col-span-3 mt-10'>
                    <h3 className='mb-2 text-center text-xl font-bold'>
                        Tọa độ bản đồ
                    </h3>
                    <GoongMap ref={mapRef} className='h-56 w-full bg-primary' />
                </div>

                <div className='col-span-3 mt-10 flex justify-center'>
                    <Button
                        className='px-16'
                        rounded
                        onClick={handleCreateStation}
                    >
                        Lưu
                    </Button>
                </div>
            </div>
        </div>
    );
}

CreateStation.propTypes = {};

SearchResult.propTypes = {
    data: PropTypes.array,
    onItemClick: PropTypes.func,
};

export default CreateStation;
