import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import configs from '../../../../configs';
import ultils from '../../../../ultils';

import Tippy from '@tippyjs/react';

function Item({ data, className }) {
    const { name, estimated_time: time, price } = data;
    const [hour, minute] = time.split(':');

    return (
        <tr className={className}>
            <td>{name}</td>
            <td>
                {hour && hour > 0 ? `${hour} giờ` : ''}{' '}
                {minute && minute > 0 ? `${minute} phút` : ''}
            </td>
            <td>{ultils.getCurrencyFormat(price)}</td>
            <td className='flex gap-x-2'>
                <Link
                    to={{
                        pathname: `/services/${data.id}/modify`,
                    }}
                    state={{
                        data: data,
                        from: window.location.pathname,
                    }}
                    className='flex hover:text-primary'
                >
                    <Tippy content='Chỉnh sửa'>
                        <div className='size-6'>
                            <svg
                                fill='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <title />
                                <path
                                    d='M17,22H5a3,3,0,0,1-3-3V7A3,3,0,0,1,5,4H9A1,1,0,0,1,9,6H5A1,1,0,0,0,4,7V19a1,1,0,0,0,1,1H17a1,1,0,0,0,1-1V15a1,1,0,0,1,2,0v4A3,3,0,0,1,17,22Z'
                                    fill='currentColor'
                                />
                                <path
                                    d='M14.6,5.87l-4.95,5a.41.41,0,0,0-.13.23l-1,3.82a.48.48,0,0,0,.13.48A.47.47,0,0,0,9,15.5a.32.32,0,0,0,.13,0l3.82-1a.41.41,0,0,0,.23-.13L18.13,9.4Z'
                                    fill='currentColor'
                                />
                                <path
                                    d='M21,4.45,19.55,3a1.52,1.52,0,0,0-2.13,0L16,4.45,19.55,8,21,6.58A1.52,1.52,0,0,0,21,4.45Z'
                                    fill='currentColor'
                                />
                            </svg>
                        </div>
                    </Tippy>
                </Link>
                <Link
                    to={configs.routes.admin.dashboard.services + '/1'}
                    className='flex hover:text-primary'
                >
                    <Tippy content='Xóa'>
                        <div className='size-6'>
                            <svg
                                fill='currentColor'
                                viewBox='0 0 512 512'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <title />
                                <g data-name='1' id='_1'>
                                    <path d='M356.65,450H171.47a41,41,0,0,1-40.9-40.9V120.66a15,15,0,0,1,15-15h237a15,15,0,0,1,15,15V409.1A41,41,0,0,1,356.65,450ZM160.57,135.66V409.1a10.91,10.91,0,0,0,10.9,10.9H356.65a10.91,10.91,0,0,0,10.91-10.9V135.66Z' />
                                    <path d='M327.06,135.66h-126a15,15,0,0,1-15-15V93.4A44.79,44.79,0,0,1,230.8,48.67h66.52A44.79,44.79,0,0,1,342.06,93.4v27.26A15,15,0,0,1,327.06,135.66Zm-111-30h96V93.4a14.75,14.75,0,0,0-14.74-14.73H230.8A14.75,14.75,0,0,0,216.07,93.4Z' />
                                    <path d='M264.06,392.58a15,15,0,0,1-15-15V178.09a15,15,0,1,1,30,0V377.58A15,15,0,0,1,264.06,392.58Z' />
                                    <path d='M209.9,392.58a15,15,0,0,1-15-15V178.09a15,15,0,0,1,30,0V377.58A15,15,0,0,1,209.9,392.58Z' />
                                    <path d='M318.23,392.58a15,15,0,0,1-15-15V178.09a15,15,0,0,1,30,0V377.58A15,15,0,0,1,318.23,392.58Z' />
                                    <path d='M405.81,135.66H122.32a15,15,0,0,1,0-30H405.81a15,15,0,0,1,0,30Z' />
                                </g>
                            </svg>
                        </div>
                    </Tippy>
                </Link>
            </td>
        </tr>
    );
}

Item.propTypes = {
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
};

export default Item;
