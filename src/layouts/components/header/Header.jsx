import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../../../components/button';
import logo from '/favicon.svg';
import textLogo from '/favicon_text.svg';

import configs from '../../../configs';
import ultils from '../../../ultils';
import loadData from '../../../services/loadData';

const webName = import.meta.env.VITE_WEB_NAME;

function Header({ className }) {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [carts, setCarts] = useState([]);
    const [user, setUser] = useState({});
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleClickGoToMyBooking = () => {
        if (!isSignedIn) {
            navigate('/login');
        }
        navigate(`/users/${user.id}/bookings`);
    };

    useEffect(() => {
        const user = ultils.getUserDataLogedin();

        if (!user) {
            setIsSignedIn(false);
            return;
        }

        setRole(user.role);

        setUser(user);
        setIsSignedIn(true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const result = await loadData.getCarts(user.id);

            if (result.status !== configs.STATUS_CODE.OK) {
                console.log(result.message);
                return;
            }

            const data = result.data;

            const carts = data.data;

            setCarts(carts);
        };

        if (isSignedIn) {
            fetchData();
        }
    }, [isSignedIn, user.id]);

    return (
        <div className={className}>
            <Link
                to='/'
                className='flex flex-shrink-0 items-center gap-x-2 font-bold text-primary'
            >
                <img
                    src={logo}
                    alt='logo'
                    className='hidden h-10 w-10 sm:block'
                />
                <img
                    src={textLogo}
                    alt='logo'
                    className='block h-10 w-10 sm:hidden'
                />
                <span className='hidden text-xl capitalize sm:block'>
                    {webName || 'Shop sửa xe'}
                </span>
            </Link>
            <div className='flex h-full justify-center sm:flex-grow'>
                <input
                    type='text'
                    className='h-full w-full rounded-full border-2 border-[#D9D9D9] px-[20px] py-2 font-medium caret-primary placeholder:text-[12px] focus:outline-primary md:placeholder:font-medium lg:w-[60%] lg:placeholder:font-bold'
                    placeholder='Tìm kiếm dịch vụ'
                />
            </div>
            <div className='flex flex-shrink-0 justify-center gap-x-4 lg:gap-x-6'>
                {(!isSignedIn || role === configs.USER_ROLES.customer) && (
                    <Tippy content='Giỏ hàng'>
                        <div className='relative items-center self-center'>
                            <svg
                                id='cart'
                                className='h-[32px]'
                                viewBox='0 0 153 149'
                                fill='currentColor'
                                xmlns='http://www.w3.org/2000/svg'
                                stroke='currentColor'
                            >
                                <path d='M56.2959 100.5C57.8711 106.62 59.3774 112.462 60.9789 118.677C62.4405 118.677 63.9815 118.688 65.5226 118.677C83.1536 118.543 100.785 118.412 118.415 118.283C120.77 118.269 123.13 118.438 125.48 118.617C126.485 118.7 127.475 118.909 128.427 119.24C132.111 120.5 132.741 123.269 130.038 126.117C129.816 126.352 129.607 126.6 129.382 126.855C130.888 127.995 132.325 129.222 133.686 130.531C138.501 135.704 137.529 142.595 131.455 146.245C126.557 149.189 121.56 148.961 116.824 145.917C111.646 142.591 110.659 136.027 114.391 130.848C115.165 129.773 116.106 128.82 117.279 127.454C102.405 127.187 87.9187 126.767 72.6168 127.162C76.2923 129.897 78.558 132.668 78.512 136.704C78.4976 139.434 77.4113 142.049 75.4863 143.986C71.2392 148.401 62.9117 148.37 57.9511 143.996C53.194 139.802 53.6194 133.808 59.3032 126.902C54.5875 126.517 52.3551 123.329 51.1507 119.419C49.8013 115.042 48.9264 110.519 47.7877 106.073C45.3697 96.636 42.6906 87.2589 40.524 77.7643C36.8105 61.487 33.4061 45.1442 29.8763 28.8257C29.1655 25.5401 28.4048 22.2626 27.8063 18.9559C27.7154 18.2946 27.4302 17.6751 26.9869 17.176C26.5436 16.6769 25.9621 16.3208 25.3161 16.1527C20.0542 14.2172 14.8192 12.2094 9.58821 10.1925C7.37209 9.40051 5.19837 8.4947 3.07547 7.47902C0.71659 6.27593 -0.0356972 4.34564 0.831325 2.55647C1.65043 0.865081 3.26646 0.345203 5.78286 1.15053C11.0165 2.82485 16.2232 4.58329 21.447 6.28714C24.0067 7.12132 26.5605 7.96478 29.1452 8.70644C32.0862 9.55049 33.9809 11.2594 34.7495 14.333C36.6529 21.9406 38.6876 29.5156 40.6625 37.1081C40.9973 38.3932 41.3136 39.6837 41.6805 41.1375C44.7075 41.1375 47.604 41.1662 50.4997 41.1301C53.8674 41.0875 57.2351 40.9183 60.6021 40.9333C63.4992 40.9478 65.0725 42.0432 65.1965 43.8724C65.3278 45.7404 63.5701 47.248 60.6369 47.3301C56.3753 47.4502 52.1045 47.3136 47.8383 47.2913C46.4042 47.2841 44.9695 47.2913 42.9775 47.2913L54.4273 92.1722H123.686L143.256 45.8886C139.515 45.7153 136.215 45.5637 132.913 45.4081C131.12 45.3241 129.311 45.3557 127.538 45.1187C125.069 44.7906 123.929 43.6369 123.957 41.8464C123.984 40.1517 124.909 39.0812 127.378 38.8803C131.622 38.5344 135.892 38.4384 140.152 38.3958C142.276 38.3741 144.41 38.9032 146.528 38.8316C150.657 38.6918 152.277 41.6639 152.11 46.6455C151.963 47.9861 151.566 49.287 150.938 50.481C147.412 58.357 143.777 66.1819 140.281 74.0697C137.557 80.217 134.871 86.3866 132.394 92.6362C131.259 95.3167 129.585 97.7353 127.475 99.7417C126.653 100.498 125.629 100.999 124.528 101.186C122.656 101.528 120.755 101.686 118.851 101.654C100.999 101.301 83.1464 100.881 65.2982 100.504C62.4077 100.447 59.5126 100.5 56.2959 100.5ZM127.65 137.37C127.62 135.676 125.422 133.581 123.609 133.516C122.217 133.466 120.759 135.251 120.734 137.034C120.711 138.764 122.322 140.076 124.432 140.045C126.302 140.018 127.676 138.875 127.65 137.37ZM66.6474 139.183C67.4232 138.586 68.5409 138.128 68.9617 137.311C69.5845 136.098 68.9617 134.923 67.7468 134.226C67.0799 133.823 66.3731 133.489 65.6387 133.229C64.418 132.826 63.1999 132.643 62.5402 134.18C61.9016 135.668 62.2364 137.275 63.5247 138.013C64.5342 138.483 65.5782 138.873 66.6474 139.183Z' />
                                <path d='M89.5079 57.1721C89.5079 55.3652 89.5296 54.2554 89.504 53.1475C89.1483 37.8964 88.7919 22.6451 88.4342 7.39359C88.3685 6.27388 88.4066 5.15069 88.5464 4.03788C88.8037 2.46267 89.695 1.33494 91.4218 1.24043C92.1569 1.14695 92.9012 1.33286 93.5057 1.76152C94.1108 2.19019 94.5329 2.83029 94.6891 3.55523C95.0048 4.51191 95.2181 5.49978 95.3251 6.5017C95.8206 14.11 96.2512 21.7226 96.7217 29.3322C97.1982 37.0547 97.6918 44.776 98.2011 52.4963C98.2589 53.3699 98.4991 54.231 98.7597 55.6815C100.302 53.9147 101.539 52.5189 102.752 51.1039C104.651 48.89 106.532 46.6618 108.426 44.444C108.718 44.1034 109.024 43.7732 109.345 43.4634C111.408 41.4904 113.752 41.1471 115.331 42.5766C117.079 44.1597 116.995 46.6119 114.978 48.8467C110.246 54.0915 105.456 59.2856 100.702 64.5107C99.7973 65.5037 98.9402 66.5395 98.0712 67.5641C96.1678 69.8074 94.1633 70.2839 91.5045 69.0481C90.6887 68.674 89.9129 68.2191 89.1883 67.6901C82.7713 62.9429 76.6844 57.8173 71.439 51.7717C70.6028 50.7308 69.9235 49.5726 69.4233 48.334C69.0775 47.6757 68.9849 46.9136 69.1621 46.1916C69.34 45.4695 69.7758 44.8375 70.3875 44.4149C70.95 44.095 71.5709 43.8912 72.2134 43.8155C72.856 43.7399 73.5077 43.794 74.1286 43.9745C75.5142 44.4858 76.6733 45.7183 77.814 46.7659C81.1147 49.7968 84.3511 52.8974 87.6315 55.9507C88.2287 56.3994 88.8555 56.8074 89.5079 57.1721Z' />
                            </svg>
                            {carts.length > 0 ? (
                                <span
                                    id='cart-number'
                                    className='absolute right-0 top-0 flex h-6 w-6 translate-x-[50%] translate-y-[-50%] select-none items-center justify-center rounded-full bg-primary-supper-light font-medium text-white'
                                >
                                    {carts.length}
                                </span>
                            ) : null}
                        </div>
                    </Tippy>
                )}
                {isSignedIn ? (
                    <>
                        {role === configs.USER_ROLES.customer ? (
                            <Button
                                className=''
                                rounded
                                onClick={() => handleClickGoToMyBooking()}
                            >
                                Dịch vụ của tôi
                            </Button>
                        ) : (
                            <Button
                                rounded
                                onClick={() =>
                                    navigate(
                                        configs.routes.admin.dashboard.services
                                    )
                                }
                            >
                                Quản lý
                            </Button>
                        )}
                        <Tippy content='Profile'>
                            <Button circle className='size-10 overflow-hidden'>
                                <svg
                                    id='default-avatar'
                                    className='size-[80%] fill-current text-gray-500'
                                    viewBox='0 0 512 512'
                                    width='512'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <title />
                                    <path d='M332.64,64.58C313.18,43.57,286,32,256,32c-30.16,0-57.43,11.5-76.8,32.38-19.58,21.11-29.12,49.8-26.88,80.78C156.76,206.28,203.27,256,256,256s99.16-49.71,103.67-110.82C361.94,114.48,352.34,85.85,332.64,64.58Z' />
                                    <path d='M432,480H80A31,31,0,0,1,55.8,468.87c-6.5-7.77-9.12-18.38-7.18-29.11C57.06,392.94,83.4,353.61,124.8,326c36.78-24.51,83.37-38,131.2-38s94.42,13.5,131.2,38c41.4,27.6,67.74,66.93,76.18,113.75,1.94,10.73-.68,21.34-7.18,29.11A31,31,0,0,1,432,480Z' />
                                </svg>
                            </Button>
                        </Tippy>
                    </>
                ) : (
                    <>
                        <Button rounded to='/login'>
                            Đăng nhập
                        </Button>

                        <Button textonly to='/register'>
                            Đăng ký
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

Header.propTypes = {
    className: PropTypes.string,
};

export default Header;