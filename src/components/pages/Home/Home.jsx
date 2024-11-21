import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import HomeContent from '@/src/components/HomeContent/HomeContent';
import ServiceCategory from '@/src/components/pages/Home/ServiceCategory';
import configs from '@/src/configs';
import useUser from '@/src/hooks/useUser.js';
import serviceService from '@/src/services/serviceService.js';

function Home() {
    const [serviceList, setServiceList] = useState([]);

    const user = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !navigate) {
            return;
        }

        if (user.user.role === configs.USER_ROLES.admin) {
            navigate(configs.routes.admin.dashboard.services);
        }
    }, [user, navigate]);
    const handleChooseServiceCategory = useCallback((categoryId) => {
        try {
            let params = {
                active: 1,
            };

            if (categoryId === '#') {
                // find all services
                params = { ...params };
            } else {
                params = {
                    ...params,
                    category_id: categoryId,
                };
            }

            const fetchServicesByCategory = async (params) => {
                const services = await serviceService.getListService(params);
                setServiceList(services.data.data);
            };

            fetchServicesByCategory(params);
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            const services = await serviceService.getListService({ active: 1 });

            if (services && services.data) {
                setServiceList(services.data?.data);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className='flex flex-row'>
            <div className='h-full w-60'>
                <ServiceCategory
                    onChooseServiceCategory={handleChooseServiceCategory}
                />
            </div>
            <div className='mx-2 flex-1'>
                <HomeContent data={serviceList} />
            </div>
        </div>
    );
}

export default Home;
