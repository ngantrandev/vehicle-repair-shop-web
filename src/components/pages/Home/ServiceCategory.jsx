import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import MenuIcon from '@mui/icons-material/Menu';

import serviceService from '@/src/services/serviceService';

function ServiceCategory({ onChooseServiceCategory, hide }) {
    const [serviceCategories, setServiceCategories] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            const serviceCategories =
                await serviceService.getServiceCategories();

            if (serviceCategories && serviceCategories.data) {
                setServiceCategories(serviceCategories.data.data);
            }
        };

        fetchServices();
    }, []);

    return (
        <>
            <div className='flex w-full items-center justify-center gap-2 bg-[#484848] py-1 text-center text-white'>
                <MenuIcon />
                Danh mục dịch vụ
            </div>
            <div
                className={`text-md mt-2 flex cursor-pointer flex-col gap-y-2 px-2 font-bold text-[#555] ${hide && 'hidden'}`}
            >
                <p
                    className='hover:text-primary-supper-light'
                    onClick={() =>
                        onChooseServiceCategory && onChooseServiceCategory('#')
                    }
                >
                    Tất cả
                </p>
                {serviceCategories.map(({ id, name }) => {
                    return (
                        <p
                            key={id}
                            className='hover:text-primary-supper-light'
                            onClick={() => onChooseServiceCategory(id)}
                        >
                            {name}
                        </p>
                    );
                })}
            </div>
        </>
    );
}

ServiceCategory.propTypes = {
    onChooseServiceCategory: PropTypes.func,
    hide: PropTypes.bool,
};

export default memo(ServiceCategory);
