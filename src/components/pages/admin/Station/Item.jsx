import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Item = forwardRef(function Item({ data, className, onClick }, ref) {
    const { name, address } = data;
    const { ward, district, province, street } = address;
    return (
        <tr className={className} ref={ref} onClick={onClick}>
            <td>{name}</td>
            <td>{`${street}, ${ward.name}, ${district.name}, ${province.name}`}</td>
        </tr>
    );
});

Item.propTypes = {
    data: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default Item;
