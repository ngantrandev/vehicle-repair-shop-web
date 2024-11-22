import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import CameraIcon from '@/src/assets/icon/CameraIcon';
import Button from '@/src/components/button';
import Image from '@/src/components/image/Image';
import Input from '@/src/components/input';
import configs from '@/src/configs';
import serviceService from '@/src/services/serviceService';
import ultils from '@/src/ultils';

import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';

function CreateService() {
    const [listCategory, setListCategory] = useState([]);

    const [inputName, setInputName] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [inputPrice, setInputPrice] = useState(0);
    const [inputTime, setInputTime] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [image, setImage] = useState(null);

    const { setBreadcrumbsData } = useBreadcrumbs();

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Dashboard',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.services,
                label: 'Danh sách dịch vụ',
            },
            {
                to: '',
                label: 'Tạo mới dịch vụ',
            },
        ]);
    }, [setBreadcrumbsData]);

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

            if (!inputTime) {
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
        <div className='flex h-full flex-1 flex-col'>
            <div className='mb-0 bg-white py-5 pl-4'>
                <Breadcrumbs className='mb-0 bg-white' />
            </div>
            <div
                id='container'
                className='mx-20 flex h-full flex-col items-center bg-white'
            >
                <div className='grid w-full flex-1 grid-cols-3 gap-x-10 gap-y-5 p-10'>
                    <div className='flex flex-col gap-2'>
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
                    <div className='flex flex-col gap-2'>
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
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='time' className=''>
                            Thời gian ước tính
                        </label>
                        <div className='h-[43px]'>
                            <TimePicker
                                value={inputTime}
                                onChange={handleChangeTime}
                                format={'HH:mm'}
                                className='h-full w-full border-2 border-[#a3a3a3]'
                            />
                        </div>
                    </div>
                    <div className='col-span-2 flex flex-col gap-2'>
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

                    <div className='row-span-2 flex flex-col gap-2'>
                        <label htmlFor=''>Hình ảnh mô tả</label>
                        <div className='flex flex-col justify-center'>
                            <div className='relative size-56 overflow-hidden border-2 object-cover'>
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
                                            'absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 text-primary'
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
                                    className='mt-4 h-10 w-20'
                                    onClick={handleDeleteImage}
                                    outlined
                                >
                                    Xóa
                                </Button>
                            )}
                        </div>
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
                            className='block w-full rounded-lg border-2 border-[#a3a3a3] p-2.5 text-sm hover:border-primary-light focus:border-primary-light'
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
                </div>
                <Button
                    className='w-30 mb-4 font-medium'
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
