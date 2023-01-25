function terremotosGeonamesToGeoJSON(respuestaGeonames){

    var geoJSON ={
        "type": "FeatureCollection",
        "features": []
    };

    for (var i =0; i < respuestaGeonames.earthquakes.length; i++){

        //console.info("item",respuestaGeonames.earthquakes[i]);
        geoJSON.features.push(
            {
                "type": "Feature",
                "properties": {"magnitude":respuestaGeonames.earthquakes[i].magnitude,
                                "datetime":respuestaGeonames.earthquakes[i].datetime
                            },
                "geometry": {
                  "type": "Point",
                  "coordinates": [
                    respuestaGeonames.earthquakes[i].lng,
                    respuestaGeonames.earthquakes[i].lat
                  ]
                }
              }
        );

    } //fin loop

    return geoJSON;

    } //fin funcion


    function generarPeticionTerremotos() {


     var mag =document.getElementById('mag').value;

        var peticion = 'https://secure.geonames.org/earthquakesJSON?' +
            'north=' + map.getBounds()._ne.lat + '&' +
            'south=' + map.getBounds()._sw.lat + '&' +
            'east=' + map.getBounds()._ne.lng + '&' +
            'west=' + map.getBounds()._sw.lng + '&' +
            'maxRows=50&' +
            'minMagnitude='+mag+'&' +
            'username=gismasterm2';
            //date : 'yyyy-MM-d
    
        enviarPeticion(peticion).then(function (respuestaGeonames) {
    
//console.info("respuesta",respuestaGeonames);

            var geoJSON = terremotosGeonamesToGeoJSON(respuestaGeonames);

           // console.info("geojson",geoJSON);
    
            if (!map.getSource("terremotos_source")) {
    
        map.addSource("terremotos_source", {
                    type: "geojson",
                    data: geoJSON
                });
    
                map.addLayer({
                    'id': 'terremotos',
                    'type': 'circle',
                    'source': 'terremotos_source',
                    'paint': {
                        'circle-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'magnitude'],
                            3, '#ebe709',
                            5, '#eb1809',
                            7, '#ef4bf2',
                            8,'#f78205',
                           
                        ],
                        'circle-opacity': 0.75,
                        'circle-radius': [
                            'interpolate',
                            ['linear'], ['get', 'magnitude'],
                            3, 8,
                            5, 16,
                            8, 32
                        ]
                    }
                });
    
                map.addLayer({
                    'id': 'terremotos-textos',
                    'type': 'symbol',
                    'source': 'terremotos_source',
                    'layout': {
                        'text-field': [                            
                            'format', ['get', 'magnitude'],                               
                        ],
                        'text-size': 10
                    },
                    'paint': {
                        'text-color': 'rgba(255,255,255,1)'
                    }
                });
    
    
            } else {
    
                map.getSource("terremotos_source").setData(geoJSON);
    
            }
    
        });
    
    } // fin funcion
    

    function addPlacas(){

        var url = 'datos/placas.geojson';
        map.addSource('placas', { type: 'geojson', data: url });
    
        map.addLayer({
            'id': 'placas',
            'type': 'line',
            'source': 'placas',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#ff0000',
                'line-width': 3,
                'line-dasharray':[6.2,6.2]
            }
        });

    }