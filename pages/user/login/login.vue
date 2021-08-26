<template>
	<view>
		<view>
			<view style="margin: 58rpx;">
				<view class="title">
					<view>欢迎使用</view>
					<view class="logo-name">携筑</view>
				</view>
				<view class="desc">建筑行业的互联网平台</view>
				<view v-if="title" class="sub-title">{{title}}</view>
				<view style="display: flex; justify-content: center; margin: 120rpx 0">
					<u-image src="http://oss.jianyb.com/cpms/app/icon/logo.png" width="200" mode="widthFix" border-radius="8"></u-image>
				</view>

			</view>

<!--			<u-image src="/static/images/login.jpg"></u-image>-->
<!--			<image src="/static/images/content-empty-1.png"></image>-->
		</view>
		<u-gap height="60"></u-gap>
		<view>
			<view v-if="!weixin" class="phone-login">
				<u-input v-model="phone" type="phone"  :border="false" placeholder="手机号" class="input-password" />
				<u-line></u-line>
				<u-input v-model="password" type="password" :border="false" placeholder="密码" class="input-password" />
				<u-line></u-line>
				<view class="modify-password">
					<view class="item" @click="goModifyPassword()">修改密码</view>
					<view class="item" @click="goForgetPassword()">忘记密码</view>
				</view>

				<view v-if="!weixin" class="btn-login">
					<u-button @click="login()" class="btn-submit"  :disabled="!checked" size="default" shape="circle" type="primary">登录</u-button>
				</view>
			</view>

			<view>
				<view class="dx-agree">
					<view class="dx-agree-text">
						<u-checkbox shape="circle" size="48"
								@change="checkboxChange"
								v-model="checked"
						></u-checkbox>
						<!--以下逻辑也可以正常使用，可以优化减少弹窗手机号获取操作 -->
<!--						<view v-if="checked" @click="checked = !checked">-->
<!--							<button class="check-btn">-->
<!--								<u-icon size="56" name="/static/images/icon-checked.png"></u-icon>-->
<!--							</button>-->
<!--						</view>-->
<!--						<view v-if="!checked">-->
<!--							<button v-if="!canIUseGetUserProfile" class="check-btn"  open-type="getUserInfo" @getuserinfo="getUserInfo" >-->
<!--								<u-icon size="48" name="/static/images/icon-uncheck.png"></u-icon>-->
<!--							</button>-->
<!--							<button v-if="canIUseGetUserProfile" class="check-btn"  @click="getUserInfo" >-->
<!--								<u-icon size="48" name="/static/images/icon-uncheck.png"></u-icon>-->
<!--							</button>-->
<!--						</view>-->

						<text style="margin-left:0rpx">
							阅读并同意
						</text>
						<navigator class="word-blue"  :url="`/pages/webview/webview/webview?url=${agreementUrl}`">《使用政策》</navigator><text>和</text><navigator class="word-blue" :url="`/pages/webview/webview/webview?url=${privacyPolicyUrl}`">《隐私协议》</navigator>
					</view>
				</view>
			</view>
			<view class="background">

			</view>

			<view v-if="weixin" style="width: 480rpx; margin: auto">
				<u-button v-if="!canIUseGetUserProfile" style="width: 640rpx" :class="['wechat-button',  checked ? 'wechat-login':'wechat-disable'] "  type="primary"  shape="circle" size="default" :disabled="!checked" open-type="getUserInfo" @getuserinfo="getUserInfo">
					微信用户一键登录
				</u-button>
				<u-button v-if="canIUseGetUserProfile" style="width: 640rpx" :class="['wechat-button',  checked ? 'wechat-login':'wechat-disable'] "  type="primary"  shape="circle" size="default" :disabled="!checked" @click="getUserInfo">
					微信用户一键登录
				</u-button>

			</view>
			<view>

			</view>
		</view>
		<dx-modal v-model="showGetPhoneModal" content="一键关联手机号登录"  :content-style="{'color':'#000', 'font':'32rpx', 'font-weight': '500'}" :show-title="true" :show-cancel-button="true" @cancel="cancelGetPhone">
			<button open-type="getPhoneNumber" class="u-reset-button" style="color: #fff" slot="confirm-button" @getphonenumber="getUserPhoneNumber">同意</button>
