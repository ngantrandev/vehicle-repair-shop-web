import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react';
import { useNavigate } from 'react-router-dom';

import Item from './Item.jsx';

function StationList({ data, className }) {
    const [stations, setStations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setStations(data);
    }, [data]);

    const handleClickDetail = (station) => {
        navigate(`/admin/dashboard/stations/${station.id}/modify`, {
            state: { from: window.location.pathname },
        });
    };

    return (
        <table className={className}>
            <thead className='h-8 bg-primary-supper-light'>
                <tr className='text-left'>
                    <th>Tên trạm</th>
                    <th>Địch chỉ</th>
                </tr>
            </thead>
            <tbody>
                {stations.map((station, index) => (
                    <Tippy
                        key={index}
                        content='Xem chi tiết'
                        animation='fade'
                        hideOnClick={false}
                    >
                        <Item
                            data={station}
                            className={'hover:cursor-pointer hover:bg-gray-200'}
                            onClick={() => handleClickDetail(station)}
                        />
                    </Tippy>
                ))}
            </tbody>
        </table>
    );
}

StationList.propTypes = {
    data: PropTypes.array,
    className: PropTypes.string,
};

export default StationList;
