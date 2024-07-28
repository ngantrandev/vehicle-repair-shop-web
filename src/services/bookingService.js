import * as httpRequests from '../ultils/httpRequest';

const createBooking = async (userId, bookingData) => {
    try {
        const res = await httpRequests.post(
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
            `users/${userId}/bookings/${bookingId}`,
            data
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
};

export default bookingService;
