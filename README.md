# 개발직군 신입사원 공동교육 '22
<br/>

> OpenLayers 중심으로..

<br/>

## 들어가기전에
교육 내용을 소개하고, WebGIS 서비스 아키텍쳐를 이해한다.

- 교육 내용 등 소개
- WebGIS 서비스 아키텍쳐 

![Alt text](/img/img_archi.png "WebGIS 서비스 아키텍쳐")

<br/>

## OpenLayers 시작하기 (Node.js)
OpenLayers를 활용하여 Node.js 기반의 WebGIS 서비스 구현한다.

- Node.js (https://nodejs.org) 및 모듈 설치
- OpenLayers QuickStart.html 실습 (__Node.js vs. Apach httpd__)

<br/>
Node.js 설치 후, 확인한다.

    C:\Users\kacgung>node -v
    v11.6.0

<br/>
Node.js 설치 시, npm(Node Package Modules)이 같이 설치 된 것을 확인한다.

    C:\Users\kacgung>npm -v
    6.13.6

<br/>
Work(프로젝트) 작업 폴더를 생성한다.

    C:\Users\kacgung>cd C:\Day_3\ol
    C:\Day_3\ol>mkdir work && cd work
    C:\Day_3\ol\work>

<br/>
프로젝트를 초기화한다.

    C:\Day_3\ol\work>npm init -y

<br/>
필요한 모듈을 설치한다. `Openlayers, Parcel`

    C:\Day_3\ol\work>npm install ol

    C:\Day_3\ol\work>npm install -g parcel-bundler

<br/>

웹 페이지 `index.html` 을 작성한다. 
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Using Parcel with OpenLayers</title>
        <style>
            #map {      width: 100%;      height: 390px;     }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script src="./index_init.js"></script>
    </body>
</html>
```

<br/>

웹 GIS `index.js` 를 작성한다.

```javascript
import 'ol/ol.css';
import {Map, View} from 'ol';    
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        }),
    ],
    view: new View({
        center: [0, 0],
        zoom: 0
    })
});
```

<br/>

프로젝트 설정 `package.json` 을 수정한다.

```javascript
"scripts": {
 "test": "echo \"Error: no test specified\" && exit 1",
 "start": "parcel index.html",
 "build": "parcel build --public-url . index.html"
}
```

<br/>

프로젝트를 시작한다.

    C:\Day_3\ol\work>npm start
    Server running at http://localhost:1234 
    √  Built in 1.95s.

<br/>

## OpenLayers 기초
Map, Control, Interaction 등 OpenLayers를 활용 방법을 이해한다.

<br/>

## OpenLayers 웹 GIS 실습
공간 정보를 편집하는 WebGIS 기능 구현을 실습한다.

<br/>

## 공간 데이터 배포 (PostGIS + GeoServer)
편집 대상 공간 데이터를 등록하고 배포한다.

<br/>

## WebGIS 테스트 환경 구성
CORS(교차출처리소스공유) 가 가능하도록 WebGIS 테스트 환경을 구성한다.
