import httpRequests from '../ultils/httpRequest';

const createBooking = async (userId, bookingData) => {
    try {
        const res = await httpRequests.postFormData(
            `users/${userId}/bookings`,
            bookingData
        );

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getAllBookings = async (userId) => {
    try {
        const res = await httpRequests.get(`users/${userId}/bookings`);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const cancelBooking = async (userId, bookingId, data) => {
    try {
        const res = await httpRequests.patch(
            `users/${userId}/bookings/${bookingId}/cancel`,
            data
        );

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const doneBooking = async (staffId, bookingId, note) => {
    try {
        const res = await httpRequests.patch(
            `staffs/${staffId}/bookings/${bookingId}/set_done`,
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

const setBookingStatusToFixing = async (staffId, bookingId, note) => {
    try {
        const res = await httpRequests.patch(
            `staffs/${staffId}/bookings/${bookingId}/set_fixing`,
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

const bookingService = {
    createBooking,
    getAllBookings,
    cancelBooking,
    doneBooking,
    getBookingByID,
    setBookingStatusToFixing,
    getAllBookingsOfStaff,
    undoBooking,
};

export default bookingService;
