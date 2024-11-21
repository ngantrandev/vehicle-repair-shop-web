import { memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ErrorImage from '@/src/assets/images/ErrorImage.jpg';

function Image({ src, alt, className, fallback }) {
    const [_src, setSrc] = useState(src);

    useEffect(() => {
        setSrc(src);
    }, [src]);

    const handleOnError = useCallback(() => {
        if (fallback) {
            setSrc(fallback);
        } else {
            setSrc(ErrorImage);
        }
    }, [fallback]);

    return (
        <img
            src={_src}
            alt={alt}
            className={className}
            onError={handleOnError}
        />
    );
}

Image.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
    fallback: PropTypes.node,
};

export default memo(Image);
