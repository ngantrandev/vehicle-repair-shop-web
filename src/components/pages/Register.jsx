import { useCallback, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

import Button from '@/src/components/button';
import Input from '@/src/components/input';
import configs from '@/src/configs';
import authService from '@/src/services/authService';
import ultils from '@/src/ultils/ultils';

import banner from '@/src/assets/banner.svg';

function Register() {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');

    const resetForm = useCallback(() => {
        setUsername('');
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
    }, []);

    const handleRegister = useCallback(() => {
        const createAccount = async () => {
            try {
                if (!username || username.trim().length === 0) {
                    ultils.notifyError('Tên người dùng không được để trống');
                    return;
                }

                if (fullName.split(' ').length < 2) {
                    ultils.notifyError('Họ tên phải có ít nhất 2 từ');
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

                if (password.length < 6) {
                    ultils.notifyError('Mật khẩu phải có ít nhất 6 ký tự');
                    return;
                }

                if (password !== confirmPassword) {
                    ultils.notifyError('Mật khẩu không khớp');
                    return;
                }

                const res = await authService.register({
                    username,
                    password,
                    fullName,
                    email,
                    phone,
                });

                if (res.status === configs.STATUS_CODE.OK) {
                    ultils.notifySuccess('Đăng ký thành công');

                    resetForm();

                    setTimeout(() => {
                        ultils.notifyInfo(
                            'Vui lòng chuyển sang trang đăng nhập để đăng nhập'
                        );
                    }, 1000);
                } else if (res.status === configs.STATUS_CODE.CONFLICT) {
                    ultils.notifyError('Tên tài khoản hoặc Email đã tồn tại');
                }
            } catch (error) {
                console.log(error);
                ultils.notifyError('Có lỗi xảy ra, vui lòng thử lại sau');
            }
        };

        createAccount();
    }, [
        username,
        fullName,
        email,
        phone,
        password,
        confirmPassword,
        resetForm,
    ]);

    const handleFullNameChange = useCallback((e) => {
        setFullName(e.target.value.replace(/\s+/g, ' '));
    }, []);

    const handleUsernameChange = useCallback((e) => {
        setUsername(e.target.value);
    }, []);

    const handleEmailChange = useCallback((e) => {
        setEmail(e.target.value);
    }, []);

    const handlePasswordChange = useCallback((e) => {
        setPassword(e.target.value);
    }, []);

    const handleConfirmPasswordChange = useCallback((e) => {
        setConfirmPassword(e.target.value);
    }, []);

    const handlePhoneChange = useCallback((e) => {
        setPhone(e.target.value);
    }, []);

    return (
        <div
            tabIndex='-1'
            className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-200`}
        >
            <div className='w-1/3 flex-col overflow-hidden rounded-md bg-white'>
                <div className='flex flex-col gap-4 p-5'>
                    <div className='flex w-full items-center justify-center'>
                        <Link to={configs.routes.home} className='w-3/5'>
                            <img src={banner} alt='' className='' />
                        </Link>
                    </div>
                    <form className='flex flex-col gap-2'>
                        <div className='grid grid-cols-2 gap-2'>
                            <div className=''>
                                <label htmlFor='username' className=''>
                                    Tên người dùng
                                </label>
                                <Input
                                    rounded
                                    id='username'
                                    type='text'
                                    placeholder='Nhập tên người dùng'
                                    className={'w-full p-2'}
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                            </div>
                            <div className=''>
                                <label htmlFor='fullname' className=''>
                                    Họ và tên
                                </label>
                                <Input
                                    rounded
                                    id='fullname'
                                    type='text'
                                    placeholder='Nhập họ và tên'
                                    className={'w-full p-2'}
                                    value={fullName}
                                    onChange={handleFullNameChange}
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
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
                                    value={email}
                                    onChange={handleEmailChange}
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
                                    onChange={handlePhoneChange}
                                />
                            </div>
                        </div>
                        <div className=''>
                            <label htmlFor='password' className=''>
                                Mật khẩu
                            </label>
                            <Input
                                rounded
                                id='password'
                                type='password'
                                placeholder='Nhập mật khẩu'
                                className={'w-full p-2'}
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className=''>
                            <label htmlFor='confirm-password' className=''>
                                Nhập lại mật khẩu
                            </label>
                            <Input
                                rounded
                                id='confirm-password'
                                type='password'
                                placeholder='Nhập mật khẩu'
                                className={'w-full p-2'}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                password
                            />
                        </div>
                    </form>

                    <Button
                        className='mt-2 w-full font-medium'
                        rounded
                        onClick={handleRegister}
                    >
                        Đăng ký
                    </Button>
                    <div className='mt-4 flex gap-1'>
                        <span>Bạn đã có tài khoản?</span>

                        <Button
                            textonly
                            to={configs.routes.login}
                            className='font-medium'
                        >
                            Đăng nhập ngay
                        </Button>
                    </div>
                </div>
            </div>

            <ToastContainer
                position='bottom-right'
                autoClose={5000}
                limit={5}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover
                theme='colored'
            />
        </div>
    );
}

export default Register;
