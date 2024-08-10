import httpRequests from '../ultils/httpRequest.js';

const getProfileByUsername = async (username) => {
    try {
        const res = await httpRequests.get(`/profile/${username}`);
        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const updateProfile = async (userId, data) => {
    try {
        const res = await httpRequests.patchFormData(
            `/profile/${userId}`,
            data
        );
        return res;
    } catch (error) {
        throw new Error(error);
    }
};

const profileService = {
    getProfileByUsername,
    updateProfile,
};

export default profileService;
