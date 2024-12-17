import httpRequests from '@/src/ultils/httpRequest.js';

const getRevenue = async (params) => {
    try {
        const res = await httpRequests.get('/admin/statistics/revenue', {
            params,
        });
        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getTopItems = async (params) => {
    try {
        const res = await httpRequests.get('/admin/statistics/top-items', {
            params,
        });
        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getTopStaffs = async (params) => {
    try {
        const res = await httpRequests.get('/admin/statistics/top-staffs', {
            params,
        });
        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const statisticsService = {
    getRevenue,
    getTopItems,
    getTopStaffs,
};

export default statisticsService;
