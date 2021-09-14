<template>
    <view>
        <view style="background-color: #fff">
            <view class="content">
                <view v-if="!login || !userInfo">
                    <!-- <view style="font-size: 56rpx; margin: 64rpx; text-align: center;" >点击登录</view>		 -->
                    <button v-if="!canIUseGetUserProfile" class="user-unlogin-button" hover-class='none' open-type="getUserInfo" @getuserinfo="getUserInfo">
                        <view class="user-info">
                            <view class="left">
                                <image class="avatar" src="/static/images/icon-default-avatar.png"
                                       background-size="cover"></image>
                            </view>
                            <view class="right">
                                <view class="user-name">登录/注册</view>
                                <view class="user-desc-home">
                                    <view class="user-desc">点击登录 享受更多精彩</view>
                                </view>
                            </view>
                        </view>
                    </button>
                    <button v-if="canIUseGetUserProfile" class="user-unlogin-button" hover-class='none' @click="getUserInfo">
                        <view class="user-info">
                            <view class="left">
                                <image class="avatar" src="/static/images/icon-default-avatar.png"
                                       background-size="cover"></image>
                            </view>
                            <view class="right">
                                <view class="user-name">登录/注册</view>
                                <view class="user-desc-home">
                                    <view class="user-desc">点击登录 享受更多精彩</view>
                                </view>
                            </view>
                        </view>
                    </button>
                </view>
                <view v-if="login && userInfo">
                    <view class="user-card" @click="onAvatarClick()">
                        <view class="user-info">
                            <view class="left">
                                <u-avatar size="128" :src="userInfo.avatar" @click="onAvatarClick()"></u-avatar>
<!--                                <image class="avatar" :src="userInfo.avatar" background-size="cover"-->
<!--                                       @click="onAvatarClick()"></image>-->
                            </view>
                            <view class="right">
                                <view class="user-name" v-if="userInfo.nickname" @click="onAvatarClick()">
                                    {{userInfo.nickname}}
                                </view>
                                <view class="mp">
                                    <view>公众号：爱享外卖优惠券</view>
                                    <view>
                                        <u-icon @click="copy('爱享外卖优惠券')" style="margin-left: 12rpx" name="/static/icon/copy.png" size="24"></u-icon>
                                    </view>
                                </view>
                                <view class="user-desc-home">
<!--                                    <view class="user-desc" @click="onAvatarClick()">{{userInfo.description || "&nbsp;"}}-->
<!--                                    </view>-->
                                    <view class="user-home" v-if="userInfo.user_id" @click="goUserHome()">
                                        <!--                                    <view style="color: #5F74FF;">个人主页</view>-->
                                        <!--                                    <image src="/static/images/icon-right-arrow-blue.png"-->
                                        <!--                                           style="height: 32rpx;width: 32rpx;"></image>-->
                                    </view>
                                </view>
                            </view>
                        </view>
<!--                        <u-icon size="28" color="#969799" name="arrow-right"></u-icon>-->
                    </view>

                </view>

            </view>
        </view>



<!--        <view class="user-menu">-->
<!--            <view class="col">-->
<!--                <view><u-icon name="woman" size="36"></u-icon></view>-->
<!--                <view>好友列表</view>-->
<!--            </view>-->
<!--            <view>-->
<!--                <u-line direction="col" length="48rpx"></u-line>-->
<!--            </view>-->
<!--            <view class="col">-->
<!--                <view><u-icon name="woman" size="36"></u-icon></view>-->
<!--                <view>我的海报</view>-->
<!--            </view>-->
<!--        </view>-->
<!--        <u-gap height="16" bg-color="#F8F8F8"></u-gap>-->
<!--        <u-cell-group :border="false" :icon-style="iconStyle">-->
<!--            <u-cell-item icon="http://oss.jianyb.com/cpms/app/icon/mine/idcard.png" iconSize="62" :title-style="titleStyle" title="实名认证" :border-top="false" @click="goIdcard()"></u-cell-item>-->
<!--        </u-cell-group>-->
<!--        <u-gap height="16" bg-color="#F8F8F8"></u-gap>-->
<!--        <u-cell-group>-->
<!--            <u-cell-item icon="http://oss.jianyb.com/cpms/app/icon/mine/phone.png" iconSize="62"  :title-style="titleStyle" title="手机号" :value="hiddenPhone" :border-top="false" @click="goChangePhone()"></u-cell-item>-->
<!--            <u-cell-item icon="http://oss.jianyb.com/cpms/app/icon/mine/password.png" iconSize="62" :title-style="titleStyle" title="修改密码" :border-top="false" @click="goModifyPassword()"></u-cell-item>-->
<!--			<u-cell-item icon="http://oss.jianyb.com/cpms/app/icon/mine/bankcard.png" iconSize="62" :title-style="titleStyle" title="银行卡" @click="goBankcard()"></u-cell-item>-->
<!--        </u-cell-group>-->
        <u-gap height="16" bg-color="#F8F8F8"></u-gap>
        <u-cell-group :border="false">
            <u-cell-item icon="http://oss.jianyb.com/cpms/app/icon/mine/poster.png" iconSize="62" :title-style="titleStyle" title="我的海报" :border-top="false" @click="goPoster()"></u-cell-item>
            <u-cell-item icon="http://oss.jianyb.com/cpms/app/icon/mine/feedback.png" iconSize="62" :title-style="titleStyle" title="意见反馈" :border-top="false" @click="goFeedback()"></u-cell-item>
