import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';

function Dropdown({
    name,
    data,
    onItemSelect,
    inputPlaceHolder = 'Tìm kiếm...',
    id,
    dropdownOpenId,
    setDropdownOpenId,
    className,
    currentIrem = -1,
    visibleSearch = false,
}) {
    const [dropdownName, setDropdownName] = useState(name);
    const [selectedItem, setSelectedItem] =
        useState(currentIrem); /**id of selected item */
    const isOpen = id === dropdownOpenId;

    useEffect(() => {
        data.forEach((item) => {
            if (item.id === currentIrem) {
                setDropdownName(item.name);
            }
        });
    }, [data, currentIrem]);

    const handleToggle = () => {
        setDropdownOpenId(isOpen ? null : id);
    };

    return (
        <div className={`relative ${className}`}>
            <button
                id={id}
                data-dropdown-toggle='dropdownSearch'
                data-dropdown-placement='bottom'
                className={`inline-flex w-full min-w-28 items-center rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 ${className}`}
                type='button'
                onClick={handleToggle}
            >
                {dropdownName || 'Dropdown'}{' '}
                <svg
                    className='ms-3 h-2.5 w-2.5'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 10 6'
                >
                    <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 1 4 4 4-4'
                    />
                </svg>
            </button>

            <div
                id='dropdownSearch'
                className={`z-10 ${isOpen ? '' : 'hidden'} absolute -bottom-4 left-1/2 w-40 -translate-x-1/2 translate-y-full rounded-lg bg-white shadow-md lg:w-60`}
            >
                {visibleSearch && (
                    <div className='p-3'>
                        <label htmlFor='input-group-search' className='sr-only'>
                            Search
                        </label>
                        <div className='relative'>
                            <div className='rtl:inset-r-0 pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3'>
                                <svg
                                    className='h-4 w-4 text-gray-500'
                                    aria-hidden='true'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 20 20'
                                >
                                    <path
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                                    />
                                </svg>
                            </div>
                            <input
                                type='text'
                                id='input-group-search'
                                className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 ps-10 text-sm text-gray-900 focus:border-blue-500 active:border-primary-light'
                                placeholder={inputPlaceHolder}
                            />
                        </div>
                    </div>
                )}
                <ul
                    className='h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700'
                    aria-labelledby='dropdownSearchButton'
                >
                    {data.map(({ name, id }, index) => {
                        return (
                            <li
                                key={index}
                                onClick={() => {
                                    setSelectedItem(id);
                                    setDropdownName(name);

                                    if (typeof onItemSelect === 'function') {
                                        onItemSelect(id);
                                    }
                                }}
                                className='cursor-pointer'
                            >
                                <div className='flex items-center rounded ps-2 hover:bg-gray-100'>
                                    <span className='ms-2 w-full rounded py-2 text-sm font-medium text-gray-900'>
                                        {name}
                                    </span>
                                    {id === selectedItem && (
                                        <svg
                                            className='size-8 fill-primary-light'
                                            version='1.1'
                                            viewBox='0 0 24 24'
                                            xmlSpace='preserve'
                                            xmlns='http://www.w3.org/2000/svg'
                                            xmlnsXlink='http://www.w3.org/1999/xlink'
                                        >
                                            <g id='info' />
                                            <g id='icons'>
                                                <path
                                                    d='M10,18c-0.5,0-1-0.2-1.4-0.6l-4-4c-0.8-0.8-0.8-2,0-2.8c0.8-0.8,2.1-0.8,2.8,0l2.6,2.6l6.6-6.6   c0.8-0.8,2-0.8,2.8,0c0.8,0.8,0.8,2,0,2.8l-8,8C11,17.8,10.5,18,10,18z'
                                                    id='check'
                                                />
                                            </g>
                                        </svg>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

Dropdown.propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    onItemSelect: PropTypes.func,
    inputPlaceHolder: PropTypes.string,
    className: PropTypes.string,
    dropdownOpenId: PropTypes.string,
    setDropdownOpenId: PropTypes.func,
    id: PropTypes.string,
    currentIrem: PropTypes.number,
    visibleSearch: PropTypes.bool,
};

export default Dropdown;
