import httpRequests from '@/src/ultils/httpRequest.js';

const getActiveServiceStations = async () => {
    try {
        const res = await httpRequests.get('/stations');

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getStationById = async (id) => {
    try {
        const res = await httpRequests.get(`/stations/${id}`);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const updateStation = async (id, data) => {
    try {
        const res = await httpRequests.patch(`/stations/${id}`, data);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const createStation = async (data) => {
    try {
        const res = await httpRequests.post('/stations', data);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const stationsService = {
    getActiveServiceStations,
    getStationById,
    updateStation,
    createStation,
};

export default stationsService;
