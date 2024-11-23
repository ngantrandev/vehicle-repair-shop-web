import PropTypes from 'prop-types';
import { memo, useEffect, useMemo, useState } from 'react';

import OpenEye from '@/src/assets/icon/OpenEye';
import CloseEye from '@/src/assets/icon/CloseEye';

const INPUT_TYPES = {
    TEXT: 'text',
    PASSWORD: 'password',
    EMAIL: 'email',
    NUMBER: 'number',
};

function Input({
    id,
    type,
    rounded,
    placeholder,
    value,
    onChange,
    className,
    multiline,
    password,
    disabled,
    ...otherProps
}) {
    const isPasswordField = useMemo(
        () => type === INPUT_TYPES.PASSWORD,
        [type]
    );

    const customClassName = [
        'focus:outline-primary-light bg-white border-2 border-neutral-400 p-2 rounded-lg w-full',
    ];
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [inputType, setInputType] = useState(
        password ? INPUT_TYPES.PASSWORD : type
    );

    useEffect(() => {
        setIsShowPassword(inputType === INPUT_TYPES.TEXT ? true : false);
    }, [inputType]);

    const toggleInputType = () => {
        if (inputType === INPUT_TYPES.PASSWORD) {
            setInputType(INPUT_TYPES.TEXT);
        } else {
            setInputType(INPUT_TYPES.PASSWORD);
        }
    };

    const props = {
        onChange,
        ...otherProps,
    };

    if (rounded) {
        customClassName.push('border-2 border-[#E5E5E5] bg-[#F2F2F2]');
    }

    customClassName.push(className);

    if (disabled) {
        customClassName.push(
            'cursor-not-allowed border-neutral-200 pointer-events-none'
        );
    }

    let Tag = 'input';
    if (multiline) {
        Tag = 'textarea';
    }

    return (
        <div className='relative'>
            <Tag
                id={id}
                type={inputType}
                placeholder={placeholder}
                className={customClassName.join(' ')}
                value={value}
                onChange={onChange}
                {...props}
            />

            {isPasswordField && (
                <div
                    className='absolute right-0 top-1/2 -translate-x-2 -translate-y-1/2 p-2 hover:cursor-pointer'
                    onClick={toggleInputType}
                >
                    {isShowPassword ? (
                        <OpenEye className='h-4' />
                    ) : (
                        <CloseEye className='h-4' />
                    )}
                </div>
            )}
        </div>
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
    password: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default memo(Input);
