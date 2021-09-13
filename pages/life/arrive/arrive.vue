<template>
	<view class="app">
		<!-- 顶部筛选 分类栏 -->
		<u-sticky h5-nav-height="0">
			<view class="nav-bar choose-address">
				<view class="city" @click="openPopup">{{ city }}</view>
				<u-search placeholder="搜索门店找优惠" v-model="keywords" @search="search" @custom="search"></u-search>
			</view>
			<view class="sticky-box">
				<u-tabs :list="tabList" :is-scroll="true" :current="tabCurrent" :bar-style="barStyle"
					:active-item-style="activeItemStyle" @change="changeTab" ></u-tabs>
				<!-- 商品分类 -->
				<view class="cate-bar">
					<view class="cate-wrap row b-b">
						<!-- <text :id="'cate-'+item._id" class="item" :class="{active: item._id === curCateItem._id}" v-for="item in cateList" :key="item._id" @click="changeCategory(item)">{{ item.name }}</text> -->
						<view class="item" :class="{ active: !!aroundOpen }" @click="openMenu('aroundOpen')">
							<text>{{ aroundTitle }}</text>
							<view class="arrow">
								<uni-icons type="arrowdown" size="12"></uni-icons>
							</view>
						</view>
						<view class="item" :class="{ active: !!allOpen }" @click="openMenu('allOpen')">
							<text>{{ allTitle }}</text>
							<view class="arrow">
								<uni-icons type="arrowdown" size="12"></uni-icons>
							</view>
						</view>
						<view class="item" :class="{ active: !!sortOpen }" @click="openMenu('sortOpen')">
							<text>{{ sortTitle }}</text>
							<view class="arrow">
								<uni-icons type="arrowdown" size="12"></uni-icons>
							</view>
						</view>
						<view class="item" :class="{ active: !!filterOpen }" @click="openMenu('filterOpen')">
							<text>筛选</text>
							<view class="arrow">
								<uni-icons type="arrowdown" size="12"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<view class="dropdown">
					<view class="menu" v-if="aroundOpen">
						<view class="item b-b" v-for="item in aroundList" @click="handleMenuItem('radii', item)"
							:key="item.id">{{ item.title }}</view>
					</view>
					<scroll-view style="height: 520rpx" scroll-y="true" v-if="allOpen">
						<view class="menu menu-cate-list">
							<view class="item" :class="{ active: item.id === cat1Id }" v-for="item in allCateList"
								@click="handleMenuItem('cat1Id', item)" :key="item.id">{{ item.title }}</view>
						</view>
					</scroll-view>
					<view class="menu" v-if="sortOpen">
						<scroll-view style="height: 520rpx" scroll-y="true">
							<view class="item b-b" v-for="item in sortList" @click="handleMenuItem('sortType', item)"
								:key="item.id">{{ item.title }}</view>
						</scroll-view>
					</view>
					<view class="menu menu-filter" v-if="filterOpen">
						<view class="menu-title">价格</view>
						<view class="menu-filter-list">
							<view class="item" :class="{ active: priceRangeIndex === item.id }"
								v-for="item in priceRange" @click="handlePriceRange(item.id)" :key="item.id">
								{{ item.title }}</view>
						</view>
						<view class="menu-title">全部优惠</view>
						<view class="menu-filter-list">
							<view class="item" :class="{ active: item.id === filterType }"
								v-for="item in filterTypeList" @click="handleFilter(item)" :key="item.id">
								{{ item.title }}</view>
						</view>
						<view class="button-list">
							<view class="btn btn-reset" @click="handelRestFilter">重置</view>
							<view class="btn btn-submit" @click="handelSubmitFilter">确认</view>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>

		<!--    <view-->
		<!--      class="mask"-->
		<!--      v-if="aroundOpen || allOpen || sortOpen || filterOpen"-->
		<!--      @click="closeMenu"-->
		<!--    ></view>-->


		<view class="product-body">
			<view class="empty" v-if="isListEmpty">
				<image class="empty-image" mode="widthFix" src="/static/img_empty.png"></image>
				<view class="empty-text">暂无商家</view>
			</view>
			<block v-else>
				<productList ref="productList" :list="shopList" baseUrl="/pages/life/shop/shop"></productList>
			</block>
		</view>

		<u-popup v-model="showPopup" id="popup" ref="popup" mode="bottom" animation="true">
			<view class="popup-content" @click="closePopup">
				<view class="action-sheet-item b-b" @click="initLocation">定位当前位置</view>
				<picker mode="multiSelector" :range="areaList" @columnchange="handleCityColumnChange"
					@change="handleCityChange">
					<view class="action-sheet-item">选择所在城市</view>
				</picker>
				<view class="action-sheet-item-cancel-item">取消</view>
			</view>
		</u-popup>

	</view>
