import { PropTypes } from 'prop-types';

import Menu from '../menu';
import SideBarItem from './SideBarItem';
import configs from '../../../configs';

function SideBar({ className }) {
    return (
        <aside className={className}>
            <Menu className='grid w-full grid-cols-3 flex-col gap-y-1 md:flex'>
                <SideBarItem
                    title='Danh sách dịch vụ'
                    to={configs.routes.admin.dashboard.services}
                />
                <SideBarItem
                    title='Danh sách khách hàng'
                    to={configs.routes.admin.dashboard.users}
                />
                <SideBarItem
                    title='Danh sách nhân viên'
                    to={configs.routes.admin.dashboard.staffs}
                />
                <SideBarItem
                    title='Danh sách đặt lịch'
                    to={configs.routes.admin.dashboard.bookings}
                />
                <SideBarItem
                    title='Danh sách trạm dịch vụ'
                    to={configs.routes.admin.dashboard.stations}
                />

                <SideBarItem
                    title='Thống kê'
                    to={configs.routes.admin.statistics}
                />
            </Menu>
        </aside>
    );
}

SideBar.propTypes = {
    className: PropTypes.string,
};

export default SideBar;
