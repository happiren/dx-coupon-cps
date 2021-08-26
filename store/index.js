import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// const ACCESSTOKEN = uni.getStorageSync('accessToken') || '';
// const USER = uni.getStorageSync('userInfo') || {};

const store = new Vuex.Store({
	state: {
		//用户token
		token: "",
		//用户信息
		login: false,
		userInfo: {},
		showDebugInfo: false,
		sessionKey: "",
		projectInfo:{},
		projectPermissions: [],
		//网络状态
		networkState: 'unknown',
		version: "2.0.0", //小程序版本
	},
	getters: {
		// 判断用户是否登录
		checkLogin: state =>{
			if (state.userInfo && state.userInfo.user_id !== undefined && state.userInfo.user_id > 0) {
				return true;
			} else {
				return false;
			}
		},
		token: state => {
			return state.token;
		},
		showDebugInfo: state => {
			return state.showDebugInfo;
		},
		userInfo: state =>{
			return state.userInfo;
		},
		// projectInfo: state => {
		// 	return state.projectInfo;
		// },
		// projectPermissions: state => {
		// 	return state.projectPermissions;
		// },
		shopInfo: state =>{
			return state.shopInfo;
		},
		version: state => {
			return state.version;
		},
		sessionKey: state =>{
			return state.sessionKey;
		},
		hasLogin: state => {
		    if (state.token) {
		        return true;
		    } else {
		        return false
		    }
		}
	},
	mutations: {
		token(state, token) {
			state.token = token;
		},
		login(state, login) {
			state.login = login;
		},


		userInfo(state, userInfo){
			// state.login = true;
			state.userInfo = userInfo;
			console.log(state.userInfo);
			// uni.setStorageSync('userInfo', userInfo);
		},
		version(state, version) {
			state.version = version;
		},
		projectInfo(state, projectInfo) {
			state.projectInfo = projectInfo;
		},
		projectPermissions(state, permissions) {
			state.projectPermissions = permissions;
		},
		sessionKey(state, sessionKey){
			// state.login = true;
			state.sessionKey = sessionKey;
			console.log("sava seesion key");
			console.log(state.sessionKey);
			// uni.setStorageSync('userInfo', userInfo);
		},
		showDebugInfo(state, showDebugInfo) {
			state.showDebugInfo = showDebugInfo;
		},

		// login(state, provider) {
		// 	//state.accessToken = provider.access_token;
		// 	state.userInfo = provider.user_info;
		// 	//uni.setStorageSync('accessToken', provider.access_token);
		// 	uni.setStorageSync('userInfo', provider.access_token);

		// 	console.log(state.userInfo);
		// },
		// logout(state) {
		// 	state.accessToken = '';
		// 	state.userInfo = {};
		// 	uni.removeStorageSync('accessToken');
		// 	uni.removeStorageSync('userInfo');
		// },
		setNetworkState(state, provider) {
			console.log('setNetworkState', provider);
		    state.networkState = provider;
		}
	},
	actions: {
		networkStateChange({commit}, info) {
		    commit('setNetworkState', info);
		},
		logout({commit}) {
		    commit('logout');
		}
	}
})

export default store
