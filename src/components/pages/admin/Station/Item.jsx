import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import ultils from '../../../../ultils/ultils.js';

const Item = forwardRef(function Item({ data, className, onClick }, ref) {
    const { name, address } = data;
    return (
        <tr className={className} ref={ref} onClick={onClick}>
            <td>{name}</td>
            <td>{ultils.getFormatedAddress(address)}</td>
        </tr>
    );
});

Item.propTypes = {
    data: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default Item;
