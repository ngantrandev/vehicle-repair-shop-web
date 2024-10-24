import httpRequests from '../ultils/httpRequest.js';

const getAllBooking = async () => {
    try {
        const res = await httpRequests.get('/admin/bookings');
        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const confirmBooking = async (bookingId, note, staffId) => {
    try {
        const res = await httpRequests.patch(
            `/admin/bookings/${bookingId}/confirm`,
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

const assignStaffToBooking = async ( bookingId, staffId, note) => {
    try {
        const res = await httpRequests.patch(
            `/admin/bookings/${bookingId}/assign`,
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
    assignStaffToBooking,
};

export default adminBookingService;
