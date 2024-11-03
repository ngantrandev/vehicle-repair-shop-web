import httpRequests from '../ultils/httpRequest';

const getListService = async (params = {}) => {
    try {
        const res = await httpRequests.get('/services', {
            params: {
                ...params,
            },
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getServiceById = async (id) => {
    try {
        const res = await httpRequests.get(`/services/${id}`);

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const getServiceCategories = async () => {
    try {
        const res = await httpRequests.get('/services/categories');

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const updateService = async (service) => {
    try {
        const res = await httpRequests.patchFormData(`admin/services/${service.id}`, {
            ...service,
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const createService = async (service) => {
    try {
        const res = await httpRequests.postFormData('admin/services', {
            ...service,
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const serviceService = {
    getServiceById,
    getServiceCategories,
    updateService,
    createService,
    getListService,
};

export default serviceService;
