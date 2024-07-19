import bannerImg from '../../assets/images/login_banner.jpg';
import configs from '../../configs';
import Input from '../input';
import Button from '../button';

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
            <div className='flex h-screen content-center items-center justify-center lg:col-span-1 lg:min-h-screen lg:pl-[48px] lg:pr-[48px]'>
                <div className='w-11/12 place-content-center bg-white sm:w-4/5 md:w-3/5 lg:w-full'>
                    <h2 className='bold mb-4 text-center text-[40px] font-bold'>
                        Đăng ký
                    </h2>
                    <form>
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
                            />
                        </div>
                    </form>

                    <Button className='w-full font-medium' rounded>
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
        </div>
    );
}

export default Register;
