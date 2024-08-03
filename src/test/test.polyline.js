import polyline from '@mapbox/polyline';

const decodePolyline = (str) => {
    return polyline.decode(str).map(([lat, lng]) => [lng, lat]);
};

console.log(decodePolyline('ov`aAk~wiSLz@iC\\sARY{AUD'));
