import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { Pagination } from '@mui/material';

import ServiceItem from './ServiceItem.jsx';

const ServiceList = ({ data, itemsPerPage = 8 }) => {
    const [page, setPage] = useState(0);

    const currentItems = data.slice(
        page * itemsPerPage,
        page * itemsPerPage + itemsPerPage
    );
    const pageCount = Math.ceil(data.length / itemsPerPage);

    const handlePageClick = (event, page) => {
        setPage(page - 1);
    };

    return (
        <div className='flex flex-col items-center gap-4'>
            <div
                id='services-container'
                className='mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'
            >
                {currentItems.map((service, index) => (
                    <Link
                        key={index}
                        to={`/services/${service.id}/`}
                        state={{
                            data: service,
                            from: window.location.pathname,
                        }}
                    >
                        <ServiceItem
                            itemData={service}
                            className='w-full hover:-translate-y-1 hover:border hover:border-primary'
                        />
                    </Link>
                ))}
            </div>
            <Pagination
                count={pageCount}
                variant='outlined'
                shape='rounded'
                showFirstButton
                showLastButton
                onChange={handlePageClick}
                color='primary'
            />
        </div>
    );
};

ServiceList.propTypes = {
    data: PropTypes.array,
    itemsPerPage: PropTypes.number,
};

export default ServiceList;
