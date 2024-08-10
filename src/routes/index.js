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
import ListTask from '../components/pages/staff/ListTask.jsx';
import StationDetail from '../components/pages/admin/Station/StationDetail.jsx';
import Stations from '../components/pages/admin/Station';
import CreateStation from '../components/pages/admin/Station/CreateStation.jsx';
import Profile from '../components/pages/Profile.jsx';

const publicRoutes = [
    { path: configs.routes.login, component: Login, layout: null },
    { path: configs.routes.register, component: Register, layout: null },
    { path: configs.routes.home, component: Home },
    {
        path: configs.routes.booking.list,
        component: MyBookings,
    },
    {
        path: configs.routes.booking.detail,
        component: BookingDetail,
    },
    {
        path: configs.routes.service.create,
        component: CreateService,
    },
    {
        path: configs.routes.admin.service.modify,
        component: ModifyService,
    },
    {
        path: configs.routes.service.detail,
        component: ServiceDetail,
    },
    {
        path: configs.routes.admin.dashboard.services,
        component: Service,
        layout: SidebarLayout,
    },
    {
        path: configs.routes.admin.dashboard.users,
        component: User,
        layout: SidebarLayout,
    },
    {
        path: configs.routes.admin.dashboard.bookings,
        component: BookingMagager,
        layout: SidebarLayout,
    },
    {
        path: configs.routes.admin.dashboard.stations,
        component: Stations,
        layout: SidebarLayout,
    },
    {
        path: configs.routes.admin.station.modify,
        component: StationDetail,
    },
    {
        path: configs.routes.admin.station.create,
        component: CreateStation,
    },

    {
        path: configs.routes.staff.task,
        component: ListTask,
    },
    {
        path: configs.routes.profile,
        component: Profile,
    },
];

export { publicRoutes };
