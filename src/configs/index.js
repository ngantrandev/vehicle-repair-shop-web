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
    admin: {
        dashboard: {
            services: '/admin/dashboard/service',
            users: '/admin/dashboard/user',
        },
    },
};

const configs = {
    routes,
};

export default configs;
