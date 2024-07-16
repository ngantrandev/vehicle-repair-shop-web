import { Link } from 'react-router-dom';

import notFoundImg from '../../assets/images/404.svg';
import configs from '../../configs';

function Page404() {
    return (
        <div className='flex h-screen flex-col items-center justify-center'>
            <img src={notFoundImg} alt='' className='w-[100px]' />
            <h1 className='mb-4 text-xl font-bold lg:text-4xl'>
                Đường dẫn không tồn tại 🤣🤣
            </h1>

            <Link to={configs.routes.home}>
                <button className='rounded-md bg-primary-light p-2 text-sm font-bold text-[#fff] lg:text-xl'>
                    Quay về trang chủ
                </button>
            </Link>
        </div>
    );
}

export default Page404;
