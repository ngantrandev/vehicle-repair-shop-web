import httpRequest from '@/src/ultils/httpRequest';

const getAllStaffOfStation = async (stationId) => {
    try {
        const res = await httpRequest.get(`/stations/${stationId}/staffs`);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const updateStaffInfo = async (staffId, data) => {
    try {
        const res = await httpRequest.patch(`/admin/staffs/${staffId}`, data);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getStaffById = async (staffId) => {
    try {
        const res = await httpRequest.get(`/admin/staffs/${staffId}`);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const adminStaffService = {
    getAllStaffOfStation,
    updateStaffInfo,
    getStaffById,
};

export default adminStaffService;
