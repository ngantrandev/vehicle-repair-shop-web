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

const statisticsService = {
    getRevenue,
};

export default statisticsService;
