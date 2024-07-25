import { useEffect, useState } from 'react';
import Item from './Item';

function User() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        setUsers([
            {
                firstname: 'Nguyễn',
                lastname: 'Văn A',
                email: 'toaltral',
                phone: '0123456789',
                role: 'admin',
            },
            {
                firstname: 'Nguyễn',
                lastname: 'Văn B',
                email: 'toaltral',
                phone: '0123456789',
                role: 'admin',
            },
            {
                firstname: 'Nguyễn',
                lastname: 'Văn C',
                email: 'toaltral',
                phone: '0123456789',
                role: 'admin',
            },
        ]);
    }, []);
    return (
        <div className='relative m-5 w-full border-collapse overflow-x-auto border-2 shadow-md sm:rounded-lg'>
            <table className='w-full table-auto'>
                <thead className='h-8 border-y-2 bg-primary-supper-light'>
                    <tr className='text-left'>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Admin</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => {
                        return (
                            <Item
                                key={index}
                                data={user}
                                className={'hover:bg-gray-200'}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default User;
