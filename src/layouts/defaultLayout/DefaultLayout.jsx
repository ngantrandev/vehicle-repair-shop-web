import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';

import Header from '@/src/layouts/components/header';

function DefaultLayout({ children }) {
    return (
        <div className='h-screen md:mx-5'>
            <div className='flex h-full w-full flex-col'>
                <Header className='mx-2 flex items-center justify-between gap-x-2 border-b-2 bg-white py-[8px] sm:gap-x-8 md:mx-5 md:gap-x-16 lg:gap-x-4' />
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
