import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { ToastContainer } from 'react-toastify';

import Header from '@/src/layouts/components/header';
import configs from '@/src/configs';
import Menu from '@/src/layouts/components/menu';
import SideBarItem from '@/src/layouts/components/sidebar/SideBarItem';

const items = [
    {
        title: 'Thống kê',
        to: configs.routes.admin.statistics,
    },
    {
        title: 'Danh sách dịch vụ',
        to: configs.routes.admin.dashboard.services,
    },
    {
        title: 'Danh sách khách hàng',
        to: configs.routes.admin.dashboard.users,
    },
    {
        title: 'Danh sách nhân viên',
        to: configs.routes.admin.dashboard.staffs,
    },
    {
        title: 'Danh sách đặt lịch',
        to: configs.routes.admin.dashboard.bookings,
    },
    {
        title: 'Danh sách trạm dịch vụ',
        to: configs.routes.admin.dashboard.stations,
    },
];

function SidebarLayout({ children }) {
    const [activeItem, setActiveItem] = useState(0);
    const location = useLocation();

    const handleChangeActiveItem = useCallback((index) => {
        setActiveItem(index);
    }, []);

    useEffect(() => {
        const pathSplits = location.pathname.split('/');

        let matchedIndex = -1;

        pathSplits.forEach((pathSplit) => {
            items.forEach((item, index) => {
                if (pathSplit !== 'admin' && pathSplit != 'dashboard') {
                    if (item.to.includes(pathSplit)) {
                        matchedIndex = index;
                        return
                    }
                }
            });
        });

        if (matchedIndex !== -1) {
            setActiveItem(matchedIndex);
        }
    }, [location.pathname]);

    return (
        <div className='h-screen'>
            <div className='flex h-full flex-col'>
                <Header className='mx-2 flex items-center justify-between gap-x-2 border-b-2 bg-white py-[8px] sm:gap-x-8 md:mx-5 md:gap-x-16 lg:gap-x-4' />
                <div className='flex h-auto flex-1'>
                    <aside className='border-r-2'>
                        <Menu className='grid w-full grid-cols-3 flex-col md:flex'>
                            {items.map((item, index) => (
                                <SideBarItem
                                    key={index}
                                    title={item.title}
                                    to={item.to}
                                    active={activeItem === index}
                                    onClick={() =>
                                        handleChangeActiveItem(index)
                                    }
                                />
                            ))}
                        </Menu>
                    </aside>
                    <div className='flex-1 bg-[#f1f1ee]'>{children}</div>
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
