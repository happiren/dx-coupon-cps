/**
 接口返回错误码
 */

//成功
export  const SUCCESS = 200;

//失败
export  const ERROR_NORMAL_ERROR = 1;

//服务器异常
export  const ERROR_EXCEPTION_ERROR = 2;

//数据库操作失败
export  const ERROR_DATABASE_ERROR = 3;

//服务器未知错误
export  const ERROR_DATA_NOT_AUTH = 998;
//服务器未知错误
export  const ERROR_UNKNOWN = 999;
//用户未授权
export  const ERROR_UNAUTHORARITY = 1000;
//登录错误
export  const ERROR_LOGIN_ERROR = 1001;
//用户名或者密码错误
export  const ERROR_ACCOUNT_ERROR = 1002;
//参数验证失败
export  const ERROR_PARAMS_ERROR = 1003;
//验证码失效
export  const ERROR_CODE_EXPIRE = 1004;
//验证码错误
export  const ERROR_CODE_ERROR = 1005;
//手机号错误
export  const ERROR_PHONE_ERROR = 1006;
//密码格式不符合
export  const ERROR_PASSWORD_FORMAT_ERROR = 1007;
//手机号绑定失败
export  const ERROR_BIND_PHONE_ERROR = 1008;
//绑定第三方账号失败
export  const ERROR_BIND_SNS_ERROR = 1009;
//手机号已经使用
export  const ERROR_PHONE_USED = 1010;
//用户不存在
export  const ERROR_UNKNOWN_USER = 1011;
//文件上传失败
export  const ERROR_UPLOAD_ERROR = 1012;
//用户未登录
export  const ERROR_USER_NO_LOGIN = 1015;
//获取社交网络信息错误
export  const ERROR_GET_SNS_INFO_ERROR = 1017;
 //第三方账号已经绑定了账号
export  const ERROR_SNS_BINDED_ERROR = 1021;
//第三方重复绑定
export  const ERROR_DUMPLICATE_SNS_ERROR = 1022;
//内容包含敏感词
export  const ERROR_SENSITIVE_WORD_ERROR = 1023;
//黑名單,禁言
export  const ERROR_BLACK_LIST_ERROR = 1024;
//商品库存不足
export  const ERROR_SHOP_OUT_OF_STOCK = 1026;
//超出销售时间范围
export  const ERROR_SHOP_OUT_OF_SALES_TIME = 1027;
//购买数量超限
export  const ERROR_SHOP_AMOUNT_LIMIT = 1028;
//不在活动时间范围
export  const ERROR_OUT_OF_ACTIVITY_TIME = 1030;
//短信发送频率超限
export  const ERROR_CODE_LIMIT_ERROR = 1031;
//数量超出限制
export  const ERROR_CODE_NUM_ULTRALIMIT = 1032;
//QPS超限,请重试
export  const ERROR_QPS_LIMIT = 1033;
//第三方服务异常
export  const ERROR_THIRD_SERVER_ERROR = 1034;
//第三方网络请求失败
export  const ERROR_NET_REQUEST_ERROR = 1035;
//昵称被禁用
export  const ERROR_NICKNAME_FORBIDDEN = 1036;
//第三方解绑失败
export  const ERROR_SNS_UNBIND_FORBIDDEN = 1037;
//数据重复
export  const ERROR_DATA_DUPLICATION = 1038;
//资源使用中未释放
export  const ERROR_RES_USED = 1039;
//数据为空
export  const ERROR_DATA_EMPTY = 1040;
//缺少资源
export const ERROR_RES_LACK = 1041;


