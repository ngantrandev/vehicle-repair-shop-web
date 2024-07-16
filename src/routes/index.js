import Home from '../components/pages/Home';
import Login from '../components/pages/Login';
import Register from '../components/pages/Register';
import configs from '../configs';

const publicRoutes = [
    { path: configs.routes.login, component: Login },
    { path: configs.routes.register, component: Register },
    { path: configs.routes.home, component: Home },
];

export { publicRoutes };
