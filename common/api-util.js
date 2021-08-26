import config from '@/config/config.js';
import utils from "./utils";
import {
	http
} from '@/common/request';
import log from '@/common/log-util.js'
import errorCode from '@/api/error-code.js'
import user from "../api/user.js";
import home from "../api/home.js";
import article from "../api/article.js";
import message from "../api/message.js";
import common from "../api/common.js";
import coupon from "../api/coupon.js";



//api方法合集
export default {
	errorCode: errorCode,
	SUCCESS: errorCode.SUCCESS,
	user: user,
	common: common,
	home: home,
	article:article,
	message: message,
	coupon: coupon,

	getErrorMessage(code) {
		return errorCode.getErrorMessage(code).message;
	},
}
