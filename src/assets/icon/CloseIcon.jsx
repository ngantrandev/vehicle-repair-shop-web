import PropTypes from 'prop-types';

function CloseIcon({ className }) {
    return (
        <svg
            className={className}
            fill='none'
            height='24'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            viewBox='0 0 24 24'
            width='24'
            xmlns='http://www.w3.org/2000/svg'
        >
            <circle cx='12' cy='12' r='10' />
            <line x1='15' x2='9' y1='9' y2='15' />
            <line x1='9' x2='15' y1='9' y2='15' />
        </svg>
    );
}

CloseIcon.propTypes = {
    className: PropTypes.string,
};

export default CloseIcon;