<!--            <u-cell-item icon="/static/images/icon-default-avatar.png" title="设置" :border-bottom="false"></u-cell-item>-->
        </u-cell-group>

        <dx-poster ref="dxPoster" @cancel="posterHandleCancel" :posterData.sync="posterData"  />

        <view v-if="login" style="text-align: center;margin-top:48rpx">
            <u-button size="medium" shape="circle" plain @click="onLogout">退出登录</u-button>
        </view>

        <view v-if="env == 'develop'">
            <view class="develop-env" @click="goDebugPage">
                开发板-
                <view v-if="apiUrl == 'https://cpms-api.jianyb.com'">
                    正式服
                </view>
                <view v-else="config.baseUrl == 'https://cpms-api.jianyb.com'">
                    测试服
                </view>
            </view>
            <view class="develop-env" @click="scanCodeTest()">扫码测试</view>

        </view>
        <view v-else-if="env == 'trial'" >
            <view class="develop-env" @click="goDebugPage">
                体验版-
                <view v-if="apiUrl == 'https://cpms-api.jianyb.com'">
                    正式服
                </view>
                <view v-else="config.baseUrl == 'https://cpms-api.jianyb.com'">
                    测试服
                </view>
            </view>

            <view class="develop-env" @click="scanCodeTest()">扫码测试</view>
        </view>
        <dx-tabbar v-model="tabBarIndex"></dx-tabbar>
    </view>
</template>


