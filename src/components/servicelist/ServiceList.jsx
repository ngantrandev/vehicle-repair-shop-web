import { PropTypes } from 'prop-types';

import ServiceItem from '../serviceitem';

const ServiceList = ({ data }) => {
    return (
        <div
            id='services'
            className='mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'
        >
            {data.map((service, index) => (
                <ServiceItem
                    key={index}
                    itemData={service}
                    className='w-full hover:-translate-y-1 hover:border hover:border-primary'
                />
            ))}
        </div>
    );
};

ServiceList.propTypes = {
    data: PropTypes.array,
};

export default ServiceList;
