import PropTypes from 'prop-types';

function Input({
    id,
    type,
    rounded,
    placeholder,
    value,
    onChange,
    className,
    multiline,
    ...otherProps
}) {
    /**'focus:outline-primary-supper-light w-full border-2 border-[#E5E5E5] bg-[#F2F2F2] p-2' */

    const customClassName = ['focus:outline-primary-light'];

    const props = {
        onChange,
        ...otherProps,
    };

    if (rounded) {
        customClassName.push('border-2 border-[#E5E5E5] bg-[#F2F2F2]');
    }

    customClassName.push(className);

    let Tag = 'input';
    if (multiline) {
        Tag = 'textarea';
    }

    return (
        <Tag
            id={id}
            type={type}
            placeholder={placeholder}
            className={customClassName.join(' ')}
            value={value}
            onChange={onChange}
            {...props}
        />
    );
}

Input.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    rounded: PropTypes.bool,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    multiline: PropTypes.bool,
};

export default Input;
