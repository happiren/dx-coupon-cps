<template>
	<view class="container">
		<view v-if="!login">
			<u-empty text="请先进行登录" mode="permission" ></u-empty>
			<view style="margin: 100rpx 48rpx">
				<u-button  @click="goLogin()" class="btn-submit"  size="default" shape="circle" type="primary">去登录</u-button>
			</view>
		</view>
		<view v-if="login">
			<view class="dx-flex-center" v-if="loading">
				<u-loading :show="true" mode="flower" size="50"></u-loading>
			</view>
			<view v-else="loading">
				<view class="card-message" v-for="(message, index) in messageList" :key="index" @click="onMessageClick(message)">
					<view v-if="message.type == 1" >
						<view class="body">
							<view class="title">
								<view class="title-word">
									{{message.title}}
								</view>
								<view class="time">{{message.time}}</view>
							</view>
							<view v-if="message.sub_title" class="sub-title">
								{{message.sub_title}}
							</view>
							<view class="text">
								<view class="u-line-1 info">{{message.content}}</view>
								<view class="more" v-if="message.action > 0">点击查看</view>
							</view>
						</view>
<!--						<view class="tail" v-if="message.action > 0">-->
<!--							<view>查看详情</view>-->
<!--							<u-icon  name="arrow-right" class="arrow"></u-icon>-->
<!--						</view>-->
					</view>
					<view v-if="message.type == 2">
						<view>
							<view v-if="message.url">
								<u-image :src="message.url"   mode="widthFix"></u-image>
							</view>
							<view class="body">
								<view class="title">
									<view class="title-word">
										{{message.title}}
									</view>
									<view class="time">{{message.time}}</view>
								</view>
								<view v-if="message.sub_title" class="sub-title">
									{{message.sub_title}}
								</view>
								<view v-if="message.content" class="text">

									<view class="u-line-1 info">{{message.content}}</view>
									<view class="more" v-if="message.action > 0">点击查看</view>
								</view>
							</view>
<!--							<view class="tail" v-if="message.action > 0">-->
<!--								<view>查看详情</view>-->
<!--								<u-icon name="arrow-right"  class="arrow"></u-icon>-->
<!--							</view>-->
						</view>
					</view>
				</view>
				<view v-if="noMoreFlag" style="margin-top: 16rpx; padding-bottom: 32rpx">
					<u-divider half-width="200" bg-color="#F5F5F5">没有消息了</u-divider>
				</view>
				<view v-if="dataEmptyFlag">
					<u-empty mode="message" text="消息列表为空"></u-empty>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import auth from '@/common/auth.js'
	import utils from '@/common/utils.js'
	import commonFun from '@/common/common-func.js'
	import api from '@/common/api-util.js'
	import log from '@/common/log-util.js'
	import UImage from "../../../uview-ui/components/u-image/u-image";
	import UEmpty from "../../../uview-ui/components/u-empty/u-empty";
	export default {
		components: {UEmpty, UImage},
		data() {
			return {
				login: false,
				loading:true,
				requesting: false,
				page: 1,
				messageList: [],
				noMoreFlag: false,
				dataEmptyFlag: false,

			}
		},
		onLoad(){
			this.login = auth.checkLogin();
			if (this.login) {
				this.loading = true;
				this.getMessage();
			} else {
				this.loading = false;
			}
		},
		onShow(){
			this.login = auth.checkLogin();
			if (this.login) {
				api.message.getSysMessageChat().then(res=> {
					if (res.code == api.SUCCESS) {
						if (res.data.unread_count > 0) {
							this.page = 1;
							this.noMoreFlag = false;
							this.dataEmptyFlag = false;
							this.requesting = false;
							this.messageList = [];

						} else {

						}
						this.getMessage();
					}
				})
			}

		},
		onReachBottom() {
			this.getMessage();
		},
		methods: {

			getMessage() {

				if (this.noMoreFlag == true || this.dataEmptyFlag == true) {
					return ;
				}
				if (this.requesting == true) {
					return ;
				}
				this.requesting = true;
				api.message.getSysMessageList(this.page).then(res => {
					this.loading = false;
					this.requesting = false;
					if (res.code == api.SUCCESS) {
						if (res.data.length == 0) {
							if (this.page == 1) {
								this.dataEmptyFlag = true;
							} else {
								this.noMoreFlag = true;
							}
							return;
						}
						if (this.page == 1) {

							//清空系统消息
							api.message.clearSysMessageChat().then(r => {
								if (r.code = api.SUCCESS){
									uni.hideTabBarRedDot({
										index: 2
									})
								}
							})
						}
						this.page = this.page + 1;
						for(var i=0; i<res.data.length; i++) {
							var message = res.data[i];
							message.time = utils.formatDateTime(message.created_at);
							this.messageList.push(message);
						}


					}
				})
			},
			onMessageClick(message) {
				log.debug(message)
				commonFun.clickNavigate(message.action, message.action_param)
			},
			goLogin() {
				utils.navigateTo("/pages/user/login/login?loginNavigateBack=1");
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F5F5;
	}
	.container{
		margin: 20rpx;
	}

	.card-message{
		background-color: #FFFFFF;
		overflow: hidden;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		/*padding: 16rpx 32rpx;*/
		/*border: solid 1px #F1F1F1;*/
	}
	.card-message .body{
		padding: 30rpx;
		/*padding: 16rpx 32rpx 0rpx 32rpx;*/
		/*background: linear-gradient(180deg, #000088 0%, #FFFFFF 100%);*/
	}

	.card-message .body .title{
		display: flex;
		justify-content: space-between;
		align-content: center;
		font-size: 16px;
		font-weight: 600;
		color: rgba(0,0, 0, 0.6);
		color: #2b85e4;
		line-height: 1.7;
	}

	.card-message .body .title .title-word{
		font-size: 34rpx;
		font-weight: 600;
		/*color: rgba(0,0, 0, 0.6);*/
		color: #3D3D3D;
		line-height: 1.5;
		max-width: 460rpx;
		overflow: hidden;
		white-space:nowrap;
		text-overflow:ellipsis;
	}

	.card-message .body .title .time{
		display: flex;
		align-content: center;
		align-items: center;
		font-size: 26rpx;
		font-weight: 500;
		color: #9F9F9F;
		line-height: 1.0;
		vertical-align: middle;
	}

	.card-message .body .sub-title{
		margin: 16rpx 0rpx;
		font-size: 30rpx;
		line-height: 1.5;
		/*color: #2D2D2D;*/
		color: #303133;
	}

	.card-message .body .text{
		margin: 8rpx 0rpx;
		font-size: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		/*color: #2D2D2D;*/
		/*color: #4B4B4B;*/
		color: #A6A6A6;
		.info{
			/*flex-basis: 500rpx;*/
		}
		.more{
			margin-left: 16rpx;
			color:#3A83FF;
			flex: 0 0;
			flex-basis: 112rpx;
			font-size: 28rpx;
		}

	}

	.card-message .tail{
		display: flex;
		align-items: center;
		position: relative;
		/*border-top: solid 1px #DDD;*/
		justify-content: space-between;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		width: 100%;
		/*padding: 0 32rpx 12rpx 32rpx;*/
		font-size: 28rpx;
		line-height: 54rpx;
		/*color: rgba(0, 0, 0, 0.7);*/
		color:#909399;
		background-color: #fff;
		text-align: left;
	}

	.card-message .tail .arrow{
		color: #C1C1C1;
	}


</style>
