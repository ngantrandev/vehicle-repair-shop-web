import httpRequest from '@/src/ultils/httpRequest';

const updateUserInfo = async (userId, data) => {
    try {
        const res = await httpRequest.patch(`/admin/users/${userId}`, data);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getUserById = async (userId) => {
    try {
        const res = await httpRequest.get(`/admin/users/${userId}`);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const adminUserService = {
    updateUserInfo,
    getUserById,
};

export default adminUserService;
