import PropTypes from 'prop-types';

function PinIcon({ className, active }) {
    return (
        <svg
            fill='currentColor'
            className={`h-10 w-10 origin-bottom transition-transform duration-100 ${active ? 'scale-125' : 'scale-100'} ${className}`}
            version='1.1'
            viewBox='0 0 91 91'
            xmlSpace='preserve'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
        >
            <g>
                <path d='M66.9,41.8c0-11.3-9.1-20.4-20.4-20.4c-11.3,0-20.4,9.1-20.4,20.4c0,11.3,20.4,32.4,20.4,32.4S66.9,53.1,66.9,41.8z    M37,41.4c0-5.2,4.3-9.5,9.5-9.5c5.2,0,9.5,4.2,9.5,9.5c0,5.2-4.2,9.5-9.5,9.5C41.3,50.9,37,46.6,37,41.4z' />
            </g>
        </svg>
    );
}

PinIcon.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
};

export default PinIcon;
