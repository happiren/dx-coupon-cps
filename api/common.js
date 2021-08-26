import config from '@/config/config.js';
import utils from "@/common/utils";
import { http } from '@/common/request';
import log from '@/common/log-util.js'
import errorCode from '@/api/error-code.js'
//api方法合集
export default {

    /***************************************************** 平台配置项 start*******************************************/

    officialAccountSwitch(){
        return http.get('/api/v2/system/config/miniapp/officialAccountSwitch', {});
    },

    /**
     * 获取小程序封面图片
     * @returns {*}
     */
    async miniappShareCover(){
        let res = await http.get('/api/common/config/miniapp/shareCover', {});
        if (res.code == errorCode.SUCCESS)  {
            return res.data;
        }
        return null;
    },

    /***************************************************** 平台配置项 start*******************************************/

    /***************************************************** 公共模块 start*******************************************/
    /**
     * 获取短信验证码
     * @param phone
     * @param type
     * @param sign
     * @returns {Promise<unknown>}
     */
    getMsgCode(phone, type, sign){
        return http.post('/api/v2/user/passport/msgCode', {
            phone:phone,
            type:type,
            sign:sign,
        })
    },



    /**
     * 上传图片
     * @param imagePath
     * @returns {void|Promise<any>|*}
     */
    uploadImage(imagePath){
        return http.upload('/api/common/images/upload', {
            filePath:imagePath,
            name:"image",
        })
    },




    /**
     * 获取上传图片地址
     * @returns {string}
     */
    getUploadImageUrl(){
        //#ifdef H5
        return config.hostUrl +"/api/common/images/upload";
        //#endif
        //#ifndef H5
        return config.baseUrl +"/api/common/images/upload";
        //#endif

    },

    /**
     * 添加用户反馈
     * @param type	反馈类型，先填0
     * @param title
     * @param content
     * @param images
     * @param contact
     * @param name
     * @returns {Promise<unknown>}
     */
    feedback(type, title, content,images, contact, name){
        return http.post("/api/common/feedback/add",{
            type: type,
            title:title,
            content:content,
            images:images,
            contact:contact || "",
            name:name || "",
        });
    },


    /**
     * 向服务器添加错误日志
     * @param level  FFATAL(1),ERROR(2),WARN(3),INFO(4),DEBUG(5),TRACE(6);
     * @param title
     * @param desc
     * @param param
     *
     * @returns {Promise<unknown>}
     */
    addErrorLog(level, title, desc="", param=""){
        return http.post("/api/v2/common/feedback/addLog",{
            level: level,
            title:title,
            desc:desc,
            param:param,
        });
    },

    /***************************************************** 公共模块 end *******************************************/

}
