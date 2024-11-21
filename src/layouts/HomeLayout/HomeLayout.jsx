import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import PropTypes from 'prop-types';

import GoongMap from '@/src/components/map/GoongMap.jsx';
import Stations from '@/src/components/pages/Home/Stations';
import TopServices from '@/src/components/pages/Home/TopServices';
import configs from '@/src/configs';
import useUser from '@/src/hooks/useUser.js';
import Header from '@/src/layouts/components/header';

function HomeLayout({ children }) {
    const user = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !navigate) {
            return;
        }

        if (user.user.role === configs.USER_ROLES.admin) {
            navigate(configs.routes.admin.dashboard.services);
        }
    }, [user, navigate]);

    return (
        <div className='mx-20'>
            <div className='w-full'>
                <Header className='flex h-[70px] w-full items-center justify-between gap-x-2 border-b-2 bg-white py-[14px] sm:gap-x-8 md:gap-x-16 lg:gap-x-4' />
            </div>
            <div className='mt-4 flex flex-row'>
                {/* <div className='h-full w-60'>
                    <ServiceCategory />
                </div> */}
                <div className='flex-1'>{children}</div>
                <div className='w-60'>
                    <Stations />

                    <div className='mt-8'>
                        <TopServices />
                    </div>
                </div>
            </div>

            <div className='mt-8'>
                <p className='inline bg-primary p-1 text-lg font-bold text-white'>
                    Giới thiệu cửa hàng
                </p>
                <div className='mt-8 grid h-[550px] w-full grid-cols-3 gap-2 overflow-hidden'>
                    <div className='col-span-2'>
                        <img
                            src='https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/10/15/1105357/311251702_4781739143.jpg'
                            alt='Ảnh bìa'
                            className='h-full w-full'
                        />
                    </div>
                    <div className='col-span-1 grid grid-rows-3 gap-2 overflow-hidden'>
                        <div className='row-span-1'>
                            <img
                                src='https://www.motosoft.vn/uploads/files/tin-tuc-phan-mem-motor-net/nghe-sua-xe-may.jpg'
                                alt=''
                                className='h-full w-full'
                            />
                        </div>
                        <div className='row-span-1'>
                            {' '}
                            <img
                                src='https://photo-cms-tpo.zadn.vn/w1000/Uploaded/2022/xqeioxdexq/2022_02_20/z3197941555722-735ad6924cfe61833ebd4e8d45b5937b-9501.jpg'
                                alt=''
                                className='h-full w-full'
                            />
                        </div>
                        <div className='row-span-1'>
                            {' '}
                            <img
                                src='https://cuuhonhanh24h.com/wp-content/uploads/2023/04/sua-xe-may-tai-nha.jpg'
                                alt=''
                                className='h-full w-full'
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='my-20 flex flex-col gap-y-8 text-center'>
                <h1 className='text-2xl font-bold lg:text-3xl'>
                    Địa chỉ trụ sở chính
                </h1>
                <GoongMap
                    className='h-96 w-full bg-primary'
                    originPoint={[106.62383478787928, 10.822608284821372]}
                />
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

HomeLayout.propTypes = {
    children: PropTypes.node,
};

export default HomeLayout;
