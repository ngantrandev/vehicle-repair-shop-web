import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Item from './Item';

function UserList({ className, data }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers(data);
    }, [data]);

    return (
        <div className={className}>
            <table className='w-full table-auto border-2 border-primary-light'>
                <thead className='h-8 border-y-2 bg-primary-supper-light'>
                    <tr className='text-left'>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Vai trò</th>
                        {/* <th>Hành động</th> */}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => {
                        return (
                            <Item
                                key={index}
                                data={user}
                                className={
                                    'hover:cursor-pointer hover:bg-gray-200'
                                }
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

UserList.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
};

export default UserList;
