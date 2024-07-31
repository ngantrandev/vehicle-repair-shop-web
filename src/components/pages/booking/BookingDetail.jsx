import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import bookingService from '../../../services/bookingService';
import configs from '../../../configs';
import ultils from '../../../ultils';
import loadData from '../../../services/loadData';
import adminStaffService from '../../../services/admin.staff.service';
import Button from '../../button';
import adminBookingService from '../../../services/admin.bookingService';
import Input from '../../input';

function BookingDetail() {
    const { booking_id: bookingId, user_id: userId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { from } = location.state;

    const [status, setStatus] = useState('');

    const [selectedStaff, setSelectedStaff] = useState('');
    const [selectedStation, setSelectedStation] = useState('');
    const [note, setNote] = useState('');

    const [booking, setBooking] = useState({});

    const [stations, setStations] = useState([]);
    const [staffs, setStaffs] = useState([]);

    useEffect(() => {
        const fetchStaffs = async (stationId) => {
            try {
                if (!stationId || stationId.toString().length === 0) return;

                const res =
                    await adminStaffService.getAllStaffOfStation(stationId);

                if (res.status !== configs.STATUS_CODE.OK) {
                    throw new Error(res.data.message);
                }

                const resData = res.data;

                setStaffs(resData.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchStaffs(selectedStation);
    }, [selectedStation]);

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const res = await loadData.getActiveServiceStations();

                if (res.status !== configs.STATUS_CODE.OK) {
                    throw new Error(res.data.message);
                }
                const resData = res.data;

                setStations(resData.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchStations();
    }, []);

    useEffect(() => {
        const fetchBookingDetail = async () => {
            try {
                const res = await bookingService.getBookingByID(
                    userId,
                    bookingId
                );

                if (res.status !== configs.STATUS_CODE.OK) {
                    throw new Error(res.data.message);
                }

                const resData = res.data;

                setSelectedStation(resData.data?.station_id || '');
                setSelectedStaff(resData.data?.staff?.id || '');
                setNote(resData.data?.note || '');
                setStatus(resData.data?.status || '');

                setBooking(resData.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchBookingDetail();
    }, [bookingId, userId]);

    const handleConfirmBooking = async () => {
        try {
            const res = await adminBookingService.confirmBooking(
                userId,
                bookingId,
                note,
                selectedStaff
            );

            if (res.status !== configs.STATUS_CODE.OK) {
                throw new Error(res.data.message);
            }

            setStatus(configs.BOOKING_STATE.accepted);
        } catch (error) {
            console.log(error);
        }
    };

    const handleStartFixing = async () => {
        try {
            const res = await bookingService.setBookingStatusToFixing(
                selectedStaff,
                bookingId,
                note
            );

            if (res.status !== configs.STATUS_CODE.OK) {
                throw new Error(res.data.message);
            }

            setStatus(configs.BOOKING_STATE.fixing);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDoneFixing = async () => {
        try {
            const res = await bookingService.doneBooking(
                selectedStaff,
                bookingId,
                note
            );

            if (res.status !== configs.STATUS_CODE.OK) {
                throw new Error(res.data.message);
            }

            setStatus(configs.BOOKING_STATE.done);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelBooking = async () => {
        try {
            const res = await bookingService.cancelBooking(userId, bookingId, {
                note: note,
            });

            if (res.status !== configs.STATUS_CODE.OK) {
                throw new Error(res.data.message);
            }

            setStatus(configs.BOOKING_STATE.cancelled);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='relative flex w-full justify-center'>
            <div className='absolute top-6 flex w-full'>
                <Button
                    className='absolute'
                    rounded
                    onClick={() => navigate(from)}
                >
                    Quay lại
                </Button>
                <h1 className='w-full text-center text-2xl font-bold'>
                    Thông tin đặt lịch
                </h1>
            </div>
            <div className='mx-2 mt-32 grid grid-cols-4 gap-x-1 rounded-md border-2 border-primary-light p-3 md:mx-12'>
                <div className='col-span-4'>
                    <span>Khách hàng: </span>
                    <span className='text-xl font-bold'>
                        {booking.user?.lastname +
                            ' ' +
                            booking.user?.firstname || '---'}
                    </span>
                </div>
                <div className='col-span-4'>
                    <span>Tên dịch vụ: </span>
                    <span className='text-xl font-bold'>
                        {booking.service?.name || '---'}
                    </span>
                </div>
                <div className='col-span-4'>
                    <span>Giá tiền: </span>
                    <span className='font-bold'>
                        {ultils.getCurrencyFormat(booking.service?.price) ||
                            '---'}
                    </span>
                </div>

                <div className='col-span-4 pb-2'>
                    <span>Địa chỉ sửa chữa: </span>
                    <span className='font-bold'>
                        {booking.address?.street +
                            ', ' +
                            booking.address?.ward +
                            ', ' +
                            booking.address?.district +
                            ', ' +
                            booking.address?.province}
                    </span>
                </div>

                <div className='col-span-4 mb-8 border-b-2 border-primary-light pb-2'>
                    <span>Trạng thái: </span>
                    <span className='font-bold'>
                        {status === configs.BOOKING_STATE.pending
                            ? 'Chờ xác nhận'
                            : status === configs.BOOKING_STATE.accepted
                              ? 'Đã xác nhận'
                              : status === configs.BOOKING_STATE.fixing
                                ? 'Đang sửa chữa'
                                : status === configs.BOOKING_STATE.done
                                  ? 'Đã hoàn thành'
                                  : status === configs.BOOKING_STATE.cancelled
                                    ? 'Đã hủy'
                                    : '---'}
                    </span>
                </div>

                <div className='col-span-4 sm:col-span-2'>
                    <label
                        htmlFor='station'
                        className='mb-2 block text-sm font-medium text-gray-900'
                    >
                        Chi nhánh
                    </label>
                    <select
                        id='station'
                        className='block w-full rounded-lg border-2 border-primary-light p-2.5 text-sm focus:border-primary-light'
                        value={selectedStation}
                        onChange={(e) => {
                            setSelectedStation(e.target.value);
                        }}
                    >
                        <option className='p-5'></option>
                        {stations.map(({ id, name }) => {
                            return (
                                <option key={id} value={id}>
                                    {name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className='col-span-4 sm:col-span-2'>
                    <label
                        htmlFor='staffs'
                        className='mb-2 block text-sm font-medium text-gray-900'
                    >
                        Nhân viên
                    </label>
                    <select
                        id='staffs'
                        className='block w-full rounded-lg border-2 border-primary-light p-2.5 text-sm focus:border-primary-light'
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                    >
                        <option className='p-5'></option>
                        {staffs.map(({ id, firstname, lastname }) => {
                            return (
                                <option key={id} value={id}>
                                    {`Mã: ${id} - ${lastname} ${firstname}`}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className='col-span-4 mb-2 flex flex-col'>
                    <label
                        htmlFor='note'
                        className='mb-2 block text-sm font-medium text-gray-900'
                    >
                        Ghi chú
                    </label>
                    <Input
                        multiline
                        className={
                            'w-full rounded-md border-2 border-primary-light p-2'
                        }
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                {status === configs.BOOKING_STATE.pending ? (
                    <Button
                        rounded
                        className={`col-span-1 w-full`}
                        onClick={() => handleConfirmBooking()}
                    >
                        Xác nhận yêu cầu
                    </Button>
                ) : (
                    <Button rounded className={`col-span-1 w-full`} disabled>
                        Xác nhận yêu cầu
                    </Button>
                )}

                {status === configs.BOOKING_STATE.accepted ? (
                    <Button
                        rounded
                        className={`col-span-1 w-full bg-green-600 hover:bg-green-800 active:bg-green-700`}
                        onClick={() => handleStartFixing()}
                    >
                        Bắt đầu sửa chữa
                    </Button>
                ) : (
                    <Button
                        rounded
                        className={`col-span-1 w-full bg-green-600 hover:bg-green-800 active:bg-green-700`}
                        disabled
                    >
                        Bắt đầu sửa chữa
                    </Button>
                )}

                {status !== configs.BOOKING_STATE.done &&
                status !== configs.BOOKING_STATE.cancelled ? (
                    <Button
                        rounded
                        className={`col-span-1 w-full bg-green-600 hover:bg-green-800 active:bg-green-700`}
                        onClick={() => handleDoneFixing()}
                    >
                        Xác nhận xong
                    </Button>
                ) : (
                    <Button
                        rounded
                        className={`col-span-1 w-full bg-green-600 hover:bg-green-800 active:bg-green-700`}
                        disabled
                    >
                        Xác nhận xong
                    </Button>
                )}

                {status !== configs.BOOKING_STATE.done &&
                status !== configs.BOOKING_STATE.cancelled ? (
                    <Button
                        rounded
                        className={`col-span-1 w-full bg-red-500 hover:bg-red-600 active:bg-red-700`}
                        onClick={() => handleCancelBooking()}
                    >
                        Xác nhận hủy
                    </Button>
                ) : (
                    <Button
                        rounded
                        className={`col-span-1 w-full bg-red-500 hover:bg-red-600 active:bg-red-700`}
                        disabled
                    >
                        Xác nhận hủy
                    </Button>
                )}
            </div>
        </div>
    );
}

BookingDetail.propTypes = {};

export default BookingDetail;