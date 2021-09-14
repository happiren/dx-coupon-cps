<template>
	<view class="u-select" style="color:#fff">
		<!-- <view class="u-select__action" :class="{
			'u-select--border': border
		}" @tap.stop="selectHandler">
			<view class="u-select__action__icon" :class="{
				'u-select__action__icon--reverse': value == true
			}">
				<u-icon name="arrow-down-fill" size="26" color="#c0c4cc"></u-icon>
			</view>
		</view> -->
		<u-popup :maskCloseAble="maskCloseAble" mode="bottom" :popup="false" v-model="value" length="auto" :safeAreaInsetBottom="safeAreaInsetBottom" @close="close" :z-index="uZIndex">
			<view class="u-select">
				<view class="u-select__header" @touchmove.stop.prevent="">
<!--					<view-->
<!--						class="u-select__header__cancel u-select__header__btn"-->
<!--						:style="{ color: cancelColor }"-->
<!--						hover-class="u-hover-class"-->
<!--						:hover-stay-time="150"-->
<!--						@tap="getResult('cancel')"-->
<!--					>-->
<!--						{{cancelText}}-->
<!--					</view>-->
					<view class="u-select__header__title">
						{{title}}
						<view style="display: inline-block;marin-left: 8rpx; width: 28rpx; ">
							<u-loading :show="loading" mode="flower" size="28"></u-loading>
						</view>

					</view>
<!--					<view-->
<!--						class="u-select__header__confirm u-select__header__btn"-->
<!--						:style="{ color: moving ? cancelColor : confirmColor }"-->
<!--						hover-class="u-hover-class"-->
<!--						:hover-stay-time="150"-->
<!--						@touchmove.stop=""-->
<!--						@tap.stop="getResult('confirm')"-->
<!--					>-->
<!--						{{confirmText}}-->
<!--					</view>-->
				</view>

				<view class="u-select__body">
					<picker-view @change="columnChange" class="u-select__body__picker-view" :value="defaultSelector" @pickstart="pickstart" @pickend="pickend">
						<picker-view-column v-for="(item, index) in columnData" :key="index">
							<view class="u-select__body__picker-view__item" v-for="(item1, index1) in item" :key="index1">
								<view class="u-line-1">{{ item1[labelName] }}</view>
							</view>
						</picker-view-column>
					</picker-view>
				</view>
				<view class="u-select__tail" @touchmove.stop.prevent="">
					<view class="cancel-btn" :style="{ color: cancelColor }" hover-class="u-hover-class" @tap="getResult('cancel')">
						{{cancelText}}
					</view>
					<view class="confirm-btn" :style="{ color: confirmColor, opacity: moving ? 0.7: 1 }"
						  hover-class="u-hover-class"
						  :hover-stay-time="150"
						  @touchmove.stop=""
						  @tap.stop="getResult('confirm')"
					>
						{{confirmText}}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import utils from '@/common/utils.js'
	import api from '@/common/api-util.js'
	import ErrorCode from '@/api/error-code.js';
	import log from '@/common/log-util.js'
	/**
	 * select 列选择器
	 * @description 此选择器用于单列，多列，多列联动的选择场景。(从1.3.0版本起，不建议使用Picker组件的单列和多列模式，Select组件是专门为列选择而构造的组件，更简单易用。)
	 * @tutorial http://uviewui.com/components/select.html
	 * @property {String} mode 模式选择，"single-column"-单列模式，"mutil-column"-多列模式，"mutil-column-auto"-多列联动模式
	 * @property {Array} list 列数据，数组形式，见官网说明
	 * @property {Boolean} v-model 布尔值变量，用于控制选择器的弹出与收起
	 * @property {Boolean} safe-area-inset-bottom 是否开启底部安全区适配(默认false)
	 * @property {String} cancel-color 取消按钮的颜色（默认#606266）
	 * @property {String} confirm-color 确认按钮的颜色(默认#2979ff)
	 * @property {String} confirm-text 确认按钮的文字
	 * @property {String} cancel-text 取消按钮的文字
	 * @property {String} default-value 提供的默认选中的下标，见官网说明
	 * @property {Boolean} mask-close-able 是否允许通过点击遮罩关闭Picker(默认true)
	 * @property {String Number} z-index 弹出时的z-index值(默认10075)
	 * @property {String} value-name 自定义list数据的value属性名 1.3.6
	 * @property {String} label-name 自定义list数据的label属性名 1.3.6
	 * @property {String} child-name 自定义list数据的children属性名，只对多列联动模式有效 1.3.7
	 * @event {Function} confirm 点击确定按钮，返回当前选择的值
	 * @example <u-select v-model="show" :list="list"></u-select>
	 */

