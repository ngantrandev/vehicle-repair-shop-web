import httpRequests from '../ultils/httpRequest';

const getMotorcycleBrands = async () => {
    try {
        const res = await httpRequests.get('/motorcycle-brands');

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getListProvince = async () => {
    try {
        const res = await httpRequests.get('/addresses/provinces');

        return res.data;
    } catch (error) {
        throw new Error(error);
    }
};

const getListDistrict = async (provinceId) => {
    try {
        const res = await httpRequests.get(
            `/addresses/provinces/${provinceId}/districts`
        );

        return res.data;
    } catch (error) {
        throw new Error(error);
    }
};

const getListWard = async (districtId) => {
    try {
        const res = await httpRequests.get(
            `/addresses/districts/${districtId}/wards`
        );

        return res.data;
    } catch (error) {
        throw new Error(error);
    }
};

const getCarts = async (userId) => {
    try {
        const res = await httpRequests.get(`users/${userId}/carts`);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getActiveServiceStations = async () => {
    try {
        const res = await httpRequests.get('/stations');

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const loadData = {
    getMotorcycleBrands,
    getListProvince,
    getListDistrict,
    getListWard,
    getCarts,
    getActiveServiceStations,
};

export default loadData;
