import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import MapGL, {
    GeolocateControl,
    Marker,
    NavigationControl,
} from '@goongmaps/goong-map-react';

import Pin from '../../assets/icon/PinIcon';

const MAPTILE_KEY = import.meta.env.VITE_GOONG_MAP_TILE_KEY;
const DEFAULT_LATITUDE = Number(import.meta.env.VITE_DEFAULT_LATITUDE);
const DEFAULT_LONGITUDE = Number(import.meta.env.VITE_DEFAULT_LONGITUDE);

const geolocateStyle = {
    top: 0,
    left: 0,
    margin: 10,
};

const navStyle = {
    position: 'absolute',
    top: 50,
    left: 0,
    margin: 10,
};
const positionOptions = { enableHighAccuracy: true };

const GoongMap = forwardRef(function GoongMap({ className }, ref) {
    const mapRef = useRef();

    const [isDragging, setIsDragging] = useState(false);

    const [viewport, setViewport] = useState({
        width: '100%',
        height: '100%',
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        zoom: 16,
        bearing: 0,
        pitch: 0,
    });

    const handleViewPortChange = useCallback((newViewport) => {
        setViewport(newViewport);
    }, []);

    const hanleOnMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleOnMouseDown = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleOnTouchMove = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleOnTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    useImperativeHandle(ref, () => ({
        center: {
            latitude: viewport.latitude,
            longitude: viewport.longitude,
        },
    }));

    return (
        <div className={className}>
            <MapGL
                ref={mapRef}
                {...viewport}
                width='100%'
                height='100%'
                mapStyle='https://tiles.goong.io/assets/goong_light_v2.json'
                onViewportChange={handleViewPortChange}
                goongApiAccessToken={MAPTILE_KEY}
                onTouchMove={handleOnTouchMove}
                onTouchEnd={handleOnTouchEnd}
                onMouseDown={handleOnMouseDown}
                onMouseUp={hanleOnMouseUp}
            >
                <GeolocateControl
                    style={geolocateStyle}
                    positionOptions={positionOptions}
                    trackUserLocation
                />
                <div>
                    <Marker
                        longitude={viewport.longitude}
                        latitude={viewport.latitude}
                    >
                        <Pin active={isDragging} />
                    </Marker>
                </div>

                <div style={navStyle}>
                    <NavigationControl />
                </div>
            </MapGL>
        </div>
    );
});

GoongMap.propTypes = {
    className: PropTypes.string,
};

export default GoongMap;
