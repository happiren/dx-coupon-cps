<template>
	<view>
		<view class="content">
			<u-form :model="form" ref="uForm" >
				<u-gap height="32"></u-gap>
				<view class="code-cell" style="justify-content: flex-start; ">
					<view class="title-code" style="margin-right: 70rpx">手机号</view>
					<u-input v-model="form.phone" placeholder="请输入新手机号" />

				</view>
				<u-line></u-line>
				<view class="code-cell">
					<view class="title-code">验证码</view>
					<u-input v-model="form.code" placeholder="请输入验证码" style="margin-right: 16rpx"/>
					<view>
						<u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange" start-text="获取验证码" change-text="x秒" end-text="重新获取"></u-verification-code>
						<u-button @click="getCode" type="primary" size="mini">{{tips}}</u-button>
					</view>
				</view>

<!--				<u-form-item label="手机号" :required="true" label-align="center" :label-width="130"><u-input v-model="form.phone" placeholder="请输入新手机号" /></u-form-item>-->
<!--				<u-form-item label="验证码" :required="true" label-align="center" :label-width="130" >-->
<!--					<view class="u-flex">-->
<!--						<u-input v-model="form.code" placeholder="请输入验证码" style="margin-right: 16rpx"/>-->
<!--						<u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange" start-text="获取验证码" change-text="x秒" end-text="重新获取"></u-verification-code>-->
<!--						<u-button @click="getCode" size="medium">{{tips}}</u-button>-->
<!--					</view>-->

<!--				</u-form-item>-->
			</u-form>
			<view style="margin: 32rpx 128rpx;">
				<u-button  type="primary" :ripple="false" shape="square" class="btn-change-phone" @click="changePhone()">修改手机号</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import auth from '@/common/auth.js'
	import log from '@/common/log-util.js'
	import utils from '@/common/utils.js'
	import api from '@/common/api-util.js'
	import md5Libs from "uview-ui/libs/function/md5";
	import UGap from "../../../../../uview-ui/components/u-gap/u-gap";
	import ULine from "../../../../../uview-ui/components/u-line/u-line";
	export default {
		components: {ULine, UGap},
		data() {
			return {
				userInfo:null,
				seconds: 60,
				tips: '',
				form:{
					phone:"",
					code:"",
					key:""
				}
			}
		},
		onLoad(){
			this.userInfo = auth.getLocalUserInfo();
		},
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if(this.$refs.uCode.canGetCode) {

					if (!this.$u.test.mobile(this.form.phone)) {
						utils.toast("手机格式错误");
						return;
					}

					var sign = md5Libs.md5(this.form.phone+":4:L9oCAcXMTj8PVrHWUEM4rz7AKKoaHPTx")
					log.debug("sign raw:" + this.form.phone+":4:L9oCAcXMTj8PVrHWUEM4rz7AKKoaHPTx");
					log.debug("sign:" + sign);
					api.common.getMsgCode(this.form.phone, 4, sign.toUpperCase()).then(res => {
						if (res.code == api.SUCCESS) {
							this.form.key = res.data.sms_key;
							this.$refs.uCode.start();
						} else {
							utils.toast(api.getErrorMessage(res.code));
						}
					})
				} else {
					utils.toast("请稍后发送");
				}
			},
			end() {
				// this.$u.toast('倒计时结束');
			},
			start() {
				// this.$u.toast('倒计时开始');
			},
			changePhone(){
				if (!this.$u.test.mobile(this.form.phone)) {
					utils.toast("手机格式错误");
					return;
				}
				if (this.form.code.length <= 0) {
					utils.toast("请输入验证码");
					return;
				}
				if (this.form.key.length <= 0) {
					utils.toast("请输入正确的验证码");
					return;
				}
				api.user.changPhone(this.form.phone, this.form.key, this.form.code).then(res => {
					if (res.code == api.SUCCESS) {
						this.$store.commit('userInfo', res.data.user);
						this.$store.commit('token', res.data.token);
						uni.setStorageSync('token', res.data.token);
						utils.toast("修改手机号成功");
						utils.navigateBack();
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

	.code-cell {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #FFF;
		padding: 16rpx 40rpx;

		.title-code {
			color: #303133;
			font-size: 34rpx;
			margin-right: 56rpx;
		}
	}


	.btn-change-phone{
		margin: 64rpx;
	}
</style>
