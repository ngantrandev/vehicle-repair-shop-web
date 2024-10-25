import { useEffect, useState } from 'react';

import userService from '../../../../services/userService';
import configs from '../../../../configs';
import Paginateditems from '../../../paginateditems';
import UserList from './UserList';

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
        <div className='flex flex-1 flex-col items-center px-0 md:px-4'>
            <h1 className='py-10 text-center text-3xl font-bold'>
                Danh sách tài khoản
            </h1>

            <Paginateditems data={users} itemsPerPage={10} size={8}>
                <UserList className='relative m-5 w-max border-collapse overflow-x-auto md:w-full' />
            </Paginateditems>
        </div>
    );
}

export default User;
