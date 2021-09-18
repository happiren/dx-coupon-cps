<template>
	<view class="wrap" :style="theme.bgColorStyle">
		<u-navbar :is-back="false" :border-bottom="false" :is-fixed="true" title=" " :background="background">
			<view class="slot-wrap">
				<view class="center">
					<u-tabs :list="activities" :is-scroll="false" name="title" :current="current" @change="change"
					 bg-color="background.backgroundColor" inactive-color="#FFF" active-color="#FFF"></u-tabs>
				</view>
			</view>
		</u-navbar>
		<view class="content">
			<!-- 正文内容 -->
			<view class="top">
				<image :src="theme.topBgImg" mode="widthFix"></image>
			</view>
			<view class="center">
				<!-- 导购三标栏 -->
				<view class="center-top">
					<image :src="theme.navigateBgImg" mode="widthFix"></image>
					<view class="y y1" :style="theme.bgColorStyle"></view>
					<view class="y y2" :style="theme.bgColorStyle"></view>
				</view>
				<!-- 二维码 -->
				<view class="center-middle" v-if="qrcode">
					<image  :src="qrcode" :show-menu-by-longpress="true"></image>
				</view>

				<view class="center-bottom" :style="theme.topBtnColorStyle" v-for="(item, index) in coupons" :key="index" @click="getCoupon(item)">
					<text v-if="item.title">{{item.title}}</text>
					<text v-else="item.title">点击领红包{{coupons.length > 1 && index > 0 ? index : ""}}</text>
				</view>
			</view>
			<view class="bottom">
<!--				<view class="btn flex justify-between">-->
<!--					<view :style="theme.bottomLeftBtnStyle" @click="shareImgClick">分享赚钱</view>-->
<!--					<view :style="theme.bottomRightBtnStyle" @click="cpClipboard">复制文案</view>-->
<!--				</view>-->
				<view class="bottom-text">
					注意事项:<br />
					1.每个手机号每天可领一次，红包金额随机发放;<br />
					2.多种类型的红包可同时领，下单时选择最大金额红包使用;<br />
					3.饿了么绑定的手机号，需与领券登录的手机号—致;<br />
				</view>
			</view>
		</view>
		<dx-tabbar v-model="tabBarIndex"></dx-tabbar>
	</view>
</template>

<script>
	import auth from '@/common/auth.js'
	import log from '@/common/log-util.js'
	import utils from '@/common/utils.js'
	import api from '@/common/api-util.js'
	import shareHb from '../../components/share_hb2/share_hb2.vue'
	import DxTabbar from "../../components/dx-tabbar/dx-tabbar";

	export default {
		components: {
			DxTabbar,
			shareHb
		},
		data() {
			return {
				tabBarIndex:1,
				loading: false,
				activities: [
						{
					"title": "外卖",
					}
				],
				coupons: null,//[]
				current: 0,
				qrcode: null,
				background: {},
				theme: {},
				themes: [{ //
						"backgroundColor": "#027ed8",
						"bgColorStyle": "background-color:#027ed8",
						"topBgImg": "../../static/ele_bg_hb.jpg",
						"navigateBgImg": "../../static/ele1-center-top.jpg",
						"topBtnColorStyle": "background-color: #1280d9;color: #fff;",
						"bottomLeftBtnStyle": "color: #0f5195;background-color: #fadca0;",
						"bottomRightBtnStyle": "color: #194a5d;background-color: #fff;",
					},
					{ //美团商超颜色
						backgroundColor: '#12c293',
						bgColor: 'background-color:#4edba6',
						topBgImg: '../../static/ele2_bg_hb.jpg',
						navigateBgImg: '../../static/ele2_ydl.jpg',
						topBtnColor: 'background-color: #11c296;color: #fff;',
						bottomLeftBtnStyle: 'color: #0f5195;background-color: #fadca0;',
						bottomRightBtnStyle: 'color: #194a5d;background-color: #fff;',
					},
				],
			}
		},
		computed: {
			appInfo() {
				return this.$store.state.appInfo
			}
		},
		onShow(e) {
			if (this.$store.getters.tabParam) {
				this.current = parseInt(this.$store.getters.tabParam);
				this.$store.commit('tabParam', "");
			}
			// let tabParam = uni.getStorageSync("tabParam");
			// if (tabParam) {
			// 	this.current = parseInt(tabParam);
			// 	uni.setStorageSync("tabParam", "");
			// }
		},
		onLoad(options) {
			this.loading = false;
			api.coupon.eleCoupon().then(res => {
				if (res.code = api.SUCCESS) {
					this.loading = true;
					this.activities = res.data;
					// this.current = 0;
					this.change(this.current);
				}
			})
		},
		methods: {

			async onShareAppMessage(res) {
				let coverImage = await api.common.miniappShareCover();
				log.debug("coverImage", coverImage);
				return {
					title: "爱享饿了么优惠券",
					path: "pages/ele/ele" ,
					imageUrl: coverImage
				}
			},


			getCoupon(item){
				if (!item) {
					return;
				}
				if (item.appid) {
					log.debug("go miniapp", item)
					utils.navigateToMiniProgram(item.appid, item.path);

				} else if (item.url){
					utils.navigateTo("/pages/webview/webview/webview?url=" + item.url);
				}
			},

			// 复制到剪切板
			cpClipboard() {
				utils.setClipboardData();
			},

			// 切换
			change(index) {
				this.current = index;

				console.log("activity",this.activities[this.current])

				this.theme = JSON.parse(this.activities[this.current].theme);
				this.qrcode = this.activities[this.current].qrcode;
				this.background.backgroundColor = this.theme.backgroundColor
				this.coupons = this.activities[this.current].coupons;

			},

		},
	}
</script>

<style scoped lang="scss">
	.wrap {
		// height: 100vh;

		.content {
			.top {
				width: 750rpx;

				image {
					width: 100%;
					vertical-align: bottom;
				}
			}

			.center {
				background-color: #fff;
				width: 650rpx;
				margin: 0 auto;
				padding-bottom: 50rpx;
				border-radius: 20rpx;
				text-align: center;

				.center-top {
					padding: 20rpx;
					border-bottom: dashed 1px rgba($color: #ccc, $alpha: 1);
					position: relative;

					image {
						width: 100%;
					}

					.y {
						width: 60rpx;
						height: 60rpx;
						position: absolute;
						bottom: 0;
						border-radius: 50%;
					}

					.y1 {
						left: 0;
						transform: translate(-50%, 50%);
					}

					.y2 {
						right: 0;
						transform: translate(50%, 50%);
					}

				}

				.center-middle {
					margin: 40rpx 0 20rpx;

					image {
						width: 340rpx;
						height: 340rpx;
					}
				}

				.center-bottom {
					width: 550rpx;
					margin: 20rpx auto 0;
					font-size: 42rpx;
					height: 100rpx;
					line-height: 100rpx;
					text-align: center;
					border-radius: 100rpx;
				}


			}

			.bottom {
				width: 650rpx;
				margin: 30rpx auto 0;
				padding-bottom: 100rpx;

				.btn {
					view {
						width: 47%;
						text-align: center;
						line-height: 80rpx;
						font-size: 36rpx;
						letter-spacing: 4rpx;
						border-radius: 10rpx;
					}

				}

				.bottom-text {
					color: #fff;
					line-height: 50rpx;
					margin-top: 40rpx;

					text {
						color: rgb(236, 76, 21)
					}
				}
			}
		}

	}

	.slot-wrap {
		display: flex;
		align-items: center;
		width: 750rpx;

		.center {
			width: 300rpx;
			margin:  0 auto;
		}

	}
</style>
