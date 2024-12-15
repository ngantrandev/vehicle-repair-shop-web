import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { ToastContainer } from 'react-toastify';

import Header from '@/src/layouts/components/header';
import configs from '@/src/configs';
import Menu from '@/src/layouts/components/menu';
import SideBarItem from '@/src/layouts/components/sidebar/SideBarItem';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import SatelliteAltOutlinedIcon from '@mui/icons-material/SatelliteAltOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const items = [
    {
        title: 'Thống kê',
        to: configs.routes.admin.statistics,
        isLabel: false,
        icon: HomeOutlinedIcon,
    },
    {
        title: 'Danh sách lịch hẹn',
        to: configs.routes.admin.dashboard.bookings,
        isLabel: false,
        icon: CalendarMonthOutlinedIcon,
    },
    {
        title: 'Quản trị',
        isLabel: true,
    },
    {
        title: 'Danh sách dịch vụ',
        to: configs.routes.admin.dashboard.services,
        isLabel: false,
        icon: SupportAgentOutlinedIcon,
    },
    {
        title: 'Danh sách khách hàng',
        to: configs.routes.admin.dashboard.users,
        isLabel: false,
        icon: Person2OutlinedIcon,
    },
    {
        title: 'Danh sách nhân viên',
        to: configs.routes.admin.dashboard.staffs,
        isLabel: false,
        icon: HandymanOutlinedIcon,
    },
    {
        title: 'Danh sách trạm dịch vụ',
        to: configs.routes.admin.dashboard.stations,
        isLabel: false,
        icon: SatelliteAltOutlinedIcon,
    },
    {
        title: 'Danh mục phụ tùng',
        to: configs.routes.admin.items.list,
        isLabel: false,
    },
    {
        title: 'Nhập hàng',
        to: configs.routes.admin.inventories.import,
        isLabel: false,
        icon: AddShoppingCartIcon,
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
                    if (item.isLabel == false && item.to.includes(pathSplit)) {
                        matchedIndex = index;
                        return;
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
                        <Menu className='w-full'>
                            {items.map((item, index) => {
                                if (item.isLabel) {
                                    return (
                                        <div
                                            key={index}
                                            className='px-4 py-2 font-bold'
                                        >
                                            {item.title}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <SideBarItem
                                            key={index}
                                            title={item.title}
                                            to={item.to}
                                            icon={item.icon}
                                            active={activeItem === index}
                                            onClick={() =>
                                                handleChangeActiveItem(index)
                                            }
                                        />
                                    );
                                }
                            })}
                        </Menu>
                    </aside>
                    <div className='flex-1'>{children}</div>
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
