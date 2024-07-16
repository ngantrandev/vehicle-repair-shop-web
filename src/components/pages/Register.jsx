import { Link } from 'react-router-dom';

import bannerImg from '../../assets/images/login_banner.jpg';
import configs from '../../configs';

function Register() {
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
                        Đăng ký
                    </h2>
                    <form>
                        <div className='mb-4'>
                            <label htmlFor='fullname' className=''>
                                Họ và tên
                            </label>
                            <input
                                id='fullname'
                                type='text'
                                className='w-full border-2 border-[#E5E5E5] bg-[#F2F2F2] p-2 focus:outline-primary-light'
                                placeholder='Nhập họ và tên'
                            />
                        </div>
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
                        <div className='mb-4'>
                            <label htmlFor='confirm-password' className=''>
                                Nhập lại password
                            </label>
                            <input
                                placeholder='Nhập lại password'
                                id='confirm-password'
                                type='text'
                                className='w-full border-2 border-[#E5E5E5] bg-[#F2F2F2] p-2 focus:outline-primary-light'
                            />
                        </div>
                        {/* <span className='text-red-500'>*sdfsdf</span> */}
                    </form>

                    <button className='h-[40px] w-full rounded-sm border-0 bg-primary pb-[10px] pt-[10px] text-[15px] font-bold text-white hover:bg-primary-dark'>
                        Đăng ký
                    </button>
                    <div className='mt-4'>
                        <p>
                            Bạn đã có tài khoản?
                            <span className='cursor-pointer font-medium text-primary hover:underline'>
                                <Link to={configs.routes.login}>
                                    Đăng nhập ngay
                                </Link>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
