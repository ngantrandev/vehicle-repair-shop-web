import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton, Menu, MenuItem } from '@mui/material';

import Breadcrumbs from '@/src/components/Breadcrumbs/Breadcrumbs';
import Button from '@/src/components/button';
import Image from '@/src/components/image/Image';
import Input from '@/src/components/input';
import GoongMap from '@/src/components/map/GoongMap';
import configs from '@/src/configs';
import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';
import useUser from '@/src/hooks/useUser';
import adminBookingService from '@/src/services/admin.bookingService';
import adminStaffService from '@/src/services/admin.staff.service';
import bookingService from '@/src/services/bookingService';
import itemsService from '@/src/services/itemsService';
import stationsService from '@/src/services/stationsService';
import ultils from '@/src/ultils';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';

function BookingDetail() {
    const { booking_id: bookingId, user_id: userId } = useParams();

    const { user } = useUser();

    const [status, setStatus] = useState();

    const [isChangeStatus, setIsChangeStatus] = useState(false);

    const [selectedStaff, setSelectedStaff] = useState('');
    const [selectedStation, setSelectedStation] = useState('');

    console.log(selectedStation);
    const [note, setNote] = useState('');

    const [booking, setBooking] = useState({});

    const [stations, setStations] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [listItemsOfBooking, setListItemsOfBooking] = useState([]);
    const [listItems, setListItems] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const canModifyItems = useMemo(() => {
        return (
            user?.role === configs.USER_ROLES.admin &&
            status !== configs.BOOKING_STATE.cancelled &&
            status !== configs.BOOKING_STATE.done &&
            !booking.is_paid
        );
    }, [user, status]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { setBreadcrumbsData } = useBreadcrumbs();

    useEffect(() => {
        setBreadcrumbsData([
            {
                to: configs.routes.admin.dashboard.statistics,
                label: 'Home',
                icon: ViewCompactIcon,
            },
            {
                to: configs.routes.admin.dashboard.bookings,
                label: 'Danh sách lịch hẹn',
            },
            {
                to: '',
                label: 'Chi tiết lịch hẹn',
            },
        ]);
    }, [setBreadcrumbsData]);

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
        const fetchData = async () => {
            try {
                const res = await stationsService.getActiveServiceStations();
                const itemsRes = await itemsService.getAllItems();
                if (res.status !== configs.STATUS_CODE.OK) {
                    throw new Error(res.data.message);
                }

                if (itemsRes.status !== configs.STATUS_CODE.OK) {
                    throw new Error(itemsRes.data.message);
                }

                const resData = res.data;
                const itemsResData = itemsRes.data;
                setStations(resData.data);
                setListItems(itemsResData.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchBookingDetail = async () => {
            try {
                const res = await bookingService.getBookingByID(bookingId);
                const itemsOfBookingRes =
                    await itemsService.getAllItemsOfBooking(bookingId);

                if (res.status !== configs.STATUS_CODE.OK) {
                    throw new Error(res.data.message);
                }

                if (itemsOfBookingRes.status !== configs.STATUS_CODE.OK) {
                    throw new Error(itemsOfBookingRes.data.message);
                }

                const resData = res.data;
                const itemsOfBookingResData = itemsOfBookingRes.data;

                setListItemsOfBooking(itemsOfBookingResData.data);

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
            // if (!selectedStation || selectedStation.length === 0) {
            //     ultils.notifyWarning('Vui lòng chọn chi nhánh');
            //     return;
            // }

            // if (!selectedStaff || selectedStaff.length === 0) {
            //     ultils.notifyWarning('Vui lòng chọn nhân viên');
            //     return;
            // }

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
            const res = await bookingService.doneBooking(bookingId, note);

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

    const handleExportInvoice = async () => {
        try {
            const res = await bookingService.exportInvoice(bookingId);

            if (res.status == configs.STATUS_CODE.OK) {
                ultils.notifySuccess('Xuất hóa đơn thành công');
            } else {
                ultils.notifyError('Xuất hóa đơn thất bại');
            }
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
        {
            text: 'Xuất hóa đơn',
            onClick: handleExportInvoice,
            isShow: true,
        },
    ];

    const handleAddItem = async (item) => {
        try {
            const { id: itemId } = item;
            let flag = false;
            const res = await itemsService.addItemToBooking(bookingId, itemId);

            if (res.status !== configs.STATUS_CODE.OK) {
                throw new Error(res.data.message);
            }

            const newItems = listItemsOfBooking.map((i) => {
                if (i.id === itemId) {
                    flag = true;
                    return {
                        ...i,
                        quantity: i.quantity + 1,
                    };
                }
                return i;
            });

            if (!flag) {
                newItems.push({
                    ...item,
                    quantity: 1,
                });
            }

            setListItemsOfBooking(newItems);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const res = await itemsService.removeItemFromBooking(
                bookingId,
                itemId
            );

            if (res.status !== configs.STATUS_CODE.OK) {
                throw new Error(res.data.message);
            }

            const newItems = listItemsOfBooking.filter((item) => {
                if (item.id !== itemId) {
                    return item;
                } else if (item.quantity > 1) {
                    item.quantity -= 1;
                    return item;
                } else if (item.quantity === 1) {
                    return;
                }
            });
            setListItemsOfBooking(newItems);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex flex-col justify-center overflow-auto bg-white px-4'>
            <div className='my-5 w-full'>
                <Breadcrumbs />
            </div>
            <div className='px-20'>
                <div className='grid w-full grid-cols-2 grid-rows-3'>
                    <div className='p-3'>
                        <h2 className='font-bold'>Thông tin khách hàng</h2>
                        <p>{`Tên khách hàng: ${booking.user?.lastname} ${booking.user?.firstname}`}</p>
                        <p>{`Số điện thoại: ${booking.user?.phone}`}</p>
                        <p>{`Địa chỉ: ${ultils.getFormatedAddress(booking.address)}`}</p>
                    </div>
                    <div className='p-3'>
                        <h2 className='font-bold'>
                            Thông tin trạm và nhân viên
                        </h2>
                        <div className='flex items-center gap-4'>
                            <span className='mb-2 block text-sm font-medium text-gray-900'>
                                Chi nhánh
                            </span>
                            <select
                                className='min-w-64 rounded-lg border-2 border-primary-light p-2.5 text-sm focus:border-primary-light'
                                disabled={
                                    user?.role !== configs.USER_ROLES.admin ||
                                    status ===
                                        configs.BOOKING_STATE.cancelled ||
                                    status === configs.BOOKING_STATE.done
                                }
                                id='station'
                                value={selectedStation}
                                onChange={(e) => {
                                    if (
                                        user?.role !== configs.USER_ROLES.admin
                                    ) {
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
                        <div className='flex items-center gap-4'>
                            <span className='mb-2 block text-sm font-medium text-gray-900'>
                                Nhân viên
                            </span>
                            <select
                                className='min-w-64 rounded-lg border-2 border-primary-light p-2.5 text-sm focus:border-primary-light'
                                disabled={
                                    user?.role !== configs.USER_ROLES.admin ||
                                    status ===
                                        configs.BOOKING_STATE.cancelled ||
                                    status === configs.BOOKING_STATE.done
                                }
                                id='staffs'
                                value={selectedStaff}
                                onChange={(e) => {
                                    if (
                                        user?.role !== configs.USER_ROLES.admin
                                    ) {
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
                    </div>
                    <div className='p-3'>
                        <h2 className='font-bold'>Thông tin lịch hẹn</h2>
                        <p>{`Tên dịch vụ: ${booking.service?.name}`}</p>
                        <p>{`Phí dịch vụ: ${ultils.getCurrencyFormat(booking.service?.price)}`}</p>
                        <p>{`Thời gian  : ${booking.service?.estimated_time}`}</p>
                        <div>
                            <span>Trạng thái thanh toán: </span>
                            {booking.is_paid ? (
                                <span className='font-bold text-green-500'>
                                    Đã thanh toán
                                </span>
                            ) : (
                                <span className='font-bold text-red-500'>
                                    Chưa thanh toán
                                </span>
                            )}
                        </div>
                    </div>
                    <div className='row-span-1 p-3'>
                        <h2 className='font-bold'>Danh sách sản phẩm</h2>
                        <div className='max-h-28 overflow-auto'>
                            {listItemsOfBooking.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className='mb-1 flex items-center justify-between gap-2'
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
                                        <div className='mr-4 flex items-center justify-center'>
                                            {canModifyItems ? (
                                                <>
                                                    <IconButton
                                                        color='#ccc'
                                                        aria-label='remove'
                                                        onClick={() => {
                                                            handleRemoveItem(
                                                                item.id
                                                            );
                                                        }}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <p>{item.quantity}</p>
                                                    <IconButton
                                                        aria-label='add'
                                                        onClick={() => {
                                                            handleAddItem(item);
                                                        }}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <p>{`Số lượng: ${item.quantity}`}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className='p-3'>
                        <label
                            htmlFor='note'
                            className='mb-2 block text-sm font-bold text-gray-900'
                        >
                            Ghi chú
                        </label>
                        <Input
                            className={
                                'h-20 w-1/2 rounded-md border-2 border-primary-light p-2'
                            }
                            disabled={
                                user?.role !== configs.USER_ROLES.admin ||
                                status === configs.BOOKING_STATE.cancelled ||
                                status === configs.BOOKING_STATE.done
                            }
                            multiline
                            value={note}
                            onChange={(e) => {
                                if (user?.role !== configs.USER_ROLES.admin) {
                                    return;
                                }
                                setNote(e.target.value);
                            }}
                        />
                    </div>
                    <div className={`p-3 ${booking.is_paid && 'hidden'}`}>
                        <div className='max-h-28 overflow-auto'>
                            {canModifyItems &&
                                listItems.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className='mb-1 mr-10 flex items-center justify-between gap-2 hover:cursor-pointer hover:bg-gray-100'
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

                                            <Button
                                                rounded
                                                onClick={() => {
                                                    handleAddItem(item);
                                                }}
                                            >
                                                Thêm
                                            </Button>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
                <div className='px-4'>
                    <Button
                        id='basic-button'
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        outlined
                    >
                        Hành động
                    </Button>
                    <Menu
                        id='basic-menu'
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {buttonList.map((item, index) => {
                            return (
                                item.isShow && (
                                    <MenuItem
                                        key={index}
                                        onClick={() => {
                                            item.onClick();
                                            handleClose();
                                        }}
                                    >
                                        {item.text}
                                    </MenuItem>
                                )
                            );
                        })}
                    </Menu>
                </div>

                {booking.image_url && (
                    <div className='mt-6 flex w-full flex-col items-center justify-center gap-y-2'>
                        <h1 className='text-2xl font-bold lg:text-3xl'>
                            Tình trạng của xe
                        </h1>
                        <Image
                            className='w-full border-2 border-primary object-cover md:w-11/12 lg:w-4/5'
                            src={ultils.getFormatedImageUrl(booking?.image_url)}
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
