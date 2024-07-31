import httpRequests from '../ultils/httpRequest';

const getAllUsers = async () => {
    try {
        const res = await httpRequests.get('/admin/users');

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const userService = {
    getAllUsers,
};

export default userService;
