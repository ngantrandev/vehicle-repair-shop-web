import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Button from '@/src/components/button';
import Input from '@/src/components/input';
import configs from '@/src/configs';

import banner from '@/src/assets/banner.svg';
import rightarrow from '@/src/assets/icon/RightArrow';
import useUser from '@/src/hooks/useUser';
import authService from '@/src/services/authService';
import ultils from '@/src/ultils';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSaveDevice, setIsSaveDevice] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

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

        try {
            setLoading(true);
            const result = await authService.login({ username, password });

            if (result.status === configs.STATUS_CODE.FORBIDDEN) {
                ultils.notifyError('Tài khoản của bạn đã bị khóa');
                return;
            } else if (result.status === configs.STATUS_CODE.NOT_FOUND) {
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

            ultils.saveUserDataLogedin(
                resData.data,
                resData.token,
                isSaveDevice
            );

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
        } catch (error) {
            setLoading(false);
            ultils.notifyError('Đăng nhập thất bại, vui lòng thử lại sau');
            setUser({
                data: null,
                token: null,
                role: null,
                isLoggedin: false,
            });
            return;
        }
    };

    return (
        <div
            tabIndex='-1'
            className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-200`}
        >
            <div className='grid w-1/2 grid-cols-2 flex-col overflow-hidden rounded-md bg-white'>
                <div className='flex flex-col gap-4 p-5'>
                    <div className='flex w-full items-center justify-center'>
                        <Link to={configs.routes.home} className='w-3/5'>
                            <img src={banner} alt='' className='' />
                        </Link>
                    </div>
                    <form className='w-full'>
                        <div className=''>
                            <label htmlFor='username' className=''>
                                Email / Tên tài khoản
                            </label>
                            <Input
                                rounded
                                id='username'
                                type='text'
                                placeholder='Nhập email hoặc tên tài khoản'
                                className={'w-full p-2'}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className=''>
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
                    <div className='flex justify-between'>
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
                        <div>
                            <Button
                                textonly
                                to={configs.routes['forgot-password']}
                                className='font-medium'
                            >
                                Quên mật khẩu?
                            </Button>
                        </div>
                    </div>
                    <Button
                        disabled={loading}
                        className='w-full font-medium'
                        rounded
                        onClick={() => handleSignIn()}
                    >
                        Đăng nhập
                    </Button>
                </div>
                <div className='flex flex-col items-center justify-center gap-4 bg-blue-700 p-10 text-white'>
                    <h2 className='text-2xl font-bold'>
                        Bạn chưa có tài khoản?
                    </h2>
                    <h3 className='text-center'>
                        Bạn muốn tham gia vào hệ thống của chúng tôi và tận
                        hưởng các tiện ích của hệ thống. Còn chần chừ gì nữa mà
                        không đăng ký tài khoản ngay nào!
                    </h3>
                    <Button
                        outlined
                        to={configs.routes.register}
                        className='border-white font-bold text-white hover:bg-none'
                    >
                        <div>
                            <img src={rightarrow} alt='' />
                            Đăng ký ngay
                        </div>
                    </Button>
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
