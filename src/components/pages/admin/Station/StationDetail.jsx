import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from '@/src/components/button';
import Input from '@/src/components/input';
import GoongMap from '@/src/components/map/GoongMap';
import configs from '@/src/configs';
import useDebounce from '@/src/hooks/useDebounce';
import goongMapService from '@/src/services/goongMapService';
import stationsService from '@/src/services/stationsService';
import ultils from '@/src/ultils';

import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';

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

    const [stationName, setStationName] = useState('');
    const [stationAddressInput, setStationAddressInput] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isProgrammaticChange, setIsProgrammaticChange] = useState(false);

    const [suggestAddresses, setSuggestAddresses] = useState([]);
    const [showSearchResult, setShowSearchResult] = useState(false);

    const addressInputDebounce = useDebounce(stationAddressInput, 500);

    const mapRef = useRef(null);

    const [station, setStation] = useState(null);

    const { setBreadcrumbsData } = useBreadcrumbs();

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Dashboard',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.stations,
                label: 'Danh sách trạm dịch vụ',
            },
            {
                to: '',
                label: 'Chi tiết trạm dịch vụ',
            },
        ]);
    }, [setBreadcrumbsData]);

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
        <div className='relative flex h-full flex-1 flex-col bg-white md:px-4'>
            <div className='my-5'>
                <Breadcrumbs />
            </div>
            <div className='mb-10 grid grid-cols-3 gap-1 gap-y-5 rounded-md border-2 border-primary-light p-3'>
                <div className='col-span-1'>
                    <h3 className='mb-2'>Tên trạm dịch vụ</h3>
                    <Input
                        className={'w-full border-2 border-primary p-2'}
                        value={stationName}
                        onChange={handleChangeStationName}
                    />
                </div>
                <div className='col-span-2 col-start-1'>
                    <h3 className='mb-2'>Địa chỉ</h3>
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

                <div className='col-span-3'>
                    <h3 className='mb-2 text-center text-xl font-bold'>
                        Tọa độ bản đồ
                    </h3>
                    <GoongMap
                        ref={mapRef}
                        className='h-56 w-full bg-primary'
                        currentPoint={currentPoint}
                    />
                </div>
            </div>
            <div className='flex justify-center'>
                <Button className='px-16' rounded onClick={handleUpdateStation}>
                    Lưu
                </Button>
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
