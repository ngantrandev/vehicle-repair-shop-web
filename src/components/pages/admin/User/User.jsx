import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';

import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import Button from '@/src/components/button';
import UserList from '@/src/components/pages/admin/User/UserList';
import configs from '@/src/configs';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import userService from '@/src/services/userService';
import ultils from '@/src/ultils/ultils';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import Input from '@/src/components/input/Input';

function User() {
    const [users, setUsers] = useState([]);
    const [csvData, setCsvData] = useState([]);

    const { setBreadcrumbsData } = useBreadcrumbs();

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Home',
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

            <div className='mb-8 w-full overflow-hidden rounded-2xl pt-0 shadow-[rgba(0,5,0,0.15)_1px_1px_60px_1px]'>
                <h2 className='border-b-2 px-4 py-2 font-bold'>
                    Bộ lọc tìm kiếm
                </h2>
                <div className='grid w-full grid-cols-6 gap-4 p-8'>
                    <div className='col-span-3 flex w-full gap-2'>
                        <div className='flex-1'>
                            <Input
                                className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                                placeholder='Bạn cần tìm kiếm gì?'
                            />
                        </div>
                        <Button rounded className='h-full'>
                            Tìm kiếm
                        </Button>
                    </div>

                    <div className='col-span-2 col-start-1 flex flex-col'>
                        <label htmlFor='time'>Ngày tạo tài khoản</label>
                        <select
                            name=''
                            id='time'
                            className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                        >
                            <option value=''>Tất cả</option>
                            <option value=''>Mới nhất</option>
                            <option value=''>Cũ nhất</option>
                        </select>
                    </div>
                    <div className='col-span-2 flex flex-col'>
                        <label htmlFor='state'>Sắp xếp theo trạng thái</label>
                        <select
                            name=''
                            id='state'
                            className='h-10 rounded-md border-2 border-neutral-500 px-2 focus:border-primary'
                        >
                            <option value=''>Tất cả</option>
                            <option value=''>Hoạt động</option>
                            <option value=''>Khóa</option>
                        </select>
                    </div>
                </div>
            </div>

            <UserList
                data={users}
                className='w-full flex-1 border-collapse overflow-x-auto md:w-full'
            />
        </div>
    );
}

export default User;
