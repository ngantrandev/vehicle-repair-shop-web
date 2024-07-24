const routes = {
    login: '/login',
    register: '/register',
    home: '/home',
    resetPassword: '/reset-password',
    service: {
        list: '/service/',
        create: '/service/new',
        modify: '/service/:service_id/modify',
    },
};

const configs = {
    routes,
};

export default configs;
