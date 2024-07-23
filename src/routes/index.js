import CreateService from '../components/pages/CreateService.jsx';
import Home from '../components/pages/Home.jsx';
import Login from '../components/pages/Login.jsx';
import Register from '../components/pages/Register.jsx';
import configs from '../configs';

const publicRoutes = [
    { path: configs.routes.login, component: Login },
    { path: configs.routes.register, component: Register },
    { path: configs.routes.home, component: Home },
    { path: configs.routes.createService, component: CreateService },
];

export { publicRoutes };
