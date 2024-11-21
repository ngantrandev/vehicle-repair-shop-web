import PropTypes from 'prop-types';

import useUser from '@/src/hooks/useUser';
import Page404 from '@/src/components/pages/Page404';
import configs from '@/src/configs';
import DefaultLayout from '@/src/layouts/defaultLayout';

function ProtectedRoute({ children, requiredRole }) {
    const { user } = useUser();

    if (!user?.isLoggedin) {
        return (
            <DefaultLayout>
                <Page404 content='Không thể truy cập trang này do chưa đăng nhập😘😍' />
            </DefaultLayout>
        );
    }

    if (
        requiredRole &&
        user.role !== requiredRole &&
        user.role !== configs.USER_ROLES.admin
    ) {
        return (
            <DefaultLayout>
                <Page404 content='Bạn không có quyền truy cập trang này' />
            </DefaultLayout>
        );
    }

    if (!requiredRole && user.role === configs.USER_ROLES.staff) {
        return (
            <DefaultLayout>
                <Page404 content='Bạn không có quyền truy cập trang này' />
            </DefaultLayout>
        );
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node,
    requiredRole: PropTypes.oneOf([
        configs.USER_ROLES.admin,
        configs.USER_ROLES.staff,
        configs.USER_ROLES.customer,
    ]),
};

export default ProtectedRoute;
