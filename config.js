var config = {
    style: "mapbox://styles/mapbox/satellite-v9",
    accessToken: "pk.eyJ1IjoiZ2lzbWFzdGVybTIiLCJhIjoiY2plZHhubTQxMTNoYzMza3Rqa3kxYTdrOCJ9.53B1E6mKD_EQOVb2Y0-SsA",
    showMarkers: false,
    markerColor: "#3FB1CE",
    theme: "dark",
    use3dTerrain: true,
    title: "Volcanes",
    subtitle: "Los principales volcanes activos del mundo",
    byline: "M2B ",
    footer: "Source: Wikipedia",
    chapters: [{
            id: "volcan1",
            alignment: "left",
            hidden: false,
            title: "Eyjafjallajökull, Islandia",
            image: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Eyjafjallaj%C3%B6kull_first_crater_20100329.jpg",
            description: "También conocido como Eyjafjöll,2​ o Eyjafjalla,3​ es un volcán situado al norte de Skógar, en la región de Suðurland, al sur de Islandia.4​ Tiene entre 1651 m y 1666 m de altitud,​ y ha estado moderadamente activo en los últimos 8000 años.",
            location: {
                center: [-19.62, 63.63],
                zoom: 13.5,
                pitch: 60,
                bearing: 0,
            },
            mapAnimation: "flyTo",
            rotateAnimation: true,
            callback: "",
            onChapterEnter: [
                // {
                //     layer: 'layer-name',
                //     opacity: 1,
                //     duration: 5000
                // }
            ],
            onChapterExit: [
                // {
                //     layer: 'layer-name',
                //     opacity: 0
                // }
            ],
        },
        {
            id: "volcan2",
            alignment: "right",
            hidden: false,
            title: "Monte Vesubio, Italia",
            image: "https://upload.wikimedia.org/wikipedia/commons/2/24/Cr%C3%A1ter_del_Vesubio.jpg",
            description: "Es un volcán activo del tipo vesubiano situado frente a la bahía de Nápoles y a unos nueve kilómetros de distancia de la ciudad de Nápoles. Se encuentra en la ciudad metropolitana de Nápoles, perteneciente a la región italiana de la Campania. Tiene una altura máxima de 1281 m s. n. m. y se alza al sur de la cadena principal de los Apeninos.",
            location: {
                center: [14.42555555, 40.82138888],
                zoom: 14.5,
                pitch: 60,
                bearing: -43.2,
            },
            mapAnimation: "flyTo",
            rotateAnimation: true,
            callback: "",
            onChapterEnter: [],
            onChapterExit: [],
        },
        {
            id: "volcan3",
            alignment: "right",
            hidden: false,
            title: "Kīlauea",
            image: "",
            description: 'Kīlauea (en hawaiano: ˈkiːlɔuˈwɛjə) es un volcán en escudo, el más reciente y activo de los cinco que conforman la isla de Hawái. Es uno de los volcanes más activos de la Tierra <br><iframe width="415" height="315" src="https://www.youtube.com/embed/j08bYTBVWrg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
            location: {
                center: [-155.286762, 19.421097],
                zoom: 14,
                pitch: 60,
                bearing: -43.2,
            },
            mapAnimation: "flyTo",
            rotateAnimation: true,
            callback: "",
            onChapterEnter: [],
            onChapterExit: [],
        },
    ],
};