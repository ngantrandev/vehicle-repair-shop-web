import PropTypes from 'prop-types';

import Header from '../components/header';

function DefaultLayout({ children }) {
    return (
        <div className='mx-2 md:mx-12'>
            <div className='h-full w-full'>
                <Header className='flex h-[70px] w-full items-center justify-between gap-x-2 border-b-2 bg-white py-[14px] sm:gap-x-8 md:gap-x-16 lg:gap-x-4' />
                {children}
            </div>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node,
};

export default DefaultLayout;
