import { Fragment } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { publicRoutes } from './routes/index.js';
import configs from './configs/index.js';
import Page404 from './components/pages/Page404.jsx';
import DefaultLayout from './layouts/defaultLayout';

function App() {
    return (
        <Routes>
            {publicRoutes.map((route, index) => {
                let Layout = DefaultLayout;
                if (route.layout) {
                    Layout = route.layout;
                } else if (route.layout === null) {
                    Layout = Fragment;
                }
                const Page = route.component;
                return (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <Layout>
                                <Page />
                            </Layout>
                        }
                    />
                );
            })}
            <Route path='/' element={<Navigate to={configs.routes.home} />} />
            <Route path='*' element={<Page404 />} />
        </Routes>
    );
}

export default App;
