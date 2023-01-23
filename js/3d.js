function add3D(terreno) {

    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
    });


    map.addSource('icgc-dem', {
        'type': 'raster-dem',
        "tiles": [
            "https://tilemaps.icgc.cat/tileserver/tileserver.php/terreny_icgc_2m_rgb/{z}/{x}/{y}.png"
        ],
        'tileSize': 512,
        'maxzoom': 14
    });



    map.setFog({});

    /*
        map.setTerrain({
            'source': 'mapbox-dem',
            'exaggeration': 1.5
        });
    */

    //edificios de los estilos Mapbox


    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 13,
        'layout': {
            'visibility': 'none',
        },
        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-opacity': 0.9
        }
    });



    changeTerrain(terreno);

} //fin funcion



function changeTerrain(terreno) {

    if (terreno == "mapbox-dem" || terreno == "icgc-dem") {

        console.info("changeTerrain", terreno);
        map.setTerrain({
            'source': terreno,
            'exaggeration': 1.5
        });
    } else if (terreno == "none") {
        map.setTerrain(null);
    } else {
        map.setTerrain({
            'source': "mapbox-dem",
            'exaggeration': 1.5
        });
    }

} //fin funcion




function activarEdificios(estado) {


    if (estado) {

        map.setLayoutProperty('edificios', 'visibility', 'visible');

    } else {
        map.setLayoutProperty('edificios', 'visibility', 'none');
    }



}