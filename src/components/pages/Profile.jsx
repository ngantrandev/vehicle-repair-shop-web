import { useCallback, useEffect, useState } from 'react';

import CameraIcon from '../../assets/icon/CameraIcon';
import ultils from '../../ultils';
import Button from '../button';
import Input from '../input/Input';
import Avatar from '../../assets/icon/DefaultAvatar.jsx';
import profileService from '../../services/profileService';
import Image from '../image/Image.jsx';
import useUser from '../../hooks/useUser.js';

const baseApiEnpoint = import.meta.env.VITE_API_BASE_URL;

function Profile() {
    const { user, setUser } = useUser();
    const [avatar, setAvatar] = useState();

    const [userName, setUserName] = useState('');
    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            if (!user || !user?.isLoggedin) return;

            const res = await profileService.getProfileByUsername(
                user?.data?.username
            );

            const resData = res.data;
            const userData = resData.data;

            setUserName(userData.username);
            setLastname(userData.lastname);
            setFirstname(userData.firstname);
            setBirthday(userData.birthday);
            setEmail(userData.email);
            setPhone(userData.phone);

            setUser((pre) => {
                return {
                    ...pre,
                    data: userData,
                };
            });

            if (userData.image_url) {
                setAvatar((pre) => ({
                    ...pre,
                    preview: baseApiEnpoint + userData.image_url,
                }));
            }
        };

        fetchUser();
    }, []);

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

    const handleClickChangeProfile = useCallback(async () => {
        if (!user?.isLoggedin) {
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

        const res = await profileService.updateProfile(user?.data.id, userData);

        if (res.status === 200) {
            ultils.notifySuccess('Cập nhật thông tin thành công');
        } else {
            ultils.notifyError('Cập nhật thông tin thất bại');
        }
    }, [userName, lastname, birthday, email, phone, avatar, firstname, user]);

    return (
        <div className='inset-0 mb-20 mt-4 flex h-full min-h-screen w-full flex-col items-center gap-y-4 px-3'>
            <div className='w-full md:w-2/3 lg:w-2/5'>
                <h1 className='my-4 text-center text-2xl font-bold'>
                    Thông tin tài khoản
                </h1>

                <div className='w-full'>
                    <div className='mb-4 flex w-full justify-center'>
                        <label
                            htmlFor='avatar'
                            className='relative flex size-32 items-center justify-center rounded-full border-2 border-primary-supper-light hover:cursor-pointer'
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

                    <div className='mb-4'>
                        <label htmlFor='username' className=''>
                            Tên tài khoản
                        </label>
                        <Input
                            rounded
                            id='username'
                            type='text'
                            placeholder='Nhập tên tài khoản'
                            className={'w-full p-2'}
                            value={userName}
                            onChange={handleChangeUserName}
                        />
                    </div>
                    <div className='mb-4'>
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
                        />
                    </div>
                    <div className='mb-4'>
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
                        />
                    </div>

                    <div className='mb-4'>
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
                        />
                    </div>
                    <div className='mb-4'>
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
                        />
                    </div>
                    <div className='mb-4'>
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
                        />
                    </div>
                    <div className='mb-4'>
                        <Button
                            rounded
                            className='w-full'
                            onClick={handleClickChangeProfile}
                        >
                            Cập nhật
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
