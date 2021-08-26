<template>
	<view class="container">
		<u-form ref="uForm" >
<!--			<view class="title">忘记密码</view>-->
			<u-gap height="36"></u-gap>
			<view class="phone-tips">验证码将发送至手机&nbsp;{{phoneNum || ""}}</view>
			<view class="code-cell" style="justify-content: space-between">
				<view class="title-code">验证码</view>

					<u-input v-model="code" placeholder="请输入验证码" type="number" style="margin-right: 32rpx"/>

				<view>
					<u-verification-code :seconds="seconds"  ref="uCode" @change="codeChange" start-text="获取验证码" change-text="x秒" end-text="重新获取"></u-verification-code>
					<u-button @click="getCode" type="primary" size="mini">{{tips}}</u-button>
				</view>
			</view>

			<u-gap height="36"></u-gap>
			<view class="phone-tips">密码长度需8-16个字符</view>
			<view class="code-cell">
				<view class="title-code">新密码</view>
				<view style="flex: 1 0">
					<u-input v-model="password" type="password" placeholder="请输入新密码" class="input-password" />
				</view>
			</view>
			<u-line></u-line>
			<view class="code-cell">
				<view class="title-code">确认密码</view>
				<view style="flex: 1 0">
					<u-input v-model="confirmPassword" type="password" placeholder="请确认新密码" class="input-password" />
				</view>

			</view>

		</u-form>
		<view style="margin: 64rpx 128rpx">
			<u-button size="default" :disabled="disabled" shape="square" type="primary" @click="resetPassword()">确定</u-button>
		</view>
	</view>
</template>

<script>
	import auth from '@/common/auth.js'
	import log from '@/common/log-util.js'
	import utils from '@/common/utils.js'
	import api from '@/common/api-util.js'
	import ErrorCode from '@/api/error-code.js';
	import md5Libs from "../../../uview-ui/libs/function/md5";
	import UGap from "../../../uview-ui/components/u-gap/u-gap";
	import ULine from "../../../uview-ui/components/u-line/u-line";


	export default {
		components: {ULine, UGap},
		data() {
			return {
				tips:"",
				userInfo: {},
				password:"",
				confirmPassword:"",
				disabled:true,
				seconds:60,
				key:"",
				code:"",
			}
		},
		watch: {
			password:function(password){
				if (!utils.isEmpty(password) && !utils.isEmpty(this.confirmPassword)) {
					this.disabled = false;
				} else {
					this.disabled = true;
				}
			},
			confirmPassword:function (confirmPassword) {
				if (!utils.isEmpty(this.password) && !utils.isEmpty(confirmPassword)) {
					this.disabled = false;
				} else {
					this.disabled = true;
				}
			}
		},

		onLoad(options) {
			if(!auth.checkLogin()){
				utils.toast("用户未登录");
				return;
			}
			auth.getUserInfo().then(res => {
				this.userInfo = res;
			})
		},

		onShow(){

		},

		computed: {
			phoneNum() {
				if (this.userInfo && this.userInfo.phone) {
					let phone = this.userInfo.phone;
					return phone.substring(0,3) + "****" + phone.substring(7,11);
				} else {
					return ""
				}
			}
		},
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if(this.$refs.uCode.canGetCode) {
					log.debug(this.userInfo)


					if (!this.$u.test.mobile(this.userInfo.phone)) {
						utils.toast("手机格式错误");
						return;
					}
					var sign = md5Libs.md5(this.userInfo.phone+":2:L9oCAcXMTj8PVrHWUEM4rz7AKKoaHPTx")
					log.debug("sign raw:" + this.userInfo.phone+":2:L9oCAcXMTj8PVrHWUEM4rz7AKKoaHPTx");
					log.debug("sign:" + sign);
					api.common.getMsgCode(this.userInfo.phone, 2, sign.toUpperCase()).then(res => {
						if (res.code == api.SUCCESS) {
							this.key = res.data.sms_key;
							this.$refs.uCode.start();
						} else {
							utils.toast(api.getErrorMessage(res.code));
						}
					})
				} else {
					utils.toast("请稍后发送");
				}
			},
			resetPassword(){
				if (this.password.length < 8 || this.password.length > 16) {
					utils.toast("密码格式错误");
					return;
				}
				if (this.password != this.confirmPassword) {
					utils.toast("两次输入的密码不一致");
					return;
				}
				api.user.resetPassword(this.userInfo.phone, this.key, this.code, this.password).then(res => {
					if (res.code == api.SUCCESS) {
						utils.toast("修改密码成功");
						this.$store.commit('token', res.data.token);
						uni.setStorageSync('token', res.data.token);
						utils.switchTab("/pages/user/mine/mine");
					}else if (res.code == ErrorCode.ERROR_CODE_ERROR) {
						utils.toast("验证码错误");
					} else if (res.code == ErrorCode.ERROR_CODE_EXPIRE) {
						utils.toast("验证码失效");
					} else if (res.code == ErrorCode.ERROR_UNKNOWN_USER) {
						utils.toast("用户不存在");
					} else {
						utils.toast(api.getErrorMessage(res.code));
					}
				})
			}
		}

	}
</script>

<style lang="scss">
	page{
		background-color: #F5F5F5;
	}
	.container{
		/*margin: 32rpx;*/
	}

	.title{
		font-weight: 700;
		font-size: 17px;
		color: rgba(0,0,0,0.7);
	}
	.phone-tips{
		line-height: 1.5;
		font-size: 32rpx;
		color: #9B9B9B;
		margin-left: 40rpx;
		margin-bottom: 16rpx;
	}
	.tips{
		line-height: 1.7;
		font-size: 14px;
		color: #B1B1B1;
		margin-top: 64rpx;
	}

	.input-password{
		/*border-bottom: solid 1px #000000;*/
	}

	.forget-password{
		display: inline-block;
		margin-top: 32rpx;
		color: #B1B1B1;
		font-size: 14px;
	}
	.code-cell{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		background-color: #FFF;
		padding: 16rpx 40rpx;
		.title-code{
			color: #303133;
			font-size: 34rpx;
			margin-right: 56rpx;
		}
	}

</style>
