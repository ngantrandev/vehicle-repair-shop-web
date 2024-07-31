import httpRequest from '../ultils/httpRequest';

const getAllStaffOfStation = async (stationId) => {
    try {
        const res = await httpRequest.get(`admin/stations/${stationId}/staffs`);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const adminStaffService = {
    getAllStaffOfStation,
};

export default adminStaffService;
