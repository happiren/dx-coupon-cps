import config from '@/config/config.js';
import utils from "@/common/utils";
import { http } from '@/common/request';
import log from '@/common/log-util.js'
import errorCode from '@/api/error-code.js'

//api方法合集
export default {

    /***************************************************** 账号相关 start*******************************************/


    /**
     * 获取token
     */
    getBearerToken(){
        return "Bearer " + uni.getStorageSync("token");
    },
    /**
     * 生成用户token
     */
    // async getTestToken(uid = 120){
    // 	log.info('getTestToken');
    // 	return http.get(login.testToken, {
    // 		uid : uid
    // 	});
    // },

    testLogin(uid){
        return http.get('/api/user/userTestLogin', {
            uid: uid,
        });
    },

    // async login(code) {
    //     console.log("login");
    //     return http.post('/api/v2/user/passport/wx/miniapp/login', {
    //         code: code,
    //     });
    // },

    /**
     * 添加登录日志
     * @param status
     * @returns {*}
     */
    addEntryLog(status){
        let sysInfo = uni.getSystemInfoSync();
        return http.get("/api/user/log/userEntryLog", {
            status:status,
            brand: sysInfo.brand,
            model: sysInfo.model,
        })
    },

    /**
     * 通过手机号登陆
     * @param phone
     * @param password
     * @returns {Promise<unknown>}
     */
    async phoneLogin(phone, password) {
        console.log("login");
        return http.post('/api/v2/user/passport/phoneLogin', {
            phone: phone,
            password:password,
        });
    },

    /**
     * 小程序通过code登录。
     * @param code
     * @returns {Promise<unknown>}
     */
    codeLogin( code) {
	    console.log("codeLogin");
	    return http.post('/api/user/wx/miniapp/codeLogin', {
	        code: code,
	    });
	},

    /**
     * 小程序获取手机号登录
     * @param phoneIv
     * @param phoneEncryptedData
     * @param userEncryptedIv
     * @param userEncryptedData
     * @param code
     * @returns {Promise<unknown>}
     */
    register(code, userEncryptedIv, userEncryptedData, ) {
        console.log("register");
        return http.post('/api/user/wx/miniapp/register', {
            userEncryptedIv: userEncryptedIv,
            userEncryptedData: userEncryptedData,
            code: code,
        });
    },
    userDetailInfo(){
        return http.get('/api/user/info/userSelfInfo', {});
    },

    /**
     * 获取个人推广海报模板内容
     * @returns {*}
     */
    usePosterTemplate(){
        return http.get('/api/user/info/posterTemplate', {});
    },


    uploadFrontIdcard(imagePath){
        return http.upload('/api/v2/user/info/idcardFrontOcr', {
            filePath:imagePath,
            name:"frontPic",
        })
    },

    /**
     * 绑定实名认证
     * @param frontIdcardOcrId
     * @param backIdcardOcrId
     * @returns {Promise<unknown>}
     */
    bindIdcard(frontIdcardOcrId, backIdcardOcrId){
        return http.post('/api/v2/user/info/bindIdcard', {
            frontIdcardOcrId:frontIdcardOcrId,
            backIdcardOcrId:backIdcardOcrId,
        })
    },

    /**
     * 通过OCR绑定平台用户实名认证
     * @param idcardOcrId
     * @param projectId
     * @returns {Promise<unknown>}
     */
    bindIdcardByOcr(idcardOcrId, projectId=0){
        return http.post('/api/v2/user/info/bindIdcardByOcr', {
            idcardOcrId:idcardOcrId,
            projectId:projectId,
        })
    },



    /**
     * 绑定两个OCR
     * @param projectId
     * @param frontIdcardOcrId
     * @param backIdcardOcrId
     * @returns {Promise<unknown>}
     */
    rebindIdcard(projectId, frontIdcardOcrId, backIdcardOcrId){
        return http.post('/api/v2/user/info/rebindIdcard', {
            projectId:projectId,
            frontIdcardOcrId:frontIdcardOcrId,
            backIdcardOcrId:backIdcardOcrId,
        })
    },

    /**
     * 获取用户项目中使用但未添加到平台的银行卡列表
     * @returns {*}
     */
    userProjectBankcards(){
        return http.get('/api/v2/user/info/bankcard/userProjectBankcards', {
        })
    },

    /**
     * 将两个ocr结果合成为身份识别结果
     * @param projectId
     * @param puid
     * @param frontIdcardOcrId
     * @param backIdcardOcrId
     * @returns {Promise<unknown>}
     */
    compositeIdcardOcr(projectId, puid, frontIdcardOcrId, backIdcardOcrId){
        return http.post('/api/v2/user/info/compositeIdcardOcr', {
            projectId:projectId,
            puid: puid,
            frontIdcardOcrId:frontIdcardOcrId,
            backIdcardOcrId:backIdcardOcrId,
        })
    },

    /**
     * 获取实名认证信息
     * @returns {*}
     */
    idCardInfo(){
        return http.get('/api/v2/user/info/idCardInfo', {
        })
    },

    /**
     * 获取实名认证OCRID结果
     * @returns {*}
     */
    idCardOcrInfo(idcardOcrId){
        return http.get('/api/v2/user/info/idcardOcrInfo', {
            idcardOcrId:idcardOcrId
        })
    },

    /**
     * 获取用户的银行卡列表
     * @returns {*}
     */
    userBankcards(){
        return http.get('/api/v2/user/info/bankcard/userBankcards', {
        })
    },

    /**
     * 设置银行卡为默认银行卡
     * @param bankcardId
     * @returns {Promise<unknown>}
     */
    setDefaultBankcard(bankcardId){
        return http.post('/api/v2/user/info/bankcard/setDefaultBankcard', {
            bankcardId:bankcardId
        })
    },


    /**
     * 修改用户头像
     * @param image
     * @returns {void|Promise<any>|*}
     */
    changeUserAvatar(imagePath){
        return http.upload('/api/v2/user/info/modifyPicInfo', {
            filePath:imagePath,
            name:"image",
            params:{type: 13}
        })
    },

    /**
     * 修改用户联系微信二维码
     * @param image
     * @returns {void|Promise<any>|*}
     */
    changeUserWechatQrcode(imagePath){
        return http.upload('/api/v2/user/info/modifyPicInfo', {
            filePath:imagePath,
            name:"image",
            params:{type: 5}
        })
    },
    /**
     * 修改用户数字类型信息
     * @param image
     * @returns {void|Promise<any>|*}
     */
    modifyUserAddress(province, city, area, location){
        return http.post('/api/v2/user/info/modifyAddress', {
            province:province,
            city:city,
            area:area,
            location:location
        })
    },

    /**
     * 修改用户数字类型信息
     * @param image
     * @returns {void|Promise<any>|*}
     */
    modifyUserIntInfo(type, value){
        return http.post('/api/v2/user/info/modifyIntInfo', {
            type:type,
            value:value,
        })
    },


    /**
     * 修改用户字符串类型信息
     * @param image
     * @returns {void|Promise<any>|*}
     */
    modifyUserStrInfo(type, value){
        return http.post('/api/v2/user/info/modifyStrInfo', {
            type:type,
            value:value,
        })
    },

    /**
     * 删除银行卡
     * @returns {*}
     */
    deleteBankcards(bankcardId){
        return http.post('/api/v2/user/info/bankcard/deleteBankcard', {
            bankcardId:bankcardId
        })
    },
    /**
     * 银行卡OCR
     * @param imagePath
     * @returns {void|Promise<any>|*}
     */
    uploadBankcardOcr(imagePath){
        return http.upload('/api/v2/user/info/bankcard/bankCardOcr', {
            filePath:imagePath,
            name:"bankCard",
        })
    },
    /**
     * 添加用户自己的银行卡
     * @param imagePath
     * @returns {Promise<unknown>}
     */
    addBankcard(name, bankcardNum, bank, bankAddress, picUrl ){
        return http.post('/api/v2/user/info/bankcard/addBankcard', {
            name:name,
            bankcardNum:bankcardNum,
            bank:bank,
            bankAddress:bankAddress,
            url:picUrl ? picUrl : "",
        })
    },

    /**
     * 修改用户手机号
     * @param phone
     * @param key
     * @param code
     * @returns {Promise<unknown>}
     */
    changPhone(phone, key, code){
        return http.post('/api/v2/user/passport/changePhone', {
            phone:phone,
            key:key,
            code:code,
        })
    },

    /**
     * 修改密码
     * @param oldPassword
     * @param newPassword
     * @param code
     * @returns {Promise<unknown>}
     */
    modifyPassword(oldPassword, newPassword, code){
        return http.post('/api/v2/user/passport/modifyPassword', {
            oldPassword:oldPassword,
            password:newPassword,
        })
    },

    /**
     * 重置密码
     * @returns {Promise<unknown>}
     */
    resetPassword(phone, key, code, password){
        return http.post('/api/v2/user/passport/modifyPasswordByPhone', {
            phone:phone,
            key:key,
            code:code,
            password:password,
        })
    },



    /***************************************************** 账号相关 end *******************************************/

}