</template>
<script>
	// import recommand from "./components/recommand/recommand";
	import auth from '@/common/auth.js'
	import log from '@/common/log-util.js'
	import utils from '@/common/utils.js'
	import api from '@/common/api-util.js'
	import productList from '@/components/product-list/product-list.vue'


	export default {
		components: {
			productList
		},
		data() {
			return {
				list: [],
				areaList: [], // 处理后城市列表展示数据
				index: 0,
				provinceIndex: 0, // 当前列表选择省份索引
				originAreaList: [], // 存储接口原始城市数据
				tabList: [],
				tabCurrent: 0,
				barStyle: {
					// "color": 'red',
					"background": '#ff536f'
				},
				activeItemStyle: {
					"color": '#ff536f',
				},
				city: "选择", // 当前选择城市
				cityId: 0, // 当前选择城市id
				cat0Id: 0, // 当前选择一级类目id
				sortList: [{
						id: 1,
						title: "离我最近",
					},
					{
						id: 6,
						title: "销量升序",
					},
					{
						id: 7,
						title: "销量降序",
					},
					{
						id: 8,
						title: "价格由低到高",
					},
					{
						id: 9,
						title: "价格由高到底",
					},
					{
						id: 10,
						title: "优惠比例升序",
					},
					{
						id: 11,
						title: "优惠比例降序",
					},
				],
				aroundList: [{
						id: 500,
						title: "500m",
					},
					{
						id: 1e3,
						title: "1km",
					},
					{
						id: 3e3,
						title: "3km",
					},
					{
						id: 5e3,
						title: "5km",
					},
					{
						id: 1e4,
						title: "10km",
					},
				],
				allCateList: [],
				aroundOpen: false,
				aroundTitle: "附近",
				radii: "", // 距离
				allOpen: false,
				allTitle: "全部分类",
				cat1Id: "", // 二级类目id
				sortOpen: false,
				sortTitle: "离我最近",
				sortType: 1, // 排序类型
				filterOpen: false,
				filterType: "",
				priceRangeIndex: null,
				shopList: [],
				page: 1,
				keywords: "",
				navHeight: 60,
				showPopup: false,
				priceRange: [{
						lower: 0,
						upper: 5000,
						title: "50以下",
						id: 1
					},
					{
						lower: 5000,
						upper: 10000,
						title: "50-100",
						id: 2
					},
					{
						lower: 10000,
						upper: 30000,
						title: "100-300",
						id: 3
					},
					{
						lower: 30000,
						upper: 10000000,
						title: "300以上",
						id: 4
					},
				],
				filterTypeList: [{
						id: 1,
						title: "券后价"
					},
					{
						id: 2,
						title: "优惠比例"
					},
					{
						id: 3,
						title: "满减优惠"
					},
				],
				isListEmpty: false,
			};
		},

		computed: {

		},

		onLoad(e) {
			// this.getNavHeight();
			this.initLocation();
			this.getCityList();
		},
		methods: {
			async initLocation() {
				//#ifndef H5
				const authorize = await utils.getLocationAuth();
				if (!authorize) return;
				const [locationErr, locationRes] = await uni.getLocation();
				const {
					latitude,
					longitude
				} = locationRes;
				//#endif


				// const [cityErr, cityRes] = await getCity({
				//   lat: latitude,
				//   lng: longitude,
				// });
				// const { city, id } = cityRes?.data?.data || {};
				this.city = "厦门";
				this.cityId = "62";

				this.lat = 24.57591;
				this.lng = 118.09728;



				// 一级tab也通过后端接口返回
				// api.mt.cityCategories(this.cityId).then(res => {
				//   if (res.code == api.SUCCESS) {
				//     this.tabList = res.data.categories;
				//     if (this.tabList.length > 0) {
				//       this.cat0Id = this.tabList[0];
				//     }
				//
				//   }
				// })
				// await this.fetchTabList();

				// this.cat0Id = this.tabList[0].id;
				await this.updateCategoryList();
				this.getShopList();
			},

			/**
			 * 请求原始城市数据
			 */
			async getCityList() {
				// const [err, res] = await getArea();
				// this.originAreaList = res?.data?.data || [];
				// this.updateAreaList();
			},

			/**
			 * 请求优惠列表
			 */
			async getShopList(concat) {
				if (!this.cat0Id) {
					return;
				}
				if (!concat) {
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 500,
					});
					this.isListEmpty = false;
					this.page = 1;
				}

				const {
					cat0Id,
					cat1Id,
					cityId,
					radii,
					sortType,
					lat,
					lng,
					page,
					keywords,
					filters,
				} = this;
				const data = {
					"cat0Id": cat0Id,
					"cat1Id": cat1Id,
					"cityId": cityId,
					"radii": radii,
					"sortType": sortType,
					"lat": lat,
					"lng": lng,
					"page": page,
					"keywords": keywords,
					"filters": filters ? JSON.stringify(filters) : "",
				};
				Object.keys(data).forEach((key) => {
					if (data[key])
						return;
					delete data[key];
				});
				utils.showLoading("加载优惠中");
				this.isListEmpty = false;
				api.mt.dealsSearch(data).then(res => {
					utils.hideLoading();
					if (res.code == api.SUCCESS) {
						this.page = this.page + 1;
						this.shopList = concat ? this.shopList.concat(res.data.records) : res.data.records;
					} else {
						if (data.page == 1) {
							this.isListEmpty = true;
						}
					}
				})
				// const [err, res] = await getShopList(data);
				// const shopList = res?.data?.data?.records || [];
				// this.shopList = concat ? this.shopList.concat(shopList) : shopList;
				// // 没有商家数据
				// this.isListEmpty = !concat && !shopList.length;
				// uni.hideLoading();
			},

			/**
			 * 页面上拉触底事件的处理函数
			 */
			onReachBottom() {
				this.getShopList(true);
			},

			/**
			 * 重置二级分类
			 */
			resetMenu() {
				this.aroundTitle = "附近";
				this.radii = ""; // 距离
				this.allTitle = "全部分类";
				this.cat1Id = ""; // 二级类目id
				this.sortTitle = "离我最近";
				this.sortType = 1; // 排序类型
				this.page = 1;

				this.priceRangeIndex = null;
				this.filterType = "";
				this.filters = null;
			},

			handleCityColumnChange({
				detail
			}) {
				const {
					column,
					value
				} = detail;
				if (column != 0) return;
				this.provinceIndex = value;
				this.updateAreaList();
			},

			changeTab(index) {
				let tab = this.tabList[index];
				this.tabCurrent = index;
				if (tab.id == this.cat0Id) return;
				this.cat0Id = tab.id;
				this.closeMenu();
				api.mt.cityCategories(this.cityId, this.cat0Id).then(res => {
					if (res.code == api.SUCCESS) {

					}
				})

				// this.updateCategoryList();
				this.getShopList();
			},

			handleMenuItem(type, item) {
				const {
					id,
					title
				} = item;
				this[type] = id;
				switch (type) {
					case "radii":
						this.aroundTitle = title;
						break;
					case "cat1Id":
						this.allTitle = title;
						break;
					case "sortType":
						this.sortTitle = title;
						break;
				}
				this.closeMenu();
				this.getShopList();
			},

			handlePriceRange(index) {
				this.priceRangeIndex = index;
			},

			handleFilter(item) {
				this.filterType = item.id;
			},

			handelRestFilter() {
				this.priceRangeIndex = null;
				this.filterType = "";
				this.filters = null;

				this.closeMenu();
				this.getShopList();
			},

			handelSubmitFilter() {
				const {
					upper,
					lower
				} =
				this.priceRange.find((item) => item.id == this.priceRangeIndex) || {};
				this.filters = [{
					upper,
					lower,
					filterType: this.filterType || 1
				}];

				this.closeMenu();
				this.getShopList();
			},

			openMenu(type) {
				if (this[type]) {
					this[type] = false;
				} else {
					this.closeMenu();
					this[type] = true;
				}
			},

			closeMenu() {
				this.aroundOpen = false;
				this.allOpen = false;
				this.sortOpen = false;
				this.filterOpen = false;
			},

			async updateCategoryList() {
				this.resetMenu(); // 重置二级tab选择
				this.tabList = [];
				api.mt.cityCategories(this.cityId).then(res => {
					if (res.code == api.SUCCESS) {
						let catetories = res.data.categories;
						if (catetories){
                          for (let [key, value] of Object.entries(catetories)) {
                            console.log([key, value]); // ['a', 1], ['b', 2], ['c', 3]
                            let o = {};
                            o.id = key;
                            o.name = value;
                            this.tabList.push(o)
                          }
                        }

						if (this.tabList.length > 0) {
							if (!this.cat0Id) {
								this.cat0Id = this.tabList[0].id;
							}
							this.getShopList();
						}
					}
				})
				// const [err, res] = await getCategory({
				//   cityId: this.cityId,
				//   cat0Id: this.cat0Id,
				// });
				// const categories = res.data.data.categories;
				// const allCateList = Object.keys(categories).map((id) => ({
				//   id,
				//   title: categories[id],
				// }));
				// this.allCateList = [{ id: "", title: "全部分类" }, ...allCateList];
			},

			/**
			 * 更新城市选择列表
			 */
			updateAreaList() {
				const province = this.originAreaList.map((item) => item.province);
				const city = this.originAreaList[this.provinceIndex].city.map(
					(item) => item.name
				);
				this.areaList = [province, city];
			},

			handleCityChange({
				detail
			}) {
				const {
					value
				} = detail;
				const [provinceIndex, cityIndex] = value;
				const city = this.originAreaList[provinceIndex].city[cityIndex];
				this.city = city.name;
				this.cityId = city.id;

				this.updateCategoryList();

			},

			handleInput(e) {
				this.keywords = e.detail.value;
			},


			search() {
				this.page = 1;
				this.getShopList();
			},

			openPopup() {
				this.showPopup = true;
			},
			closePopup() {
				this.showPopup = false;
			},
			getNavHeight() {
				const query = uni.createSelectorQuery();
				query
					.select(".top")
					.boundingClientRect((rect) => {
						const height = rect.height;
						this.navHeight = height;
					})
					.exec();
			},
			onShareAppMessage(res) {
				// return getShareMessage()
			},

			onShareTimeline() {
				return getShareMessage()
			}
		},
	};
