<template>
	<view class="page">
		<!-- 搜索 -->
		<view class="search-head">
			<view class="back" @click="onBack">
				<text></text>
			</view>
			<view class="search">
				<text class="cuIcon-search"></text>
				<input type="text" v-model="keyword" placeholder="搜索商品" />
			</view>
			<view class="cut" @click="isList = !isList">
				<text class="iconfont" :class="isList?'icon-shitu01':'icon-shitu02'"></text>
			</view>
		</view>
		<!-- 筛选 -->
		<view class="screen-info">
			<view class="screen-list">
				<view class="list" :class="{'action':screenShow===0}" @click="onSynthesize(0)">
					<text>综合</text>
					<text class="iconfont icon-sanjiao icon_z"></text>
				</view>
				<view class="list">
					<text>销量</text>
					<text></text>
				</view>
				<view class="list">
					<text>价格</text>
					<view class="icon_j">
						<text class="iconfont icon-sanjiao up"></text>
						<text class="iconfont icon-sanjiao down"></text>
					</view>
				</view>
				<view class="list" @click="isDrawer = true">
					<text>筛选</text>
					<text class="iconfont icon-shaixuan icon_s"></text>
				</view>
			</view>
			<!-- 筛选弹窗 -->
			<view class="screen-popup" @click.stop="isScreen = false" v-show="isScreen">
				<view class="synthesize">
					<view class="list">
						<text class="check"></text>
						<text class="title">综合排序</text>
					</view>
					<view class="list">
						<text class="check"></text>
						<text class="title">评论数从高到低</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="goods-data">
			<mescroll-body ref="mescrollRef"
				@init="mescrollInit"
				@down="downCallback"
				@up="upCallback"
				:down="downOption"
				:up="upOption"
				:top="0">
				<view class="goods-list">
					<view :class="isList?'list-view':'list-li'" v-for="(item,index) in goodsList" @click="onGoodsList(item,index)" :key="index">
						<view class="thumb">
							<image :src="item.pict_url" mode="heightFix"></image>
						</view>
						<view class="item">
							<view class="title">
								<text class="two-omit">{{item.title}}</text>
							</view>
							<view class="price">
								<view class="retail-price">
									<text class="min">￥</text>
									<text class="max">{{item.zk_final_price}}</text>
									<view class="tag" v-if="item.coupon_amount > 0">
										<text>领券减{{item.coupon_amount}}</text>
									</view>
								</view>
								<view class="vip-price">
									<text class="min"></text>
									<text class="max"></text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</mescroll-body>
		</view>
		<!-- 抽屉 -->

	</view>
</template>

<script>
	import auth from '@/common/auth.js'
	import utils from '@/common/utils.js'
	import commonFun from '@/common/common-func.js'
	import api from '@/common/api-util.js'
	import log from '@/common/log-util.js'
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue";
	import UButton from "../../../../uview-ui/components/u-button/u-button"; // 非uni_modules版本
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			UButton,
			MescrollBody
		},
		data() {
			return {
				mescroll: null, // mescroll实例对象 (此行可删,mixins已默认)
				// 下拉刷新的配置(可选, 绝大部分情况无需配置)
				downOption: {},
				// 上拉加载的配置(可选, 绝大部分情况无需配置)
				upOption: {
				},
				page: 0,

				// 列表视图切换
				isList: true,
				// 筛选弹窗
				isScreen: false,
				// 筛选切换
				screenShow: 0,
				// 抽屉
				isDrawer: false,
				keyword: '',
				goodsList:[
				  {
					id: 1,
					name: 'BANDALY 2020夏季女装连衣裙韩版大码宽松显瘦套装裙子两件套 JX19301 上豆绿下米白 M ',
					price: '219.00',
					vip_price: '129.00',
					img: '/static/img/goods_thumb_01.png',
					is_goods: 0,
				  },{
					id: 1,
					name: '花花公子 卫衣男秋季圆领薄款休闲体恤男士时尚长袖T恤外套上衣男生情侣装套头衣服秋天男装 白色 XL',
					price: '139.00',
					vip_price: '99.00',
					img: '/static/img/goods_thumb_02.png',
					is_goods: 1,
				  },
				],
			}
		},
		onLoad(params) {
			this.keyword = decodeURIComponent(params.keyword||'');
			api.tbk.search(this.keyword).then(res => {
				if (res.code == api.SUCCESS) {
					this.goodsList = res.data;
				}
			})
		},
		methods: {
			searchGoods(){

			},
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback(){
				this.mescroll.endSuccess();
			},
			/*上拉加载的回调*/
			upCallback(page) {
				setTimeout(() =>{
					this.mescroll.endByPage(10, 20);
				},2000)
			},
			/**
			 * 返回点击
			 */
			onBack(){
				uni.navigateBack();
			},
			/**
			 * 综合点击
			 * @param {Number} type
			 */
			onSynthesize(type){
				this.screenShow = type;
				this.isScreen = !this.isScreen;
			},
			/**
			 * 商品列表点击
			 */
			onGoodsList(item,index){
				log.debug(item)
				log.debug(index)
				log.debug(this.goodsList[index])
				var param = {
					"itemId": item.item_id,
					"couponAmount": item.coupon_amount,
					"couponEndTime": item.coupon_end_time,
					"couponStartTime": item.coupon_start_time,
					"couponRemainTime": item.coupon_remain_count,
					"couponTotalCount": item.coupon_total_count,
					"couponStartFee": item.coupon_start_fee,
					"couponShareUrl": encodeURIComponent(item.coupon_share_url),
				}
				if (!param.couponShareUrl) {
					param.couponShareUrl = item.url;
				}
				log.debug("goods info param");
				log.debug(utils.queryParams(param));
				utils.navigateTo("/pages/taobao/tbk/goodsDetails/goodsDetails"+ utils.queryParams(param));

			}
		}
	}
</script>

<style scoped lang="scss">
	@import  'searchGoodsList.scss';
</style>
