import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ultils from '../ultils';

export const UserContext = createContext();

function UserProvider({ children }) {
    const [user, setUser] = useState({
        data: null,
        token: null,
        isLoggedin: false,
        role: null,
    });

    useEffect(() => {
        const loggedUser = ultils.getUserDataLogedin();
        const token = ultils.getAccessToken();
        const userRole = ultils.getUserRole(token);

        if (!loggedUser || !token) {
            setUser({ data: null, token: null, isLoggedin: false, role: null });
            return;
        }

        setUser({
            data: loggedUser,
            token,
            isLoggedin: true,
            role: userRole,
        });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default UserProvider;
