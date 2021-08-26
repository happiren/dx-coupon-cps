<template>
	<view class="wrap" :style="theme.bgColor">
		<u-navbar :is-back="false" :border-bottom="false" title=" " :background="background">
			<view class="slot-wrap">
				<view class="center">
					<u-tabs name="cate_name" count="cate_count" :list="list" :is-scroll="false" :current="current" @change="change"
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
				<view class="cen-top">
					<image :src="theme.navigateBgImg" mode="widthFix"></image>
					<view class="y y1" :style="theme.bgColor"></view>
					<view class="y y2" :style="theme.bgColor"></view>
				</view>
				<!-- 二维码 -->
				<view class="cen-cen">
					<image v-if="coupons" :src="coupons[0].qrcode" :show-menu-by-longpress="true"></image>
				</view>

				<view class="center-bottom" :style="theme.topBtnColor" v-for="(item, index) in coupons" :key="index" @click="getCoupon(item)">
					<text v-if="item.title">{{item.title}}</text>
					<text v-else="item.title">领红包点外卖{{coupons.length > 1 ? index : ""}}</text>
				</view>


<!--				<view v-if="is_pay">-->
<!--					<view class="cen-bottom" :style="theme.topBtnColor" @click="jump">领红包点外卖</view>-->
<!--				</view>-->
<!--				<view v-else>-->
<!--					<view class="cen-bottom" :style="theme.topBtnColor">长按二维码保存到相册</view>-->
<!--				</view>-->

			</view>
			<view class="bottom">
<!--				<view class="btn flex justify-between">-->
<!--					<view :style="theme.bottomLeftBtnStyle" @click="shareImgClick">分享赚钱</view>-->
<!--					<view :style="theme.bottomRightBtnStyle" @click="cpClipboard">复制文案</view>-->
<!--				</view>-->
				<view class="bottom-text">
					返利注意事项:<br />
					1.美团外卖，必须使用带有渠道专享标记的优惠卷才有返利<br />
					2.领券后在红包有效期内下单均有返利;<br />
					3.美团绑定的手机号，需与领券登录的手机号—致;<br />
					4.下单后第二天上午10点会有订单返现提醒<br />
					5.无论美团新老用户,每个手机号每天可领一次,红包金额随机发放;
				</view>
			</view>
		</view>

		<share-hb :bgImg="appInfo.poster_bg" :ewmImg="current_data[current].ewm" :isshow="isshow_share" @cloose_share_img="clooseShare"
		 v-if="isshow_share"></share-hb>



	</view>
</template>

<script>
	import auth from '@/common/auth.js'
	import log from '@/common/log-util.js'
	import utils from '@/common/utils.js'
	import api from '@/common/api-util.js'
	import shareHb from '../../components/share_hb2/share_hb2.vue'

	export default {
		components: {
			shareHb
		},
		data() {
			return {
				notitle: '',
				list: [{
					name: '外卖',
					activity_material_id: '20150318020002597'
				}],
				coupons:null,
				current: 0,
				background: {},
				theme: {},
				current_data: [{
					ewm: '',
					url: ''
				}, {
					ewm: '',
					url: ''
				}],
				themes: [{ //

						backgroundColor: '#feac00',
						bgColor: 'background-color:#fdc413',
						topBgImg: '../../static/meituan2_bg_hb.jpg',
						navigateBgImg: '../../static/meituan2_ydl.jpg',
						topBtnColor: 'background-color: #ff6100;color: #fff;',
						bottomLeftBtnStyle: 'color: #fff;background-color: #ff4401;',
						bottomRightBtnStyle: 'color: #1c4c60;background-color: #fff;',
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

				isshow_share: false,
				is_pay: true,
			}
		},
		computed: {
			appInfo() {
				return this.$store.state.appInfo
			}
		},
		onShow(e) {
			this.current = 0;
			this.change(this.current)
			this.is_pay = true
		},
		onLoad() {
			this.is_pay = true
			api.coupon.meituanCoupon().then(res => {
				if (res.code = api.SUCCESS) {
					this.coupons = res.data;
				}
			})
		},
		methods: {
			async onShareAppMessage(res) {
				let coverImage = await api.common.miniappShareCover();
				log.debug("coverImage", coverImage);
				return {
					title: "爱享美团优惠券",
					path: "pages/ele/ele" ,
					imageUrl: coverImage
				}
			},
			//打开分享图文
			shareImgClick() {
				this.isshow_share = true
			},
			// 关闭
			clooseShare() {
				this.isshow_share = false
			},
			getCoupon(item){
				if (!item) {
					return;
				}
				if (item.appid) {
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
				this.background.backgroundColor = this.themes[this.current].backgroundColor
				this.theme = this.themes[this.current];
				this.getactivi()
			},
			// 数据请求
			getactivi() {

				if (!this.current_data[this.current].ewm) {
					// uni.showLoading({
					// 	title: '加载中',
					// 	mask: true
					// })
					const that = this
					let data = {
						activity_material_id: this.list[this.current].activity_material_id
					}
					// this.$http.index.getItemLink(data)
					// 	.then(res => {
					// 		console.log('饿了么获取', res);
					// 		that.$set(that.current_data[that.current], 'ewm', res.data.data.wx_qrcode_url)
					// 		that.$set(that.current_data[that.current], 'url', res.data.data.wx_miniprogram_path)
					// 		uni.hideLoading()
					// 	})
					// uni.hideLoading();
				}

			},
			//小程序跳转
			jump() {
				uni.navigateToMiniProgram({
					appId: 'wxece3a9a4c82f58c9',
					path: this.current_data[this.current].url
				})
				console.log('我点击了跳转');
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

				.cen-top {
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

				.cen-cen {
					margin: 40rpx 0 20rpx;

					image {
						width: 340rpx;
						height: 340rpx;
					}
				}

				.center-bottom {
					width: 550rpx;
					margin: 10rpx auto 0;
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
