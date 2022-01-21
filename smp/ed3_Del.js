// OprenLayers 기본 스타일
import 'ol/ol.css';

// jQuery
import $ from "jquery";

import { Map, View, Collection } from 'ol';
import { Attribution, Zoom } from 'ol/control';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { XYZ, Vector, TileWMS } from 'ol/source';
import { DragPan, MouseWheelZoom, Select } from 'ol/interaction';
import { Style, Stroke, Fill, Circle } from 'ol/style';
import { GeoJSON, GML, WFS } from 'ol/format';
import { bbox as bboxStrategy } from 'ol/loadingstrategy.js';
import { singleClick } from 'ol/events/condition.js';

// Map Object
const map = new Map({
  target: 'map',
  view: new View({
    center: [14139375.266574217, 4507391.386530381],
    zoom: 14,
    minZoom: 1,
    maxZoom: 18
  }),
  controls: [new Zoom()],
  interactions: [
    new DragPan(),
    new MouseWheelZoom()
  ],
  layers: [
    new TileLayer({
      source: new XYZ({
        attributions: new Attribution({
          html: 'Data by <a href="http://map.vworld.kr">VWORLD</a>"'
        }),
        url: 'http://xdworld.vworld.kr:8080/2d/Base/201512/{z}/{x}/{y}.png'
      })
    })
  ]
});

// Draw Feature Vector Layer
let features = new Collection();
let featureOverlay = new VectorLayer({
  source: new Vector({ features: features }),
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.5)'
    }),
    stroke: new Stroke({
      color: 'rgba(55, 155, 55, 0.8)',
      width: 5
    }),
    image: new Circle({
      radius: 10,
      fill: new Fill({
        color: '#ffcc33'
      })
    })
  })
});
map.addLayer(featureOverlay);

// Building WMS Layer
let buildingWMSSource = new TileWMS({
  url: '/geoserver/ows',
  params: {
    VERSION: '1.3.0',
    LAYERS: 'building',
    WIDTH: 256,
    HEIGHT: 256,
    CRS: 'EPSG:3857',
    TILED: true
  }
});
let buildingWMSLayer = new TileLayer({
  source: buildingWMSSource,
  opacity: .5
});
map.addLayer(buildingWMSLayer);

// Building Vector
let buildingVectorSource = new Vector({
  format: new GeoJSON(),
  url: extent => {
    return '/geoserver/ows?' +
      'service=WFS' +
      '&version=1.1.0' +
      '&request=GetFeature' +
      '&typeName=building' +
      '&srsName=EPSG:3857' +
      '&outputFormat=application/json' +
      '&bbox=' + extent.join(',') + ',EPSG:3857';
  },
  strategy: bboxStrategy
})
let buildingVectorLayer = new VectorLayer({
  source: buildingVectorSource,
  visible: false
});
map.addLayer(buildingVectorLayer);

// Select Interaction 추가
let select = new Select({
  wrapX: false,
  type: 'MultiPolygon',
  condition: singleClick
});
map.addInteraction(select);

// Resoultion Changed Event
map.getView().on('change:resolution', e => {
  if (map.getView().getZoom() > 15) {
    buildingVectorLayer.setVisible(true);
  } else {
    buildingVectorLayer.setVisible(false);
  }
});

// transaction WFS-T 문서 생성
const formatWFS = new WFS();
const formatGML = new GML({
  featureNS: 'http://osgeo.kr/korea',
  featureType: 'building',
  srsName: 'EPSG:3857'
});

const transactWFS = (tType, features) => {
  let node = "";
  switch (tType) {
    case 'insert':
      node = formatWFS.writeTransaction(features, null, null, formatGML);
      break;
    case 'update':
      node = formatWFS.writeTransaction(null, features, null, formatGML);
      break;
    case 'delete':
      node = formatWFS.writeTransaction(null, null, features, formatGML);
      break;
  }

  const dataStr = new XMLSerializer().serializeToString(node);
  console.log(dataStr);
  $.ajax({
    type: 'POST',
    service: 'WFS',
    url: '/geoserver/ows',
    dataType: 'xml',
    contentType: 'text/xml',
    processData: false,
    data: dataStr
  }).done(() => {
    reset()
  });
};

const reset = () => {
  features.clear();
  buildingVectorSource.refresh();
  buildingWMSSource.updateParams({ '_t': Date.now() });
};

$('button[name=btnReset]').on('click', reset);

$('button[name=btnDelete]').on('click', e => {
  if (select.getFeatures().getArray().length > 0) {
    transactWFS('delete', select.getFeatures().getArray());
    select.getFeatures().clear();
  }
});
