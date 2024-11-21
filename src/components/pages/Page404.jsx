import PropTypes from 'prop-types';

import notFoundImg from '@/src/assets/images/404.svg';
import configs from '@/src/configs';
import Button from '@/src/components/button';
import Image from '@/src/components/image/Image';
import { Link } from 'react-router-dom';

function Page404({ content }) {
    return (
        <div className='relative mt-40 flex h-full w-full flex-col items-center justify-center'>
            <Image src={notFoundImg} alt='' className='w-[100px]' />
            <h1 className='mb-4 flex w-full items-center justify-center gap-2 px-8 text-center text-2xl font-bold md:px-0 lg:w-3/5 lg:text-4xl'>
                {content || 'Trang không tồn tại'}
            </h1>

            <Link to={configs.routes.home}>
                <Button rounded>Quay lại trang chủ</Button>
            </Link>
        </div>
    );
}

Page404.propTypes = {
    content: PropTypes.string,
    from: PropTypes.string,
};

export default Page404;
