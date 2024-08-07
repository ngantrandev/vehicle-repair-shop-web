import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '../../../button';
import stationsService from '../../../../services/stationsService';
import configs from '../../../../configs';
import Input from '../../../input';
import loadData from '../../../../services/loadData';
import GoongMap from '../../../map/GoongMap';
import ultils from '../../../../ultils';

function CreateStation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { from } = location.state || { from: '/' };

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [stationName, setStationName] = useState('');
    const [stationStreet, setStationStreet] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');

    const mapRef = useRef(null);

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

    const handleCreateStation = async () => {
        const createStation = async () => {
            if (!stationName || stationName.trim().length === 0) {
                ultils.notifyWarning('Vui lòng nhập tên trạm dịch vụ');
                return;
            }

            if (!stationStreet || stationStreet.trim().length === 0) {
                ultils.notifyWarning('Vui lòng nhập tên đường');
                return;
            }

            if (!selectedProvince || selectedProvince.trim().length === 0) {
                ultils.notifyWarning('Vui lòng chọn tỉnh thành');
                return;
            }
            if (!selectedDistrict || selectedDistrict.trim().length === 0) {
                ultils.notifyWarning('Vui lòng chọn quận huyện');
                return;
            }
            if (!selectedWard || selectedWard.trim().length === 0) {
                ultils.notifyWarning('Vui lòng chọn phường xã');
                return;
            }

            const { lng, lat } = mapRef.current.center;
            const data = {
                name: stationName,
                street: stationStreet,
                ward_id: selectedWard,
                lng: lng,
                lat: lat,
            };
            const response = await stationsService.createStation(data);
            if (response.status === configs.STATUS_CODE.OK) {
                ultils.notifySuccess('Tạo trạm dịch vụ thành công');

                setStationName('');
                setStationStreet('');
                setSelectedWard('');
                setSelectedDistrict('');
                setSelectedProvince('');
            } else {
                ultils.notifyError('Tạo trạm dịch vụ thất bại');
            }
        };

        createStation();
    };

    return (
        <div className='relative flex w-full flex-col justify-center'>
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
                    <h3>Tên dịch vụ</h3>
                    <Input
                        className={'w-full border-2 border-primary p-2'}
                        value={stationName}
                        onChange={(e) => setStationName(e.target.value)}
                    />
                </div>
                <div className='col-span-3'>
                    <h3>Tên đường</h3>
                    <Input
                        className={'w-full border-2 border-primary p-2'}
                        value={stationStreet}
                        onChange={(e) => setStationStreet(e.target.value)}
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
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        value={selectedProvince}
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
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        value={selectedDistrict}
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
                        onChange={(e) => setSelectedWard(e.target.value)}
                        value={selectedWard}
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

export default CreateStation;
