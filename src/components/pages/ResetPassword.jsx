import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Modal, Typography } from '@mui/material';

import Button from '@/src/components/button';
import forgotpassService from '@/src/services/forgotpass.service';
import Input from '@/src/components/input';
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

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const resetPassword = async () => {
            try {
                setIsSubmitting(true);
                if (password !== confirmPassword) {
                    setError('Mật khẩu và xác nhận mật khẩu không trùng khớp.');
                    setIsSubmitting(false);
                    return;
                }

                const res = await forgotpassService.resetPass({
                    password,
                    repassword: confirmPassword,
                    token:
                        'Bearer ' +
                        new URLSearchParams(window.location.search).get(
                            'token'
                        ),
                });

                if (res.status === 200) {
                    setOpen(true);
                    setError('');
                } else {
                    setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
                }

                setIsSubmitting(false);
            } catch (error) {
                setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        };

        resetPassword();
    };

    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-100'>
            <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
                <h2 className='mb-4 text-center text-2xl font-semibold text-gray-800'>
                    Đặt Lại Mật Khẩu
                </h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    {error && (
                        <div className='animate-bounce text-center text-sm text-red-500'>
                            {error}
                        </div>
                    )}
                    <div>
                        <label
                            htmlFor='password'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Mật khẩu mới
                        </label>
                        <Input
                            type='password'
                            id='password'
                            name='password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Nhập mật khẩu mới'
                            className='mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        />
                    </div>
                    <div>
                        <label
                            htmlFor='confirm-password'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Xác nhận mật khẩu
                        </label>
                        <Input
                            type='password'
                            id='confirm-password'
                            name='confirm-password'
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Nhập lại mật khẩu'
                            className='mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        />
                    </div>
                    <Button
                        rounded
                        type='submit'
                        className='w-full rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600'
                    >
                        {isSubmitting && (
                            <LoadingIcon className='h-5 w-5 animate-spin' />
                        )}
                        <p>Đặt lại mật khẩu</p>
                    </Button>
                </form>

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
                        Thay đổi mật khẩu thành công
                    </Typography>
                    <Typography
                        id='modal-modal-description'
                        sx={{ mt: 2, textAlign: 'center' }}
                    >
                        Bạn đã thay đổi mật khẩu thành công. Hãy đăng nhập để
                        trải nghiệm.
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
                            onClick={() => {
                                setOpen(false);
                                navigate('/login', { replace: true });
                            }}
                        >
                            Đến trang đăng nhập
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
