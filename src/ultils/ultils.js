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

const ultils = {
    getUserDataLogedin,
    isValidInteger,
};

export default ultils;
