import log from '@/common/log-util.js'
import utils from '@/common/utils.js'
export default {



    /**
     * 跳转项目首页
     */
    goProjectHome() {

        utils.switchTab("/pages/project/project/project");
    },

    goHome() {
        utils.switchTab("/pages/index/index");
    },

    /**
     * 跳转用户登录页面
     * @param back
     */
    goUserLogin(back) {
        if (back) {
            utils.navigateTo("/pages/user/login/login?loginNavigateBack=1");
        } else {
            utils.navigateTo("/pages/user/login/login?loginNavigateBack=0");
        }
    },


    reLaunchProjectHome(){
        uni.reLaunch("/pages/project/project/project");
    },


    /**
     * 跳转查看用户信息
     * @param projectId
     * @param projectUserId
     */
    goProjectUser(projectId, projectUserId) {
        log.debug(projectUserId);
        var param = {
            projectId: projectId,
            projectUserId: projectUserId,
        }
        utils.navigateTo("/pages/project/user/userdetail/userdetail" + utils.queryParams(param));
    },

    /**
     * 跳转查看用户考勤信息
     * @param projectId
     * @param projectUserId
     * @param projectUserName
     * @param dateTime， 日期，字符串格式
     */
    goUserAttendInfo(projectId, projectUserId, projectUserName, dateTime = "",  goBack=false) {

        var param = {
            projectId: projectId,
            projectUserId: projectUserId,
            projectUserName: projectUserName,
            dateTime: dateTime
        }
        if (goBack) {
            param.goBack = 1;
        }
        utils.navigateTo("/pages/attend/attendstastic/userstats" + utils.queryParams(param));
    },

    /**
     * 跳转考勤页面
     * @param projectId
     * @param projectUserId
     */
    goAttend(projectId, projectUserId) {
        var param = {
            projectId: projectId,
            projectUserId: projectUserId,
        }
        utils.navigateTo("/pages/attend/attend/attend" + utils.queryParams(param));
    },

    /**
     * 查看自身详细信息
     */
    goProjectSelfInfo(projectId) {
        var param = {
            projectId: projectId,
            selfProjectUserInfo: 1,
        }
        utils.navigateTo("/pages/project/user/userdetail/userdetail"+utils.queryParams(param));
    },


    /**
     * 修改项目自身信息
     */
    goModifyProjectSelfInfo(projectId) {
        var param = {
            projectId: projectId,
        }
        utils.navigateTo("/pages/project/user/modifyinfo/modifyinfo"+utils.queryParams(param));
    },

    /**
     * 跳转查看人员工作状态
     * @param projectId
     * @param areaId    区域ID, 若是整个项目则填写0
     * @param state     状态：1:进场 2:退场
     */
    goWorkStateUser(projectId, areaId, state, areaNum) {

        var param = {
            projectId: projectId,
            areaId: areaId,
            state: state,
            userNum: areaNum,
        }
        utils.navigateTo("/pages/project/area/user/area-user" + utils.queryParams(param));
        // } else {
        //     var param = {
        //         projectId:projectId,
        //         status: state,
        //     }
        //     utils.navigateTo("/pages/project/user/projectuser/projectWorkStateUser"+utils.queryParams(param));
        // }
    },

    /**
     * 查看项目公告详情
     * @param projectId
     * @param noticeId
     */
    goProjectNoticeDetail(projectId, noticeId) {
        var param = {
            projectId: projectId,
            noticeId: noticeId,
        }
        utils.navigateTo("/pages/project/notice/detail/detail"+utils.queryParams(param));
    },
}
