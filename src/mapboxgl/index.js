/*
 * @Author: Joe Jiang 
 * @Date:   2017-09-14 14:05:45 
 * @Last Modified by: Joe Jiang (anxiao.jt@alibaba-inc.com)
 * @Last Modified time: 2017-09-14 16:06:21
 */

'use strict'
let map;

let getData = () => {
    return new Promise((resolve, reject) => {
        $.getJSON('/data/data.json', res => {
            resolve(res);
        });
    })
}

let generateGeoJSON = res => {
    let geojson = {
        "type": "FeatureCollection",
        "features": []
    };

    res.map((serieData, idx) => {
        let px = serieData[0] / 1000;
        let py = serieData[1] / 1000;
        let res = [[px, py]];

        for (let i = 2; i < serieData.length; i += 2) {
            let dx = serieData[i] / 1000;
            let dy = serieData[i + 1] / 1000;
            let x = px + dx;
            let y = py + dy;
            
            geojson.features.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [x, y]
                },
                "properties": {
                    "val": 1
                }
            })

            px = x;
            py = y;
        }
    });

    return geojson;
}

let renderGeoJSON = ({data, prop}) => {
    mapboxgl.accessToken = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";
    map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/dark-v9', //hosted style id
        center: [107.271, 33.285], // starting position
        zoom: 3 // starting zoom
    });
    map.setLayoutProperty('country-label-lg', 'text-field', '{name_zh}');

    return new Promise((resolve, reject) => {
        map.on('load', () => {
            resolve(data);
        });
    });

    
}

let animation = () => {
    setTimeout(() => {
        map.flyTo({
            center: [116.406, 39.912],
            zoom: 9,
            speed: 0.4,
            // curve: 1,
            // easing(t) {
            //     return t;
            // }
        });
    }, 2000);

    setTimeout(() => {
        map.flyTo({
            center: [120.1712, 30.275],
            zoom: 9,
            speed: 0.3,
            // curve: 1,
            // easing(t) {
            //     return t;
            // }
        });
    }, 12000);
}

let initMap = () => {
    getData().then(res => {
        let data = generateGeoJSON(res);
        return renderGeoJSON({ data, prop:{} })
    }, err => {
        alert(JSON.stringify(err))
    }).then(data => {
        map.addLayer({
            "id": "points",
            "type": "circle",
            "source": {
                "type": "geojson",
                data
            },
            "paint": {
                "circle-radius": 1,
                "circle-color": "#007cbf"
            }
        });

        return animation();
    }).catch(err => {
        alert(JSON.stringify(err));
    });
};

initMap();