export function getErrorMessage(code){
	var message = "";
	var developMessage = ""
	switch (code) {
		case SUCCESS:
			message = "成功";
			developMessage = "逻辑正常成功返回";
			break;
		case ERROR_NORMAL_ERROR:
			message = "失败";
			developMessage = "正常失败返回";
			break;
		case ERROR_EXCEPTION_ERROR:
			message = "异常失败";
			developMessage = "异常失败返回";
			break;
		case ERROR_DATABASE_ERROR:
			message = "数据库操作失败";
			developMessage = "数据库操作失败";
			break;
		case ERROR_DATA_NOT_AUTH:
			message = "数据未授权";
			developMessage = "数据未授权";
			break;
		case ERROR_UNKNOWN:
			message = "未知错误";
			developMessage = "杂乱无法归类的错误";
			break;
		case ERROR_UNAUTHORARITY:
			message = "需要权限";
			developMessage = "需要权限";
			break;
		case ERROR_LOGIN_ERROR:
			message = "登入错误";
			developMessage = "登入错误";
			break;
		case ERROR_ACCOUNT_ERROR:
			message = "账号或密码错误";
			developMessage = "账号或密码与数据库中不匹配";
			break;
		case ERROR_PARAMS_ERROR:
			message = "参数验证失败";
			developMessage = "提交参数不合法等失败情况";
			break;
		case ERROR_CODE_EXPIRE:
			message = "验证码失效";
			developMessage = "验证码过期失效";
			break;
		case ERROR_CODE_ERROR:
			message = "验证码错误";
			developMessage = "验证码错误";
			break;
		case ERROR_PHONE_ERROR:
			message = "手机号码错误";
			developMessage = "手机号码错误";
			break;
		case ERROR_PASSWORD_FORMAT_ERROR:
			message = "密码不符合格式";
			developMessage = "密码不符合格式";
			break;
		case ERROR_BIND_PHONE_ERROR:
			message = "手机绑定失败";
			developMessage = "手机绑定失败";
			break;
		case ERROR_BIND_SNS_ERROR:
			message = "绑定第三方失败";
			developMessage = "绑定第三方失败";
			break;
		case ERROR_PHONE_USED:
			message = "手机号已经使用";
			developMessage = "手机号已经使用";
			break;
		case ERROR_UNKNOWN_USER:
			message = "用户不存在";
			developMessage = "用户不存在";
			break;
		case ERROR_UPLOAD_ERROR:
			message = "文件上传失败";
			developMessage = "文件上传失败";
			break;
		case ERROR_USER_NO_LOGIN:
			message = "用户未登入";
			developMessage = "用户未登入";
			break;
		case ERROR_GET_SNS_INFO_ERROR:
			message = "获取微信用户信息错误";
			developMessage = "获取微信用户信息错误";
			break;
		case ERROR_SNS_BINDED_ERROR:
			message = "第三方已经绑定了账号";
			developMessage = "第三方已经绑定了账号";
			break;
		case ERROR_SENSITIVE_WORD_ERROR:
			message = "包含敏感词";
			developMessage = "包含敏感词";
			break;
		case ERROR_BLACK_LIST_ERROR:
			message = "黑名單,禁言";
			developMessage = "黑名單,禁言";
			break;
		case ERROR_SHOP_OUT_OF_STOCK:
			message = "商品库存不足";
			developMessage = "商品库存不足";
			break;
		case ERROR_SHOP_OUT_OF_SALES_TIME:
			message = "超出销售时间范围";
			developMessage = "超出销售时间范围";
			break;
		case ERROR_SHOP_AMOUNT_LIMIT:
			message = "购买数量超限";
			developMessage = "购买数量超限";
			break;
		case ERROR_CODE_LIMIT_ERROR:
			message = "短信发送频率超限";
			developMessage = "短信发送频率超限";
			break;
		case ERROR_CODE_NUM_ULTRALIMIT:
			message = "数量超出限制";
			developMessage = "数量超出限制";
			break;
		case ERROR_OUT_OF_ACTIVITY_TIME:
			message = "不在活动时间范围";
			developMessage = "不在活动时间范围";
			break;
		case ERROR_QPS_LIMIT:
			message = "QPS超限,请重试";
			developMessage = "QPS超限,请重试";
			break;
		case ERROR_THIRD_SERVER_ERROR:
			message = "第三方服务异常";
			developMessage = "第三方服务异常";
			break;
		case ERROR_NET_REQUEST_ERROR:
			message = "第三方网络请求失败";
			developMessage = "第三方网络请求失败";
			break;
		case ERROR_NICKNAME_FORBIDDEN:
			message = "昵称被禁用";
			developMessage = "昵称被禁用";
			break;
		case ERROR_SNS_UNBIND_FORBIDDEN:
			message = "第三方解绑失败";
			developMessage = "第三方解绑失败";
			break;
		case ERROR_DATA_DUPLICATION:
			message = "数据重复";
			developMessage = "数据重复";
			break;
		case ERROR_RES_USED:
			message = "资源使用中未释放";
			developMessage = "资源使用中未释放";
			break;
		case ERROR_DATA_EMPTY:
			message = "数据为空";
			developMessage = "数据为空";
			break;
		case ERROR_RES_LACK:
			message = "缺少材料";
			developMessage = "缺少材料";
			break;
		default:
			break;
	}
	return {
		code:code,
		message: message
	}
}


