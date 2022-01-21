import 'ol/ol.css';
import {Map, View} from 'ol';    
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import {
    defaults as defaultControls, Attribution, OverviewMap, 
    FullScreen, ScaleLine, ZoomSlider, ZoomToExtent
} from 'ol/control.js';
import MousePosition from 'ol/control/MousePosition.js';
import {createStringXY} from 'ol/coordinate.js';

const attribution = new Attribution({collapsible: true});
const overviewControl = new OverviewMap();

const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:3857',
    target: 'coordinateDivId',
    undefinedHTML: '&nbsp;'
});

const map = new Map({
    controls: defaultControls().extend([
        attribution, overviewControl, new FullScreen(), mousePositionControl,
        new ScaleLine({ units: 'metric' }), new ZoomSlider(), new ZoomToExtent()
    ]),
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        }),
    ],
    view: new View({
        center: [-12000000, 4100000],
        zoom: 1
    })
});
