
let mockData = function({ num, bLat, bLng, eLat, eLng }) {
    let res = [];
    for (let i = 0; i < num; i++) {
        res.push(Math.random()*359-180 , Math.random()*179-90, Math.random()*10+0.5 );
    }

    return res;
};

export {
    mockData
}
