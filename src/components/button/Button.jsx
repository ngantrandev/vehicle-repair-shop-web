import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const Button = forwardRef(function Button(
    {
        to,
        href,
        rounded,
        outlined,
        textonly,
        circle,
        size = 40,
        onClick,
        disabled,
        children,
        className,
        ...otherProps
    },
    ref
) {
    let Component = 'button';
    const customClassName = ['flex items-center justify-center select-none'];

    const props = {
        onClick,
        ...otherProps,
    };

    if (to) {
        Component = Link;
        props.to = to;
    } else if (href) {
        Component = 'a';
        props.href = href;
    }

    if (rounded) {
        customClassName.push(
            'rounded-md bg-primary text-white hover:bg-primary-dark active:bg-primary p-2'
        );
    } else if (outlined) {
        customClassName.push(
            'border-2 border-primary text-primary hover:bg-primary hover:text-white active:bg-primary-dark p-2'
        );
    } else if (textonly) {
        customClassName.push('text-primary hover:underline');
    } else if (circle) {
        customClassName.push(
            `rounded-full w-[${size}px] h-[${size}px] border-2`
        );
    }

    if (disabled) {
        customClassName.push('pointer-events-none opacity-50');
    }

    if (className) {
        customClassName.push(className);
    }

    return (
        <Component ref={ref} className={customClassName.join(' ')} {...props}>
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
};

export default Button;
