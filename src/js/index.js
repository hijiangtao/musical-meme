/*
 * @Author: Joe Jiang 
 * @Date:   2017-09-13 10:48:25 
 * @Last Modified by: Joe Jiang (anxiao.jt@alibaba-inc.com)
 * @Last Modified time: 2017-09-14 15:25:49
 */

'use strict'

// 中国微博签到数据 API http://gallerybox.echartsjs.com/asset/get/s/data-1491917776060-Sku0i8qpx.json
// 中国 107.271, 33.285
// 世界 -4.436, 25.196
// 北京 116.406, 39.912
// 杭州 [120.1712, 30.275]

let myChart = echarts.init(document.getElementById('main'));
let weiboData;
let config = {
    increase: true, // 决定是否随机偏移
    level: 1, // 用于控制地图绘制
    center: [
        [-4.436, 25.196],
        [107.271, 33.285],
        [116.406, 39.912]
    ]
}

// Echarts-gl 生成中国地图下的微博可视化数据
$.getJSON('/data/data.json', function (res) {

    weiboData = res.map(function (serieData, idx) {
        var px = serieData[0] / 1000;
        var py = serieData[1] / 1000;
        var res = [[px, py]];

        for (var i = 2; i < serieData.length; i += 2) {
            var dx = serieData[i] / 1000;
            var dy = serieData[i + 1] / 1000;
            var x = px + dx;
            var y = py + dy;
            res.push(
                [x.toFixed(2), y.toFixed(2), 1], 
                [x.toFixed(2) + Math.random(), y.toFixed(2) + Math.random(), 1],
                [x.toFixed(2) + Math.random(), y.toFixed(2) + Math.random(), 1],
                [x.toFixed(2) + Math.random(), y.toFixed(2) + Math.random(), 1],
                [x.toFixed(2) + Math.random(), y.toFixed(2) + Math.random(), 1],
            );

            px = x;
            py = y;
        }
        return res;
    });
    myChart.setOption({
        backgroundColor: '#2c343c',
        title : {
            text: '微博签到数据点亮中国',
            subtext: '',
            sublink: '',
            left: 'center',
            top: 'top',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {},
        legend: {
            left: 'left',
            data: ['强', '中', '弱'],
            textStyle: {
                color: '#ccc'
            }
        },
        geo: {
            map: 'world',
            roam: true,
            label: {
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#111'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: [{
            name: '弱',
            type: 'scatterGL',
            coordinateSystem: 'geo',
            symbolSize: .6,
            itemStyle: {
                shadowBlur: 2,
                shadowColor: 'rgba(37, 140, 249, 0.8)',
                color: 'rgba(37, 140, 249, 0.8)'
            },
            data: weiboData[0]
        }, {
            name: '中',
            type: 'scatterGL',
            coordinateSystem: 'geo',
            symbolSize: .6,
            itemStyle: {
                shadowBlur: 2,
                shadowColor: 'rgba(14, 241, 242, 0.8)',
                color: 'rgba(14, 241, 242, 0.8)'
            },
            data: weiboData[1]
        }, {
            name: '强',
            type: 'scatterGL',
            coordinateSystem: 'geo',
            symbolSize: .6,
            itemStyle: {
                shadowBlur: 2,
                shadowColor: 'rgba(255, 255, 255, 0.8)',
                color: 'rgba(255, 255, 255, 0.8)'
            },
            data: weiboData[2]
        }]
    });
});

$('#updateBtn').on('click', e => {
    let map = 'world',
        symbolSize = .6,
        center = config.center[config.level];
    // weiboData = weiboData.map(function (serieData, idx) {
    //     var res = [];
    //     let r1 = Math.random()*2,
    //         r2 = -Math.random()*2;

    //     if (config.increase) {
    //         r1 = -r1;
    //         r2 = -r2;
    //         symbolSize = 2;
    //     }

    //     for (var i = 0; i < serieData.length; i++) {
    //         var dx = Number.parseFloat(serieData[i][0]) + r1;
    //         var dy = Number.parseFloat(serieData[i][1]) + r2;

    //         res.push([dx.toFixed(2), dy.toFixed(2), 1]);
    //     }
    //     return res;
    // });

    switch(config.level) {
        case 0:
        map = 'world';
        symbolSize = .6;
        break;
        case 1:
        map = 'china';
        symbolSize = 1.2;
        break;
        default:
        map = 'beijing';
        symbolSize = 2;
        break;
    }
    config.increase = !config.increase;
    config.level = (config.level + 1) % 3;

    myChart.setOption({
        geo: {
            map,
            center
        },
        series: [{
            name: '弱',
            data: weiboData[0],
            symbolSize
        }, {
            name: '中',
            symbolSize,
            data: weiboData[1]
        }, {
            name: '强',
            symbolSize,
            data: weiboData[2]
        }]
    });
})