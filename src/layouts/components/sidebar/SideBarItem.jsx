import { NavLink } from 'react-router-dom';
import { PropTypes } from 'prop-types';

const activeStyle = 'bg-primary-light    ';

function SideBarItem({ title, to, icon, active, onClick }) {
    return (
        <NavLink
            to={to}
            className={`block border-2 px-4 py-2 hover:bg-primary-supper-light md:border-0 ${active && activeStyle}`}
            onClick={onClick}
        >
            <span>{icon}</span>
            <span className='text-sm md:text-lg'>{title}</span>
        </NavLink>
    );
}

SideBarItem.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.node,
    active: PropTypes.bool,
    onClick: PropTypes.func,
};

export default SideBarItem;
