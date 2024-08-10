import { useCallback, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import bannerImg from '../../assets/images/login_banner.jpg';
import configs from '../../configs';
import Input from '../input';
import Button from '../button';
import ultils from '../../ultils/ultils';
import authService from '../../services/authService';

const webName = import.meta.env.VITE_WEB_NAME || 'Shop sửa xe';
import vehicleImg from '../../assets/images/motorcycle.png';
import Image from '../image/Image';

function Register() {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const resetForm = useCallback(() => {
        setUsername(null);
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
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
                ultils.notifyError('Đăng ký thất bại');
            }
        };

        createAccount();
    }, [username, fullName, email, password, confirmPassword, resetForm]);

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

    return (
        <div className='relative grid w-full grid-cols-1 text-[15px] lg:grid-cols-3'>
            <div className='relative hidden h-screen select-none lg:col-span-2 lg:block'>
                <div className='absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-slate-300 opacity-25'></div>
                <div className='absolute left-0 top-0 flex h-full w-full select-none flex-col items-center justify-center'>
                    <Image src={vehicleImg} alt='' className='size-56' />
                    <h1 className='inline-block bg-gradient-to-r from-cyan-500 to-primary bg-clip-text text-7xl font-bold capitalize text-transparent'>
                        {webName}
                    </h1>
                </div>
                <Image
                    src={bannerImg}
                    alt='banner image'
                    className='h-full w-full bg-transparent object-cover'
                />
            </div>
            <div className='flex h-screen content-center items-center justify-center lg:col-span-1 lg:min-h-screen lg:pl-[48px] lg:pr-[48px]'>
                <div className='w-11/12 place-content-center bg-white sm:w-4/5 md:w-3/5 lg:w-full'>
                    <h2 className='bold mb-4 text-center text-[40px] font-bold text-primary'>
                        Đăng ký
                    </h2>
                    <form>
                        <div className='mb-4'>
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
                        <div className='mb-4'>
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
                        <div className='mb-4'>
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
                        <div className='mb-4'>
                            <label htmlFor='password' className=''>
                                Password
                            </label>
                            <Input
                                rounded
                                id='password'
                                type='password'
                                placeholder='Nhập password'
                                className={'w-full p-2'}
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='confirm-password' className=''>
                                Nhập lại password
                            </label>
                            <Input
                                rounded
                                id='confirm-password'
                                type='password'
                                placeholder='Nhập lại password'
                                className={'w-full p-2'}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                password
                            />
                        </div>
                    </form>

                    <Button
                        className='w-full font-medium'
                        rounded
                        onClick={handleRegister}
                    >
                        Đăng ký
                    </Button>
                    <div className='mt-4 flex gap-1'>
                        <span>Bạn chưa có tài khoản?</span>

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
