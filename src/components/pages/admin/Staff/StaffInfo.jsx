import { useCallback, useEffect, useState } from 'react';

import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import configs from '@/src/configs';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';

import Button from '@/src/components/button';
import Image from '@/src/components/image';
import Input from '@/src/components/input/Input';
import adminStaffService from '@/src/services/admin.staff.service';
import loadData from '@/src/services/loadData';
import ultils from '@/src/ultils';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import { useLocation } from 'react-router-dom';

export default function StaffInfo() {
    const { setBreadcrumbsData } = useBreadcrumbs();
    const [isModify, setIsModify] = useState(false);
    const [staff, setStaff] = useState({});

    const [selectedStation, setSelectedStation] = useState('');
    const [stations, setStations] = useState([]);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [lastInfo, setLastInfo] = useState({});

    const location = useLocation();

    useEffect(() => {
        const loadStations = async () => {
            const res = await loadData.getListServiceStation();

            if (res.status !== configs.STATUS_CODE.OK) {
                return;
            }
            const resData = res.data;
            setStations(resData.data);
        };

        loadStations();
    }, []);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                if (!location || !location.state || !location.state.data)
                    return;

                const res = await adminStaffService.getStaffById(
                    location.state.data.id
                );

                if (res.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                const resData = res.data;
                const staff = resData.data;

                setStaff(staff);

                setFirstname(staff.firstname);
                setLastname(staff.lastname);
                setBirthday(staff.birthday);
                setEmail(staff.email);
                setPhone(staff.phone);
                setSelectedStation(staff?.service_station?.id);
            } catch (error) {
                console.log(error);
            }
        };

        fetchStaff();
    }, [location]);

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Home',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.staffs,
                label: 'Danh sách nhân viên',
            },
            {
                to: '',
                label: 'Thông tin nhân viên',
            },
        ]);
    }, [setBreadcrumbsData]);

    const handleChangeLastname = useCallback((e) => {
        setLastname(e.target.value);
    }, []);

    const handleChangeFirstname = useCallback((e) => {
        setFirstname(e.target.value);
    }, []);

    const handleChangeBirthday = useCallback((e) => {
        setBirthday(e.target.value);
    }, []);

    const handleChangeEmail = useCallback((e) => {
        setEmail(e.target.value);
    }, []);

    const handleChangePhone = useCallback((e) => {
        setPhone(e.target.value);
    }, []);

    const handleClickEdit = useCallback(() => {
        setIsModify(true);
        setLastInfo({
            firstname,
            lastname,
            email,
            phone,
            birthday,
        });
    }, [firstname, lastname, email, phone, birthday]);

    const handleClickCancelEdit = useCallback(() => {
        setIsModify(false);

        setFirstname(lastInfo.firstname);
        setLastname(lastInfo.lastname);
        setEmail(lastInfo.email);
        setPhone(lastInfo.phone);
        setBirthday(lastInfo.birthday);
    }, [lastInfo]);

    const handleClickChangeInfo = useCallback(() => {
        const changeInfo = async () => {
            if (!firstname || firstname.trim() === '') {
                ultils.notifyWarning('Vui lòng nhập tên nhân viên');
                return;
            }

            if (!lastname || lastname.trim() === '') {
                ultils.notifyWarning('Vui lòng nhập họ nhân viên');
                return;
            }

            if (!email || email.trim() === '') {
                ultils.notifyWarning('Vui lòng nhập email');
                return;
            }

            if (!phone || phone.trim() === '') {
                ultils.notifyWarning('Vui lòng nhập số điện thoại');
                return;
            }

            if (!birthday || birthday.trim() === '') {
                ultils.notifyWarning('Vui lòng nhập ngày sinh');
                return;
            }

            const staffData = {
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                birthday: birthday,
                email: email.trim(),
                phone: phone.trim(),
                station_id: selectedStation.toString(),
            };

            const res = await adminStaffService.updateStaffInfo(
                location.state.data.id,
                staffData
            );

            if (res.status === configs.STATUS_CODE.OK) {
                ultils.notifySuccess('Cập nhật thông tin thành công');
                setStaff((pre) => ({
                    ...pre,
                    firstname: firstname.trim(),
                    lastname: lastname.trim(),
                    birthday: birthday,
                    email: email.trim(),
                    phone: phone.trim(),
                }));
                setIsModify(false);
            } else {
                ultils.notifyError('Cập nhật thông tin thất bại');
            }
        };

        changeInfo();
    }, [
        firstname,
        lastname,
        email,
        phone,
        birthday,
        location,
        selectedStation,
    ]);

    return (
        <div className='flex h-full flex-col px-0 pb-4 md:px-4'>
            <div className='flex w-full justify-between py-5'>
                <Breadcrumbs />
            </div>

            <div className='flex-1 overflow-hidden rounded-lg'>
                <div className='flex h-full w-full flex-col shadow-lg'>
                    <div className='h-24 w-full bg-gradient-to-r from-blue-200 to-yellow-100'></div>
                    <div className='m-8 flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <Image
                                src='https://www.w3schools.com/howto/img_avatar.png'
                                alt='avatar'
                                className='size-24 rounded-full'
                            />
                            <div>
                                <div>
                                    <p className='text-lg font-bold'>
                                        {staff.lastname} {staff.firstname}
                                    </p>
                                </div>
                                <div>
                                    <span>Ngày tham gia: </span>
                                    <span>
                                        {ultils.convertTimeToGMT7(
                                            staff.created_at
                                        )}
                                    </span>
                                </div>

                                <div>
                                    <span>Số điện thoại: </span>
                                    <span>{staff.phone}</span>
                                </div>
                                <div>
                                    <span>Email: </span>
                                    <span>{staff.email}</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            rounded
                            className='w-24'
                            onClick={
                                isModify
                                    ? handleClickCancelEdit
                                    : handleClickEdit
                            }
                        >
                            {isModify ? 'Hủy' : 'Chỉnh sửa'}
                        </Button>
                    </div>
                    <div className='mx-8 grid grid-cols-2 gap-8 gap-y-6'>
                        <div className=''>
                            <label htmlFor='lastname' className=''>
                                Họ
                            </label>
                            <Input
                                rounded
                                id='latsname'
                                type='text'
                                placeholder='Nhập họ'
                                className={'w-full p-2'}
                                disabled={!isModify}
                                value={lastname}
                                onChange={handleChangeLastname}
                            />
                        </div>
                        <div className=''>
                            <label htmlFor='firstname' className=''>
                                Tên nhân viên
                            </label>
                            <Input
                                rounded
                                id='firstname'
                                type='text'
                                placeholder='Nhập tên nhân viên'
                                className={'w-full p-2'}
                                disabled={!isModify}
                                value={firstname}
                                onChange={handleChangeFirstname}
                            />
                        </div>

                        <div className=''>
                            <label htmlFor='birthday' className=''>
                                Ngày sinh
                            </label>
                            <Input
                                rounded
                                id='birthday'
                                type='date'
                                placeholder='Nhập ngày sinh'
                                className={'w-full p-2'}
                                disabled={!isModify}
                                value={birthday}
                                onChange={handleChangeBirthday}
                            />
                        </div>
                        <div className=''>
                            <label htmlFor='email' className=''>
                                Email
                            </label>
                            <Input
                                rounded
                                id='email'
                                type='text'
                                placeholder='Nhập email'
                                className={'w-full p-2'}
                                disabled={!isModify}
                                value={email}
                                onChange={handleChangeEmail}
                            />
                        </div>
                        <div className=''>
                            <label htmlFor='phone' className=''>
                                Số điện thoại
                            </label>
                            <Input
                                rounded
                                id='phone'
                                type='text'
                                placeholder='Nhập số điện thoại'
                                className={'w-full p-2'}
                                disabled={!isModify}
                                value={phone}
                                onChange={handleChangePhone}
                            />
                        </div>

                        <div className=''>
                            <span className='text-sm font-medium text-gray-900'>
                                Chi nhánh
                            </span>
                            <select
                                className={`w-full rounded-lg border-2 border-neutral-400 p-2.5 text-sm focus:border-primary-light ${isModify ? '' : 'pointer-events-none select-none border-0 border-gray-100 bg-gray-100 text-neutral-400 outline-none'}`}
                                id='station'
                                value={selectedStation}
                                onChange={(e) => {
                                    setSelectedStation(e.target.value);
                                }}
                            >
                                <option className='p-5'></option>
                                {stations.map(({ id, name }) => {
                                    return (
                                        <option key={id} value={id}>
                                            {name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className='flex w-full flex-1 items-end justify-center'>
                        {isModify && (
                            <Button
                                rounded
                                className='h-10'
                                onClick={handleClickChangeInfo}
                            >
                                Lưu thay đổi
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
