import PropTypes from 'prop-types';

function RightArrow({ className }) {
    return (
        <svg
            viewBox='0 0 32 32'
            xmlns='http://www.w3.org/2000/svg'
            className={className}
        >
            <title />
            <g data-name='Layer 2' id='Layer_2'>
                <path d='M22,9a1,1,0,0,0,0,1.42l4.6,4.6H3.06a1,1,0,1,0,0,2H26.58L22,21.59A1,1,0,0,0,22,23a1,1,0,0,0,1.41,0l6.36-6.36a.88.88,0,0,0,0-1.27L23.42,9A1,1,0,0,0,22,9Z' />
            </g>
        </svg>
    );
}

RightArrow.propTypes = {
    className: PropTypes.string,
};

export default RightArrow;
