

function Rad(d){
    return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
}


/**
 *
 * @param lng1 点1 经度
 * @param lat1 点1 纬度
 * @param lng2 点2 经度
 * @param lat2 点2 纬度
 * @returns {number} 单位（米）
 */
function getDistance(lng1, lat1, lng2, lat2){
    var radLat1 = Rad(lat1);
    var radLat2 = Rad(lat2);
    var a = radLat1 - radLat2;
    var  b = Rad(lng1) - Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
        Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378137 ;// EARTH_RADIUS;
    return s;
}


module.exports = {
    getDistance: getDistance  //导出
}
