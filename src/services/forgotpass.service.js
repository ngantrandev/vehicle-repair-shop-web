import requests from '@/src/ultils/httpRequest';

const forgotPass = async (data) => {
    try {
        const res = await requests.post('/auth/forgot-password', data);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const resetPass = async (data) => {
    try {
        const res = await requests.post('/auth/reset-password', data);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

export default {
    forgotPass,
    resetPass,
};
