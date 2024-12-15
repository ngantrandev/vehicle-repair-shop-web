import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import CameraIcon from '@/src/assets/icon/CameraIcon';
import Button from '@/src/components/button';
import Image from '@/src/components/image/Image';
import Input from '@/src/components/input';
import configs from '@/src/configs';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import serviceService from '@/src/services/serviceService';
import ultils from '@/src/ultils';
import itemsService from '@/src/services/itemsService';

import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';

function ModifyService() {
    const { service_id: serviceId } = useParams();

    const [listCategory, setListCategory] = useState([]);
    const [listItems, setListItems] = useState([]);
    const [listItemsOfService, setListItemsOfService] = useState([]);
    const [serviceStatus, setServiceStatus] = useState(false);

    const [inputName, setInputName] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [inputPrice, setInputPrice] = useState(0);
    const [inputTime, setInputTime] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [image, setImage] = useState(null);

    const { setBreadcrumbsData } = useBreadcrumbs();

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Home',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.services,
                label: 'Danh sách dịch vụ',
            },
            {
                to: '',
                label: 'Chỉnh sửa thông tin dịch vụ',
            },
        ]);
    }, [setBreadcrumbsData]);

    useEffect(() => {
        const fetchService = async () => {
            try {
                if (!serviceId || !ultils.isValidInteger(serviceId)) {
                    return;
                }

                const res = await serviceService.getServiceById(serviceId);
                const itemsOfServiceRes =
                    await itemsService.getAllItemsOfService(serviceId);

                if (res.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                if (itemsOfServiceRes.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                setListItemsOfService(itemsOfServiceRes.data.data);

                const resData = res.data;

                setInputName(resData.data?.name);
                setInputDescription(resData.data?.description);
                setInputPrice(resData.data?.price);
                setServiceStatus(resData.data?.active == 1 ? true : false);
                setCategoryId(resData.data?.category?.id);

                setInputTime(dayjs(resData.data?.estimated_time, 'HH:mm'));

                setImage({
                    data: null,
                    preview: ultils.getFormatedImageUrl(
                        resData?.data?.image_url
                    ),
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchService();
    }, [serviceId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryRes = await serviceService.getServiceCategories();
                const itemsRes = await itemsService.getAllItems();

                if (categoryRes.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                if (itemsRes.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                setListCategory(categoryRes.data.data);
                setListItems(itemsRes.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

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

    const handleUpdateService = async () => {
        try {
            if (!inputName || inputName.trim() === '') {
                ultils.notifyError('Tên quá ngắn');
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

            const formatedTime = dayjs(inputTime).format('HH:mm');

            const res = await serviceService.updateService({
                id: serviceId,
                name: inputName,
                description: inputDescription,
                price: inputPrice,
                estimated_time: formatedTime,
                category_id: categoryId,
                active: serviceStatus ? '1' : '0',
                file: image?.data && image.data,
                items: listItemsOfService.map((item) => item.id),
            });

            if (res.status !== configs.STATUS_CODE.OK) {
                return;
            }

            ultils.notifySuccess('Cập nhật dịch vụ thành công');
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeTime = (e) => {
        setInputTime(e);
    };

    const handleAddItem = useCallback(
        (item) => {
            if (listItemsOfService.find((i) => i.id === item.id)) {
                return;
            }

            setListItemsOfService([...listItemsOfService, item]);
        },
        [listItemsOfService]
    );

    const handleRemoveItem = useCallback(
        (itemId) => {
            setListItemsOfService(
                listItemsOfService.filter((item) => item.id !== itemId)
            );
        },
        [listItemsOfService]
    );

    return (
        <div className='flex h-full flex-1 flex-col'>
            <div className='mb-0 bg-white py-5 pl-4'>
                <Breadcrumbs className='mb-0 bg-white' />
            </div>

            <div
                id='container'
                className='mx-20 flex h-full flex-col items-center bg-white'
            >
                <div className='grid w-full flex-1 grid-cols-6 gap-x-10 gap-y-5 p-10 pt-0'>
                    <div className='col-span-2 flex flex-col gap-2'>
                        <label htmlFor='name'>Tên dịch vụ</label>
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
                    <div className='col-span-4 flex flex-col gap-2'>
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

                    <div className='flex flex-col gap-2'>
                        <label
                            htmlFor='category'
                            className='font-medium text-gray-900'
                        >
                            Loại dịch vụ
                        </label>
                        <select
                            id='category'
                            className='block w-full rounded-lg border-2 border-[#a3a3a3] p-2.5 text-sm focus:border-primary-light'
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
                    <div className='col-span-1 flex flex-col gap-2'>
                        <label htmlFor='active'>Trạng thái</label>
                        <label className='flex cursor-pointer items-center'>
                            <input
                                id='active'
                                type='checkbox'
                                className='peer sr-only'
                                checked={serviceStatus}
                                onChange={() => {
                                    setServiceStatus(!serviceStatus);
                                }}
                            />
                            <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                            <span className='ms-3 text-sm font-medium text-black'>
                                {serviceStatus ? 'Sẵn có' : 'Ngừng cung cấp'}
                            </span>
                        </label>
                    </div>

                    <div className='col-span-2 row-span-2 flex flex-col gap-2'>
                        <label htmlFor=''>Hình ảnh mô tả</label>
                        <div className='flex flex-col justify-center'>
                            <div className='relative size-36 overflow-hidden border-2 object-cover'>
                                {image && (
                                    <Image
                                        className='h-full w-full opacity-80'
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

                    <div className='col-span-2 row-span-2 flex flex-col gap-2 overflow-hidden'>
                        <label htmlFor='items'>Danh sách sản phẩm gợi ý</label>
                        <div className='flex max-h-36 flex-col gap-2 overflow-auto'>
                            {listItemsOfService.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className='flex justify-between gap-2'
                                    >
                                        <Image
                                            src={ultils.getFormatedImageUrl(
                                                item.image_url
                                            )}
                                            alt={item.name}
                                            className='size-10'
                                        />
                                        <span className='flex-1 text-sm'>
                                            {item.name}
                                        </span>
                                        <IconButton
                                            aria-label='delete'
                                            onClick={() => {
                                                handleRemoveItem(item.id);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className='col-span-2 col-start-1 max-h-28 overflow-auto'>
                        {listItems.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className='flex gap-2 hover:cursor-pointer'
                                    onClick={() => {
                                        handleAddItem(item);
                                    }}
                                >
                                    <Image
                                        src={ultils.getFormatedImageUrl(
                                            item.image_url
                                        )}
                                        alt={item.name}
                                        className='size-10'
                                    />
                                    <span>{item.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <Button
                    className='w-30 mb-4 font-medium'
                    rounded
                    onClick={handleUpdateService}
                >
                    Cập nhật
                </Button>
            </div>
        </div>
    );
}

export default ModifyService;
