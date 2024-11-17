import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';

import staffService from '../../../../services/staffService';
import configs from '../../../../configs';
import StaffList from './StaffList';
import ultils from '../../../../ultils/ultils';
import Button from '../../../button';

function Staff() {
    const [staffs, setStaffs] = useState([]);
    // const [csvData, setCsvData] = useState([]);

    useEffect(() => {
        const fetchStaffs = async () => {
            try {
                const res = await staffService.getAllStaffs();

                if (res.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                const resData = res.data;

                setStaffs(resData.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchStaffs();
    }, []);

    // useEffect(() => {
    //     const exportData = staffs.reduce((acc, user, index) => {
    //         const data = {
    //             STT: index + 1,
    //             'Mã khách hàng': user.id,
    //             'Tên khách hàng': user.lastname + ' ' + user.firstname,
    //             Email: user.email,
    //             'Số điện thoại': '' + user.phone,
    //             'Địa chỉ':
    //                 user?.address &&
    //                 user?.address?.address_name +
    //                     ' ' +
    //                     user?.address?.full_address,
    //             'Ngày tạo': '' + ultils.getFormatedTime(user.created_at),
    //             'Trạng thái': user.active == 1 ? 'Hoạt động' : 'Khóa',
    //         };

    //         acc.push(data);

    //         return acc;
    //     }, []);

    //     setCsvData(exportData);
    // }, [staffs]);

    // const fileName = `user_list_${dayjs().format('YYYY-MM-DD')}.csv`;

    return (
        <div className='flex flex-1 flex-col items-center px-0 md:px-10'>
            <div className='flex w-full justify-between py-5'>
                <h1 className='text-center text-3xl font-bold'>
                    Danh sách nhân viên
                </h1>

                {/* <Button rounded>
                    <CSVLink data={csvData} filename={fileName}>
                        Xuất excel
                    </CSVLink>
                </Button> */}
            </div>

            <StaffList
                data={staffs}
                className='w-full flex-1 border-collapse overflow-x-auto md:w-full'
            />
        </div>
    );
}

export default Staff;
