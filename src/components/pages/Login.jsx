import { Link } from 'react-router-dom';

import bannerImg from '../../assets/images/login_banner.jpg';
import configs from '../../configs';

function Login() {
    return (
        <div className='grid w-full grid-cols-1 text-[15px] lg:grid-cols-3'>
            <div className='hidden h-screen lg:col-span-2 lg:block'>
                <img
                    src={bannerImg}
                    alt='banner image'
                    className='h-full w-full object-cover'
                />
            </div>
            <div className='flex items-center justify-center lg:col-span-1 lg:min-h-screen lg:pl-[48px] lg:pr-[48px]'>
                <div className='color-red w-11/12 place-content-center sm:w-4/5 md:w-3/5 lg:w-full'>
                    <h2 className='bold mb-4 text-center text-[40px] font-bold'>
                        Đăng nhập
                    </h2>
                    <form>
                        <div className='mb-4'>
                            <label htmlFor='email' className=''>
                                Email
                            </label>
                            <input
                                id='email'
                                type='text'
                                className='w-full border-2 border-[#E5E5E5] bg-[#F2F2F2] p-2 focus:outline-primary-light'
                                placeholder='Nhập email'
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='password' className=''>
                                Password
                            </label>
                            <input
                                placeholder='Nhập password'
                                id='password'
                                type='text'
                                className='w-full border-2 border-[#E5E5E5] bg-[#F2F2F2] p-2 focus:outline-primary-light'
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
                        {/* <div>
                            <p className='text-primary cursor-pointer font-medium hover:underline'>
                                Quên mật khẩu?
                            </p>
                        </div> */}
                    </div>
                    <button className='h-[40px] w-full rounded-sm border-0 bg-primary pb-[10px] pt-[10px] text-[15px] font-bold text-white hover:bg-primary-dark'>
                        Đăng nhập
                    </button>
                    <div className='mt-4'>
                        <p>
                            Bạn chưa có tài khoản?
                            <Link to={configs.routes.register}>
                                <span className='cursor-pointer font-medium text-primary hover:underline'>
                                    Đăng ký ngay
                                </span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
