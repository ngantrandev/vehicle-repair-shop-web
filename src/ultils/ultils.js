const getUserDataLogedin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        return user;
    }
    return null;
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

const ultils = {
    getUserDataLogedin,
    isValidInteger,
    getCurrencyFormat,
};

export default ultils;
