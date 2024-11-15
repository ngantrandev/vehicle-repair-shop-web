import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';

import ultils from '../../../../ultils';
import Image from '../../../image/Image';

function Item({ data, className }) {
    return (
        <>
            <Link
                to={{
                    pathname: `/admin/services/${data.id}/modify`,
                }}
                state={{
                    from: window.location.pathname,
                }}
                className={className}
            >
                <Tippy content='Chỉnh sửa'>
                    <div className='h-full w-full'>
                        <div className='flex justify-between gap-2'>
                            <div className='size-20 overflow-hidden rounded-lg shadow-lg'>
                                <Image
                                    className='h-full w-full object-cover'
                                    src={ultils.getFormatedImageUrl(
                                        data.image_url
                                    )}
                                    alt='service image'
                                />
                            </div>
                            <div className='flex-1'>
                                <p className='text-base font-semibold'>
                                    {data.name}
                                </p>
                                <p className='text-sm'>
                                    {data?.category?.name}
                                </p>
                            </div>
                        </div>
                        <div className=''>
                            <p className='font-semibold'>Mô tả</p>
                            <p>{data.description}</p>
                        </div>
                    </div>
                </Tippy>
            </Link>
        </>
    );
}

Item.propTypes = {
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
};

export default Item;
