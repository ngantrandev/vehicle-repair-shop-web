import PropTypes from 'prop-types';

function ServiceItem({ itemData, className, ...otherProps }) {
    const customClassName = ['h-72 w-72 overflow-hidden rounded-2xl'];

    const { name, price, time } = itemData;

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
                className='flex h-2/3 items-center justify-center bg-pink-light px-1 font-bold lg:px-2'
            >
                <p className='text-center text-lg md:text-2xl lg:text-3xl'>
                    {name}
                </p>
            </div>
            <div
                id='item-footer'
                className='flex h-1/3 flex-col justify-between bg-[#47484b66] p-2 lg:p-3'
            >
                <h1 className='overflow-hidden text-ellipsis whitespace-nowrap text-sm md:text-base'>
                    {name}
                </h1>
                <p>{price}</p>
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
