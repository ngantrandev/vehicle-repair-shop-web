import PropTypes from 'prop-types';
import { createContext, useCallback, useState } from 'react';

export const BreadcrumbsContext = createContext();

function BreadcrumbsProvider({ children }) {
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    const setBreadcrumbsData = useCallback((breadcrumbs) => {
        setBreadcrumbs(breadcrumbs);
    }, []);

    const handleClickBreadcrumb = useCallback((index) => {
        setBreadcrumbs((prev) => prev.slice(0, index + 1));
    }, []);

    const addBreadcrumb = useCallback((breadcrumb) => {
        setBreadcrumbs((prev) => [...prev, breadcrumb]);
    }, []);

    return (
        <BreadcrumbsContext.Provider
            value={{
                breadcrumbs,
                setBreadcrumbsData,
                handleClickBreadcrumb,
                addBreadcrumb,
            }}
        >
            {children}
        </BreadcrumbsContext.Provider>
    );
}

BreadcrumbsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default BreadcrumbsProvider;