<!--			<u-button type="default" slot="cancel-button"  size="medium" >取消</u-button>-->
<!--			<u-button type="primary" slot="confirm-button" open-type="getPhoneNumber" size="medium" @getphonenumber="getUserPhoneNumber">同意</u-button>-->
		</dx-modal>


	</view>
</template>

<script>
	import config from "@/config/config.js"
	import auth from '@/common/auth.js'
	import log from '@/common/log-util.js'
	import utils from '@/common/utils.js'
	import api from '@/common/api-util.js'
	import UModal from "../../../uview-ui/components/u-modal/u-modal";
	import UButton from "../../../uview-ui/components/u-button/u-button";
	import UGap from "../../../uview-ui/components/u-gap/u-gap";
	import UImage from "../../../uview-ui/components/u-image/u-image";
	import UIcon from "../../../uview-ui/components/u-icon/u-icon";
	export default {
		data() {
			return {
				checked: false,
				title:"",
				canIUseGetUserProfile: false,
				loginNavigateBack: false,
				privacyPolicyUrl: config.privacy,
				agreementUrl: config.agreement,
				showGetPhoneModal: false,
				wxUserInfo: null,
				wxUserInfoIv:null,
				wxUserInfoEncryptedData:null,
				wxCode: null,
				wxPhoneIv:null,
				wxPhoneEncryptedData: null,
				weixin: false,
				phone:"",
				password:"",
			}
		},
		components: {
			UIcon,
			UGap,
			UButton,
			UImage,
			UModal,
		},
		onLoad(options) {
			this.title = decodeURIComponent(options.title);
			if (this.title == "undefined") {
				this.title = "";
			}
			this.loginNavigateBack = options.loginNavigateBack ? true: false;
			//#ifdef MP-WEIXIN
			this.weixin = true;
			//#endif
			if (wx.getUserProfile) {
				const version = wx.getSystemInfoSync().SDKVersion
				if (utils.compareVersion(version, '2.10.4') > 0) {
					log.debug("sdk > 2.10.4")
					this.canIUseGetUserProfile = true;
				}
			}

			//使用代码检测一遍，如果已经登录则直接跳转
			auth.getUserInfo().then(info => {
				log.debug("user info", info)
				if (info) {
					this.loginCallback();
				}
			});

			// //必须要提前登陆获取code，否则在获取用户信息和手机号时将可能刷新code将可能导致手机号获取失败
			// uni.login({
			// 	provider: "weixin",
			// 	success: (res => {
			// 		let code = res.code;
			// 		this.wxCode = code;
			//
			// 	})
			// });
		},

		onShow(){

		},
		methods: {
			checkboxChange(e) {
				let that = this;
				console.log(e.value);
				uni.login({
					provider: "weixin",
					success: (res => {
						that.wxCode = res.code;
						//暂时不做调整
					}),
					fail: (res) => {
						// utils.hideLoading("加载中...");
						// utils.toast("微信登录失败");
					}
				});
			},
			onUserInfoClick(){

			},
			getUserInfo(e) {
				if (!e) {
					utils.toast("获取用户信息失败");
					return;
				}

				var that = this;


				if (this.canIUseGetUserProfile) {
					log.debug("wx.getUserProfile login")
					wx.getUserProfile({
						desc: '用于完善用户资料',
						success(info_res) {
							that.checked = true;
							that.showGetPhoneModal = true;
							console.log(info_res)
							that.wxUserInfoIv = info_res.iv;
							that.wxUserInfoEncryData = info_res.encryptedData;
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
							that.checked = true;
							that.showGetPhoneModal = true;
							console.log(info_res)
							that.wxUserInfoIv = info_res.iv;
							that.wxUserInfoEncryData = info_res.encryptedData;
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



				uni.login({
					provider: "weixin",
					success: (res => {
						let code = res.code;
						that.wxCode = code;
						//暂时不做调整
					}),
					fail: (res) => {
						// utils.hideLoading("加载中...");
						utils.toast("微信登录失败");
					}
				});
			},
			cancelGetPhone(){
				this.showGetPhoneModal = false;
				utils.toast("请允许获取手机号登录")
			},

			loginCallback() {
				log.debug("loginCallback");
				if (this.loginNavigateBack) {
					return utils.navigateBack();
				} else {
					uni.switchTab({
						url:"/pages/user/mine/mine"
					});
				}
			},
			getUserPhoneNumber(e){
				let that = this;
				this.showGetPhoneModal = false;
				// log.debug("getUserPhoneNumber");
				// log.debug(e);
				// log.debug(e.detail.iv)
				// log.debug(e.detail.encryptedData)
				if (utils.isEmpty(e.detail.iv)) {
					api.common.addErrorLog(2, "获取手机号失败无法登陆", "wxPhoneIv empty");
					utils.toast("获取手机号失败");
					return ;
				}
				this.wxPhoneIv = e.detail.iv;
				this.wxPhoneEncryptedData = e.detail.encryptedData;
				if (!this.wxCode) {
					utils.toast("用户授权code为空");
					api.common.addErrorLog(2, "用户授权code为空无法登陆", "wxCode empty");
					return ;
				}
				if (!this.wxUserInfoIv || !this.wxUserInfoEncryData) {
					api.common.addErrorLog(2, "获取用户信息失败无法登陆", "wxUserInfoIv or wxUserInfoEncryData empty");
					utils.toast("请先获取用户信息");
					return ;
				}
				log.debug("register info", this.wxPhoneIv, this.wxPhoneEncryptedData, this.wxUserInfoIv, this.wxUserInfoEncryData, this.wxCode)
				auth.register(that.wxPhoneIv, that.wxPhoneEncryptedData, that.wxUserInfoIv, that.wxUserInfoEncryData, that.wxCode, that.loginCallback);
				//注册或者登陆
				api.user.addEntryLog(1);

			},
			goModifyPassword(){
				utils.navigateTo("/pages/user/setting/modifyPassword")
			},
			goForgetPassword(){
				utils.navigateTo("/pages/user/setting/forgetPassword")
			},
			login(){
				log.debug("login");
				if (!this.$u.test.mobile(this.phone)) {
					utils.toast("手机格式错误");
					return;
				}
				auth.phoneLogin(this.phone, this.password);
			}
		}

	}
</script>

<style lang="scss">
	.background{
		position: fixed;
		bottom: 0;
		width: 750rpx;
		height: 250rpx;
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: bottom center;
		background-image: url("http://oss.jianyb.com/cpms/app/icon/login/background.png");
	}
	.title{
		display: flex;
		font-size: 40rpx;
		font-weight: 400;
		color: #343434;
		line-height: 1.4;
	}
	.logo-name{
		font-size: 42rpx;

		margin-left: 22rpx;
		font-weight: 700;
		color:#343434;

	}
	.desc{
		color: #737373;
		font-size: 16px;
		margin: 16rpx 0;
	}
	.sub-title{
		font-size: 14px;
		margin: 16rpx 0;
	}
	.word-blue{
		color: #2979ff;
	}
	.phone-login{
		margin: 0 64rpx;

	}
	.modify-password {
		display: flex;
		justify-content: flex-end;
		margin: 32rpx 0;
		color: #A1A1A1;
	}
	.modify-password .item{
		margin-left: 32rpx;
	}
	.btn-login{
		margin: 44rpx 0 16rpx 0;
	}
	.check-btn{
		background-color: #FFF;
		padding: 0;
		line-height: 1;
		border-radius:0;
	}
	.modal{
		height: auto;
		overflow: hidden;
		font-size: 32rpx;
		background-color: #fff;
	}
	.modal-title{
		padding-top: 48rpx;
		padding-bottom: 48rpx;
		font-weight: 500;
		text-align: center;
		color: #0d0d0d;
	}
	.modal-footer{
		display: flex;
	}
	.modal-btn{
		flex: 1;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 32rpx;
		box-sizing: border-box;
		cursor: pointer;
		text-align: center;
		border-radius: 0;
		background-color: #FFF;
	}

	.wechat-button{
		margin: 32rpx;
		margin: 32rpx;
		width: 640rpx;
	}
	.wechat-login {
		color: #FFF;
		background-color: #00C777;
	}
	.wechat-disable {
		color: #FFF;
		background-color: #AAAAAA;
	}

	.modal-btn-hover {
		background-color: rgb(230, 230, 230);
	}

</style>
