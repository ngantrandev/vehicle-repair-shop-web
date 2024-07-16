import { Routes, Route, Navigate } from 'react-router-dom';

import { publicRoutes } from './routes/index.js';
import configs from './configs/index.js';
import Page404 from './components/pages/Page404';

function App() {
    return (
        <div>
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={<Page />}
                        />
                    );
                })}
                <Route
                    path='/'
                    element={<Navigate to={configs.routes.home} />}
                />
                <Route path='*' element={<Page404 />} />
            </Routes>
        </div>
    );
}

export default App;
