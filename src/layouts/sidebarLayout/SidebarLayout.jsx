import { PropTypes } from 'prop-types';
import { ToastContainer } from 'react-toastify';

import SideBar from '../components/sidebar';
import Header from '../components/header';

function SidebarLayout({ children }) {
    return (
        <div className='mb-2'>
            <div className='h-screen'>
                <Header className='mx-2 flex items-center justify-between gap-x-2 border-b-2 bg-white py-[8px] sm:gap-x-8 md:mx-5 md:gap-x-16 lg:gap-x-4' />
                <div className='flex h-screen md:flex-row'>
                    <SideBar className='mt-3' />
                    {children}
                </div>
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

SidebarLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default SidebarLayout;
