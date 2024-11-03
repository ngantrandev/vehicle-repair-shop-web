import PropTypes from 'prop-types';

import ultils from '../../ultils/ultils';

const baseApiEnpoint = import.meta.env.VITE_API_BASE_URL;

function ServiceItem({ itemData, className, ...otherProps }) {
    const customClassName = ['h-72 w-72 overflow-hidden border-2'];

    const {
        name,
        price,
        estimated_time: time,
        image_url,
    } = itemData;

    const props = {
        ...otherProps,
    };

    customClassName.push(className);

    return (
        <div
            id='service-items'
            className={customClassName.join(' ')}
            {...props}
        >
            <div
                id='item-header'
                className='flex h-2/3 items-center justify-center font-bold'
            >
                <img
                    className='h-full w-full object-cover'
                    src={`${baseApiEnpoint}${image_url}`}
                    alt={name}
                />
            </div>
            <div
                id='item-footer'
                className='flex h-1/3 flex-col justify-between p-2 lg:p-3 border-t-2'
            >
                <h1 className='overflow-hidden text-ellipsis whitespace-nowrap text-sm md:text-base'>
                    {name}
                </h1>
                <p>{`Tạm tính ${ultils.getCurrencyFormat(price)}`}</p>
                <div className='flex items-center gap-1'>
                    <svg
                        className='w-4'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-7.59V4h2v5.59l3.95 3.95-1.41 1.41L9 10.41z' />
                    </svg>
                    <span>{time}</span>
                </div>
            </div>
        </div>
    );
}

ServiceItem.propTypes = {
    className: PropTypes.string,
    itemData: PropTypes.object.isRequired,
};

export default ServiceItem;
