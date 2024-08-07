import PropTypes from 'prop-types';

function SignOutIcon({ className }) {
    return (
        <svg
            fill='currentColor'
            className={className}
            id='svg8'
            version='1.1'
            viewBox='0 0 12.7 12.7'
            xmlns='http://www.w3.org/2000/svg'
        >
            <g id='layer1' transform='translate(0,-284.3)'>
                <path
                    d='M 7.0555553,285.71111 H 2.1166666 v 9.87779 h 4.938889 v -0.70557 H 2.8222222 v -8.46667 h 4.2333334 z'
                    id='path12'
                />
                <path
                    d='M 4.2333334,289.94445 H 9.172222 l -2.1166667,-2.11667 0.7055557,-0.70555 3.527778,3.52776 -3.527778,3.52779 -0.7055554,-0.70555 2.1166666,-2.11666 H 4.2333334 Z'
                    id='path822'
                />
            </g>
        </svg>
    );
}

SignOutIcon.propTypes = {
    className: PropTypes.string,
};

export default SignOutIcon;
