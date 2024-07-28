import * as httpRequests from '../ultils/httpRequest';

const getServiceCategories = async () => {
    try {
        const res = await httpRequests.get('/services/categories');

        return res.data;
    } catch (error) {
        throw new Error(error);
    }
};

const getMotorcycleBrands = async () => {
    try {
        const res = await httpRequests.get('/motorcycle-brands');

        return res.data;
    } catch (error) {
        throw new Error(error);
    }
};

const getListService = async () => {
    try {
        const res = await httpRequests.get('/services');

        return res.data;
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

export {
    getListService,
    getServiceCategories,
    getMotorcycleBrands,
    getListProvince,
    getListDistrict,
    getListWard,
};
