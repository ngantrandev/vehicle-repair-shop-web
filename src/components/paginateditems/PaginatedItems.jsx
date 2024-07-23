import ReactPaginate from 'react-paginate';
import { PropTypes } from 'prop-types';

import React, { useState } from 'react';

function PaginatedItems({ data, itemsPerPage, size, children }) {
    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = data.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(data.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % data.length;

        setItemOffset(newOffset);
    };

    return (
        <>
            {React.cloneElement(children, { data: currentItems })}

            <div className='mt-8 flex w-full justify-center'>
                <ReactPaginate
                    className={`flex h-${size} w-full items-center justify-center gap-2 rounded-md`}
                    breakLabel='...'
                    nextLabel={
                        <svg
                            className='size-5'
                            viewBox='0 0 96 96'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <title />
                            <path d='M69.8437,43.3876,33.8422,13.3863a6.0035,6.0035,0,0,0-7.6878,9.223l30.47,25.39-30.47,25.39a6.0035,6.0035,0,0,0,7.6878,9.2231L69.8437,52.6106a6.0091,6.0091,0,0,0,0-9.223Z' />
                        </svg>
                    }
                    previousLabel={
                        <svg
                            className='size-5'
                            viewBox='0 0 96 96'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <title />
                            <path d='M39.3756,48.0022l30.47-25.39a6.0035,6.0035,0,0,0-7.6878-9.223L26.1563,43.3906a6.0092,6.0092,0,0,0,0,9.2231L62.1578,82.615a6.0035,6.0035,0,0,0,7.6878-9.2231Z' />
                        </svg>
                    }
                    renderOnZeroPageCount={undefined}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    previousClassName={`border size-${size} flex justify-center items-center font-bold border-black select-none active:border-primary active:bg-primary-light active:fill-white`}
                    nextClassName={`flex size-${size} select-none items-center justify-center border border-black font-bold active:bg-primary-light active:fill-white`}
                    pageClassName={`flex size-${size} select-none items-center justify-center border border-black bg-white font-medium text-black hover:bg-primary-light hover:text-white`}
                    activeClassName={`flex items-center justify-center bg-primary font-bold text-white`}
                    pageLinkClassName='flex size-full items-center justify-center'
                    activeLinkClassName='flex size-full items-center justify-center bg-primary text-white'
                />
            </div>
        </>
    );
}

PaginatedItems.propTypes = {
    data: PropTypes.array.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    children: PropTypes.element,
    size: PropTypes.number,
};

export default PaginatedItems;
