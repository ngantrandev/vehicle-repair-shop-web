import httpRequests from '@/src/ultils/httpRequest';

const createBooking = async (bookingData) => {
    try {
        const res = await httpRequests.postFormData(
            `users/bookings`,
            bookingData
        );

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getAllBookings = async (params) => {
    try {
        const res = await httpRequests.get(`users/bookings`, { params });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const cancelBooking = async (bookingId, data) => {
    try {
        const res = await httpRequests.patch(
            `users/bookings/${bookingId}/cancel`,
            data
        );

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const doneBooking = async (bookingId, note) => {
    try {
        const res = await httpRequests.patch(
            `staffs/bookings/${bookingId}/set_done`,
            { note: note }
        );

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getBookingByID = async (bookingId) => {
    try {
        const res = await httpRequests.get(`/bookings/${bookingId}`);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const setBookingStatusToFixing = async (bookingId, note) => {
    try {
        const res = await httpRequests.patch(
            `staffs/bookings/${bookingId}/set_fixing`,
            { note: note }
        );

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getAllBookingsOfStaff = async (staffId) => {
    try {
        if (!staffId) return;

        const res = await httpRequests.get(`staffs/${staffId}/bookings`);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const undoBooking = async (bookingId) => {
    try {
        const res = await httpRequests.patch(
            `admin/bookings/${bookingId}/undo`
        );

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const userUndoCancelBooking = async (bookingId) => {
    try {
        const res = await httpRequests.patch(`/bookings/${bookingId}/undo`);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const exportInvoice = async (bookingId) => {
    try {
        const res = await httpRequests.post(`/invoices/export`, {
            booking_id: bookingId,
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const bookingService = {
    createBooking,
    getAllBookings,
    cancelBooking,
    doneBooking,
    getBookingByID,
    setBookingStatusToFixing,
    getAllBookingsOfStaff,
    undoBooking,
    userUndoCancelBooking,
    exportInvoice,
};

export default bookingService;
