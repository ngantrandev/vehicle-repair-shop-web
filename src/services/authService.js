import httpRequests from '../ultils/httpRequest.js';

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

const register = async ({ username, password, fullName, email }) => {
    try {
        const words = fullName.split(' ');

        const firstname = words[0];
        const lastname = words.slice(1).join(' ');

        const res = await httpRequests.post('/auth/register', {
            username,
            password,
            firstname,
            lastname,
            email,
        });

        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const authService = {
    login,
    register,
};

export default authService;
