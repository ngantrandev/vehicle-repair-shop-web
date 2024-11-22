import { useContext } from 'react';

import { BreadcrumbsContext } from '@/src/context/BreadcrumbsProvider';

function useBreadcrumbs() {
    const context = useContext(BreadcrumbsContext);
    return context;
}

export default useBreadcrumbs;
