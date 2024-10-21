const goongMapKey = import.meta.env.VITE_GOONG_MAP_KEY;
const goongMapBaseUrl = import.meta.env.VITE_GOONG_MAP_BASE_URL;

import httpRequest from '../ultils/httpRequest';

const getDirections = async (
    origin = [],
    destination = [],
    vehicleType = 'bike'
) => {
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

const autoCompleteAddress = async (input, latitude, longitude) => {
    const res = await httpRequest.get('address/autocomplete', {
        params: {
            input,
            latitude,
            longitude,
        },
    });

    return res;
};

const getAddressInfoByPlaceId = async (placeId) => {
    const res = await httpRequest.get('address/detail', {
        params: {
            place_id: placeId,
        },
    });

    return res;
};

const getReverseGeocoding = async (latitude, longitude) => {
    const res = await httpRequest.get('address/reverse', {
        params: {
            lat: latitude,
            lng: longitude,
        },
    });

    return res;
};

const goongMapService = {
    getDirections,
    autoCompleteAddress,
    getAddressInfoByPlaceId,
    getReverseGeocoding,
};

export default goongMapService;