</script>
<style lang="scss">
	.nav-bar {
		background-color: #FFF;

		&.choose-address {
			padding-left: 30rpx;
			display: flex;
			align-items: center;
			font-size: 28rpx;

			.city {
				padding-right: 8rpx;
			}
		}
	}

	.sort-bar {
		display: flex;
		justify-content: space-around;
		height: 76rpx;
		padding: 4rpx 0 4rpx;
		background-color: #fff;
		position: relative;
		z-index: 1;

		.item {
			flex: 1;
			height: 100%;
			font-size: 32rpx;
			font-weight: 600;
			color: #333;
			position: relative;
			overflow: hidden;

			&.active {
				color: #ff536f;
				font-weight: 700;

				&:after {
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-28rpx);
					content: "";
					width: 56rpx;
					height: 4rpx;
					background-color: #ff536f;
					border-radius: 10px;
				}

				.mix-icon.active {
					color: #ff536f;
				}
			}

			/* #ifdef MP */
			&.last:before {
				content: "";
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 2rpx;
				height: 40rpx;
				box-shadow: 0 0 16rpx rgba(0, 0, 0, 0.6);
			}

			/* #endif */
		}

		.icon-wrap {
			display: flex;
			flex-direction: column;
			padding-left: 8rpx;
		}

		.mix-icon {
			font-size: 14rpx;
			color: #bbb;
		}

		.btn {
			height: 68rpx;
			padding-left: 16rpx;
			padding-right: 20rpx;

			.icon-hengxiangliebiao,
			.icon-shuxiangliebiao {
				font-size: 40rpx;
				color: #333;
			}
		}
	}

	.sticky-box {
		/*position: sticky;*/
		top: 220rpx;
		z-index: 5;
		background: #fff;
	}

	.cate-wrap {
		display: flex;
		justify-content: space-around;
		font-size: 28rpx;
		color: #333;

		.item {
			padding: 18rpx;
			flex: 1;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			white-space: nowrap;
		}

		.arrow {
			margin-left: 6rpx;
			transition: 0.5s;
		}

		.active .arrow {
			transform: rotate(-180deg);
		}
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 32rpx;

		.empty-image {
			width: 300rpx;
		}

		.empty-text {
			padding-top: 30rpx;
			color: #666;
			font-size: 30rpx;
		}
	}

	.dropdown {
		.item {
			margin: 0 28rpx;
			padding: 32rpx 0;
			font-size: 28rpx;
			color: #333;
		}

		.menu-cate-list,
		.menu-filter-list {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 12rpx 32rpx;

			.item {
				margin: 0 0 14rpx 0;
				padding: 14rpx 0;
				width: 200rpx;
				text-align: center;
				background: #eee;
				font-size: 26rpx;
				border-radius: 10rpx;

				&.active {
					background: #fee;
					color: #e62828;
				}
			}
		}

		.menu-title {
			padding: 0 32rpx;
			padding-top: 12rpx;
			font-size: 28rpx;
			color: #333;
		}

		.button-list {
			padding-top: 30rpx;
			padding-bottom: 26rpx;
			display: flex;
			justify-content: center;
			font-size: 30rpx;

			.btn {
				margin: 0 30rpx;
				padding: 12rpx 56rpx;
				border: 1px solid #ff536f;
				border-radius: 30rpx;

				&-reset {
					color: #ff536f;
				}

				&-submit {
					background: #ff536f;
					color: #fff;
				}
			}
		}
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 4;
		background: rgba(0, 0, 0, 0.6);
	}

	.product-body {
		padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
	}

	.popup-content {
		margin: 0 auto;
		background: #eee;
		//   width: 700rpx;

		.action-sheet-item {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 30rpx 0;
			background: #fff;
			color: #333;
		}

		.action-sheet-item-cancel-item {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 24rpx;
			padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
			background: #fff;
			margin-top: 16rpx;
			color: #164ab0;
		}
	}
</style>
