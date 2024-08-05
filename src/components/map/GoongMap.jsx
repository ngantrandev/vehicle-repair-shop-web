import {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import MapGL, {
    FullscreenControl,
    GeolocateControl,
    Layer,
    Marker,
    NavigationControl,
    Source,
} from '@goongmaps/goong-map-react';

import Pin from '../../assets/icon/PinIcon';
import goongMapService from '../../services/goongMapService';
import ultils from '../../ultils';
import configs from '../../configs';

const MAPTILE_KEY = import.meta.env.VITE_GOONG_MAP_TILE_KEY;
const DEFAULT_LATITUDE =
    Number(import.meta.env.VITE_DEFAULT_LATITUDE) || 10.822608284821372;
const DEFAULT_LONGITUDE =
    Number(import.meta.env.VITE_DEFAULT_LONGITUDE) || 106.62383478787928;

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
/**
 * startPoint and andPoint is an array of [longitude, latitude]
 * present the start and end point of the route
 *
 */
const GoongMap = forwardRef(function GoongMap(
    { className, originPoint = [], startPoint = [], endPoint = [], hidecenter },
    ref
) {
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

    const [routeData, setRouteData] = useState(null);

    useEffect(() => {
        const [longitude, latitude] = startPoint;

        if (!longitude || !latitude) return;

        setViewport((pre) => ({
            ...pre,
            latitude: latitude,
            longitude: longitude,
        }));
    }, [startPoint]);

    useEffect(() => {
        const fetchDirection = async () => {
            if (startPoint.length === 0 || endPoint.length === 0) return;

            const res = await goongMapService.getDirections(
                startPoint,
                endPoint
            );

            if (res.status !== configs.STATUS_CODE.OK) {
                return;
            }

            const resData = res.data;

            // Assuming res.routes[0].overview_polyline.points contains the encoded polyline
            if (resData.routes && resData.routes[0]) {
                const overviewPolyline =
                    resData.routes[0].overview_polyline.points;
                const coordinates = ultils.decodePolyline(overviewPolyline);
                const geojson = {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates,
                    },
                };
                setRouteData(geojson);
            }
        };

        fetchDirection();
    }, [startPoint, endPoint]);

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

                <FullscreenControl style={{ top: 150, left: 0, margin: 10 }} />

                {!hidecenter && (
                    <div id='marker-center'>
                        <Marker
                            longitude={viewport.longitude}
                            latitude={viewport.latitude}
                            offsetLeft={-20}
                            offsetTop={-20}
                        >
                            <Pin
                                active={isDragging}
                                className={'text-red-500'}
                            />
                        </Marker>
                    </div>
                )}

                {originPoint.length > 0 && (
                    <div id='marker-origin'>
                        <Marker
                            longitude={originPoint[0]}
                            latitude={originPoint[1]}
                        >
                            <Pin className={'h-16 w-16 text-blue-500'} />
                        </Marker>
                    </div>
                )}

                {startPoint.length > 0 && (
                    <div id='marker-start'>
                        <Marker
                            longitude={startPoint[0]}
                            latitude={startPoint[1]}
                        >
                            <span className='font-bold text-green-500'>
                                Trạm sửa chữa
                            </span>
                            <Pin className={'text-green-500'} />
                        </Marker>
                    </div>
                )}

                {endPoint.length > 0 && (
                    <div id='marker-end'>
                        <Marker longitude={endPoint[0]} latitude={endPoint[1]}>
                            <span className='font-bold text-red-500'>
                                Điểm đến
                            </span>
                            <Pin className={'text-red-500'} />
                        </Marker>
                    </div>
                )}

                {routeData && (
                    <Source id='route' type='geojson' data={routeData}>
                        <Layer
                            id='route-layer'
                            type='line'
                            paint={{
                                'line-color': '#18C07A',
                                'line-width': 6,
                            }}
                        />
                    </Source>
                )}

                <div style={navStyle}>
                    <NavigationControl />
                </div>
            </MapGL>
        </div>
    );
});

GoongMap.propTypes = {
    className: PropTypes.string,
    defaultViewCenter: PropTypes.array,
    startPoint: PropTypes.array,
    endPoint: PropTypes.array,
    originPoint: PropTypes.array,
    hidecenter: PropTypes.bool,
};

export default memo(GoongMap);
