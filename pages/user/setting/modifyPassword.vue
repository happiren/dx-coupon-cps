<template>
	<view class="container">
		<u-form ref="uForm" >
<!--			<view class="title" @click="titleClick()">修改密码</view>-->
			<u-gap height="28"></u-gap>
			<view class="code-cell">
				<view class="title-code">原密码</view>
				<view style="flex: 1 0">
					<u-input v-model="oldPassword" type="password"  :border="false" placeholder="请输入旧密码" class="input-password" />
				</view>

			</view>
			<view class="tips">密码长度需8-16个字符</view>
			<view class="code-cell">
				<view class="title-code">新密码</view>
				<view style="flex: 1 0">
					<u-input v-model="newPassword" type="password"  :border="false" placeholder="请输入新密码" class="input-password" />
				</view>
			</view>
			<u-line></u-line>
			<view class="code-cell">
				<view class="title-code">确认密码</view>
				<view style="flex: 1 0">
					<u-input v-model="confirmPassword" type="password" :border="false" placeholder="请输入确认密码" class="input-password" />
				</view>
			</view>


			<view class="forget-password" @click="goForgetPassword()">
				忘记密码或没有密码
				<u-icon style="margin-left: 8rpx;" name="arrow-right" size="20" color="#B1B1B1"></u-icon></view>
		</u-form>
		<view style="margin: 64rpx 128rpx;">
			<u-button size="default" :disabled="disabled" shape="square" type="primary" @click="modifyPassword()">确定</u-button>
		</view>
	</view>
</template>

<script>
	import auth from '@/common/auth.js'
	import log from '@/common/log-util.js'
	import utils from '@/common/utils.js'
	import api from '@/common/api-util.js'
	import ErrorCode from '@/api/error-code.js';
	import UIcon from "../../../uview-ui/components/u-icon/u-icon";
	import UButton from "../../../uview-ui/components/u-button/u-button";
	import ULine from "../../../uview-ui/components/u-line/u-line";

	export default {
		components: {ULine, UButton, UIcon},
		data() {
			return {
				oldPassword:"",
				newPassword:"",
				confirmPassword: "",
				// disabled:true,
				titleClickCount: 0,
			}
		},
		computed: {
			disabled(){
				if (!utils.isEmpty(this.oldPassword) && !utils.isEmpty(this.newPassword) && !utils.isEmpty(this.confirmPassword)) {
					return false;
				} else {
					return true;
				}
			}
		},
		watch: {


			// oldPassword:function(oldPassword){
			// 	if (!utils.isEmpty(oldPassword) && !utils.isEmpty(this.newPassword) && !utils.isEmpty(this.confirmPassword)) {
			// 		this.disabled = false;
			// 	} else {
			// 		this.disabled = true;
			// 	}
			// },
			// newPassword:function (newPassword) {
			// 	if (!utils.isEmpty(this.oldPassword) && !utils.isEmpty(newPassword)) {
			// 		this.disabled = false;
			// 	} else {
			// 		this.disabled = true;
			// 	}
			// }
		},

		onLoad(options) {

		},

		onShow(){

		},
		methods: {
			titleClick(){

				this.titleClickCount = this.titleClickCount + 1;
				console.log("titleClick", this.titleClickCount)
				if (this.titleClickCount > 6){
					this.$store.commit('showDebugInfo', true);
					utils.toast("已开启日志显示调试");
				}
			},
			modifyPassword(){
				if(this.oldPassword.length < 8 || this.oldPassword.length > 16) {
					utils.toast("旧密码格式不正确")
					return;
				}
				if(this.newPassword.length < 8 || this.newPassword.length > 16) {
					utils.toast("新密码格式不正确")
					return;
				}
				if(this.newPassword != this.confirmPassword) {
					utils.toast("两次输入密码不一致")
					return;
				}
				api.user.modifyPassword(this.oldPassword, this.newPassword).then(res => {
					if (res.code == ErrorCode.ERROR_ACCOUNT_ERROR) {
						utils.toast("旧密码错误");
						return;
					} else if (res.code == api.SUCCESS) {
						utils.toast("修改密码成功");
						utils.navigateBack();
					} else {
						utils.toast(api.getErrorMessage(res.code));
					}
				})
			},
			goForgetPassword(){
				utils.navigateTo("/pages/user/setting/forgetPassword")
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
	.tips{
		line-height: 1.8;
		font-size: 14px;
		color: #9B9B9B;
		margin-top: 32rpx;
		margin-left: 32rpx;
		margin-bottom: 16rpx;
	}

	.input-password{
		/*border-bottom: solid 1px #000000;*/
	}

	.code-cell{
		display: flex;
		align-items: center;
		/*justify-content: space-between;*/
		justify-content: flex-start;
		background-color: #FFF;
		padding: 16rpx 40rpx;
		.title-code{
			color: #303133;
			font-size: 34rpx;
			margin-right: 56rpx;
		}
	}


	.forget-password{
		display: flex;
		align-items: center;
		align-content: center;
		margin-top: 32rpx;
		color: #9B9B9B;
		font-size: 14px;
		margin-left: 32rpx;
	}

</style>
