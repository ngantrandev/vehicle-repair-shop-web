import PropTypes from 'prop-types';

function ArrowFilterIcon({ className, onClick }) {
    return (
        <svg
            onClick={onClick}
            className={className}
            fill='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
        >
            <g id='a' />
            <g id='b'>
                <polygon points='8 14 16 14 12 19 8 14' />
                <polygon points='16 10 8 10 12 5 16 10' />
            </g>
        </svg>
    );
}

ArrowFilterIcon.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default ArrowFilterIcon;