export default{
	getErrorMessage:getErrorMessage,
	 //成功
	SUCCESS:SUCCESS,
	ERROR_NORMAL_ERROR:ERROR_NORMAL_ERROR,
	ERROR_DATABASE_ERROR:ERROR_DATABASE_ERROR,
	ERROR_UNKNOWN:ERROR_UNKNOWN,
	ERROR_DATA_NOT_AUTH:ERROR_DATA_NOT_AUTH,
	ERROR_UNAUTHORARITY:ERROR_UNAUTHORARITY,
	ERROR_LOGIN_ERROR:ERROR_LOGIN_ERROR,
	ERROR_ACCOUNT_ERROR:ERROR_ACCOUNT_ERROR,
	ERROR_PARAMS_ERROR:ERROR_PARAMS_ERROR,
	ERROR_CODE_EXPIRE:ERROR_CODE_EXPIRE,
	ERROR_CODE_ERROR:ERROR_CODE_ERROR,
	ERROR_PHONE_ERROR:ERROR_PHONE_ERROR,
	ERROR_PASSWORD_FORMAT_ERROR:ERROR_PASSWORD_FORMAT_ERROR,
	ERROR_BIND_PHONE_ERROR:ERROR_BIND_PHONE_ERROR,
	ERROR_BIND_SNS_ERROR:ERROR_BIND_SNS_ERROR,
	ERROR_PHONE_USED:ERROR_PHONE_USED,
	ERROR_UNKNOWN_USER:ERROR_UNKNOWN_USER,
	ERROR_UPLOAD_ERROR:ERROR_UPLOAD_ERROR,
	ERROR_USER_NO_LOGIN:ERROR_USER_NO_LOGIN,
	ERROR_GET_SNS_INFO_ERROR:ERROR_GET_SNS_INFO_ERROR,
	ERROR_SNS_BINDED_ERROR:ERROR_SNS_BINDED_ERROR,
	ERROR_DUMPLICATE_SNS_ERROR:ERROR_DUMPLICATE_SNS_ERROR,
	ERROR_SENSITIVE_WORD_ERROR:ERROR_SENSITIVE_WORD_ERROR,
	ERROR_SHOP_OUT_OF_STOCK:ERROR_SHOP_OUT_OF_STOCK,
	ERROR_SHOP_OUT_OF_SALES_TIME:ERROR_SHOP_OUT_OF_SALES_TIME,
	ERROR_SHOP_AMOUNT_LIMIT:ERROR_SHOP_AMOUNT_LIMIT,
	ERROR_OUT_OF_ACTIVITY_TIME:ERROR_OUT_OF_ACTIVITY_TIME,
	ERROR_CODE_LIMIT_ERROR:ERROR_CODE_LIMIT_ERROR,
	ERROR_CODE_NUM_ULTRALIMIT:ERROR_CODE_NUM_ULTRALIMIT,
	ERROR_QPS_LIMIT:ERROR_QPS_LIMIT,
	ERROR_THIRD_SERVER_ERROR:ERROR_THIRD_SERVER_ERROR,
	ERROR_NET_REQUEST_ERROR:ERROR_NET_REQUEST_ERROR,
	ERROR_NICKNAME_FORBIDDEN:ERROR_NICKNAME_FORBIDDEN,
	ERROR_SNS_UNBIND_FORBIDDEN:ERROR_SNS_UNBIND_FORBIDDEN,
	ERROR_DATA_DUPLICATION:ERROR_DATA_DUPLICATION,
	ERROR_RES_USED:ERROR_RES_USED,
	ERROR_DATA_EMPTY:ERROR_DATA_EMPTY,
	ERROR_RES_LACK:ERROR_RES_LACK,
};