export default {
	props: {

		// 列数据
		// list: {
		// 	type: Array,
		// 	default() {
		// 		return [];
		// 	}
		// },
		// 是否显示边框
		border: {
			type: Boolean,
			default: true
		},
		// 通过双向绑定控制组件的弹出与收起
		value: {
			type: Boolean,
			default: false
		},
		// "取消"按钮的颜色
		cancelColor: {
			type: String,
			default: '#2979ff'
		},
		// "确定"按钮的颜色
		confirmColor: {
			type: String,
			default: '#FFF'
		},
		// 弹出的z-index值
		zIndex: {
			type: [String, Number],
			default: 0
		},
		safeAreaInsetBottom: {
			type: Boolean,
			default: false
		},
		// 是否允许通过点击遮罩关闭Picker
		maskCloseAble: {
			type: Boolean,
			default: true
		},
		// 提供的默认选中的下标
		defaultValue: {
			type: Array,
			default() {
				return [0];
			}
		},
		// 模式选择，single-column-单列，mutil-column-多列，mutil-column-auto-多列联动
		mode: {
			type: String,
			default: 'mutil-column'
		},
		// 自定义value属性名
		valueName: {
			type: String,
			default: 'value'
		},
		// 自定义label属性名
		labelName: {
			type: String,
			default: 'label'
		},
		// 自定义多列联动模式的children属性名
		childName: {
			type: String,
			default: 'children'
		},
		// 顶部标题
		title: {
			type: String,
			default: ''
		},
		// 取消按钮的文字
		cancelText: {
			type: String,
			default: '取消'
		},
		// 确认按钮的文字
		confirmText: {
			type: String,
			default: '确认'
		}
	},
	data() {
		return {
			// 用于列改变时，保存当前的索引，下一次变化时比较得出是哪一列发生了变化
			rootAreaList:[],
			parentAreaList:[],
			childAreaList:[],
			defaultSelector: [0, 0, 0],
			list:[],
			// picker-view的数据
			columnData: [],
			// 每次队列发生变化时，保存选择的结果
			selectValue: [],
			// 上一次列变化时的index
			lastSelectIndex: [],
			// 列数
			columnNum: 0,
			// 列是否还在滑动中，微信小程序如果在滑动中就点确定，结果可能不准确
			moving: false,
			//获取子区域中
			loading: false,
		};
	},
	watch: {
		// 在select弹起的时候，重新初始化所有数据
		value: {
			immediate: true,
			handler(val) {
				if(val) setTimeout(() => this.init(), 10);
			}
		},
	},
	computed: {
		uZIndex() {
			// 如果用户有传递z-index值，优先使用
			return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
		},
	},
	methods: {
		// 标识滑动开始，只有微信小程序才有这样的事件
		pickstart() {
			// #ifdef MP-WEIXIN
			this.moving = true;
			// #endif
		},
		// 标识滑动结束
		// 标识滑动结束
		pickend() {
			// #ifdef MP-WEIXIN
			this.moving = false;
			// #endif
		},
		getRootArea() {
			//最多100个区域
			// log.debug("getRootArea")
			this.rootAreaList = [];
			this.parentAreaList = [];
			this.childAreaList = [];
			// utils.showLoading("加载中...")
			this.loading = true;
			api.mt.getProvince().then(res => {
				this.loading = false;
				if (res.code == api.SUCCESS) {
					this.rootAreaList = [];
					for (let [key, value] of Object.entries(res.data)) {
						// console.log([key, value]); // ['a', 1], ['b', 2], ['c', 3]
						let o = {};
						o.value = key;
						o.label = value;
						this.rootAreaList.push(o)
					}
					if (this.rootAreaList.length > 0) {
						if (this.lastSelectIndex[0] < this.rootAreaList.length) {
							this.getParentArea(this.rootAreaList[this.lastSelectIndex[0]].value);
						} else {
							this.getParentArea(this.rootAreaList[0].value);
						}
					}
					this.list =  [
						this.rootAreaList,
						this.parentAreaList,
						// this.childAreaList,
					];
					this.updateColumnData();
				}
			})
		},
		getParentArea(provinceId) {
			//最多100个区域
			this.parentAreaList = [];
			this.childAreaList = [];
			// utils.showLoading("加载中...")
			this.loading = true;
			api.mt.getCities(provinceId).then(res => {
				this.loading = false;
				this.parentAreaList = [];
				if (res.code == api.SUCCESS) {
					for (let [key, value] of Object.entries(res.data)) {
						// console.log([key, value]); // ['a', 1], ['b', 2], ['c', 3]
						let o = {};
						o.value = key;
						o.label = value;
						this.parentAreaList.push(o)
					}
				} else if (res.code == ErrorCode.ERROR_DATA_EMPTY) {
					// utils.toast("没有对应的子区域");
					this.childAreaList = [
					];
				}
				this.list =  [
					this.rootAreaList,
					this.parentAreaList,
					// this.childAreaList,
				];
				this.updateColumnData();
			})
		},
		getChildArea(areaId) {
			//最多100个区域
			this.childAreaList = [];
		},
		init() {

			// log.debug("default lastSelectIndex", this.lastSelectIndex)
			// log.debug("default defaultSelector", this.defaultSelector)
			// log.debug("default selectValue", this.selectValue)
			// this.lastSelectIndex = [0, 0, 0];
			this.setColumnNum();
			this.setDefaultSelector();
			this.setColumnData();
			this.setSelectValue();
			// log.debug("update lastSelectIndex", this.lastSelectIndex)
			// log.debug("update defaultSelector", this.defaultSelector)
			// log.debug("update selectValue", this.selectValue)
			// console.log("before getRootArea  init")
			this.getRootArea();
			// console.log("after getRootArea  init")
		},
		updateColumnData(){
			this.setColumnNum();
			// this.setDefaultSelector(); //不可设置defaultSelector,会导致lastSelectIndex重置
			this.setColumnData();

			this.setSelectValue();
			// console.log("selectValue", this.selectValue);
			// this.setSelectValue();
		},
		// 获取默认选中列下标
		setDefaultSelector() {
			// 如果没有传入默认选中的值，生成长度为columnNum，用0填充的数组
			this.defaultSelector = this.defaultValue.length == this.columnNum ? this.defaultValue : Array(this.columnNum).fill(0);
			if (this.lastSelectIndex.length == 0) {
				this.lastSelectIndex = this.$u.deepClone(this.defaultSelector);
			}
		},
		// 计算列数
		setColumnNum() {
			this.columnNum = 3;
		},
		// 获取需要展示在picker中的列数据
		setColumnData() {
			let data = [];
			this.selectValue = [];
			data = this.list;
			this.columnData = data;
		},
		// 获取默认选中的值，如果没有设置defaultValue，就默认选中每列的第一个
		setSelectValue() {
			// 初始默认选中值
			this.selectValue = [];
			this.lastSelectIndex.map((item, index) => {
				if (this.columnData.length == 2) {
					// console.log("index", index)
					// console.log("columnData", this.columnData)
					// console.log("lastSelectIndex", this.lastSelectIndex)
					if (!this.columnData[index]){
						return;
					}
					let data = this.columnData[index][this.lastSelectIndex[index]];
					// console.log("data",index, data)
					// 初始默认选中值
					let tmp = {
						value: data ? data[this.valueName] : null,
						label: data ? data[this.labelName] : null,
					};
					// 判断是否有需要额外携带的参数
					if(data && data.extra !== undefined) tmp.extra = data.extra;
					this.selectValue.push(tmp);
				}
			})

		},
		// 列选项
		columnChange(e) {
			let index = null;
			let columnIndex = e.detail.value;

			for(var i=0; i<3; i++) {
				if (this.lastSelectIndex[i] != columnIndex[i]){
					index = i;
					break;
				}
			}
			// this.defaultSelector = this.$u.deepClone(columnIndex);
			this.lastSelectIndex = this.$u.deepClone(columnIndex); //修改最后选中的区域

			if (index == 0) {
				let data = this.columnData[index][columnIndex[index]];
				this.setSelectValue();
				if (data && data.value) {
					this.getParentArea(data.value);
				}
			} else if (index == 1) {
				let data = this.columnData[index][columnIndex[index]];
				this.setSelectValue();
				if (data && data.value) {
					this.getChildArea(data.value);
				}
			} else if (index == 2) {
				this.setSelectValue();
			}

			// console.log("columnChange", columnIndex)

		},
		close() {
			this.$emit('input', false);
		},
		// 点击确定或者取消
		getResult(event = null) {
			// console.log("getResult selectValue", this.selectValue);
			// #ifdef MP-WEIXIN
			if (this.moving) return;
			// #endif
			if (this.loading) return;
			if (event) this.$emit(event, this.selectValue);
			this.close();
		},
		selectHandler() {
			this.$emit('click');
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../uview-ui/libs/css/style.components.scss";

.u-select {

	&__action {
		position: relative;
		line-height: 70rpx;
		height: 70rpx;

		&__icon {
			position: absolute;
			right: 20rpx;
			top: 50%;
			transition: transform .4s;
			transform: translateY(-50%);
			z-index: 1;

			&--reverse {
				transform: rotate(-180deg) translateY(50%);
			}
		}
	}

	&__hader {
		&__title {
			color: #606266;
		}
	}

	&--border {
		border-radius: 6rpx;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
	}

	&__header {
		@include vue-flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		padding: 0 40rpx;

		&__title{
			color: #606266;
		}
	}

	&__body {
		width: 100%;
		height: 500rpx;
		overflow: hidden;
		background-color: #fff;

		&__picker-view {
			height: 100%;
			box-sizing: border-box;

			&__item {
				@include vue-flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				color: #303133;
				padding: 0 8rpx;
			}
		}
	}
	&__tail{
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin: 0 48rpx;
		padding-top: 1rpx;
		padding-bottom: 48rpx;
		.cancel-btn{
			line-height: 64rpx;
			display: inline-block;
			text-align: center;
			width: 192rpx;
			height: 64rpx;
			background: #F2F2F2;
			border-radius: 8rpx;
			color: #2979FF;
			font-size: 28rpx;
			font-weight: 500;
		}
		.confirm-btn{
			line-height: 64rpx;
			display: inline-block;
			text-align: center;
			width: 192rpx;
			height: 64rpx;
			background: #2979FF;
			border-radius: 8rpx;
			font-size: 28rpx;
			font-weight: 500;
		}
	}
}
</style>
