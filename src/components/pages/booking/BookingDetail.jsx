import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import bookingService from '../../../services/bookingService';
import configs from '../../../configs';
import ultils from '../../../ultils';
import adminStaffService from '../../../services/admin.staff.service';
import Button from '../../button';
import adminBookingService from '../../../services/admin.bookingService';
import Input from '../../input';
import GoongMap from '../../map/GoongMap';
import stationsService from '../../../services/stationsService';
import Image from '../../image/Image';
import useUser from '../../../hooks/useUser';

const baseApiEnpoint = import.meta.env.VITE_API_BASE_URL;

function BookingDetail() {
    const { booking_id: bookingId, user_id: userId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { from } = location.state;

    const { user } = useUser();

    const [status, setStatus] = useState();

    const [isChangeStatus, setIsChangeStatus] = useState(false);

    const [selectedStaff, setSelectedStaff] = useState('');
    const [selectedStation, setSelectedStation] = useState('');
    const [note, setNote] = useState('');

    const [booking, setBooking] = useState({});

    const [stations, setStations] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [isShowMenu, setIsShowMenu] = useState(false);

    const startPoint = useMemo(() => {
        const station = booking?.staff?.station || {};
        const address = station?.address || {};

        const { longitude, latitude } = address;

        if (!longitude || !latitude) return [];

        return [longitude, latitude];
    }, [booking]);

    const endPoint = useMemo(() => {
        const address = booking.address || {};

        const { longitude, latitude } = address;

        if (!longitude || !latitude) return [];

        return [longitude, latitude];
    }, [booking]);

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
                const res = await stationsService.getActiveServiceStations();
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
                const res = await bookingService.getBookingByID(bookingId);

                if (res.status !== configs.STATUS_CODE.OK) {
                    throw new Error(res.data.message);
                }

                const resData = res.data;

                const booking = resData.data;

                const { staff } = booking;
                const { station } = staff;

                setBooking(booking);
                setSelectedStation(station.id || '');
                setSelectedStaff(staff.id || '');
                setNote(booking.note || '');
                setStatus(booking.status || '');

                setIsChangeStatus(false);
            } catch (error) {
                console.log(error);
            }
        };

        fetchBookingDetail();
    }, [bookingId, userId, isChangeStatus]);

    const handleConfirmBooking = async () => {
        try {
            if (!selectedStation || selectedStation.length === 0) {
                ultils.notifyWarning('Vui lòng chọn chi nhánh');
                return;
            }

            if (!selectedStaff || selectedStaff.length === 0) {
                ultils.notifyWarning('Vui lòng chọn nhân viên');
                return;
            }

            const res = await adminBookingService.confirmBooking(
                bookingId,
                note,
                selectedStaff
            );

            if (res.status !== configs.STATUS_CODE.OK) {
                throw new Error(res.data.message);
            }

            setStatus(configs.BOOKING_STATE.accepted);
            ultils.notifySuccess('Đã xác nhận đặt lịch');
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
            ultils.notifySuccess('Đã xác nhận bắt đầu sửa chữa');
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
            ultils.notifySuccess('Đã xác nhận hoàn thành sửa chữa');
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelBooking = async () => {
        try {
            if (note.trim().length === 0) {
                ultils.notifyError(
                    'Vui lòng nhập ghi chú trước khí hủy đặt lịch'
                );
                return;
            }
            const res = await bookingService.cancelBooking(bookingId, {
                note: note,
            });

            if (res.status !== configs.STATUS_CODE.OK) {
                throw new Error(res.data.message);
            }

            setIsChangeStatus(false);
            setStatus(configs.BOOKING_STATE.cancelled);
            ultils.notifySuccess('Đã xác nhận hủy đặt lịch');
        } catch (error) {
            console.log(error);
        }
    };

    const handleUndoBooking = async () => {
        try {
            const res = await bookingService.undoBooking(bookingId);

            if (res.status !== configs.STATUS_CODE.OK) {
                ultils.notifyError('Đã xảy ra lỗi');
                throw new Error(res.data.message);
            }

            setIsChangeStatus(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeBookingInfo = async () => {
        try {
            if (!selectedStation || selectedStation.length === 0) {
                ultils.notifyWarning('Vui lòng chọn chi nhánh');
                return;
            }

            if (!selectedStaff || selectedStaff.length === 0) {
                ultils.notifyWarning('Vui lòng chọn nhân viên');
                return;
            }

            const res = await adminBookingService.assignStaffToBooking(
                bookingId,
                selectedStaff,
                note
            );

            if (res.status !== configs.STATUS_CODE.OK) {
                ultils.notifyError('Đã xảy ra lỗi');
                return;
            }

            ultils.notifySuccess('Cập nhật thông tin thành công');
        } catch (error) {
            console.log(error);
        }
    };

    const buttonList = [
        {
            text: 'Xác nhận yêu cầu',
            onClick: handleConfirmBooking,
            isShow:
                status === configs.BOOKING_STATE.pending &&
                user?.role === configs.USER_ROLES.admin,
        },
        {
            text: 'Bắt đầu sửa chữa',
            onClick: handleStartFixing,
            isShow:
                status === configs.BOOKING_STATE.accepted &&
                user?.role === configs.USER_ROLES.admin,
        },
        {
            text: 'Xác nhận xong',
            onClick: handleDoneFixing,
            isShow:
                status !== configs.BOOKING_STATE.done &&
                status !== configs.BOOKING_STATE.cancelled &&
                status !== configs.BOOKING_STATE.pending,
        },
        {
            text: 'Xác nhận hủy',
            onClick: handleCancelBooking,
            isShow:
                user?.role === configs.USER_ROLES.admin &&
                status !== configs.BOOKING_STATE.done &&
                status !== configs.BOOKING_STATE.cancelled,
        },
        {
            text: 'Thay đổi thông tin',
            onClick: handleChangeBookingInfo,
            isShow:
                user?.role === configs.USER_ROLES.admin &&
                (status === configs.BOOKING_STATE.accepted ||
                    status === configs.BOOKING_STATE.fixing),
        },
        {
            text: 'Hoàn tác',
            onClick: handleUndoBooking,
            isShow:
                status === configs.BOOKING_STATE.cancelled ||
                status === configs.BOOKING_STATE.done,
        },
    ];

    return (
        <div className='w-full justify-center overflow-auto px-4'>
            <div className='mt-3 w-full'>
                <Button className='' rounded onClick={() => navigate(from)}>
                    Quay lại
                </Button>
                <h1 className='w-full text-center text-2xl font-bold'>
                    Thông tin đặt lịch
                </h1>
            </div>
            <div className='md:mx-6'>
                <div className='mt-8 grid w-full grid-cols-4 gap-1 rounded-md border-2 border-primary-light p-3'>
                    <div className='col-span-4'>
                        <span>Khách hàng: </span>
                        <span className='text-xl font-bold'>
                            {booking.user?.lastname +
                                ' ' +
                                booking.user?.firstname || '---'}
                        </span>
                    </div>
                    <div className='col-span-4'>
                        <span>SDT khách hàng: </span>
                        <span className='text-xl font-bold'>
                            {booking.user?.phone || '---'}
                        </span>
                    </div>
                    <div className='col-span-4'>
                        <span>Tên dịch vụ: </span>
                        <span className='text-xl font-bold'>
                            {booking.service?.name || '---'}
                        </span>
                    </div>
                    <div className='col-span-4'>
                        <span>Chi phí tạm tính: </span>
                        <span className='font-bold'>
                            {ultils.getCurrencyFormat(booking.service?.price) ||
                                '---'}
                        </span>
                    </div>

                    <div className='col-span-4 pb-2'>
                        <span>Địa chỉ sửa chữa: </span>
                        <span className='font-bold'>
                            {ultils.getFormatedAddress(booking?.address)}
                        </span>
                    </div>
                    <div className='col-span-4 pb-2'>
                        <span>Trạm dịch vụ: </span>
                        <span className='font-bold'>
                            {booking?.staff?.station?.name || '---'}
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
                                      : status ===
                                          configs.BOOKING_STATE.cancelled
                                        ? 'Đã hủy'
                                        : '---'}
                        </span>
                    </div>

                    <div className='col-span-1'>
                        <label
                            htmlFor='station'
                            className='mb-2 block text-sm font-medium text-gray-900'
                        >
                            Chi nhánh
                        </label>
                        <select
                            disabled={
                                user?.role !== configs.USER_ROLES.admin ||
                                status === configs.BOOKING_STATE.cancelled ||
                                status === configs.BOOKING_STATE.done
                            }
                            id='station'
                            className='block w-full rounded-lg border-2 border-primary-light p-2.5 text-sm focus:border-primary-light'
                            value={selectedStation}
                            onChange={(e) => {
                                if (user?.role !== configs.USER_ROLES.admin) {
                                    return;
                                }
                                setSelectedStaff('');
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
                    <div className='col-span-1'>
                        <label
                            htmlFor='staffs'
                            className='mb-2 block text-sm font-medium text-gray-900'
                        >
                            Nhân viên
                        </label>
                        <select
                            disabled={
                                user?.role !== configs.USER_ROLES.admin ||
                                status === configs.BOOKING_STATE.cancelled ||
                                status === configs.BOOKING_STATE.done
                            }
                            id='staffs'
                            className='block w-full rounded-lg border-2 border-primary-light p-2.5 text-sm focus:border-primary-light'
                            value={selectedStaff}
                            onChange={(e) => {
                                if (user?.role !== configs.USER_ROLES.admin) {
                                    return;
                                }
                                setSelectedStaff(e.target.value);
                            }}
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
                    <div className='col-span-2 mb-2 flex flex-col'>
                        <label
                            htmlFor='note'
                            className='mb-2 block text-sm font-medium text-gray-900'
                        >
                            Ghi chú
                        </label>
                        <Input
                            disabled={
                                user?.role !== configs.USER_ROLES.admin ||
                                status === configs.BOOKING_STATE.cancelled ||
                                status === configs.BOOKING_STATE.done
                            }
                            multiline
                            className={
                                'h-10 w-full rounded-md border-2 border-primary-light p-2'
                            }
                            value={note}
                            onChange={(e) => {
                                if (user?.role !== configs.USER_ROLES.admin) {
                                    return;
                                }
                                setNote(e.target.value);
                            }}
                        />
                    </div>

                    <div className='relative inline-block text-left'>
                        <div>
                            <button
                                type='button'
                                className='flex w-full items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-primary-light hover:ring-primary'
                                id='menu-button'
                                aria-expanded='true'
                                aria-haspopup='true'
                                onClick={() => setIsShowMenu(!isShowMenu)}
                            >
                                <p> Hành động</p>
                                <svg
                                    className='-mr-1 size-5 text-gray-400'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                    aria-hidden='true'
                                    data-slot='icon'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                            </button>
                        </div>

                        <div
                            className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isShowMenu ? 'block' : 'hidden'}`}
                            role='menu'
                            aria-orientation='vertical'
                            aria-labelledby='menu-button'
                            tabIndex='-1'
                        >
                            <div className='py-1' role='none'>
                                {buttonList.map((item, index) => {
                                    return (
                                        item.isShow && (
                                            <p
                                                key={index}
                                                className='block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-primary-supper-light hover:bg-opacity-50'
                                                role='menuitem'
                                                tabIndex='-1'
                                                onClick={item.onClick}
                                            >
                                                {item.text}
                                            </p>
                                        )
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {booking.image_url && (
                    <div className='mt-6 flex w-full flex-col items-center justify-center gap-y-2'>
                        <h1 className='text-2xl font-bold lg:text-3xl'>
                            Tình trạng của xe
                        </h1>
                        <Image
                            className='w-full border-2 border-primary object-cover md:w-11/12 lg:w-4/5'
                            src={`${baseApiEnpoint}${booking.image_url}`}
                            alt=''
                        />
                    </div>
                )}

                <div className='my-20 flex flex-col gap-y-8 text-center'>
                    <h1 className='text-2xl font-bold lg:text-3xl'>
                        Hướng dẫn đường đi
                    </h1>

                    <GoongMap
                        className='h-72 w-full bg-primary'
                        startPoint={startPoint}
                        endPoint={endPoint}
                        hidecenter
                    />
                </div>
            </div>
        </div>
    );
}

BookingDetail.propTypes = {};

export default BookingDetail;
