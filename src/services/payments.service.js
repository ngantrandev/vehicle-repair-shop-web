import httpRequests from '@/src/ultils/httpRequest.js';

const returnPayment = async (queryParams) => {
    try {
        const res = await httpRequests.get('/payments/result?', {
            params: {
                ...queryParams,
            },
        });
        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const paymentService = {
    returnPayment,
};

export default paymentService;
