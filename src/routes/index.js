import BookingMagager from '@/src/components/pages/admin/Booking';
import MyBookings from '@/src/components/pages/booking/MyBookings.jsx';
import CreateService from '@/src/components/pages/CreateService.jsx';
import Home from '@/src/components/pages/Home/Home.jsx';
import Login from '@/src/components/pages/Login.jsx';
import ModifyService from '@/src/components/pages/ModifyService.jsx';
import Register from '@/src/components/pages/Register.jsx';
import Service from '@/src/components/pages/admin/Service';
import ServiceDetail from '@/src/components/pages/ServiceDetail.jsx';
import User from '@/src/components/pages/admin/User';
import Staff from '@/src/components/pages/admin/Staff/Staff.jsx';
import configs from '@/src/configs';
import SidebarLayout from '@/src/layouts/sidebarLayout/SidebarLayout.jsx';
import BookingDetail from '@/src/components/pages/booking/BookingDetail.jsx';
import MyTasks from '@/src/components/pages/staff/MyTasks.jsx';
import StationDetail from '@/src/components/pages/admin/Station/StationDetail.jsx';
import Stations from '@/src/components/pages/admin/Station';
import CreateStation from '@/src/components/pages/admin/Station/CreateStation.jsx';
import Profile from '@/src/components/pages/Profile.jsx';
import Statistic from '@/src/components/pages/admin/Statistic.jsx';
import HomeLayout from '@/src/layouts/HomeLayout/HomeLayout';

const publicRoutes = [
    { path: configs.routes.login, component: Login, layout: null },
    { path: configs.routes.register, component: Register, layout: null },
    { path: configs.routes.home, component: Home, layout: HomeLayout },

    {
        path: configs.routes.service.detail,
        component: ServiceDetail,
        layout: HomeLayout,
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
        path: configs.routes.admin.dashboard.staffs,
        component: Staff,
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
        path: configs.routes.admin.statistics,
        component: Statistic,
        layout: SidebarLayout,
        role: configs.USER_ROLES.admin,
    },
    {
        path: configs.routes.admin.station.modify,
        component: StationDetail,
        role: configs.USER_ROLES.admin,
        layout: SidebarLayout,
    },
    {
        path: configs.routes.admin.station.create,
        component: CreateStation,
        role: configs.USER_ROLES.admin,
        layout: SidebarLayout,
    },
    {
        path: configs.routes.booking.detail,
        component: BookingDetail,
        role: configs.USER_ROLES.staff,
        layout: SidebarLayout,
    },
    {
        path: configs.routes.service.create,
        component: CreateService,
        role: configs.USER_ROLES.admin,
        layout: SidebarLayout,
    },
    {
        path: configs.routes.admin.service.modify,
        component: ModifyService,
        role: configs.USER_ROLES.admin,
        layout: SidebarLayout,
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
