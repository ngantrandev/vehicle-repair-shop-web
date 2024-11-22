import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import bannerImg from '@/src/assets/images/login_banner.jpg';
import configs from '@/src/configs';
import Input from '@/src/components/input';
import Button from '@/src/components/button';

import authService from '@/src/services/authService';
import ultils from '@/src/ultils';

const webName = import.meta.env.VITE_WEB_NAME || 'Shop sửa xe';
import vehicleImg from '@/src/assets/images/motorcycle.png';
import Image from '@/src/components/image/Image';
import useUser from '@/src/hooks/useUser';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSaveDevice, setIsSaveDevice] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { setUser } = useUser();

    const { from } = location.state || {
        from: { pathname: configs.routes.home },
    };

    const handleSignIn = async () => {
        if (!username) {
            ultils.notifyWarning('Vui lòng nhập tên tài khoản');
            return;
        }

        if (!password) {
            ultils.notifyWarning('Vui lòng nhập mật khẩu');
            return;
        }

        const result = await authService.login({ username, password });

        if (result.status !== configs.STATUS_CODE.OK) {
            ultils.notifyError('Sai tên tài khoản hoặc mật khẩu');

            setUser({
                data: null,
                token: null,
                role: null,
                isLoggedin: false,
            });
            return;
        }

        const resData = result.data;

        if (!resData || !resData.data || !resData.token) {
            ultils.notifyError('Đăng nhập thất bại');
            setUser({
                data: null,
                token: null,
                role: null,
                isLoggedin: false,
            });
            return;
        }

        if (isSaveDevice) {
            localStorage.setItem('user', JSON.stringify(resData.data));

            let date = new Date();
            date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
            let expires = 'expires=' + date.toUTCString();
            document.cookie = `token=${resData.token}; ${expires};`;
        } else {
            sessionStorage.setItem('user', JSON.stringify(resData.data));
            document.cookie = `token=${resData.token}; path=/`;
        }

        const userRole = ultils.getUserRole(resData.token);

        setUser({
            data: resData.data,
            token: resData.token,
            role: userRole,
            isLoggedin: true,
        });

        ultils.notifySuccess('Đăng nhập thành công');

        setTimeout(() => {
            if (userRole == configs.USER_ROLES.admin) {
                navigate(configs.routes.admin.dashboard.statistics);
                return;
            }
            if (from === configs.routes.register) {
                navigate(configs.routes.home);
            } else {
                navigate(from);
            }
        }, 2000);
    };

    return (
        <div className='grid w-full grid-cols-1 text-[15px] lg:grid-cols-3'>
            <div className='relative hidden h-screen select-none lg:col-span-2 lg:block'>
                <div className='absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-slate-300 opacity-25'></div>
                <div className='absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center'>
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
                        Đăng nhập
                    </h2>
                    <form>
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
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='password' className=''>
                                Mât khẩu
                            </label>
                            <Input
                                rounded
                                id='password'
                                type='password'
                                placeholder='Nhập mật khẩu'
                                className={'w-full p-2'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </form>
                    <div className='mb-4 flex justify-between'>
                        <div className='flex cursor-pointer items-center'>
                            <input
                                type='checkbox'
                                name=''
                                id='remember'
                                className='h-4 w-4 cursor-pointer'
                                value={isSaveDevice}
                                onChange={() => setIsSaveDevice(!isSaveDevice)}
                            />
                            <label
                                htmlFor='remember'
                                className='ml-2 cursor-pointer select-none'
                            >
                                Ghi nhớ thiết bị
                            </label>
                        </div>
                        {/* <div>
                            <Button
                                textonly
                                to={configs.routes.resetPassword}
                                className='font-medium'
                            >
                                Quên mật khẩu?
                            </Button>
                        </div> */}
                    </div>
                    <Button
                        className='w-full font-medium'
                        rounded
                        onClick={() => handleSignIn()}
                    >
                        Đăng nhập
                    </Button>
                    <div className='mt-4 flex gap-1'>
                        <span>Bạn chưa có tài khoản?</span>

                        <Button
                            textonly
                            to={configs.routes.register}
                            className='font-medium'
                        >
                            Đăng ký ngay
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

export default Login;
