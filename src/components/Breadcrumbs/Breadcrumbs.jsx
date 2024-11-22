import { Link } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import PropTypes from 'prop-types';

import useBreadcrumbs from '@/src/hooks/useBreadcrumbs';

function Breadcrumbs({ className }) {
    const { breadcrumbs } = useBreadcrumbs();

    return (
        <div
            id='breadcrums'
            className={`flex items-center py-2 text-black ${className}`}
        >
            <MuiBreadcrumbs aria-label='breadcrumb'>
                {breadcrumbs.map(({ to, label, icon: Icon }, idx) => {
                    if (idx === breadcrumbs.length - 1) {
                        return (
                            <div key={idx} className='flex gap-1'>
                                {Icon && <Icon />}
                                <p className='font-bold text-primary'>
                                    {label}
                                </p>
                            </div>
                        );
                    }
                    return (
                        <Link key={idx} underline='hover' to={to}>
                            <div className='flex gap-1'>
                                {Icon && <Icon />}
                                <p className='text-black hover:underline'>
                                    {label}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </MuiBreadcrumbs>
        </div>
    );
}

Breadcrumbs.propTypes = {
    className: PropTypes.string,
};

export default Breadcrumbs;
