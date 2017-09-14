/*
 * @Author: Joe Jiang 
 * @Date:   2017-09-14 14:05:45 
 * @Last Modified by: Joe Jiang (anxiao.jt@alibaba-inc.com)
 * @Last Modified time: 2017-09-14 20:30:13
 */

'use strict'
let map;
let config = {
    initialRadius: 1,
    initialOpacity: 1,
    framesPerSecond: 15,
    maxRadius: 18,
    id: 0
};

/**
 * 获取数据
 */
let getData = () => {
    return new Promise((resolve, reject) => {
        $.getJSON('/data/data.json', res => {
            resolve(res);
        });
    })
}

/**
 * 生成 GeoJSON 对象
 * @param {*} res 
 */
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

/**
 * 渲染 GeoJSON 对象
 * @param {*} param0 
 */
let renderGeoJSON = ({data, prop}) => {
    mapboxgl.accessToken = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";
    map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/dark-v9', //hosted style id
        center: [107.271, 33.285], // starting position
        zoom: 3 // starting zoom
    });

    return new Promise((resolve, reject) => {
        map.on('load', () => {
            map.setLayoutProperty('country-label-lg', 'text-field', '{name_cn}');
            resolve(data);
        });
    });

    
}

/**
 * 生成随机点并带有闪光消逝效果
 */
let renderRandomDots = () => {
    let aniContainer;
    let opacity = config.initialOpacity;
    let radius = config.initialRadius;
    let pointID = `point${config.id}`;

    config.id++;

    // 性能隐患：每新增一个点都需要叠加一个新的 layer
    map.addSource(pointID, {
        "type": "geojson",
        "data": {
            "type": "Point",
            "coordinates": [
                360 * Math.random() - 180, 180 * Math.random() - 90
            ]
        }
    });

    map.addLayer({
        "id": pointID + '-1',
        "source": pointID,
        "type": "circle",
        "paint": {
            "circle-radius": config.initialRadius,
            "circle-radius-transition": {duration: 0},
            "circle-opacity-transition": {duration: 0},
            "circle-color": "#FFC900"
        }
    });

    map.addLayer({
        "id": pointID + '-2',
        "source": pointID,
        "type": "circle",
        "paint": {
            "circle-radius": config.initialRadius,
            "circle-color": "#007cbf"
        }
    });

    function animateMarker(timestamp) {
        setTimeout(function(){
            aniContainer = requestAnimationFrame(animateMarker);

            radius += (config.maxRadius - radius) / config.framesPerSecond;
            opacity -= ( .9 / config.framesPerSecond );

            if (opacity <= 0) {
                window.cancelAnimationFrame(aniContainer);
                map.removeLayer(pointID + '-1');
            } else {
                map.setPaintProperty(pointID + '-1', 'circle-radius', radius);
                map.setPaintProperty(pointID + '-1', 'circle-opacity', opacity);
            }

        }, 1000 / config.framesPerSecond);
        
    }

    // Start the animation.
    animateMarker(0);
}

/**
 * mapbox 延时动画
 */
let animation = () => {
    setTimeout(() => {
        map.flyTo({
            center: [116.406, 39.912],
            zoom: 9,
            speed: 0.4
        });
    }, 2000);

    setTimeout(() => {
        map.flyTo({
            center: [120.1712, 30.275],
            zoom: 9,
            speed: 0.3
        });
    }, 10000);

    setTimeout(() => {
        map.flyTo({
            center: [107.271, 33.285],
            zoom: 3,
            speed: 0.4
        });
    }, 18000);

    setTimeout(() => {
        // function tmp(t) {
        //     requestAnimationFrame(tmp);
        //     renderRandomDots();
        // }
        
        // tmp(0);
        
        setInterval(() => {
            renderRandomDots();
        }, 300);
    }, 23000);
}

/**
 * 初始化操作
 */
let initMap = () => {
    getData().then(res => {
        let data = generateGeoJSON(res);
        return renderGeoJSON({ data, prop:{} })
    }, err => {
        console.log(JSON.stringify(err))
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
    }, err => {
        console.log(JSON.stringify(err));
    }).catch(err => {
        console.log(JSON.stringify(err));
    });
};

initMap();
