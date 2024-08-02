const goongMapKey = import.meta.env.VITE_GOONG_MAP_KEY;
const goongMapBaseUrl = import.meta.env.VITE_GOONG_MAP_BASE_URL;

import httpRequest from '../ultils/httpRequest';

const getDirections = async (origin = [], destination = [], vehicleType = 'bike') => {
    const [originLongitude, originLatitude] = origin;
    const [destinationLongitude, destinationLatitude] = destination;

    const res = await httpRequest.get(`${goongMapBaseUrl}/Direction`, {
        params: {
            origin: `${originLatitude},${originLongitude}`,
            destination: `${destinationLatitude},${destinationLongitude}`,
            vehicle: vehicleType,
            api_key: goongMapKey,
        },
    });

    return res;
};

const goongMapService = {
    getDirections,
};

export default goongMapService;
