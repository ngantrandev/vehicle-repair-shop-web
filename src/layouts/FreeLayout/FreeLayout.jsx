import PropTypes from 'prop-types';

function FreeLayout({ children }) {
    return <div className='flex h-screen w-full flex-col'>{children}</div>;
}

FreeLayout.propTypes = {
    children: PropTypes.node,
};

export default FreeLayout;
