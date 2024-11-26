import { NavLink } from 'react-router-dom';
import { PropTypes } from 'prop-types';

const activeStyle = 'bg-primary-supper-light text-white';

function SideBarItem({ title, to, icon: Icon, active, onClick }) {
    return (
        <NavLink
            to={to}
            className={`flex items-center gap-2 border-2 px-5 py-2 hover:bg-primary-supper-light hover:text-white md:border-0 ${active && activeStyle}`}
            onClick={onClick}
        >
            {Icon && <Icon className='' color='inherit' />}
            <span className='text-sm md:text-lg hidden md:block'>{title}</span>
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
