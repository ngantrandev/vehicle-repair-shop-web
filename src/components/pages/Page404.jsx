import { Link } from 'react-router-dom';

import notFoundImg from '../../assets/images/404.svg';
import configs from '../../configs';
import Button from '../button';
import Image from '../image/Image';

function Page404() {
    return (
        <div className='flex h-screen w-full flex-col items-center justify-center'>
            <Image src={notFoundImg} alt='' className='w-[100px]' />
            <h1 className='mb-4 flex w-full items-center justify-center gap-2 px-8 text-center text-2xl font-bold md:px-0 lg:w-3/5 lg:text-4xl'>
                Trang bạn tìm kiếm không còn tồn tại hoặc đã bị xóa 😭😭
            </h1>

            <Link to={configs.routes.home}>
                <Button rounded>Quay lại trang chủ</Button>
            </Link>
        </div>
    );
}

export default Page404;
