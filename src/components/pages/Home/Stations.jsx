import { useEffect, useState } from 'react';

import loadData from '@/src/services/loadData';

export default function Stations() {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            const stations = await loadData.getListServiceStation();

            if (stations && stations.data) {
                setStations(stations.data.data);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className=''>
            <div className='w-full bg-[#484848] py-1 text-center text-white'>
                Địa chỉ trạm dịch vụ
            </div>
            <div className='mt-2 flex max-h-96 flex-col gap-y-2 overflow-auto px-2 hover:cursor-pointer'>
                {stations.map(({ id, name, address }) => {
                    const { latitude, longitude, address_name, full_address } =
                        address;
                    return (
                        <div key={id} className='group'>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                                target='_blank'
                                rel='noreferrer'
                            >
                                <p className='text-md font-bold text-primary'>
                                    {name}
                                </p>
                                <p className='text-xs'>
                                    {address_name + ' ' + full_address}
                                </p>
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
