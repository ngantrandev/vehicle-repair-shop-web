import { useEffect, useState } from 'react';

import Item from './Item';
import userService from '../../../../services/userService';
import configs from '../../../../configs';

function User() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await userService.getAllUsers();

                if (res.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                const resData = res.data;

                setUsers(resData.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsers();
    }, []);
    return (
        <div className='flex w-full flex-col'>
            <h1 className='py-10 text-center text-3xl font-bold'>
                Danh sách tài khoản
            </h1>
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
        </div>
    );
}

export default User;
