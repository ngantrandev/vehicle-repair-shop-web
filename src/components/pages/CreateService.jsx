import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';

import Button from '../button';
import Input from '../input';
import configs from '../../configs';
import serviceService from '../../services/serviceService';
import ultils from '../../ultils';
import CameraIcon from '../../assets/icon/CameraIcon';
import Image from '../image/Image';

function CreateService() {
    const location = useLocation();
    const navigate = useNavigate();

    const [listCategory, setListCategory] = useState([]);

    const { from } = location.state || {};

    const [inputName, setInputName] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [inputPrice, setInputPrice] = useState(0);
    const [inputTime, setInputTime] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await serviceService.getServiceCategories();

                if (res.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                setListCategory(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchCategories();
    }, []);

    const handleCreateService = async () => {
        try {
            if (!inputName || inputName.trim() === '') {
                ultils.notifyError('Tên quá ngắn', { autoClose: 5000 });
                setTimeout(() => {
                    ultils.notifyInfo('Tên dịch vụ không được để trống');
                }, 1000);
                return;
            }

        

            if (!inputPrice || inputPrice < 10000) {
                ultils.notifyError('Giá tiền không hợp lệ');

                setTimeout(() => {
                    ultils.notifyInfo('Giá tiền tối thiểu là 10.000đ');
                }, 1000);
                return;
            }

            if (!inputTime ) {
                ultils.notifyError('Phải nhập thời gian ước tính');
                return;
            }

            if (!categoryId || categoryId.trim() === '') {
                ultils.notifyError('Chọn loại dịch vụ');
                return;
            }

            const formatedTime = dayjs(inputTime).format('HH:mm');

            const res = await serviceService.createService({
                name: inputName,
                description: inputDescription,
                price: inputPrice,
                estimated_time: formatedTime,
                category_id: categoryId,
                file: image?.data,
            });

            if (res.status !== configs.STATUS_CODE.OK) {
                return;
            }

            setCategoryId('');
            setInputName('');
            setInputDescription('');
            setInputPrice(0);
            setInputTime('');

            image && URL.revokeObjectURL(image.preview);
            setImage(null);

            ultils.notifySuccess('Cập nhật dịch vụ thành công');
        } catch (error) {
            console.log(error);
        }
    };

    const handleChooseImage = (e) => {
        const file = e.target.files[0];

        setImage({
            data: file,
            preview: URL.createObjectURL(file),
        });
    };

    const handleDeleteImage = () => {
        if (image) {
            URL.revokeObjectURL(image.preview);
            setImage(null);
        }
    };

    useEffect(() => {
        return () => {
            image && URL.revokeObjectURL(image.preview);
        };
    }, [image]);

    const handleChangeTime = (e) => {
        setInputTime(e);
    };

    return (
        <div className='relative flex flex-1 flex-col items-center'>
            <div className='relative w-full'>
                {from && (
                    <Button
                        className='absolute left-0 top-0 m-3 flex gap-1'
                        rounded
                        onClick={() => navigate(from)}
                    >
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
                )}

                <h1 className='my-6 text-center text-2xl font-bold capitalize'>
                    Tạo mới dịch vụ
                </h1>
            </div>
            <div
                id='container'
                className='flex w-full flex-col items-center justify-center bg-white px-3 md:w-1/2'
            >
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
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
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
                            value={inputDescription}
                            onChange={(e) =>
                                setInputDescription(e.target.value)
                            }
                            multiline
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='price' className=''>
                            Chi phí tạm tính
                        </label>
                        <Input
                            rounded
                            id='price'
                            type='number'
                            placeholder='Nhập giá tiền'
                            className={'w-full p-2'}
                            value={`${inputPrice}`}
                            onChange={(e) => setInputPrice(e.target.value)}
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='time' className=''>
                            Thời gian ước tính
                        </label>

                        <TimePicker
                            value={inputTime}
                            onChange={handleChangeTime}
                            format={'HH:mm'}
                            className='ml-4 border-primary'
                        />
                    </div>
                    <div className='w-1/42 mb-4'>
                        <label
                            htmlFor='category'
                            className='mb-2 block text-sm font-medium text-gray-900'
                        >
                            Loại dịch vụ
                        </label>
                        <select
                            id='category'
                            className='block w-full rounded-lg border-2 border-primary-light p-2.5 text-sm focus:border-primary-light'
                            defaultValue=''
                            value={`${categoryId}`}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option className='p-5' value={' '}>
                                Chọn loại dịch vụ
                            </option>

                            {listCategory.map(({ id, name }) => {
                                return (
                                    <option key={id} value={id}>
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className='mb-4 flex items-center'>
                        <div className='relative col-span-1 row-span-2 size-20 overflow-hidden border-2 border-primary-supper-light object-cover'>
                            {image && (
                                <Image
                                    className='h-full w-full'
                                    src={image.preview || null}
                                    alt='Ảnh tình trạng phương tiện'
                                />
                            )}

                            <label
                                htmlFor='img'
                                className='h-full w-full bg-primary hover:cursor-pointer'
                            >
                                <CameraIcon
                                    className={
                                        'absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2'
                                    }
                                />
                            </label>
                        </div>

                        <input
                            type='file'
                            id='img'
                            name='img'
                            className='absolute hidden'
                            accept='Image/*'
                            onChange={handleChooseImage}
                        />

                        {image && (
                            <Button
                                type='button'
                                className='ml-4 h-10'
                                onClick={handleDeleteImage}
                                outlined
                            >
                                Xóa
                            </Button>
                        )}
                    </div>
                </form>
                <Button
                    className='w-full font-medium'
                    rounded
                    onClick={handleCreateService}
                >
                    Tạo mới dịch vụ
                </Button>
            </div>
        </div>
    );
}

export default CreateService;
