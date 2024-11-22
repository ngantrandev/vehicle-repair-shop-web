import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '@/src/App.jsx';
import '@/src/index.css';
import UserProvider from '@/src/context/UserProvider.jsx';
import BreadcrumbsProvider from '@/src/context/BreadcrumbsProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BreadcrumbsProvider>
            <UserProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </UserProvider>
        </BreadcrumbsProvider>
    </React.StrictMode>
);
