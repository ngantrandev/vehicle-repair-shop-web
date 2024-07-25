import CreateService from '../components/pages/CreateService.jsx';
import Home from '../components/pages/Home.jsx';
import Login from '../components/pages/Login.jsx';
import ModifyService from '../components/pages/ModifyService.jsx';
import Register from '../components/pages/Register.jsx';
import Service from '../components/pages/Service';
import User from '../components/pages/User';
import configs from '../configs';

const publicRoutes = [
    { path: configs.routes.login, component: Login, layout: null },
    { path: configs.routes.register, component: Register, layout: null },
    { path: configs.routes.home, component: Home, layout: null },
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
    { path: configs.routes.admin.dashboard.services, component: Service },
    { path: configs.routes.admin.dashboard.users, component: User },
];

export { publicRoutes };
