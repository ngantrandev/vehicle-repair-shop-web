import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Button from '../button';
import Input from '../input';
import serviceService from '../../services/serviceService';
import configs from '../../configs';
import ultils from '../../ultils';

function ModifyService() {
    const location = useLocation();
    const navigate = useNavigate();
    const { service_id: serviceId } = useParams();

    const { from } = location.state || {};

    const [listCategory, setListCategory] = useState([]);
    const [serviceStatus, setServiceStatus] = useState(false);

    const [inputName, setInputName] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [inputPrice, setInputPrice] = useState(0);
    const [inputTime, setInputTime] = useState('');
    const [categoryId, setCategoryId] = useState('');

    useEffect(() => {
        const fetchService = async () => {
            try {
                if (!serviceId || !ultils.isValidInteger(serviceId)) {
                    return;
                }

                const res = await serviceService.getServiceById(serviceId);

                if (res.status !== configs.STATUS_CODE.OK) {
                    return;
                }

                const resData = res.data;

                setInputName(resData.data?.name);
                setInputDescription(resData.data?.description);
                setInputPrice(resData.data?.price);
                setInputTime(resData.data?.estimated_time);
                setServiceStatus(resData.data?.active == 1 ? true : false);
                setCategoryId(resData.data?.category?.id);
            } catch (error) {
                console.log(error);
            }
        };

        fetchService();
    }, [serviceId]);

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

    const handleUpdateService = async () => {
        try {
            if (!inputName || inputName.trim() === '') {
                ultils.notifyError('Tên quá ngắn');
                return;
            }

            if (!inputDescription || inputDescription.trim() === '') {
                ultils.notifyError('Mô tả quá ngắn');
                return;
            }

            if (!inputPrice || inputPrice <= 100000) {
                ultils.notifyError('Giá tiền không hợp lệ');

                setTimeout(() => {
                    ultils.notifyInfo('Giá tiền tối thiểu là 100.000đ');
                }, 1000);
                return;
            }

            if (!inputTime || inputTime.trim() === '') {
                ultils.notifyError('Thời gian ước tính không hợp lệ');
                return;
            }

            const res = await serviceService.updateService({
                id: serviceId,
                name: inputName,
                description: inputDescription,
                price: inputPrice,
                estimated_time: inputTime,
                category_id: categoryId,
                active: serviceStatus ? '1' : '0',
            });

            if (res.status !== configs.STATUS_CODE.OK) {
                return;
            }

            ultils.notifySuccess('Cập nhật dịch vụ thành công');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='relative flex w-full items-center justify-center'>
            {from && (
                <Button
                    className='absolute left-0 top-0 m-3 flex gap-1'
                    rounded
                    onClick={() => {
                        navigate(from);
                    }}
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

            <div
                id='container'
                className='flex w-full flex-col bg-white px-3 md:w-1/2'
            >
                <h1 className='my-4 text-center text-2xl font-bold capitalize'>
                    Chỉnh sửa dịch vụ
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
                            Giá tiền
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
                        <Input
                            rounded
                            id='time'
                            type='time'
                            placeholder='Nhập thời gian ước tính'
                            className={'w-full p-2'}
                            value={inputTime}
                            onChange={(e) => setInputTime(e.target.value)}
                        />
                    </div>
                    <div className='mb-4 w-2/3'>
                        <label
                            htmlFor='category'
                            className='mb-2 block text-sm font-medium text-gray-900'
                        >
                            Loại dịch vụ
                        </label>
                        <select
                            id='category'
                            className='block w-full rounded-lg border-2 border-primary-light p-2.5 text-sm focus:border-primary-light'
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

                    <div className='mb-4 flex items-center gap-2'>
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
                                {serviceStatus
                                    ? 'Hoạt động'
                                    : 'Ngừng hoạt động'}
                            </span>
                        </label>
                    </div>
                </form>
                <Button
                    className='w-full font-medium'
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
