import * as httpRequests from '../ultils/httpRequest.js';

const login = async ({ username, password }) => {
    try {
        const res = await httpRequests.post('/auth/signin', {
            username,
            password,
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

export { login };
