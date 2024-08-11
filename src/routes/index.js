import BookingMagager from '../components/pages/admin/Booking';
import MyBookings from '../components/pages/booking/MyBookings.jsx';
import CreateService from '../components/pages/CreateService.jsx';
import Home from '../components/pages/Home.jsx';
import Login from '../components/pages/Login.jsx';
import ModifyService from '../components/pages/ModifyService.jsx';
import Register from '../components/pages/Register.jsx';
import Service from '../components/pages/admin/Service';
import ServiceDetail from '../components/pages/ServiceDetail.jsx';
import User from '../components/pages/admin/User';
import configs from '../configs';
import SidebarLayout from '../layouts/sidebarLayout/SidebarLayout.jsx';
import BookingDetail from '../components/pages/booking/BookingDetail.jsx';
import MyTasks from '../components/pages/staff/MyTasks.jsx';
import StationDetail from '../components/pages/admin/Station/StationDetail.jsx';
import Stations from '../components/pages/admin/Station';
import CreateStation from '../components/pages/admin/Station/CreateStation.jsx';
import Profile from '../components/pages/Profile.jsx';

const publicRoutes = [
    { path: configs.routes.login, component: Login, layout: null },
    { path: configs.routes.register, component: Register, layout: null },
    { path: configs.routes.home, component: Home },

    {
        path: configs.routes.service.detail,
        component: ServiceDetail,
    },
];

const privateRoutes = [
    {
        path: configs.routes.admin.dashboard.users,
        component: User,
        layout: SidebarLayout,
        role: configs.USER_ROLES.admin,
    },
    {
        path: configs.routes.admin.dashboard.services,
        component: Service,
        layout: SidebarLayout,
        role: configs.USER_ROLES.admin,
    },
    {
        path: configs.routes.admin.dashboard.bookings,
        component: BookingMagager,
        layout: SidebarLayout,
        role: configs.USER_ROLES.admin,
    },
    {
        path: configs.routes.admin.dashboard.stations,
        component: Stations,
        layout: SidebarLayout,
        role: configs.USER_ROLES.admin,
    },
    {
        path: configs.routes.admin.station.modify,
        component: StationDetail,
        role: configs.USER_ROLES.admin,
    },
    {
        path: configs.routes.admin.station.create,
        component: CreateStation,
        role: configs.USER_ROLES.admin,
    },
    {
        path: configs.routes.booking.detail,
        component: BookingDetail,
        role: configs.USER_ROLES.staff,
    },
    {
        path: configs.routes.service.create,
        component: CreateService,
        role: configs.USER_ROLES.admin,
    },
    {
        path: configs.routes.admin.service.modify,
        component: ModifyService,
        role: configs.USER_ROLES.admin,
    },
    {
        path: configs.routes.booking.list,
        component: MyBookings,
        role: configs.USER_ROLES.customer,
    },

    {
        path: configs.routes.staff.task,
        component: MyTasks,
        role: configs.USER_ROLES.staff,
    },
    {
        path: configs.routes.profile,
        component: Profile,
    },
];

export { publicRoutes, privateRoutes };
