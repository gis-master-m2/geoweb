function getBounds() {
    const bounds = map.getBounds();
    var bbox = {
        minX: bounds.getWest(), //map.getBounds()._sw.ln
        minY: bounds.getSouth(), //map.getBounds()._sw.lat
        maxX: bounds.getEast(), //map.getBounds()._ne.lng
        maxY: bounds.getNorth(), //map.getBounds()._ne.lat
    };

    return bbox;
}

var datosH3Geojson; // variable global

async function getFeaturesFGB(urlDatos, minZoom) {

    if (!map.getSource("mallaH3")) {

        map.addSource("mallaH3", {
            type: "geojson",
            data: null,
        });
        map.addLayer({
            id: "hexagonos",
            type: "fill",
            source: "mallaH3",
            minZoom: minZoom,
            paint: {
                "fill-color": "#0000ff",
                "fill-outline-color": "#ffffff",
                "fill-opacity": 0.4, //trasparente
            },
        });


    }

    datosH3Geojson = { type: "FeatureCollection", features: [] };
    if (minZoom <= map.getZoom()) {

        var bbox = getBounds();

        var hexagonosH3GeoJson = flatgeobuf.deserialize(urlDatos, bbox);

        for await (let feature of hexagonosH3GeoJson) {

            datosH3Geojson.features.push(feature);
        }
        map.getSource("mallaH3").setData(datosH3Geojson);
    } else {
        map.getSource("mallaH3").setData(datosH3Geojson);
    }

    return datosH3Geojson;
}



async function creaBuffer(featurePunto, distancia, unidades) {

    if (!map.getSource("buffer")) {

        map.addSource("buffer", {
            type: "geojson",
            data: null,
        });
        map.addLayer({
            id: "buffer",
            type: "fill",
            source: "buffer",
            paint: {
                "fill-color": "#3bb2d0",
                "fill-outline-color": "#ffffff",
                "fill-opacity": 0.4, //trasparente
            },
        });

    }

    var bufferFeature = turf.buffer(featurePunto, distancia, {
        units: unidades
    });
    var bufferGeojson = turf.featureCollection([bufferFeature]);
    map.getSource("buffer").setData(bufferGeojson);

    return bufferFeature;

}

function borraBuffer() {

    if (map.getSource("buffer")) {
        map.getSource("buffer").setData({
            type: "FeatureCollection",
            features: []
        });
    }

}



async function calculaPoblacion(geometriaMapa) {

    var poblacion = 0;
    var areaGeometriaMapa = turf.area(geometriaMapa);
    for (var i = 0; i < datosH3Geojson.features.length; i++) {


        if (turf.booleanWithin(datosH3Geojson.features[i], geometriaMapa)) {
            poblacion = poblacion + datosH3Geojson.features[i].properties.population;

        } else if (turf.booleanIntersects(datosH3Geojson.features[i], geometriaMapa)) {
            var poblacionHexagono = datosH3Geojson.features[i].properties.population;
            var areaHexagono = turf.area(datosH3Geojson.features[i]);
            var geometriaIntersecion = turf.intersect(datosH3Geojson.features[i], geometriaMapa);
            var areaIntersecion = turf.area(geometriaIntersecion);

            /*
            console.info("poblacionHexagono",poblacionHexagono);
            console.info("areaHexagono",areaHexagono);
            console.info("geometriaIntersecion",geometriaIntersecion);
            console.info("areaIntersecion",areaIntersecion);
            console.info("calculo poblacion",parseInt(areaIntersecion * poblacionHexagono / areaHexagono));
            */
            poblacion = poblacion + parseInt(areaIntersecion * poblacionHexagono / areaHexagono);

        }

    }

    return { "poblacion": poblacion, "area": (areaGeometriaMapa / 1000000).toFixed(2) };

}


function gestionCalculoPoblacion(feature, minZoom) {

    if (minZoom <= map.getZoom()) {

        if (feature.geometry.type == "Polygon") {
            calculaPoblacion(feature).then(function(resultado) {
                document.getElementById('pop').innerHTML = "Población:<b>" + resultado.poblacion + "</b><br>Área:<b>" + resultado.area + "</b>Km<sup>2</sup>";
            });
        }

        if (feature.geometry.type == "Point") {
            creaBuffer(feature, 1000, 'meters').then(function(bufferFeature) {

                calculaPoblacion(bufferFeature).then(function(resultado) {

                    document.getElementById('pop').innerHTML = "Población:<b>" + resultado.poblacion + "</b><br>Área:<b>" + resultado.area + "</b>Km<sup>2</sup>";
                });

            });
        }

    } else {

        document.getElementById('pop').innerHTML = "Cálculo de población a partir de zoom <b>" + minZoom + "</b>";
    }

}


function addWMS() {


    map.addSource('wms-incencios', {
        'type': 'raster',
        'tiles': [
            'https://maps.wild-fire.eu/gwis?time=2023-02-05%2F2023-02-06&bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=512&height=512&layers=modis.hs'
        ],
        'tileSize': 512
    });
    map.addLayer({
            'id': 'wms',
            'type': 'raster',
            'source': 'wms-incencios',
            'paint': {}
        },

    );

}