const routes = {
    login: '/login',
    register: '/register',
    home: '/home',
    resetPassword: '/reset-password',
    profile: '/profile/',
    service: {
        list: '/services/',
        create: '/services/new',
        detail: '/services/:service_id',
    },
    booking: {
        list: 'users/:user_id/bookings/',
        create: '/bookings/new',
        modify: '/bookings/:booking_id/modify',
        detail: '/users/:user_id/bookings/:booking_id',
    },

    admin: {
        dashboard: {
            services: '/admin/dashboard/service',
            users: '/admin/dashboard/user',
            staffs: '/admin/dashboard/staff',
            bookings: '/admin/dashboard/booking',
            stations: '/admin/dashboard/station',
        },
        service: {
            modify: 'admin/services/:service_id/modify',
        },
        station: {
            modify: '/admin/dashboard/stations/:station_id/modify',
            create: '/admin/dashboard/stations/new',
        },
        statistics: "/admin/dashboard/statistics",
    },
    staff: {
        task: '/staff/tasks',
    },
};

const STATUS_CODE = {
    OK: 200,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
};

const BOOKING_STATE = {
    pending: 'pending',
    accepted: 'accepted',
    fixing: 'fixing',
    done: 'done',
    cancelled: 'cancelled',
};

const USER_ROLES = {
    admin: 'admin',
    customer: 'customer',
    staff: 'staff',
};

const configs = {
    routes,
    STATUS_CODE,
    BOOKING_STATE,
    USER_ROLES,
};

export default configs;