<script>
    import auth from '@/common/auth.js'
    import log from '@/common/log-util.js'
    import utils from '@/common/utils.js'
    import config from '@/config/config.js'
    import api from '@/common/api-util.js'
    import ErrorCode from '@/api/error-code.js'

    import UGap from "../../../uview-ui/components/u-gap/u-gap";
    import UModal from "../../../uview-ui/components/u-modal/u-modal";
    import UButton from "../../../uview-ui/components/u-button/u-button";
    import UIcon from "../../../uview-ui/components/u-icon/u-icon";
    import ULine from "../../../uview-ui/components/u-line/u-line";

    export default {
        data() {
            return {
                tabBarIndex: 4,
                showGetPhone: false,
                showLoginFlag: false,
                canIUseGetUserProfile: false,
                login: false,
                userInfo: {},
                wxUserInfoIv:null,
                wxUserInfoEncryptedData:null,
                wxCode: null,
                hiddenPhone: "",
                // #ifdef MP-WEIXIN
                weixin:true,
                apiUrl: config.baseUrl,
                env:__wxConfig.envVersion,
                // #endif
                //#ifndef MP-WEIXIN
                weixin:false,
                //#endif
                // #ifdef H5
                apiUrl: config.hostUrl,
                env: 'develop',
                // #endif
                iconStyle:{
                    width: "40rpx",
                    height: "40rpx",
                },
                titleStyle: {
                    color: "#151515",
                    fontSize: "32rpx",
                    lineHeight: "1.5",
                    marginLeft: "10rpx"
                },
                posterData: null,
            }
        },
        components: {
            ULine,
            UIcon,
            UButton,
            UGap,
        },
        onLoad(option) {
            var that = this;
            log.debug("onload")
            // #ifdef MP-WEIXIN
            if (wx.getUserProfile) {
                const version = wx.getSystemInfoSync().SDKVersion;
                if (utils.compareVersion(version, '2.10.4') > 0) {
                    log.debug("sdk > 2.10.4")
                    this.canIUseGetUserProfile = true;
                }
            }
            // #endif
            this.login = auth.checkLogin();
            if (!this.login) {
                this.checkUnionidLogin();
                return;
            }
            this.userInfo = auth.getLocalUserInfo();
        },
        onShow() {
            log.debug("onshow")
            var that = this;
            this.login = auth.checkLogin();
            if (!this.login) {
                // utils.navigateTo("/pages/user/login/login");
                // return;
                this.userInfo = null;

				// #ifdef H5 || APP-PLUS
				auth.debugLoin(120);
				// #endif
                return ;
            }
            this.userInfo = this.$store.getters.userInfo;
            if (this.userInfo && this.userInfo.phone) {
                let phone = this.userInfo.phone;
                this.hiddenPhone =  phone.substring(0,3) + "****" + phone.substring(7,11);
            } else {
                return ""
            }
        },
        methods: {
            getUserInfo(e) {
                this.wxCode = null;
                this.wxUserInfoIv = null;
                this.wxUserInfoEncryData = null;
                if (!e) {
                    utils.toast("获取用户信息失败");
                    return;
                }
                var that = this;
                uni.login({
                    provider: "weixin",
                    success: (res => {
                        let code = res.code;
                        that.wxCode = code;
                        //暂时不做调整
                        that.register();
                    }),
                    fail: (res) => {
                        utils.toast("微信登录失败");
                    }
                });


                if (this.canIUseGetUserProfile) {
                    log.debug("wx.getUserProfile login")
                    wx.getUserProfile({
                        desc: '用于完善用户资料',
                        success(info_res) {
                            console.log(info_res)
                            that.wxUserInfoIv = info_res.iv;
                            that.wxUserInfoEncryData = info_res.encryptedData;
                            that.register();
                        },
                        fail(info_res){
                            log.debug("getUserProfile error", info_res)
                            utils.toast("获取微信用户信息失败");
                        },
                        complete(res){
                            utils.hideLoading();
                        }
                    })
                } else {
                    utils.showLoading("加载中...");
                    log.debug("uni.getUserInfo login")
                    uni.getUserInfo({
                        withCredentials: true,
                        success(info_res) {
                            console.log(info_res)
                            that.wxUserInfoIv = info_res.iv;
                            that.wxUserInfoEncryData = info_res.encryptedData;
                            that.register();
                        },
                        fail(info_res){
                            log.debug("getUserInfo error", info_res)
                            utils.toast("获取微信用户信息失败");
                        },
                        complete(res){
                            utils.hideLoading();
                        }
                    })
                }
            },
            register(){
                let that = this;
                if (!this.wxCode || !this.wxUserInfoIv || !this.wxUserInfoEncryData) {
                    return;
                }
                auth.register(this.wxCode, this.wxUserInfoIv, this.wxUserInfoEncryData, function () {
                    that.userInfo = auth.getLocalUserInfo();
                    that.login = true;
                });
            },
            onAvatarClick() {
                if (!auth.checkLogin()) {
                    this.processLogin();
                    return;
                } else {
                    //暂时不支持跳转个人详情页面
                    // utils.navigateTo('/pages/user/mine/info/userinfo/userinfo');
                }
            },
            checkUnionidLogin(){
                let that = this;
                uni.login({
                    provider: "weixin",
                    success: (res => {
                        auth.codeLogin(res.code, function () {
                            that.userInfo = auth.getLocalUserInfo();
                            that.login = true;
                        })
                    }),
                    fail: (res) => {
                        // utils.hideLoading("加载中...");
                        // utils.toast("微信登录失败");
                    }
                });
            },

            goLogin(){
                log.debug("goLogin")
                utils.navigateTo("/pages/user/login/login");
            },
            copy(val) {
                utils.setClipboardData(val);
            },
            goPoster(){
                if (!auth.checkLogin()){
                    utils.toast("请先登录");
                    return;
                }
                let that = this;
                api.user.usePosterTemplate().then(res =>  {
                    if (res.code == api.SUCCESS) {

                        this.posterData = JSON.parse(res.data.template);
                        setTimeout(function () {
                            that.$refs.dxPoster.posterShow();
                        }, 200)

                    } else {
                        utils.toast(api.getErrorMessage(res.code));
                    }
                })

            },
            posterHandleCancel(e){
                log.debug("posterHandleCancel", e)
            },
            goChangePhone(){
                if (!auth.checkLogin()) {
                    this.goLogin();
                    return;
                }
                utils.navigateTo("/pages/user/mine/info/changephone/changephone");
            },
            goModifyPassword(){
                if (!auth.checkLogin()) {
                    this.goLogin();
                    return;
                }
                utils.navigateTo("/pages/user/setting/modifyPassword");
            },
            goBankcard() {
                if (!auth.checkLogin()) {
                    this.goLogin();
                    return;
                }
                log.debug("goBankcard ")
                utils.navigateTo("/pages/user/mine/info/bankcard/bankcard");
            },
            goUserHome() {
                if (!auth.checkLogin()) {
                    this.checkUnionidLogin();
                    return;
                } else {
                    utils.navigateTo('/pages/user/mine/info/userinfo/userinfo');
                }
            },
            onLogout() {
                log.debug("logout")
                auth.loginOut();
                api.user.addEntryLog(2);
                this.login = false;
                this.userInfo = {};
            },
            goIdcard(){
                if (!auth.checkLogin()) {
                    this.goLogin();
                    return;
                }
                utils.navigateTo("/pages/user/mine/info/idcard/idcard");
            },
            goFeedback() {
                utils.navigateTo("/pages/user/mine/feedback/feedback");
            },
            goDebugPage(){
                utils.navigateTo("/pages/index/debug");
            },

            goContact() {
                if (!auth.checkLogin()) {
                    this.goLogin();
                    return;
                }
                if (!this.login) {
                    this.processLogin();
                    return;
                }
                utils.navigateTo("/pages/user/contact/contact");
            },
            scanCodeTest(){
                uni.scanCode({
                    onlyFromCamera: true,
                    success (res) {
                        console.log(res)
                        if (res.scanType == "WX_CODE") {
                            log.debug("WX_CODE", res)
                            utils.navigateTo("/"+res.path); //直接跳转对应页面
                            return;
                        } else if (res.scanType == "QR_CODE") {
                            log.debug("QR_CODE", res)
                            const q = decodeURIComponent(res.result);
                            log.debug("QR_CODE q", q)
                            if (!utils.isEmpty(q) && q != "undefined") {
                                utils.navigateTo("/pages/attend/attend/attend?q="+encodeURIComponent(q));
                                return;
                            }
                        }
                        utils.toast("小程序码不规范");

                    }
                })
            }


        }
    }
