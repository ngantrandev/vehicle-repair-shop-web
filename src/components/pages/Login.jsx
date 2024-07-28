import { useState } from 'react';

import bannerImg from '../../assets/images/login_banner.jpg';
import configs from '../../configs';
import Input from '../input';
import Button from '../button';

import * as authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async () => {
        const result = await authService.login({ username, password });

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.data));

        navigate(configs.routes.home);
    };

    return (
        <div className='grid w-full grid-cols-1 text-[15px] lg:grid-cols-3'>
            <div className='hidden h-screen lg:col-span-2 lg:block'>
                <img
                    src={bannerImg}
                    alt='banner image'
                    className='h-full w-full object-cover'
                />
            </div>
            <div className='flex h-screen content-center items-center justify-center lg:col-span-1 lg:min-h-screen lg:pl-[48px] lg:pr-[48px]'>
                <div className='w-11/12 place-content-center bg-white sm:w-4/5 md:w-3/5 lg:w-full'>
                    <h2 className='bold mb-4 text-center text-[40px] font-bold'>
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
                            />
                            <label
                                htmlFor='remember'
                                className='ml-2 cursor-pointer select-none'
                            >
                                Ghi nhớ thiết bị
                            </label>
                        </div>
                        <div>
                            <Button
                                textonly
                                to={configs.routes.resetPassword}
                                className='font-medium'
                            >
                                Quên mật khẩu?
                            </Button>
                        </div>
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
        </div>
    );
}

export default Login;
