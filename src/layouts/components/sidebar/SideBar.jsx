import { PropTypes } from 'prop-types';

import Menu from '../menu';
import SideBarItem from './SideBarItem';
import configs from '../../../configs';

function SideBar({ className }) {
    return (
        <aside className={className}>
            <Menu className='flex flex-col gap-y-1'>
                <SideBarItem
                    title='Danh sách dịch vụ'
                    to={configs.routes.admin.dashboard.services}
                />
                <SideBarItem
                    title='Danh sách tài khoản'
                    to={configs.routes.admin.dashboard.users}
                />
            </Menu>
        </aside>
    );
}

SideBar.propTypes = {
    className: PropTypes.string,
};

export default SideBar;
