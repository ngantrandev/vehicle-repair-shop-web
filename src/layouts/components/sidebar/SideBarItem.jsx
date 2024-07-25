import { NavLink } from 'react-router-dom';
import { PropTypes } from 'prop-types';

const activeStyle = 'bg-primary-light    ';

function SideBarItem({ title, to, icon }) {
    return (
        <NavLink
            to={to}
            className={(nav) =>
                `block rounded-md p-4 hover:bg-primary-supper-light ${nav.isActive && activeStyle}`
            }
        >
            <span>{icon}</span>
            <span>{title}</span>
        </NavLink>
    );
}

SideBarItem.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.node,
};

export default SideBarItem;
