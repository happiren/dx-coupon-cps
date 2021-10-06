const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


function padding(num, length) {
    for (var len = (num + "").length; len < length; len = num.length) {
        num = "0" + num;
    }
    return num;
}

/**
 * 格式化为 2020-09-01 16:00 格式的时间
 */
function formatFullDateTime(date) {
    if (!date){
        return "";
    }
    if (typeof (date) == 'string') {
        date = new Date(new Date(date+".000Z").getTime()-(8*3600*1000)); //转换为东八区时间
    }
    if (!date.getFullYear()) {
        return "";
    }
    var text = date.getFullYear() + "-" + padding(date.getMonth() + 1, 2) + "-" + padding(date.getDate(), 2) + " " + padding(date.getHours(), 2) + ":" + padding(date.getMinutes(), 2);

    return text;
}

/**
 * 判断是否为空
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}

/**
 * 格式化日期，如2019-08-06等格式字符串
 * date, 日期对象或者日期格式字符串
 */
function formatDate(date) {
    var now = new Date()
    if (typeof (date) == 'string') {
        date = new Date(new Date(date+".000Z").getTime()-(8*3600*1000)); //转换为东八区时间
    }
    if (!date || !date.getYear()) {
        return "";
    }
    var text = date.getFullYear() + "-" + padding(date.getMonth() + 1, 2) + "-" + padding(date.getDate(), 2);
    return text;
}

/**
 * 格式化日期，如08-06等格式字符串
 * date, 日期对象或者日期格式字符串
 */
function formatMonthDate(date) {
    var now = new Date()
    if (typeof (date) == 'string') {
        date = new Date(new Date(date+".000Z").getTime()-(8*3600*1000)); //转换为东八区时间
    }
    if (!date || !date.getYear()) {
        return "";
    }
    var text = padding(date.getMonth() + 1, 2) + "-" + padding(date.getDate(), 2);
    return text;
}

/**
 * 格式化日期，返回 刚刚，几分钟前，昨天 14:32，7-14 14:30,  2019-08-06等格式字符串
 * date, 日期对象或者日期格式字符串
 */
function formatDateTime(date) {
    var now = new Date()
    if (typeof (date) == 'string') {
        date = new Date(new Date(date+".000Z").getTime()-(8*3600*1000)); //转换为东八区时间
    }
    if (!date || !date.getYear()) {
        return "";
    }
    var nowTimestamp = new Date().getTime();
    var when = date.getTime();
    var time = (nowTimestamp - when) / 1000;
    var text = "";

    if (time < 60 * 5) {
        text = '刚刚'
    } else if (time < 60 * 60) {
        text = parseInt(time / 60) + "分前"
    } else if (time < 60 * 60 * 24) {
        if (date.getDate() != now.getDate()) { //不同天
            text = "昨天 " + padding(date.getHours(), 2) + ":" + padding(date.getMinutes(), 2);
        } else {
            text = padding(date.getHours(), 2) + ":" + padding(date.getMinutes(), 2);
        }
    } else if (time < 60 * 60 * 24 * 2) {
        text = "昨天 " + padding(date.getHours(), 2) + ":" + padding(date.getMinutes(), 2);
    } else if (time < 60 * 60 * 24 * 365) {
        if (date.getFullYear() != now.getFullYear()) { //不同年分，直接加年份
            text = date.getFullYear() + "-" + padding(date.getMonth() + 1, 2) + "-" + padding(date.getDate(), 2);
        } else {
            text = padding(date.getMonth() + 1, 2) + "-" + padding(date.getDate(), 2) + " " + padding(date.getHours(), 2) + ":" + padding(date.getMinutes(), 2);
        }
    } else {
        text = date.getFullYear() + "-" + padding(date.getMonth() + 1, 2) + "-" + padding(date.getDate(), 2);
    }
    return text;
}

const formatNumber = n => {
    if (n == undefined || n == "null") {
        return "0";
    }
    if (n < 0) {
        return "0";
    }
    if (n < 1000) {
        return n.toString()
    } else if (n < 1000000) {
        var num = n / 1000;
        num = parseFloat(num.toFixed(1));
        return num + "K";
    } else if (n < 1000000000) {
        var num = n / 1000000;
        num = parseFloat(num.toFixed(1));
        return num + "M";
    } else { //以下方法一般不会用到
        var num = n / 1000000000;
        num = parseFloat(num.toFixed(1));
        return num + "MM";
    }
}

function toast(title, duration = 2000, mask = false, icon = 'none') {
    if (Boolean(title) === false) {
        return;
    }
    uni.showToast({
        title,
        duration,
        mask,
        icon
    });
}

function navigateBack() {

    uni.navigateBack({});
}

function navigateTo(url) {
    uni.navigateTo({
        url: url
    });
}

function redirectTo(url) {
    uni.redirectTo({
        url: url
    });
}

function switchTab(url) {
    uni.switchTab({
        url: url
    });
}

function showLoading(title, icon="loading") {
    uni.showLoading({
        title: title,
        icon:icon,
    });
}

