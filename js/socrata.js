function peticionUnoApiGlobal() {

    var options = document.getElementsByName("optionsRadios");
    var url_servidor;
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            url_servidor = options[i].value;
        }
    }
    var textoBuscar = document.getElementById("text_filter_socrata").value; //encodeURI()
    var limiteResultados = document.getElementById("num_results_socrata").value;
    var peticion1 = url_servidor + "q=" + textoBuscar + "&limit=" + limiteResultados + "&only=map";
    // console.log(peticion1);

    enviarPeticion(peticion1).then(function (respuestaSocrata) {

        if (respuestaSocrata) {
            // console.info(respuestaSocrata);
            document.getElementById("results").innerHTML = "Resultados encontrados:<b>" + respuestaSocrata.resultSetSize + "</b>";
            //$('#mygrid').html('');

            var resultadosHTML;

            if (respuestaSocrata.resultSetSize >= 1) {
                resultadosHTML = "<ul>";
                for (var i = 0; i < respuestaSocrata.results.length; i++) {

                    resultadosHTML = resultadosHTML + '<li class="li"><b>' + respuestaSocrata.results[i].resource.name + ': <b>' +
                        '<a target="_blank" title="' + respuestaSocrata.results[i].resource.attribution + '" href="' + respuestaSocrata.results[i].link + '"> Link </a> ' +
                        '<a class="btn btn-success btn-xs btmapa"  onClick="buscaPintaDatos(this.id)" title="' + respuestaSocrata.results[i].resource.attribution + '" href="#" id="' + respuestaSocrata.results[i].resource.id + '#' + respuestaSocrata.results[i].metadata.domain + '">Ver mapa</a>';

                }
                resultadosHTML = resultadosHTML + "</ul>";
                document.getElementById("mygrid").innerHTML = resultadosHTML;


            } else {

                document.getElementById("results").innerHTML = "No hay resultados";
            }
        }
    });//fin peticion



} // fin funcion


async function peticionDosObtenerRecurso(data) {

    var params = data.split("#");
    var peticion2 = 'https://' + params[1] + '/api/views.json?method=getByResourceName&name=' + params[0];

  return await  enviarPeticion(peticion2).then(function (respuestaNodoSocrata) {
        var urlRecurso;
        var isGeojson;
        var bbox;
        console.info(respuestaNodoSocrata);

        if (respuestaNodoSocrata.metadata && respuestaNodoSocrata.metadata.geo) { //es geo

            urlRecurso = 'https://' + params[1] + '/api/geospatial/' + respuestaNodoSocrata.childViews[0] + '?method=export&format=GeoJSON';
            isGeojson = true;
            bbox = respuestaNodoSocrata.metadata.geo.bbox;
        } else { // es una tabla

            urlRecurso = 'https://' + params[1] + '/resource/' + params[0] + '.json?$limit=1000';
            isGeojson = false;
            bbox = null;

        }

       var respuesta = {url:urlRecurso,bbox: bbox,isGeojson: isGeojson};

        return respuesta;;

    });// fin peticion 2 

} //finfuncion


function peticionTresObtenerDato(urlRecurso, bbox, isGeojson) {

    enviarPeticion(urlRecurso).then(function (respuestaRecurso) {

        if (isGeojson) {

            pintarMapa(respuestaRecurso, bbox);

        } else {

            var geoJSON = {
                "type": "FeatureCollection",
                "features": []
            };



            for (var i = 0; i < respuestaRecurso.length; i++) {

                if (respuestaRecurso[i].location_1) {
                    geoJSON.features.push(
                        {
                            "type": "Feature",
                            "properties": respuestaRecurso[i].location_1,
                            "geometry": {
                                "type": "Point",
                                "coordinates": [
                                    respuestaRecurso[i].location_1.longitud,
                                    respuestaRecurso[i].location_1.latitude
                                ]
                            }
                        }
                    );


                } else if (respuestaRecurso[i].location) {
                    geoJSON.features.push(
                        {
                            "type": "Feature",
                            "properties": respuestaRecurso[i].location,
                            "geometry": {
                                "type": "Point",
                                "coordinates": [
                                    respuestaRecurso[i].location.longitude,
                                    respuestaRecurso[i].location.latitude
                                ]
                            }
                        }
                    );


                } else {
                    geoJSON.features.push(
                        {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "Point",
                                "coordinates": [
                                    0,
                                    0
                                ]
                            }
                        }
                    );
                }


            } //fin for


            var newBBOx = geoJSON.features[0].geometry.coordinates[0] + "," +
                geoJSON.features[0].geometry.coordinates[1] + "," +
                geoJSON.features[geoJSON.features.length - 1].geometry.coordinates[0] + "," +
                geoJSON.features[geoJSON.features.length - 1].geometry.coordinates[1];

            pintarMapa(geoJSON, newBBOx);

        } //fin else

    }) //fin peticion
}


function pintarMapa(geoJSON, bbox) {

    var tipoGeometria = geoJSON.features[0].geometry.type;

    if (!map.getSource("datossocrata_source")) {

        map.addSource("datossocrata_source", {
            type: "geojson",
            data: geoJSON
        });

    } else {

        map.getSource("datossocrata_source").setData(geoJSON);

        map.removeLayer("socrata");

    }

    if (tipoGeometria.indexOf("Line") != -1) { //es tipo linea

        map.addLayer({
            'id': 'socrata',
            'type': 'line',
            'source': 'datossocrata_source',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#ff0000',
                'line-width': 3
            }
        });


    } else if (tipoGeometria.indexOf("Polygon") != -1) { //es tipo linea

        map.addLayer({
            'id': 'socrata',
            'type': 'fill',
            'source': 'datossocrata_source',
            'paint': {
                'fill-color': '#ff0000',
                'fill-outline-color': '#ffffff',
                'fill-opacity': 0.5
            }
        });


    } else {
        map.addLayer({
            'id': 'socrata',
            'type': 'circle',
            'source': 'datossocrata_source',
            'paint': {
                'circle-color': '#ff0000',
                'circle-radius': 10
            }
        });

    }


    var bounds = bbox.split(",")

    map.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]]);



}



function buscaPintaDatos(data){

    peticionDosObtenerRecurso(data).then(function(respuesta){

        peticionTresObtenerDato(respuesta.url, respuesta.bbox, respuesta.isGeojson)


    })

}