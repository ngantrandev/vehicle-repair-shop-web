import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';

import Header from '@/src/layouts/components/header';

function DefaultLayout({ children }) {
    return (
        <div className='mx-2 md:mx-12'>
            <div className='h-full w-full'>
                <Header className='flex h-[70px] w-full items-center justify-between gap-x-2 border-b-2 bg-white py-[14px] sm:gap-x-8 md:gap-x-16 lg:gap-x-4' />
                {children}
            </div>
            <ToastContainer
                position='bottom-right'
                autoClose={5000}
                limit={5}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover
                theme='colored'
            />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node,
};

export default DefaultLayout;
