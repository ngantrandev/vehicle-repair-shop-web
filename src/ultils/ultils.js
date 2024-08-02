import moment from 'moment-timezone';
import polyline from '@mapbox/polyline';

const decodePolyline = (str) => {
    return polyline.decode(str).map(([lat, lng]) => [lng, lat]);
};

const getUserDataLogedin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        return user;
    }
    return null;
};

const getAccessToken = () => {
    const token = localStorage.getItem('token');

    if (token) {
        return token;
    }
    return null;
};

const getUserRole = () => {
    const token = getAccessToken();

    if (!token) {
        return '';
    }

    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );

    const payload = JSON.parse(jsonPayload);

    return payload.role;
};

const isValidInteger = (value) => {
    // const trimmedValue = value.trim();
    const trimmedValue = value.toString().trim();

    return (
        !isNaN(trimmedValue) &&
        Number.isInteger(Number(trimmedValue)) &&
        trimmedValue.length > 0
    );
};

const getCurrencyFormat = (value) => {
    return Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value);
};

const convertTimeToGMT7 = (time) => {
    const localDateTime = moment.utc(time).tz('Asia/Bangkok');

    return localDateTime.format('HH:mm:ss DD/MM/YYYY');
};

const removeUserDataLogedin = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

const ultils = {
    getUserDataLogedin,
    isValidInteger,
    getCurrencyFormat,
    convertTimeToGMT7,
    removeUserDataLogedin,
    getAccessToken,
    getUserRole,
    decodePolyline,
};

export default ultils;
