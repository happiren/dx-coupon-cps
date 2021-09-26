import api from '@/common/api-util.js';
import ErrorCode from '@/api/error-code.js';
import config from '@/config/config.js';


import store from '@/store';

/**
 * 检测用户是否登录
 */
function checkLogin() {
	var login =  store.getters.checkLogin;
	console.log("checkLogin login:"+login);
	return login;
}

function getDiskAccessToken() {
	var accessToken = uni.getStorageSync('token');
	return accessToken;
}


async function debugLoin(uid) {
	api.user.testLogin(uid).then(function(res) {
		if (res.code == 200) {
			store.commit('userInfo', res.data.user);
			store.commit('token', res.data.token);
			uni.setStorageSync('token', res.data.token);
		} else {
			uni.showToast({
				title: "调试登录失败"
			})
			console.log('服务器异常3')
		}
	});
}

/**
 * 通过本地token获取用户信息
 * @returns {Promise<unknown>}
 */
function getUserInfo() {
	var token =  uni.getStorageSync("token");
	store.commit('token', token);
	return new Promise((resolve, reject) => {
	    api.user.userDetailInfo().then(function(res) {
	    	if (res.code == ErrorCode.SUCCESS) {
	    		// console.log(res)
				store.commit('userInfo', res.data);
	    		return resolve(res.data)
	    	} else if (res.code == ErrorCode.ERROR_USER_NO_LOGIN) {
	    		// that.login();
	    		return resolve();
	    	} else {
	    		return resolve()
	    	}
	    })
	  })

}


async function  checkTokenLogin() {
	var token =  uni.getStorageSync("token");
	store.commit('token', token);

	let res = await api.user.userDetailInfo();
	if (res.code == ErrorCode.SUCCESS) {
		store.commit('userInfo', res.data);
		return true;
	} else {
		return false;
	}
}

/**
 * 从磁盘中获取token
 */
function setStoreToken() {
	var token =  uni.getStorageSync("token");
	store.commit('token', token);
	return token;
}


/**
 * 不请求网络获取本地用户信息
 * @returns {boolean|*}
 */
function getLocalUserInfo() {
	if(store.getters.checkLogin) {
		return store.getters.userInfo;
	} else {
		return false;
	}
}

/**
 * 更新本地用户信息
 * @param userInfo
 */
function updateLocalUserInfo(userInfo) {
	// uni.removeStorageSync('userInfo')
	store.commit("userInfo", userInfo);
	// uni.setStorageSync('userInfo', userInfo);
}


function phoneLogin(phone, password, callback=null) {
	api.user.phoneLogin(phone, password).then(res => {
		if (res.code != api.SUCCESS) {
			uni.showToast({
				title: api.getErrorMessage(res.code)
			})
			return;
		}
		store.commit('userInfo', res.data.user);
		store.commit('token', res.data.token);
		uni.setStorageSync('token', res.data.token);
		if (callback) {
			callback();
		} else {
			uni.switchTab({
				url:"/pages/user/mine/mine"
			});
		}
	})

}

function codeLogin(code, callback) {
	api.user.codeLogin(code).then(res => {
		if (res.code == api.SUCCESS) {
			store.commit('userInfo', res.data.user);
			store.commit('token', res.data.token);
			uni.setStorageSync('token', res.data.token);
			if (callback) {
				callback();
			} else {
				uni.switchTab({
					url:"/pages/user/mine/mine"
				});
			}
		} else {

		}
	});
}

function register(wxCode, wxUserInfoIv, wxUserInfoEncryData, callback = null) {
	api.user.register(wxCode, wxUserInfoIv, wxUserInfoEncryData).then(res => {
		if (res.code != api.SUCCESS) {
			uni.showToast({
				title: api.getErrorMessage(res.code)
			})
			return;
		}
		// log.debug(this.userInfo)
		store.commit('userInfo', res.data.user);
		store.commit('token', res.data.token);
		uni.setStorageSync('token', res.data.token);
		if (callback) {
			callback();
		} else {
			uni.switchTab({
				url:"/pages/user/mine/mine"
			});
		}
	})
}

/**
 * 退出登录
 */
function loginOut() {
	store.commit("userInfo", {});
	store.commit("token", '');
	store.commit("login", false);
	uni.removeStorageSync('token')
}

module.exports = {
	checkLogin: checkLogin,
	checkTokenLogin: checkTokenLogin,
	codeLogin: codeLogin,
	debugLoin: debugLoin,
	setStoreToken:setStoreToken,
	getUserInfo: getUserInfo,
	register: register,
	phoneLogin:phoneLogin,
	getLocalUserInfo:getLocalUserInfo,
	updateLocalUserInfo: updateLocalUserInfo,
	loginOut: loginOut
}
