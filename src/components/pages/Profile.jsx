import { useCallback, useEffect, useState } from 'react';

import CameraIcon from '@/src/assets/icon/CameraIcon';
import Avatar from '@/src/assets/icon/DefaultAvatar.jsx';
import Button from '@/src/components/button';
import Image from '@/src/components/image/Image.jsx';
import Input from '@/src/components/input/Input';
import configs from '@/src/configs';
import useUser from '@/src/hooks/useUser.js';
import profileService from '@/src/services/profileService';
import ultils from '@/src/ultils';

function Profile() {
    const { user: loggedUserData, setUser: setLoggedUserData } = useUser();
    const [avatar, setAvatar] = useState();
    const [user, setUser] = useState();

    const [userName, setUserName] = useState('');
    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isModify, setIsModify] = useState(false);
    const [lastInfo, setLastInfo] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            if (!loggedUserData || !loggedUserData?.isLoggedin) return;

            const res = await profileService.getProfileByUsername(
                loggedUserData?.data?.username
            );

            if (res.status !== configs.STATUS_CODE.OK) {
                return;
            }

            const resData = res.data;
            const userData = resData.data;

            setUser(userData);

            setUserName(userData.username);
            setLastname(userData.lastname);
            setFirstname(userData.firstname);
            setBirthday(userData.birthday);
            setEmail(userData.email);
            setPhone(userData.phone);

            if (userData.image_url) {
                setAvatar((pre) => ({
                    ...pre,
                    preview: ultils.getFormatedImageUrl(userData?.image_url),
                }));
            }
        };

        fetchUser();
    }, [loggedUserData]);

    const handleChooseImage = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar({
                preview: URL.createObjectURL(file),
                data: file,
            });
        }
    }, []);

    const handleChangeUserName = useCallback((e) => {
        setUserName(e.target.value);
    }, []);

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
        setLastInfo({
            firstname,
            lastname,
            email,
            phone,
            birthday,
            image_url: avatar?.preview,
        });
        setIsModify(true);
    }, [firstname, lastname, email, phone, birthday, avatar]);

    const handleClickCancelEdit = useCallback(() => {
        setFirstname(lastInfo.firstname);
        setLastname(lastInfo.lastname);
        setEmail(lastInfo.email);
        setPhone(lastInfo.phone);
        setBirthday(lastInfo.birthday);
        setAvatar((pre) => ({
            ...pre,
            preview: lastInfo.image_url,
        }));

        setIsModify(false);
    }, [lastInfo]);

    const handleClickChangeProfile = useCallback(async () => {
        if (!loggedUserData?.isLoggedin) {
            ultils.notifyError('Vui lòng đăng nhập để cập nhật thông tin');
            return;
        }

        if (!userName || userName === '') {
            ultils.notifyError('Vui lòng nhập tên tài khoản');
            return;
        }

        if (!lastname || lastname === '') {
            ultils.notifyError('Vui lòng nhập họ');
            return;
        }

        if (!firstname || firstname === '') {
            ultils.notifyError('Vui lòng nhập tên');
            return;
        }

        if (!birthday || birthday === '') {
            ultils.notifyError('Vui lòng nhập ngày sinh');
            return;
        }

        if (!email || email === '') {
            ultils.notifyError('Vui lòng nhập email');
            return;
        }

        if (!phone || phone === '') {
            ultils.notifyError('Vui lòng nhập số điện thoại');
            return;
        }

        if (!ultils.isValidEmail(email)) {
            ultils.notifyError('Email không hợp lệ');
            return;
        }

        if (!ultils.isVietnamesePhoneNumber(phone)) {
            ultils.notifyError('Số điện thoại không hợp lệ');
            return;
        }

        const userData = {
            username: userName,
            firstname: firstname,
            lastname: lastname,
            birthday: birthday,
            email: email,
            phone: phone,
            file: avatar?.data,
        };

        const res = await profileService.updateProfile(
            loggedUserData?.data.id,
            userData
        );

        if (res.status === configs.STATUS_CODE.OK) {
            ultils.notifySuccess('Cập nhật thông tin thành công');
            setIsModify(false);
            setLoggedUserData((pre) => ({
                ...pre,
                data: {
                    ...pre.data,
                    image_url: avatar?.preview,
                    firstname: firstname,
                    lastname: lastname,
                    username: userName,
                    birthday: birthday,
                    email: email,
                    phone: phone,
                },
            }));
        } else {
            ultils.notifyError('Cập nhật thông tin thất bại');
        }
    }, [
        userName,
        lastname,
        birthday,
        email,
        phone,
        avatar,
        firstname,
        loggedUserData,
        setLoggedUserData,
    ]);

    return (
        // <div className='inset-0 mb-20 flex h-full min-h-screen w-full flex-col items-center gap-y-4'>
        <div className='mb-8 mt-4 w-full flex-1 overflow-hidden rounded-lg bg-white shadow-md'>
            <div className='mb-8 flex w-full flex-col gap-y-8'>
                <div className='h-24 w-full bg-gradient-to-r from-blue-200 to-yellow-100'></div>
                <div className='mx-8 flex items-center justify-between'>
                    <div className='flex items-center gap-6'>
                        <div className='flex justify-center'>
                            <label
                                htmlFor='avatar'
                                className='relative flex size-24 items-center justify-center rounded-full border-2 border-primary-supper-light hover:cursor-pointer'
                            >
                                <div className='flex size-11/12 items-center justify-center'>
                                    {avatar && avatar.preview ? (
                                        <Image
                                            src={avatar?.preview}
                                            alt=''
                                            className='size-full rounded-full object-cover'
                                        />
                                    ) : (
                                        <Avatar className='h-4/5 w-4/5 rounded-full object-cover' />
                                    )}
                                </div>
                                <CameraIcon className='absolute bottom-2 right-2 ml-2 h-6 w-6 text-primary' />
                            </label>
                            <input
                                id='avatar'
                                type='file'
                                className='hidden'
                                accept='image/*'
                                onChange={handleChooseImage}
                            />
                        </div>
                        <div>
                            <label className='text-lg font-bold'>
                                {user?.lastname} {user?.firstname}
                            </label>
                            <div className='flex items-center gap-x-2'>
                                <div className='flex items-center gap-x-2'>
                                    <label className='text-sm'>
                                        Ngày tạo tài khoản:
                                    </label>
                                    <label className='text-sm'>
                                        {user?.created_at}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        rounded
                        className='w-24'
                        onClick={
                            isModify ? handleClickCancelEdit : handleClickEdit
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
                            value={lastname}
                            onChange={handleChangeLastname}
                            disabled={!isModify}
                        />
                    </div>
                    <div className=''>
                        <label htmlFor='firstname' className=''>
                            Tên
                        </label>
                        <Input
                            rounded
                            id='firstname'
                            type='text'
                            placeholder='Nhập tên'
                            className={'w-full p-2'}
                            value={firstname}
                            onChange={handleChangeFirstname}
                            disabled={!isModify}
                        />
                    </div>

                    <div className=''>
                        <label htmlFor='username' className=''>
                            Nickname
                        </label>
                        <Input
                            rounded
                            id='username'
                            type='text'
                            placeholder='Nhập tên tài khoản'
                            className={'w-full p-2'}
                            value={userName}
                            onChange={handleChangeUserName}
                            disabled={!isModify}
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
                            value={birthday}
                            onChange={handleChangeBirthday}
                            disabled={!isModify}
                        />
                    </div>
                    <div className=''>
                        <label htmlFor='email' className=''>
                            Email
                        </label>
                        <Input
                            rounded
                            id='email'
                            type='email'
                            placeholder='Nhập email'
                            className={'w-full p-2'}
                            value={email}
                            onChange={handleChangeEmail}
                            disabled={!isModify}
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
                            value={phone}
                            onChange={handleChangePhone}
                            disabled={!isModify}
                        />
                    </div>
                </div>

                <div className='flex w-full flex-1 items-end justify-center'>
                    {isModify && (
                        <Button
                            rounded
                            className='h-10'
                            onClick={handleClickChangeProfile}
                        >
                            Lưu thay đổi
                        </Button>
                    )}
                </div>
            </div>
        </div>
        // </div>
    );
}

export default Profile;