</script>

<style lang="scss">
    page {
        background-color: #F8F8F8;
    }

    .content {
        margin-left: 32rpx;
        margin-right: 32rpx;
        background-color: #FFFFFF;
    }

    .user-unlogin-button {
        background-color: #FFF;
    }

    .user-unlogin-button::after {
        border: none;
    }


    .user-login-tip {
        min-height: 40px;
        padding: 32px 24px;
        font-weight: 700;
        color: rgba(0, 0, 0, .9);
        color: var(--weui-FG-0);
        -webkit-flex-direction: column;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        text-align: center;
    }

    .user-card{
        display: flex;
        justify-content: space-between;

    }

    .user-info {
        position: relative;
        display: flex;
        padding-top: 32rpx;
        padding-bottom: 32rpx;
        align-items: center;
        line-height: 1.5;
    }

    .user-info .left {
        /* flex-basis: 128rpx; */
        /* margin-left:24rpx; */
        display: flex;
        flex-direction: column;
    }

    .user-info .right {
        /* flex-basis: 128rpx; */
        width: 100%;
        /* margin-top:22rpx; */
        margin-left: 24rpx;
        display: flex;
        flex-direction: column;
    }

    .user-info .avatar {
        width: 128rpx;
        height: 128rpx;
        border-radius: 64px;
    }


    .user-name {
        font-size: 40rpx;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        max-width: 460rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-bottom: 8rpx;
        text-align: left;
    }

    .user-desc-home {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    .user-desc {
        font-size: 24rpx;
        font-weight: 400;
        color: rgba(145, 145, 147, 1);
        max-width: 360rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .mp{
        display: flex;
        align-items: flex-start;
        align-content: flex-start;
        justify-content: flex-start;
        justify-items: flex-start;
    }

    .user-menu{

        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 16rpx 0;
        margin: 16rpx 0;
        background-color: #FFF;
        font-size: 28rpx;
        .col{
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }

    .user-home {
        display: flex;
        color: var(dx-color-blue);
        font-size: 24rpx;
        align-items: center;
    }

    .btn-login{
        margin: 32rpx;
    }

    .develop-env{
        margin-top: 32rpx;
        display: flex;
        color: red;
        align-content: center;
        align-items: center;
        justify-content: center;
    }

</style>
