import { PropTypes } from 'prop-types';

import SideBar from '../components/sidebar';

function DefaultLayout({ children }) {
    return (
        <div className='h-screen w-full'>
            <div className='flex h-screen w-full'>
                <SideBar className='mt-3 w-40 border-r-2 px-2' />
                {children}
            </div>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
