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
        layout: null,
    },
    {
        path: configs.routes.service.modify,
        component: ModifyService,
        layout: null,
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
];

export { publicRoutes };
