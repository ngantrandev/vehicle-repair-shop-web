import httpRequests from '../ultils/httpRequest';

const getAllUsers = async () => {
    try {
        const res = await httpRequests.get('/admin/users');

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const activeUser = async (id) => {
    try {
        const res = await httpRequests.patch(`/admin/users/${id}`, {
            active: '1',
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const inactiveUser = async (id) => {
    try {
        const res = await httpRequests.patch(`/admin/users/${id}`, {
            active: '0',
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const userService = {
    getAllUsers,
    activeUser,
    inactiveUser,
};

export default userService;