function hideLoading() {
    uni.hideLoading();
}

// function goLoginPage(login) {
//     if (login) {
//         login = 1;
//     } else {
//         login = 0;
//     }
//     uni.switchTab({
//         url: "/pages/user/mine/mine?login=" + login
//     })
// }

function checkPhone(phone) {
    if (!phone) {
        return false;
    }
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
        return false;
    } else {
        return true;
    }
}

/**
 * 删除字符串首尾指定字符
 * @param Str 源字符
 * @param char 去除的指定字符
 * @param type 类型，右边或左边，为空是替换首尾
 * @returns {*}
 */
var trimChar = function (Str, char, type) {
    if (char) {
        if (type == 'left') {
            return Str.replace(new RegExp('^\\' + char + '+', 'g'), '');
        } else if (type == 'right') {
            return this.replace(new RegExp('\\' + char + '+$', 'g'), '');
        }
        return Str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
    }
    return Str.replace(/^\s+|\s+$/g, '');
};


function saveUrlImageFile(imageUrl) {
    uni.downloadFile({
        url: imageUrl, //仅为示例，并非真实的资源
        success: (res) => {
            if (res.statusCode === 200) {
                let filePath = res.tempFilePath;
                uni.saveImageToPhotosAlbum({
                    filePath: filePath,
                    success: function () {
                        console.log('save success');
                        uni.showToast({
                            title: '图片保存成功',
                            icon: 'none',
                            duration: 2200
                        });
                    },
                    fail: function (r) {
                        log.error("saveImageToPhotosAlbum fail");
                        log.debug(r);
                        uni.showToast({
                            title: '保存图片到相册失败',
                            icon: 'none',
                            duration: 2200
                        });
                    }
                });
            }
        },
        fail: (res) => {
            log.error("fail", res);
            uni.showToast({
                title: '下载图片失败',
                icon: 'none',
                duration: 2200
            });
        }
    });
}

/**
 * 对象转url参数
 * @param {*} data,对象
 * @param {*} isPrefix,是否自动加上"?"
 */
function queryParams(data = {}, isPrefix = true, arrayFormat = 'brackets') {
    let prefix = isPrefix ? '?' : ''
    let _result = []
    if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) arrayFormat = 'brackets';
    for (let key in data) {
        let value = data[key]
        // 去掉为空的参数
        if (['', undefined, null].indexOf(value) >= 0) {
            continue;
        }
        // 如果值为数组，另行处理
        if (value.constructor === Array) {
            // e.g. {ids: [1, 2, 3]}
            switch (arrayFormat) {
                case 'indices':
                    // 结果: ids[0]=1&ids[1]=2&ids[2]=3
                    for (let i = 0; i < value.length; i++) {
                        _result.push(key + '[' + i + ']=' + value[i])
                    }
                    break;
                case 'brackets':
                    // 结果: ids[]=1&ids[]=2&ids[]=3
                    value.forEach(_value => {
                        _result.push(key + '[]=' + _value)
                    })
                    break;
                case 'repeat':
                    // 结果: ids=1&ids=2&ids=3
                    value.forEach(_value => {
                        _result.push(key + '=' + _value)
                    })
                    break;
                case 'comma':
                    // 结果: ids=1,2,3
                    let commaStr = "";
                    value.forEach(_value => {
                        commaStr += (commaStr ? "," : "") + _value;
                    })
                    _result.push(key + '=' + commaStr)
                    break;
                default:
                    value.forEach(_value => {
                        _result.push(key + '[]=' + _value)
                    })
            }
        } else {
            _result.push(key + '=' + value)
        }
    }
    return _result.length ? prefix + _result.join('&') : ''
}


// padStart 的 polyfill，因为某些机型或情况，还无法支持es7的padStart，比如电脑版的微信小程序
// 所以这里做一个兼容polyfill的兼容处理
if (!String.prototype.padStart) {
    // 为了方便表示这里 fillString 用了ES6 的默认参数，不影响理解
    String.prototype.padStart = function (maxLength, fillString = ' ') {
        if (Object.prototype.toString.call(fillString) !== "[object String]") throw new TypeError(
            'fillString must be String')
        let str = this
        // 返回 String(str) 这里是为了使返回的值是字符串字面量，在控制台中更符合直觉
        if (str.length >= maxLength) return String(str)

        let fillLength = maxLength - str.length,
            times = Math.ceil(fillLength / fillString.length)
        while (times >>= 1) {
            fillString += fillString
            if (times === 1) {
                fillString += fillString
            }
        }
        return fillString.slice(0, fillLength) + str;
    }
}


/**
 * 获取时间戳，单位为毫秒
 * @param dateTime， 字符串时间
 */
function getTimestamp(dateTime = null) {
    var timestamp;
    if (!dateTime) {
        timestamp = Number(new Date());
    } else if (typeof (dateTime) == "string") {
        timestamp = Number(new Date(new Date(dateTime+".000Z").getTime()-(8*3600*1000))); //IOS上必须要这么转才能获得正常时间
    }
    return timestamp
}



