import configs from '@/src/configs';
import paymentService from '@/src/services/payments.service';
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
            // VNPay trả về số tiền theo đơn vị là amount * 100
            return ultils.getCurrencyFormat(value / 100);
        },
    },
    {
        param: 'vnp_BankCode',
        label: 'Mã ngân hàng',
    },
    {
        param: 'vnp_BankTranNo',
        label: 'Mã giao dịch tại ngân hàng',
    },
    {
        param: 'vnp_TransactionNo',
        label: 'Mã giao dịch tại VNPay',
        format: (value) => {
            if (value) return value;
            else return '';
        },
    },
    {
        param: 'vnp_TxnRef',
        label: 'Mã giao dịch tại cửa hàng',
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
        param: 'vnp_TransactionStatus',
        label: 'Trạng thái giao dịch',
        format: (value) => {
            if (!value) {
                return 'Giao dịch không thành công';
            }
            return transactionStatusCodes[value];
        },
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
    const [params, setParams] = useState({});

    useEffect(() => {
        setParams({
            vnp_Amount: searchParams.get('vnp_Amount'),
            vnp_BankCode: searchParams.get('vnp_BankCode'),
            vnp_BankTranNo: searchParams.get('vnp_BankTranNo'),
            vnp_CardType: searchParams.get('vnp_CardType'),
            vnp_OrderInfo: searchParams.get('vnp_OrderInfo'),
            vnp_PayDate: searchParams.get('vnp_PayDate'),
            vnp_ResponseCode: searchParams.get('vnp_ResponseCode'),
            vnp_TmnCode: searchParams.get('vnp_TmnCode'),
            vnp_TransactionNo: searchParams.get('vnp_TransactionNo'),
            vnp_TransactionStatus: searchParams.get('vnp_TransactionStatus'),
            vnp_TxnRef: searchParams.get('vnp_TxnRef'),
            vnp_SecureHash: searchParams.get('vnp_SecureHash'),
        });
    }, [searchParams]);

    useEffect(() => {
        const fetchPaymentStatus = async (queryParams) => {
            if (Object.keys(queryParams).length === 0) return;

            const res = await paymentService.returnPayment(queryParams);

            if (res.status == configs.STATUS_CODE.OK) {
                setIsSuccess(true);
            }
        };

        fetchPaymentStatus(params);
    }, [params]);

    const transactionStatus = searchParams.get('vnp_TransactionStatus');
    return (
        <div className='mx-2 flex-1 text-xs md:mx-10 md:text-base'>
            <h1 className='mt-5 text-2xl font-bold'>
                {isSuccess
                    ? 'Giao dịch thành công'
                    : transactionStatusCodes[transactionStatus]}
            </h1>

            <table className='mt-5 table-auto'>
                <tbody>
                    {columns.map(({ param, label, format }, index) => {
                        const value = searchParams.get(param);
                        if (param === 'vnp_TransactionStatus') {
                            return (
                                <tr
                                    key={param}
                                    className={index % 2 != 0 && 'bg-gray-100'}
                                >
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
                            <tr
                                key={param}
                                className={index % 2 != 0 && 'bg-gray-100'}
                            >
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
