import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Modal, Typography } from '@mui/material';

import Button from '@/src/components/button';
import Input from '@/src/components/input/Input';
import forgotpassService from '@/src/services/forgotpass.service';
import configs from '@/src/configs';
import LoadingIcon from '@/src/assets/icon/LoadingIcon';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default function ForgotPassword() {
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;

        const postData = async (email) => {
            try {
                setIsSubmitting(true);
                const res = await forgotpassService.forgotPass({ email });

                if (res.status === configs.STATUS_CODE.OK) {
                    setOpen(true);
                    setError('');
                }

                if (res.status === configs.STATUS_CODE.NOT_FOUND) {
                    setError('Email không tồn tại');
                }

                if (res.status === configs.STATUS_CODE.INTERNAL_SERVER_ERROR) {
                    setError('Lỗi hệ thống');
                }

                setIsSubmitting(false);
            } catch (error) {
                setError('Lỗi hệ thống');
                setIsSubmitting(false);
            }
        };

        postData(email);
    };

    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-100'>
            <div className='w-full max-w-sm rounded-lg bg-white p-6 shadow-lg'>
                <h2 className='mb-4 text-center text-2xl font-semibold text-gray-800'>
                    Quên Mật Khẩu
                </h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    {error && (
                        <div className='text-center text-sm text-red-500'>
                            {error}
                        </div>
                    )}
                    <div>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Nhập Email của bạn
                        </label>
                        <Input
                            type='email'
                            id='email'
                            name='email'
                            required
                            placeholder='name@example.com'
                            className='mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        />
                    </div>
                    <Button
                        disabled={isSubmitting}
                        type='submit'
                        className='w-full rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600'
                    >
                        <div className='flex items-center justify-center gap-2'>
                            {isSubmitting && (
                                <LoadingIcon className='h-5 w-5 animate-spin' />
                            )}
                            <p>Gửi Yêu Cầu</p>
                        </div>
                    </Button>
                </form>
                <p className='mt-4 text-center text-sm text-gray-500'>
                    Chúng tôi sẽ gửi email để đặt lại mật khẩu.
                </p>
                <div className='mt-4 text-center'>
                    <Link
                        to='/login'
                        className='text-sm text-blue-500 hover:underline'
                    >
                        Quay lại trang đăng nhập
                    </Link>
                </div>
            </div>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <Box sx={style}>
                    <Typography
                        id='modal-modal-title'
                        variant='h6'
                        component='h2'
                        textAlign='center'
                        gutterBottom
                    >
                        Gửi Mail Thành Công!
                    </Typography>
                    <Typography
                        id='modal-modal-description'
                        sx={{ mt: 2, textAlign: 'center' }}
                    >
                        Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra
                        hộp thư của bạn.
                    </Typography>
                    <Box
                        sx={{
                            mt: 4,
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            rounded
                            color='error'
                            onClick={() => setOpen(false)}
                        >
                            Xác nhận
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
