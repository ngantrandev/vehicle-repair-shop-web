import httpRequest from '@/src/ultils/httpRequest';

const getAllItems = async () => {
    try {
        const res = await httpRequest.get('/items');

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getAllItemsOfService = async (serviceId) => {
    try {
        const res = await httpRequest.get(`/items/service/`, {
            params: {
                service_id: serviceId,
            },
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getAllItemsOfBooking = async (bookingId) => {
    try {
        const res = await httpRequest.get(`/items/booking/`, {
            params: {
                booking_id: bookingId,
            },
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const addItemToBooking = async (bookingId, itemId) => {
    try {
        const res = await httpRequest.post(`/items/booking/add`, {
            booking_id: bookingId,
            item_id: itemId,
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const removeItemFromBooking = async (bookingId, itemId) => {
    try {
        const res = await httpRequest.patch(`/items/booking/remove`, {
            booking_id: bookingId,
            item_id: itemId,
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const itemsService = {
    getAllItems,
    getAllItemsOfService,
    getAllItemsOfBooking,
    addItemToBooking,
    removeItemFromBooking,
};

export default itemsService;
