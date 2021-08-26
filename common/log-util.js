import config from '@/config/config.js';

import store from '@/store';

module.exports = {

	trace(...param){
		// #ifdef MP-WEIXIN
		if (__wxConfig.envVersion == 'release') { //正式发布版本不打印log
			config.debug = false;
		}
		// #endif
		if (config.debug || store.getters.showDebugInfo) {
			console.log("%c%s", "color: #4C4C4C; background: white; font-size: 14px;","[trace]:"+__dirname+__filename, param)
		}
	},
	info(...param){
		// #ifdef MP-WEIXIN
		if (__wxConfig.envVersion == 'release') { //正式发布版本不打印log
			config.debug = false;
		}
		// #endif
		if (config.debug || store.getters.showDebugInfo) {
			console.info("%c%s", "color: #000000; background: white; font-size: 14px;","[info]:"+__dirname+__filename, param)
		}
	},
	debug(...param){
		// // #ifdef MP-WEIXIN
		// if (__wxConfig.envVersion == 'release') { //正式发布版本不打印log
		// 	config.debug = false;
		// }
		// // #endif
		if (config.debug || store.getters.showDebugInfo) {
			console.log("%c%s", "color: #91D300; background: white; font-size: 14px;","[debug]"+__dirname+__filename, param)
		}
	},

	warn(...param){
		// // #ifdef MP-WEIXIN
		// if (__wxConfig.envVersion == 'release') { //正式发布版本不打印log
		// 	config.debug = false;
		// }
		// // #endif
		if (config.debug || store.getters.showDebugInfo) {
			console.warn("%c%s", "color: #FA9D3B; background: white; font-size: 14px;", "[warn]:"+__dirname+__filename, param)
		}
	},
	error(...param){
		if (config.debug || store.getters.showDebugInfo) {
			console.error("%c%s", "color: red; background: white; font-size: 14px;","[error]:"+__dirname+__filename, param)
		}

	},

}
