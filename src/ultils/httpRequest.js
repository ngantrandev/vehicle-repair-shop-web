import axios from 'axios';

import configs from '../configs';

const httpRequest = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        token: 'Bearer' + ' ' + localStorage.getItem('token'),
    },
});

const get = async (apiPath, params = {}) => {
    try {
        const res = await httpRequest.get(apiPath, params);

        if (res.status !== configs.STATUS_CODE.OK) {
            throw new Error(res.data.message);
        }

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const post = async (apiPath, data = {}) => {
    try {
        const res = await httpRequest.post(apiPath, data);

        if (res.status !== configs.STATUS_CODE.OK) {
            throw new Error(res.data.message);
        }

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const patch = async (apiPath, data = {}) => {
    try {
        const res = await httpRequest.patch(apiPath, data);

        if (res.status !== configs.STATUS_CODE.OK) {
            throw new Error(res.data.message);
        }

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

// export default httpRequest;

const requests = {
    get,
    post,
    patch,
};

export default requests;