// 其他更多是格式化有如下:
// yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合
function timeFormat(dateTime = null, fmt = 'yyyy-mm-dd') {
    // 如果为null,则格式化当前时间
    // 如果为null,则格式化当前时间
    let date;
    if (!dateTime) {
        dateTime = Number(new Date());
        // date = new Date(dateTime);
    } else if (typeof (dateTime) == "string") {
        // dateTime = new Date(new Date(dateTime+".000Z").getTime()-(8*3600*1000)); //转换为东八区时间
        // dateTime = Number(dateTime);
        // dateTime = dateTime.replaceAll("-", "/")
        // dateTime = Number(new Date(dateTime));
        dateTime = Number(new Date(new Date(dateTime+".000Z").getTime()-(8*3600*1000)));
    }

    // 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
    if (dateTime.toString().length == 10)
        dateTime *= 1000;
    date = new Date(dateTime);

    // console.error("timezone1")
    // console.error(date.getTimezoneOffset() / 60)

    let ret;
    let opt = {
        "y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "h+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "s+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

function getQueryValue(url, queryName) {
    var query = decodeURI(url);
    var index = query.lastIndexOf("?")
    if (index > 0) {
        query = query.substr(index+1)
    }
    console.log(query);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == queryName) {
            return pair[1];
        }
    }
    return null;
}


/**
 * 比较两个版本号
 * @param v1    如1.9.0
 * @param v2    如1.8.2
 * @returns {number} 1：v1>v2 -1:v1<v2 0:v1=v2
 */
function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}


/**
 * 预览图片
 * @param url
 */
function previewImage(url) {
    uni.previewImage({
        urls: [url],
        indicator: "none"
    });
}


/**
 * 复制到剪切板
 * @param data
 */
function setClipboardData(data, toast=null){
    uni.setClipboardData({
        data: data,
        success: () => { //复制成功的回调函数
            let message = toast;
            if (!message) {
                message = "复制成功";
            }
            uni.showToast({
                title: message,
                duration:2000,
                icon:"none"
            });
        }
    });
}

function switchHome() {
    uni.switchTab({
        url: "/pages/index/index"
    });
}

/**
 * 播放音频 微信小程序不支持本地路径
 * @param src
 */
function playAudio(src) {
    const innerAudioContext = uni.createInnerAudioContext();//新建一个createInnerAudioContext();
    innerAudioContext.autoplay = true;//音频自动播放设置
    innerAudioContext.src = src;//链接到音频的地址
    innerAudioContext.onPlay(() => {});//播放音效
    innerAudioContext.onError((res) => {//打印错误
        console.log(res.errMsg);//错误信息
        console.log(res.errCode);//错误码
    })
    innerAudioContext.offEnded(() => {
        console.log("destroy");//
        innerAudioContext.destroy();
    })
}

function navigateToMiniProgram(appId, path) {
    uni.navigateToMiniProgram({
        appId: appId,
        path: path,
        success: function () {

        },
        fail:function (res) {
            console.debug("navigateToMiniProgram fail", res)
            // uni.showToast({
            //     title:"跳转小程序失败",
            //     duration:2000,
            //     icon:"none"
            // });

        }
    })
}

function setStorageSync(key, val){
    uni.setStorageSync(key, val);
}

function getStorageSync(key){
    return uni.getStorageSync(key);
}

/**
 * 获取授权
 */
async function getLocationAuth() {
    // 获取授权
    // const [authorizeErr, authorizeRes] = await
    uni.authorize({
        scope: "scope.userLocation",
        success(data) {
            console.log(data)
        },
        fail(data) {
            console.log(data)
        }
    });
    // console.log(authorizeErr, authorizeRes);
    // // 授权失败
    // if (authorizeErr) {
    //     return false;
    // }
    return true;
}



export default {
    isEmpty: isEmpty,
    formatDate: formatDate,
    formatMonthDate: formatMonthDate,
    formatDateTime: formatDateTime,
    formatFullDateTime: formatFullDateTime,
    formatNumber: formatNumber,
    toast: toast,
    trimChar: trimChar,
    switchHome:switchHome,
    // goLoginPage: goLoginPage,
    navigateBack: navigateBack,
    navigateTo: navigateTo,
    navigateToMiniProgram: navigateToMiniProgram,
    switchTab: switchTab,
    redirectTo: redirectTo,
    showLoading: showLoading,
    hideLoading: hideLoading,
    checkPhone: checkPhone,
    saveUrlImageFile: saveUrlImageFile,
    queryParams: queryParams,
    timeFormat: timeFormat,
    getTimestamp: getTimestamp,
    getQueryValue: getQueryValue,
    compareVersion: compareVersion,
    previewImage: previewImage,
    setClipboardData: setClipboardData,
    playAudio: playAudio,
    getLocationAuth: getLocationAuth,
    setStorageSync:setStorageSync,
    getStorageSync:getStorageSync

}


