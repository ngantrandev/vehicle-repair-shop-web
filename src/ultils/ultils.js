import moment from 'moment-timezone';
import polyline from '@mapbox/polyline';
import { toast } from 'react-toastify';

const baseApiEnpoint = import.meta.env.VITE_API_BASE_URL;

const getCookie = (cname) => {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
};

const decodePolyline = (str) => {
    return polyline.decode(str).map(([lat, lng]) => [lng, lat]);
};

const getUserDataLogedin = () => {
    const localStorageUser = JSON.parse(localStorage.getItem('user'));
    if (localStorageUser) {
        return localStorageUser;
    }

    const sessionStorageUser = JSON.parse(sessionStorage.getItem('user'));

    if (sessionStorageUser) {
        return sessionStorageUser;
    }

    return null;
};

const saveUserDataLogedin = (user, token, remember) => {
    if (remember) {
        localStorage.setItem('user', JSON.stringify(user));
        let date = new Date();
        date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
        let expires = 'expires=' + date.toUTCString();
        document.cookie = `token=${token}; ${expires};`;
    } else {
        sessionStorage.setItem('user', JSON.stringify(user));
        document.cookie = `token=${token}; path=/`;
    }
};

const getAccessToken = () => {
    const token = getCookie('token');

    if (token) {
        return token;
    }

    return null;
};

const getUserRole = (token) => {
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

const getFormatedTime = (time) => {
    const gmt7Time = convertTimeToGMT7(time); // Lấy thời gian đã được chuyển về GMT+7
    const specificDate = moment.tz(
        gmt7Time,
        'HH:mm:ss DD/MM/YYYY',
        'Asia/Bangkok'
    );
    return specificDate.format('DD/MM/YYYY HH:mm:ss');
};

const removeUserDataLogedin = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

const isValidEmail = (email) => {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const isVietnamesePhoneNumber = (number) => {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
};

const notifySuccess = (message, configs = {}) => {
    toast.success(message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'colored',
        ...configs,
    });
};

const notifyError = (message, configs = {}) => {
    toast.error(message, {
        position: 'bottom-right',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'colored',
        ...configs,
    });
};

const notifyInfo = (message, configs = {}) => {
    toast.info(message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'colored',
        ...configs,
    });
};

const notifyWarning = (message, configs = {}) => {
    toast.warning(message, {
        position: 'bottom-right',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'colored',
        ...configs,
    });
};

const convertTimeFormat = (time, currFormat, targetFormat) => {
    return moment(time, currFormat).format(targetFormat);
};

const getFormatedAddress = (address) => {
    return address?.address_name + ', ' + address?.full_address;
};

const getFormatedImageUrl = (url) => {
    // Kiểm tra xem URL có bắt đầu bằng "http" hoặc "https" không
    url = url.trim();
    if (/^(https?:\/\/|blob:http)/i.test(url)) {
        return url;
    }
    // Nếu không, ghép API endpoint với URL
    return `${baseApiEnpoint}${url}`;
};

const getDateMonth = (date) => {
    const gmt7Time = convertTimeToGMT7(date); // Lấy thời gian đã được chuyển về GMT+7
    const specificDate = moment.tz(
        gmt7Time,
        'HH:mm:ss DD/MM/YYYY',
        'Asia/Bangkok'
    );
    return specificDate.format('DD/MM');
};

const ultils = {
    getUserDataLogedin,
    saveUserDataLogedin,
    isValidInteger,
    getCurrencyFormat,
    convertTimeToGMT7,
    removeUserDataLogedin,
    getAccessToken,
    getUserRole,
    decodePolyline,
    isValidEmail,
    isVietnamesePhoneNumber,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
    getFormatedAddress,
    getFormatedTime,
    getFormatedImageUrl,
    getDateMonth,
    convertTimeFormat,
};

export default ultils;
