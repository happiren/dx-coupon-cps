import Request from './request'
import indexConfig from '@/config/config.js';
import store from '@/store';
import utils from '@/common/utils.js';


const http = new Request();

// request全局参数设置
http.setConfig((config) => { /* 设置全局配置 */
	config.baseUrl = indexConfig.baseUrl; /* 根域名不同 */
	// #ifdef H5
	config.baseUrl = indexConfig.hostUrl;
	// #endif

	let appVersion = "2.0.0";
	// #ifdef MP-WEIXIN
	const accountInfo = wx.getAccountInfoSync();
	appVersion = accountInfo.miniProgram.version;
	// #endif

	const systemInfo = uni.getSystemInfoSync();
	const systemInfoHeaders = {
		'deviceName': systemInfo.brand, // 设备名称
		'width': systemInfo.screenWidth, // 屏幕宽度
		'height': systemInfo.screenHeight, // 屏幕高度
		'appType': 1, //app类型 1：小程序 2：安卓 3：ios 4:web
		'appVersion': appVersion,
		// 'os': systemInfo.platform, // 客户端平台
		'osVersion': systemInfo.system // 操作系统版本
	};

	config.header = {
		...config.header,
		...systemInfoHeaders
	};

	return config;
});


let isRefreshing = false;
let requests = [];
http.interceptor.request((config) => { /* 请求之前拦截器 */
	var token = store.getters.token;
	if (!token) {
		var token =  uni.getStorageSync("token");
		store.commit('token', token);
	}
	config.header['Authorization'] = "Bearer "+ token; //accessToken  //storageKey.ACCESS_TOKEN
	return config;
}, error => {
	return Promise.reject(error)
})

// 刷新token
async function handleRefreshToken(refresh_token) {
	// await http.get(`${testToken}`, {
	// 	uid: 120
	// }).then(async r => {
	// 	console.log("dd", r)
	// 	console.log("data",r.data)
	// 	//uni.setStorageSync('accessToken', provider.access_token);
	// 	isRefreshing = false;
	// });
}

http.interceptor.response(async (response) => { /* 请求之后拦截器 */
	switch (response.statusCode) {
		case 200:
			return response.data;
		case 400:
			utils.toast('错误的请求');
			return Promise.reject(response.data.message);
			break;
		case 401:
			utils.toast('用户未登录');
			return Promise.reject(response.data.message);
			break;
		case 405:
			utils.toast('当前操作不被允许');
			return Promise.reject(response.data.message);
		case 404:
			utils.toast("页面不存在");
			return Promise.reject(response.data.message);
		case 429:
			utils.toast('请求过多，先休息一下吧');
			return Promise.reject(response.data.message);
		case 500:
			utils.toast('服务器打瞌睡了');
			return Promise.reject(response.data.message);
		default:
			utils.toast("请求失败");
			return Promise.reject(response.data.message);
	}
}, (error) => {
	return Promise.reject(error)
});

export {
	http
}
