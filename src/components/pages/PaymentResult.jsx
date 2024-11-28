import ultils from '@/src/ultils';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const columns = [
    {
        param: 'vnp_TmnCode',
        label: 'Mã cửa hàng',
    },
    {
        param: 'vnp_OrderInfo',
        label: 'Thông tin đơn hàng',
    },
    {
        param: 'vnp_Amount',
        label: 'Số tiền thanh toán',
        format: (value) => {
            return ultils.getCurrencyFormat(value);
        },
    },
    {
        param: 'vnp_BankCode',
        label: 'Mã ngân hàng',
    },
    {
        param: 'vnp_BankTranNo',
        label: 'Mã giao dịch cổng thanh toán',
    },
    {
        param: 'vnp_CardType',
        label: 'Loại thẻ',
    },
    {
        param: 'vnp_PayDate',
        label: 'Thời gian thanh toán',
        format: (value) => {
            return ultils.convertTimeFormat(
                value,
                'YYYYMMDDHHmmss',
                'HH:mm:ss DD/MM/YYYY'
            );
        },
    },
    {
        param: 'vnp_TransactionNo',
        label: 'Mã giao dịch',
    },
    {
        param: 'vnp_TransactionStatus',
        label: 'Trạng thái giao dịch',
    },
    {
        param: 'vnp_TxnRef',
        label: 'Mã tham chiếu trên hệ thống của cửa hàng',
    },
];

const transactionStatusCodes = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
    '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
    10: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
    11: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
    12: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
    13: 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
    24: 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
    51: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
    65: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
    75: 'Ngân hàng thanh toán đang bảo trì.',
    79: 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
    99: 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
};

const websiteInfo = {
    'support-email': 'support@shopsuaxe.com',
    'support-phone': '0123456789',
};

function PaymentResult() {
    const [searchParams] = useSearchParams();
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const responseCode = searchParams.get('vnp_ResponseCode');
        if (!responseCode || responseCode !== '00') {
            setIsSuccess(false);
        } else {
            setIsSuccess(responseCode === '00');
        }
    }, [searchParams]);

    return (
        <div className='mx-2 flex-1 text-xs md:mx-10 md:text-base'>
            <h1 className='mt-5 text-2xl font-bold'>
                {isSuccess ? (
                    <div className='text-green-500'>Giao dịch thành công</div>
                ) : (
                    <div className='text-red-500'>Giao dịch thất bại</div>
                )}
            </h1>

            <table className='mt-5 table-auto'>
                <tbody>
                    {columns.map(({ param, label, format }) => {
                        const value = searchParams.get(param);
                        if (param === 'vnp_TransactionStatus') {
                            return (
                                <tr key={param}>
                                    <td className='border border-gray-400 p-2'>
                                        {label}
                                    </td>
                                    <td className='border border-gray-400 p-2'>
                                        {transactionStatusCodes[value]}
                                    </td>
                                </tr>
                            );
                        }
                        return (
                            <tr key={param}>
                                <td className='border border-gray-400 p-2'>
                                    {label}
                                </td>
                                <td className='border border-gray-400 p-2'>
                                    {format ? format(value) : value}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div>
                <h2 className='mt-5 text-xl font-bold'>Liên hệ</h2>
                <p>
                    Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ với
                    chúng tôi qua:
                </p>
                <div>
                    <div>
                        <span>Email: </span>
                        <a
                            href={`mailto:${websiteInfo['support-email']}`}
                            className='text-blue-500'
                        >
                            {websiteInfo['support-email']}
                        </a>
                    </div>
                    <div>
                        <span>Số diện thoại: </span>
                        <a
                            href={`tel:${websiteInfo['support-phone']}`}
                            className='text-blue-500'
                        >
                            {websiteInfo['support-phone']}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentResult;
