import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import serviceService from '@/src/services/serviceService';
import ultils from '@/src/ultils';

export default function TopServices() {
    const [topServices, setTopServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            const topServices = await serviceService.getListTopService();

            if (topServices && topServices.data) {
                setTopServices(topServices.data.data);
            }
        };

        fetchServices();
    }, []);

    return (
        <div>
            <p className='mb-8 inline p-1 text-lg font-bold uppercase text-black'>
                Được quan tâm nhiều
            </p>
            <div className='mt-2 flex flex-col gap-2 border-2 p-2'>
                {topServices.map((service) => (
                    <div key={service.id} className='flex hover:cursor-pointer'>
                        <div className='size-20'>
                            <img
                                src={ultils.getFormatedImageUrl(
                                    service.image_url
                                )}
                                alt={service.name}
                                className='h-full w-full object-cover'
                            />
                        </div>
                        <div className='ml-2 flex-1'>
                            <Link
                                to={`/services/${service.id}/`}
                                state={{
                                    data: service,
                                    from: window.location.pathname,
                                }}
                            >
                                <p className='hover:text-primary'>
                                    {service.name}
                                </p>
                            </Link>
                            <p>{ultils.getCurrencyFormat(service.price)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
