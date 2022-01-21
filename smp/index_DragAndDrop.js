import 'ol/ol.css';
import {Map, View} from 'ol';    
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import GeoJSON from 'ol/format/GeoJSON';

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        }),
    ],
    view: new View({
        center: [14135193.892664503, 4512192.435216382], 
        zoom: 11
    })
});

const source = new VectorSource();
const layer = new VectorLayer({
    source: source
});
map.addLayer(layer);

map.addInteraction(new DragAndDrop({
    source: source,
    formatConstructors: [GeoJSON]
}));
