import httpRequests from '@/src/ultils/httpRequest';

const getAllStaffs = async () => {
    try {
        const res = await httpRequests.get('/admin/staffs');

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const createStaff = async (data) => {
    try {
        const res = await httpRequests.post('/admin/staffs', data);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const activeStaff = async (id) => {
    try {
        const res = await httpRequests.patch(`/admin/staffs/${id}`, {
            active: '1',
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const inactiveStaff = async (id) => {
    try {
        const res = await httpRequests.patch(`/admin/staffs/${id}`, {
            active: '0',
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

export default {
    getAllStaffs,
    activeStaff,
    inactiveStaff,
    createStaff,
};
