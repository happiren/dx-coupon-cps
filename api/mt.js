import config from '@/config/config.js';
import utils from "@/common/utils";
import { http } from '@/common/request';
import log from '@/common/log-util.js'
import errorCode from '@/api/error-code.js'
export default {
    /***************************************************** 首页 start *******************************************/

    /**
     * 获取文章分类
     * @returns {*}
     */
    getProvince(){
        return http.get("/api/mt/province", {
        })
    },
    getCities(provinceId){
        return http.get("/api/mt/cities", {
            provinceId:provinceId
        })
    },

    dealsSearch(data){
        return http.get("/api/mt/dealsSearch", data)
    },

    cityCategories(cityId, cat0Id=null){
        return http.get("/api/mt/cityCategories", {
            cityId: cityId,
            cat0Id: cat0Id ? cat0Id: ""
        })
    },





    /***************************************************** 首页 end *********************************************/
}
