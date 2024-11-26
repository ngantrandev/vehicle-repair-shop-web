import { useCallback, useEffect, useState } from 'react';

import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import configs from '@/src/configs';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';

import Button from '@/src/components/button';
import Image from '@/src/components/image';
import Input from '@/src/components/input/Input';
import adminUserService from '@/src/services/admin.user.service';
import ultils from '@/src/ultils';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import { useLocation } from 'react-router-dom';

export default function UserInfo() {
    const { setBreadcrumbsData } = useBreadcrumbs();
    const [isModify, setIsModify] = useState(false);
    const [user, setUser] = useState({});

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [lastInfo, setLastInfo] = useState({});

    const location = useLocation();

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!location || !location.state) return;

            const res = await adminUserService.getUserById(
                location.state.data.id
            );

            if (res.status === configs.STATUS_CODE.OK) {
                const data = res.data.data;

                setUser(data);

                setFirstname(data.firstname);
                setLastname(data.lastname);
                setBirthday(data.birthday);
                setEmail(data.email);
                setPhone(data.phone);
            }
        };

        fetchUserInfo();
    }, [location]);

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
            {
                to: '',
                label: 'Thông tin khách hàng',
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
                ultils.notifyWarning('Vui lòng nhập tên khách hàng');
                return;
            }

            if (!lastname || lastname.trim() === '') {
                ultils.notifyWarning('Vui lòng nhập họ khách hàng');
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

            const userData = {
                firstname: firstname,
                lastname: lastname,
                birthday: birthday,
                email: email,
                phone: phone,
            };

            const res = await adminUserService.updateUserInfo(
                location.state.data.id,
                userData
            );

            if (res.status === configs.STATUS_CODE.OK) {
                ultils.notifySuccess('Cập nhật thông tin thành công');
                setIsModify(false);

                setUser((pre) => ({
                    ...pre,
                    firstname: firstname.trim(),
                    lastname: lastname.trim(),
                    birthday: birthday,
                    email: email.trim(),
                    phone: phone.trim(),
                }));
            } else {
                ultils.notifyError('Cập nhật thông tin thất bại');
            }
        };

        changeInfo();
    }, [firstname, lastname, email, phone, birthday, location]);

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
                                        {user.lastname} {user.firstname}
                                    </p>
                                </div>
                                <div>
                                    <span>Ngày tham gia: </span>
                                    <span>
                                        {ultils.convertTimeToGMT7(
                                            user.created_at
                                        )}
                                    </span>
                                </div>

                                <div>
                                    <span>Số điện thoại: </span>
                                    <span>{user.phone}</span>
                                </div>
                                <div>
                                    <span>Email: </span>
                                    <span>{user.email}</span>
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
                                Tên khách hàng
                            </label>
                            <Input
                                rounded
                                id='firstname'
                                type='text'
                                placeholder='Nhập tên khách hàng'
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
