import httpRequests from '@/src/ultils/httpRequest.js';

const getAllBooking = async (params) => {
    try {
        const res = await httpRequests.get('/admin/bookings', {
            params: params,
        });
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

const assignStaffToBooking = async (bookingId, staffId, note) => {
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
