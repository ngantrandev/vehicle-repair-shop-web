import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const Button = forwardRef(function Button(
    {
        type,
        to,
        href,
        rounded,
        outlined,
        textonly,
        circle,
        size = 10,
        onClick,
        disabled,
        children,
        className,
        hidden,
        ...otherProps
    },
    ref
) {
    let Component = 'button';
    const customClassName = ['flex items-center justify-center select-none'];

    if (rounded) {
        customClassName.push(
            'rounded-md bg-primary text-white hover:bg-blue-800 active:bg-primary p-2'
        );
    } else if (outlined) {
        customClassName.push(
            'border-2 border-primary text-primary hover:bg-primary hover:text-white active:bg-primary-dark p-2'
        );
    } else if (textonly) {
        customClassName.push('text-primary hover:underline');
    } else if (circle) {
        customClassName.push(`rounded-full size-${size} border-2`);
    }

    if (disabled) {
        customClassName.push('pointer-events-none opacity-50');
    }

    if (className) {
        customClassName.push(className);
    }

    if (hidden) {
        customClassName.push('hidden');
    }

    const props = {
        ...otherProps,
    };

    if (to) {
        Component = Link;
        props.to = to;
    } else if (href) {
        Component = 'a';
        props.href = href;
    }

    if (!disabled) {
        props.onClick = onClick;
    }

    return (
        <Component
            ref={ref}
            type={type}
            className={customClassName.join(' ')}
            state={{
                from: window.location.pathname,
            }}
            {...props}
        >
            {children}
        </Component>
    );
});

Button.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    rounded: PropTypes.bool,
    outlined: PropTypes.bool,
    textonly: PropTypes.bool,
    circle: PropTypes.bool,
    size: PropTypes.number,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    hidden: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;
