import PropTypes from 'prop-types';

const DotIcon = ({ className }) => (
    <svg
        className={className}
        enableBackground='new 0 0 32 32'
        fill='currentColor'
        id='Glyph'
        version='1.1'
        viewBox='0 0 32 32'
        xmlSpace='preserve'
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
    >
        <path
            d='M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S17.654,13,16,13z'
            id='XMLID_287_'
        />
        <path
            d='M6,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S7.654,13,6,13z'
            id='XMLID_289_'
        />
        <path
            d='M26,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S27.654,13,26,13z'
            id='XMLID_291_'
        />
    </svg>
);

const FixingIcon = ({ className }) => (
    <svg
        className={className}
        enableBackground='new 0 0 32 32'
        fill='currentColor'
        id='Setting'
        version='1.1'
        viewBox='0 0 139 139'
        width='139px'
        xmlSpace='preserve'
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
    >
        <path d='M43.563,80.854c-2.479-0.827-5.128-1.281-7.887-1.281c-13.744,0-24.89,11.14-24.89,24.889c0,2.831,0.479,5.549,1.35,8.085  l16.865-16.865l15.915,15.915l-16.64,16.641c2.338,0.728,4.823,1.116,7.401,1.119c13.748,0,24.891-11.146,24.891-24.892  c0-3.388-0.677-6.615-1.905-9.56l36.773-36.758c2.478,0.827,5.128,1.281,7.886,1.281c13.744,0,24.891-11.142,24.891-24.89  c0-2.831-0.479-5.548-1.35-8.084l-16.865,16.865L94.082,27.403l16.641-16.64c-2.338-0.727-4.823-1.118-7.401-1.119  c-13.748,0-24.891,11.144-24.891,24.891c0,3.388,0.677,6.615,1.905,9.559L43.563,80.854z' />
    </svg>
);

const CanceledIcon = ({ className }) => (
    <svg
        className={className}
        enableBackground='new 0 0 32 32'
        fill='currentColor'
        height='20px'
        version='1.1'
        viewBox='0 0 20 20'
        width='20px'
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
    >
        <title />
        <desc />
        <defs />
        <g
            fill='currentColor'
            fillRule='evenodd'
            id='Page-1'
            stroke='none'
            strokeWidth='1'
        >
            <g
                fill='currentColor'
                id='Core'
                transform='translate(-380.000000, -44.000000)'
            >
                <g id='cancel' transform='translate(380.000000, 44.000000)'>
                    <path
                        d='M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 L10,0 Z M15,13.6 L13.6,15 L10,11.4 L6.4,15 L5,13.6 L8.6,10 L5,6.4 L6.4,5 L10,8.6 L13.6,5 L15,6.4 L11.4,10 L15,13.6 L15,13.6 Z'
                        id='Shape'
                    />
                </g>
            </g>
        </g>
    </svg>
);

const DoneIcon = ({ className }) => (
    <svg
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
        className={className}
        enableBackground='new 0 0 32 32'
        fill='currentColor'
    >
        <title />
        <path
            d='M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z'
            fill='currentColor'
        />
    </svg>
);

DotIcon.propTypes = {
    className: PropTypes.string,
};

FixingIcon.propTypes = {
    className: PropTypes.string,
};

CanceledIcon.propTypes = {
    className: PropTypes.string,
};

DoneIcon.propTypes = {
    className: PropTypes.string,
};

export { DotIcon, FixingIcon, CanceledIcon, DoneIcon };
