import { useEffect, useState } from 'react';

import staffService from '@/src/services/staffService';
import configs from '@/src/configs';

import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import StaffList from '@/src/components/pages/admin/Staff/StaffList';
import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';

function Staff() {
    const [staffs, setStaffs] = useState([]);
    // const [csvData, setCsvData] = useState([]);

    const { setBreadcrumbsData } = useBreadcrumbs();

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Dashboard',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.staffs,
                label: 'Danh sách nhân viên',
            },
        ]);
    }, [setBreadcrumbsData]);

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
        <div className='flex h-full flex-1 flex-col items-center bg-white px-0 md:px-4'>
            <div className='flex w-full justify-between py-5'>
                <Breadcrumbs />

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
