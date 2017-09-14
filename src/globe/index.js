'use strict'

// import { mockData } from './js/mock';
let mockData = function({ num, bLat, bLng, eLat, eLng }) {
    let res = [];
    // for (let i = 0; i < num; i++) {
    //     res.push(Math.floor(Math.random()*359-180), Math.floor(Math.random()*179-90), 0.001 );
    //     console.log("Generate ", i, " Points");
    // }

    for (let i=-89; i<90; i++) {
        for (let j=-180; j<180; j++) {
            res.push(j, i, Math.random()*0.02, Math.random()*1 );
            // console.log("Generate ", i, j, " Points");
        }
    }

    return res;
};

if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
} else {
    var years = ['random1', 'random2', 'random3', 'random4'];
    var container = document.getElementById('container');
    var globe = new DAT.Globe(container);

    console.log(globe);
    var i,
        tweens = [];

    var settime = function (globe, t) {
        return function () {
            new TWEEN
                .Tween(globe)
                .to({
                    time: t / years.length
                }, 500)
                .easing(TWEEN.Easing.Cubic.EaseOut)
                .start();
            var y = document.getElementById('year' + years[t]);
            if (y.getAttribute('class') === 'year active') {
                return;
            }
            var yy = document.getElementsByClassName('year');
            for (i = 0; i < yy.length; i++) {
                yy[i].setAttribute('class', 'year');
            }
            y.setAttribute('class', 'year active');
        };
    };

    for (var i = 0; i < years.length; i++) {
        var y = document.getElementById('year' + years[i]);
        y.addEventListener('mouseover', settime(globe, i), false);
    }

    var xhr;
    TWEEN.start();

    // xhr = new XMLHttpRequest();
    // xhr.open('GET', '/globe/population909500.json', true);
    // xhr.onreadystatechange = function (e) {
    //     if (xhr.readyState === 4) {
    //         if (xhr.status === 200) {
                // var data = JSON.parse(xhr.responseText);
                // window.data = data;
                for (var i = 0; i < years.length; i++) {
                    globe.addData(mockData({
                        num: 1000,
                        bLat: -179,
                        bLng: -89,
                        eLat: 179,
                        eLng: 89
                    }), {
                        format: 'legend',
                        name: years[i],
                        animated: true
                    });
                }
                globe.createPoints();
                settime(globe, 0)();
                globe.animate();
                setTimeout(() => {
                    document.body.style.backgroundImage = 'none'; // remove loading
                }, 5000);
    //         }
    //     }
    // };
    // xhr.send(null);
}

// stats.js
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function animate() {
	stats.begin();
	stats.end();
	requestAnimationFrame( animate );
}

requestAnimationFrame( animate );
