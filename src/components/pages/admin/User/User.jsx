import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';

import userService from '@/src/services/userService';
import configs from '@/src/configs';
import ultils from '@/src/ultils/ultils';
import Button from '@/src/components/button';
import UserList from '@/src/components/pages/admin/User/UserList';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';

function User() {
    const [users, setUsers] = useState([]);
    const [csvData, setCsvData] = useState([]);

    const { breadcrumbs, setBreadcrumbsData } = useBreadcrumbs();

    console.log(breadcrumbs);

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Dashboard',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.users,
                label: 'Danh sách khách hàng',
            },
        ]);
    }, [setBreadcrumbsData]);

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
        <div className='flex h-full flex-1 flex-col items-center bg-white px-0 md:px-4'>
            <div className='flex w-full justify-between py-5'>
                <Breadcrumbs />

                <Button rounded className='h-10'>
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
