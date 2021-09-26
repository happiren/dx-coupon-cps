import Vue from 'vue'
//#ifdef H5
import "@/common/pc.js"
//#endif
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

//引入全局存储
import store from '@/store';

// 引入全局配置
import $mConfig from '@/config/config';

// 引入全局方法
import { http } from '@/common/request';

import uView from 'uview-ui';
Vue.use(uView);


// 网络状态监听
uni.getNetworkType({
	success: function(res) {
		store.dispatch('networkStateChange', res.networkType);
	}
});

uni.onNetworkStatusChange(function(res) {
	store.dispatch('networkStateChange', res.networkType);
});

//#ifdef APP-PLUS
plus.nativeUI.toast = (function(str){
	if(str == '再按一次退出应用'){
		// main.moveTaskToBack(false);
		uni.showToast({
			title: "再按一次返回主页",
			icon:'none',
		});
		return false;
	}else{
		uni.showToast({
			title: str,
			icon:'none',
		})
	}
});
//#endif

//挂载全局自定义方法
Vue.prototype.$http = http;
Vue.prototype.$mConfig = $mConfig;
Vue.prototype.$store = store;

const app = new Vue({
    ...App
})
app.$mount()

//用户修改用户同步登录
Vue.prototype.$onLaunched = new Promise(resolve => {
	Vue.prototype.$isResolve = resolve
})


