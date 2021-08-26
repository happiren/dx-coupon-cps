import config from "./config.js";
import cj from "../node_modules/crypto-js/crypto-js.js"

module.exports = {	
	
	/**
	 * 生成OSS上传图案地址
	 * @param {Object} userId
	 * @param {Object} fileName 图片名称
	 */
	ossUploadFileName(userId, fileName){		
		var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
		var timestamp=new Date().getTime();
		var rand = Math.floor(Math.random() * Math.floor(100000));
		return "share/"+userId+"/"+cj.MD5(""+timestamp+rand).toString().toUpperCase() +"."+fileExtension;
	},
	
	
}