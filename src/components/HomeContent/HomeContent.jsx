import PropTypes from 'prop-types';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from '@mui/material';

import ServiceItem from '@/src/components/servicelist/ServiceItem';

const itemsPerPage = 8;

export default function HomeContent({ data }) {
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
        <div>
            <div id='banner' className='h-56'>
                <div className='relative h-full rounded-xl bg-primary-light p-[2rem] font-bold text-white'>
                    <div
                        id='title'
                        className='text-2xl font-bold lg:ml-[2rem] lg:text-[2rem]'
                    >
                        Bảo dưỡng xe
                    </div>
                    <div
                        id='subtitle'
                        className='mt-3 text-xs lg:ml-[4rem] lg:mr-[10rem] lg:mt-10 lg:text-base'
                    >
                        Chúng tôi cung cấp dịch vụ bảo dưỡng xe cao cấp, áp dụng
                        đối với nhiều dòng xe. Cam kết bảo đảm chất lượng cho
                        quý khách hàng.
                    </div>
                </div>
            </div>
            <div
                id='services-container'
                className='flex flex-col items-center gap-4'
            >
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
                                className='w-full hover:-translate-y-1 hover:cursor-pointer hover:border hover:border-primary'
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
        </div>
    );
}

HomeContent.propTypes = {
    data: PropTypes.array,
};
