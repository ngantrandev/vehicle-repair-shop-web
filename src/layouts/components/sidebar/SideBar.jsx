import { PropTypes } from 'prop-types';
import { useCallback, useState } from 'react';

import Menu from '../menu';
import SideBarItem from './SideBarItem';
import configs from '../../../configs';

const items = [
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
    {
        title: 'Thống kê',
        to: configs.routes.admin.statistics,
    },
];

function SideBar({ className }) {
    const [activeItem, setActiveItem] = useState(0);

    const handleChangeActiveItem = useCallback((index) => {
        setActiveItem(index);
    }, []);

    return (
        <aside className={className}>
            <Menu className='grid w-full grid-cols-3 flex-col gap-y-1 md:flex'>
                {items.map((item, index) => (
                    <SideBarItem
                        key={index}
                        title={item.title}
                        to={item.to}
                        active={activeItem === index}
                        onClick={() => handleChangeActiveItem(index)}
                    />
                ))}
            </Menu>
        </aside>
    );
}

SideBar.propTypes = {
    className: PropTypes.string,
};

export default SideBar;
