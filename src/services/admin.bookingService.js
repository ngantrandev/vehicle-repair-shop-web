import httpRequests from '../ultils/httpRequest.js';

const getAllBooking = async () => {
    try {
        const res = await httpRequests.get('/admin/bookings');
        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const confirmBooking = async (userId, bookingId, note, staffId) => {
    try {
        const res = await httpRequests.patch(
            `/admin/users/${userId}/bookings/${bookingId}/confirm`,
            {
                employee_id: staffId,
                note: note,
            }
        );
        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const adminBookingService = {
    getAllBooking,
    confirmBooking,
};

export default adminBookingService;
