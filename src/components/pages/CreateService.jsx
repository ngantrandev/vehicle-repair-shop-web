import { useState } from 'react';

import Button from '../button';
import Dropdown from '../dropdown';
import Input from '../input';

function CreateService() {
    const [dropdownOpenId, setDropdownOpenId] = useState(null);
    return (
        <div className='flex h-screen w-full items-center justify-center bg-primary-supper-light'>
            <Button className='fixed left-0 top-0 m-3 flex gap-1' rounded>
                <svg
                    className='fill-current text-white'
                    baseProfile='tiny'
                    height='24px'
                    id='Layer_1'
                    version='1.2'
                    viewBox='0 0 24 24'
                    width='24px'
                    xmlSpace='preserve'
                    xmlns='http://www.w3.org/2000/svg'
                    xmlnsXlink='http://www.w3.org/1999/xlink'
                >
                    <path d='M12,9.059V6.5c0-0.256-0.098-0.512-0.293-0.708C11.512,5.597,11.256,5.5,11,5.5s-0.512,0.097-0.707,0.292L4,12l6.293,6.207  C10.488,18.402,10.744,18.5,11,18.5s0.512-0.098,0.707-0.293S12,17.755,12,17.5v-2.489c2.75,0.068,5.755,0.566,8,3.989v-1  C20,13.367,16.5,9.557,12,9.059z' />
                </svg>
                <span>Quay lại</span>
            </Button>
            <div
                id='container'
                className='flex h-screen w-full flex-col items-center justify-center bg-white px-3 md:w-1/2'
            >
                <h1 className='my-6 text-center text-2xl font-bold capitalize'>
                    Tạo mới dịch vụ
                </h1>
                <form className='w-full' autoComplete='on'>
                    <div className='mb-4'>
                        <label htmlFor='name' className=''>
                            Tên dịch vụ
                        </label>
                        <Input
                            rounded
                            id='name'
                            type='text'
                            placeholder='Nhập tên dịch vụ'
                            className={'w-full p-2'}
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='desc' className=''>
                            Mô tả dich vụ
                        </label>
                        <Input
                            rounded
                            id='desc'
                            type='text'
                            placeholder='Nhập mô tả dịch vụ'
                            className={'w-full p-2'}
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='price' className=''>
                            Giá tiền
                        </label>
                        <Input
                            rounded
                            id='price'
                            type='number'
                            placeholder='Nhập giá tiền'
                            className={'w-full p-2'}
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='time' className=''>
                            Thời gian ước tính
                        </label>
                        <Input
                            rounded
                            id='time'
                            type='time'
                            placeholder='Nhập thời gian ước tính'
                            className={'w-full p-2'}
                        />
                    </div>
                    <div className='mb-4 w-2/3'>
                        <label htmlFor='service-type' className=''>
                            Loại dịch vụ
                        </label>
                        <Dropdown
                            id='service-type'
                            name='Loại dịch vụ'
                            data={[
                                { name: 'Sửa xe', id: 1 },
                                { name: 'Thay thế linh kiện', id: 1 },
                                { name: 'Dịch vụ khác', id: 1 },
                            ]}
                            inputPlaceHolder='Tìm kiếm loại dịch vụ'
                            dropdownOpenId={dropdownOpenId}
                            setDropdownOpenId={setDropdownOpenId}
                        />
                    </div>
                </form>
                <Button className='w-full font-medium' rounded>
                    Tạo mới dịch vụ
                </Button>
            </div>
        </div>
    );
}

export default CreateService;
