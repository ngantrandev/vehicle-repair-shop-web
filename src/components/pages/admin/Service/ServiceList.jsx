import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Item from './Item';

function ServiceList({ data, className }) {
    const [services, setServices] = useState([]);

    useEffect(() => {
        setServices(data);
    }, [data]);

    return (
        <div className={`grid grid-cols-5 gap-4 ${className}`}>
            {services.map((service, index) => {
                return (
                    <Item
                        key={index}
                        data={service}
                        className='col-span-1 h-[200px] rounded-lg border-[1px] border-opacity-5 p-2 shadow-lg shadow-slate-200 hover:-translate-y-2 hover:cursor-pointer'
                    />
                );
            })}
        </div>
    );
}

ServiceList.propTypes = {
    data: PropTypes.array,
    className: PropTypes.string,
};

export default ServiceList;
