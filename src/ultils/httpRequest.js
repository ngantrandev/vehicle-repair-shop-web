import axios from 'axios';

import configs from '../configs';
import ultils from './ultils';

const httpRequest = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const get = async (apiPath, params = {}) => {
    try {
        const token = ultils.getAccessToken();

        const res = await httpRequest.get(apiPath, {
            ...params,

            headers: {
                token: 'Bearer ' + token,
            },
        });

        if (res.status !== configs.STATUS_CODE.OK) {
            return null;
        }

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const post = async (apiPath, data = {}) => {
    try {
        const token = ultils.getAccessToken();

        const res = await httpRequest.post(apiPath, data, {
            headers: {
                token: 'Bearer ' + token,
            },
        });

        if (res.status !== configs.STATUS_CODE.OK) {
            return null;
        }

        return res;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else if (error.request) {
            // Yêu cầu đã được gửi nhưng không nhận được phản hồi
            console.error('Error request:', error.request);
            throw new Error('No response received from server');
        } else {
            throw new Error(error.message);
        }
    }
};

const patch = async (apiPath, data = {}) => {
    try {
        const token = ultils.getAccessToken();

        const res = await httpRequest.patch(apiPath, data, {
            headers: {
                token: 'Bearer ' + token,
            },
        });

        if (res.status !== configs.STATUS_CODE.OK) {
            return null;
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
