import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import Button from '../../../button';
import stationsService from '../../../../services/stationsService';
import configs from '../../../../configs';
import Input from '../../../input';
import GoongMap from '../../../map/GoongMap';
import ultils from '../../../../ultils';
import useDebounce from '../../../../hooks/useDebounce';
import goongMapService from '../../../../services/goongMapService';

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

function StationDetail() {
    const { station_id: stationId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { from } = location.state;

    const [stationName, setStationName] = useState('');
    const [stationAddressInput, setStationAddressInput] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isProgrammaticChange, setIsProgrammaticChange] = useState(false);

    const [suggestAddresses, setSuggestAddresses] = useState([]);
    const [showSearchResult, setShowSearchResult] = useState(false);

    const addressInputDebounce = useDebounce(stationAddressInput, 500);

    const mapRef = useRef(null);

    const [station, setStation] = useState(null);

    const handleChangeStationName = useCallback((e) => {
        const value = e.target.value;

        setStationName(value);
    }, []);

    const handleChangeStationAddressInput = useCallback((e) => {
        const value = e.target.value;

        setIsProgrammaticChange(false);
        setStationAddressInput(value);
    }, []);

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

    useEffect(() => {
        const fetchStation = async () => {
            const res = await stationsService.getStationById(stationId);

            if (res.status !== configs.STATUS_CODE.OK) {
                return;
            }

            const resData = res.data;

            const station = resData.data;

            setStation(station);

            setSelectedAddress(station?.address);

            setIsProgrammaticChange(true);
            setStationAddressInput(ultils.getFormatedAddress(station?.address));
            setStationName(station.name);
        };

        fetchStation();
    }, [stationId]);

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

    const currentPoint = useMemo(() => {
        const address = station?.address || {};

        const { longitude, latitude } = address;

        if (!longitude || !latitude) return [];

        return [longitude, latitude];
    }, [station]);

    const handleUpdateStation = () => {
        const updateStation = async () => {
            if (!selectedAddress) {
                ultils.notifyError('Vui lòng chọn địa chỉ trên bản đồ');
                return;
            }
            const { latitude, longitude } = mapRef.current.center;

            const data = {
                name: stationName,
                place_id: selectedAddress.place_id,
                address_id: station.address.id,
                address_name: selectedAddress.address_name,
                full_address: selectedAddress.full_address,
                longitude,
                latitude,
            };

            const res = await stationsService.updateStation(stationId, data);

            if (res.status !== configs.STATUS_CODE.OK) {
                return;
            }

            ultils.notifySuccess('Cập nhật trạm thành công');
        };

        updateStation();
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
                    Chỉnh sửa thông tin trạm dịch vụ
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
                        value={stationAddressInput}
                        onChange={handleChangeStationAddressInput}
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
                    <GoongMap
                        ref={mapRef}
                        className='h-56 w-full bg-primary'
                        currentPoint={currentPoint}
                    />
                </div>

                <div className='col-span-3 mt-10 flex justify-center'>
                    <Button
                        className='px-16'
                        rounded
                        onClick={handleUpdateStation}
                    >
                        Lưu
                    </Button>
                </div>
            </div>
        </div>
    );
}

StationDetail.propTypes = {};
SearchResult.propTypes = {
    data: PropTypes.array,
    onItemClick: PropTypes.func,
};

export default StationDetail;
