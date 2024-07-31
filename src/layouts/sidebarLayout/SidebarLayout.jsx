import { PropTypes } from 'prop-types';

import SideBar from '../components/sidebar';
import Header from '../components/header';

function SidebarLayout({ children }) {
    return (
        <div className='mx-2 mb-2 md:mx-5'>
            <div className='h-screen w-full'>
                <Header className='flex h-[70px] w-full items-center justify-between gap-x-2 border-b-2 bg-white py-[14px] sm:gap-x-8 md:gap-x-16 lg:gap-x-4' />
                <div className='flex h-screen w-full'>
                    <SideBar className='mt-3 w-40 border-r-2 px-2' />
                    {children}
                </div>
            </div>
        </div>
    );
}

SidebarLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default SidebarLayout;
