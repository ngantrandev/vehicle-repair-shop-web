import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';

import userService from '../../../../services/userService';
import configs from '../../../../configs';
import UserList from './UserList';
import ultils from '../../../../ultils/ultils';
import Button from '../../../button';

function User() {
    const [users, setUsers] = useState([]);
    const [csvData, setCsvData] = useState([]);

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

    useEffect(() => {
        const exportData = users.reduce((acc, user, index) => {
            const data = {
                STT: index + 1,
                'Mã khách hàng': user.id,
                'Tên khách hàng': user.lastname + ' ' + user.firstname,
                Email: user.email,
                'Số điện thoại': '' + user.phone,
                'Địa chỉ':
                    user?.address &&
                    user?.address?.address_name +
                        ' ' +
                        user?.address?.full_address,
                'Ngày tạo': '' + ultils.getFormatedTime(user.created_at),
                'Trạng thái': user.active == 1 ? 'Hoạt động' : 'Khóa',
            };

            acc.push(data);

            return acc;
        }, []);

        setCsvData(exportData);
    }, [users]);

    const fileName = `user_list_${dayjs().format('YYYY-MM-DD')}.csv`;

    return (
        <div className='flex flex-1 flex-col items-center px-0 md:px-10'>
            <div className='flex w-full justify-between py-5'>
                <h1 className='text-center text-3xl font-bold'>
                    Danh sách khách hàng
                </h1>

                <Button rounded>
                    <CSVLink data={csvData} filename={fileName}>
                        Xuất excel
                    </CSVLink>
                </Button>
            </div>

            <UserList
                data={users}
                className='w-full flex-1 border-collapse overflow-x-auto md:w-full'
            />
        </div>
    );
}

export default User;
