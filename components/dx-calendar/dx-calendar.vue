<template>
	<view class="imt-calendar">
		<view>
			<view class="calendar-month-wrapper">
				<view class="icon-wrap" @click="decMonth()">
					<u-icon name="arrow-left" size="32" :style="{color:current == 0 ? '#7C7C7C': '#2979ff'}"  ></u-icon>
				</view>
				<view class="calendar-month">{{currentTime}}</view>
				<view class="icon-wrap" @click="incMonth()">
					<u-icon name="arrow-right" size="32" :style="{color:current == calendar.length-1 ? '#7C7C7C': '#2979ff'}" ></u-icon>
				</view>
			</view>
			<view class="calendar-week-wrapper">
				<view class="calendar-week" v-for="(item,index) in week" :key="index">{{item}}</view>
			</view>
			<swiper v-if="showDates" class="calendar-date-swiper" :current="current" @change="current = $event.detail.current">
				<swiper-item class="calendar-date-wrapper" v-for="(item,index) in calendar" :key="index">
					<view class="calendar-date" @click="dateClick(item, key)" v-for="(value,key) in item" :key="key" :style="{backgroundColor: value.cur ? '#2979ff' : '#fff' ,color: (value.cur ) ? '#fff' : '#909399' }">
						<view>{{value.day}}</view>
							<view v-if="!value.cur && value.selected" class="dot"></view>
					</view>
				</swiper-item>
			</swiper>
			<view>
				<u-icon v-if="showDates" @click="showDates = false" name="arrow-up" size="32" color="#7C7C7C"></u-icon>
				<u-icon v-else="showDates" @click="showDates = true" name="arrow-down" size="32" color="#7C7C7C"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from "../../common/utils";

	export default {
		data() {
			return {
				week: ['日', '一', '二', '三', '四', '五', '六'],
				current: '',
				startYear: '',
				startMonth: '',
				showDates: true, //是否显示日期
				calendar: [],
				monthCalendar:null,
				yearMonthStrList:[],
				lastSelectDayItem:null, //最近选中的月份item
				lastSelectDayKey:null, //最近选中日期月份item对应的key
			}
		},
		props: {

			// startYear: {
			// 	type: String,
			// 	default: ''
			// },
			// startMonth: {
			// 	type: String,
			// 	default: ''
			// },
			months: {
				type: Number,
				default () {
					return 12
				}
			},
			lastYearMonth: {
				type: String,
				default () {
					return "2021-02"
				}
			},
			curSelectedDate:{
				type: String,
				default () {
					// return "2021-05-01"
					return ""
				}
			},
			// selected: {
			// 	type: Array,
			// 	default () {
			// 		return []
			// 	}
			// },
			color: {
				type: String,
				// default: '#e5373f'
				default: '#2979ff'
			}
		},
		created() {
			this.init();
		},
		methods: {
			decMonth(){
				if (this.current) {
					this.current--;
					this.$emit('monthChange', this.yearMonthStrList[this.current]);
				}
				// console.log(this.current)
				// this.updateSelectedView();
				// this.$emit('monthChange', this.yearMonthStrList[this.current]);
			},
			incMonth(){
				if (this.current < this.calendar.length-1) {
					this.current++
					this.$emit('monthChange', this.yearMonthStrList[this.current]);
				}
				// this.current == this.calendar.length-1 || this.current++
				// console.log(this.current)
				// console.log(this.calendar);
				// this.updateSelectedView();

			},
			// updateSelected(selected){
			// 	this.selected  = selected;
			// 	this.updateSelectedView();
			// 	// this.selected.forEach(date => {
			// 	// 	let time = date.split('-')
			// 	// 	let dayMonth = this.yearMonthStrList[this.current].split('-');
			// 	// 	if (dayMonth[0] == time[0] && dayMonth[1] == time[1]) {
			// 	// 		this.calendar[this.current][time[2] - 1 + new Date(
			// 	// 			`${time[0]}-${time[1]}`).getDay()].selected = true
			// 	// 	}
			// 	// })
			// },
			updateSelectedView(selected) {
				for(var i=0; i<this.calendar[this.current].length; i++) {
					var date = this.calendar[this.current][i];
					if(date.date) {
						if (selected && selected.indexOf(date.date) != -1) {
							date.selected = true;
							this.calendar[this.current].splice(i, 1, date);
						} else {
							date.selected = false;
							this.calendar[this.current].splice(i, 1, date);
						}
					}
				}
			},
			init(){
				//获取月份列表
				var lastYearMonth = new Date(this.lastYearMonth);
				var tmpYear = lastYearMonth.getFullYear();
				var tmpMonth = lastYearMonth.getMonth() + 1;
				this.yearMonthStrList = [];
				for(var i=0; i<this.months; i++){
					this.yearMonthStrList.unshift(""+tmpYear+"-"+(tmpMonth>9 ? '' : '0') + tmpMonth);
					if (tmpMonth == 1) {
						tmpMonth = 12;
						tmpYear = tmpYear - 1;
					} else {
						tmpMonth = tmpMonth -1;
					}
				}

				// console.log(this.yearMonthStrList);

				//根据月份列表转换为每个月的日期
				this.calendar = [];
				for(var i=0; i<this.months; i++) {
					this.calendar.push(this.getDate(this.yearMonthStrList[i]));
				}
				this.current = this.calendar.length - 1;


				//选中当前数据
				var tmpCurSelectDate = this.curSelectedDate;
				if (!tmpCurSelectDate) {
					tmpCurSelectDate = utils.timeFormat();
				}
				//循环遍历搜索选中当前选中日期
				for (var i=0; i<this.calendar.length; i++) {
					var breakFlag = false;
					var month = this.calendar[i];
					for (var j=0; j<month.length; j++) {
						if (tmpCurSelectDate == month[j].date) {
							var cur = month[j];
							cur.cur = true;
							month.splice(j, 1, cur);
							this.lastSelectDayItem = month;
							this.lastSelectDayKey = j;
							breakFlag = true;
							break;
						}
					}
					if (breakFlag) {
						break;
					}
				}

				// //开始年月
				// var startYearMonth = new Date(this.yearMonthStrList[0]);
				// console.log("startYearMonth", startYearMonth);
				// var curDate = new Date(tmpCurSelectDate);
				// console.log("curDate", curDate);
				// //计算两个日期相差几个月
				// var monthDistance = (curDate.getFullYear() - startYearMonth.getFullYear() ) * 12 + curDate.getMonth() - startYearMonth.getMonth() ;
				// if (monthDistance < 0) {
				// 	monthDistance = 0;
				// }
				// if (monthDistance >= this.months) {
				// 	monthDistance = this.months;
				// }
				// console.log("monthDistance", monthDistance);
				// for(var i=0; i<this.calendar[monthDistance].length; i++) {
				// 	// if (this.calendar[monthDistance][i])
				// }
				this.updateSelectedView(this.selected);
			},
			dateClick(item, key){
				var date = item[key]
				if (!date.day) { //空数据则过滤
					return;
				}
				// console.log(date)
				//更新旧选中的数据
				if (this.lastSelectDayItem && this.lastSelectDayKey) {
					var oldDay = this.lastSelectDayItem[this.lastSelectDayKey];
					oldDay.cur = false;
					this.$set(this.lastSelectDayItem, this.lastSelectDayKey, oldDay)
				}
				this.lastSelectDayItem = item;
				this.lastSelectDayKey = key;
				//更新新选中的数据
				date.cur = true;
				this.$set(item, key, date)
				this.$emit('dateClick', date);
			},
			/**
			 * 根据 "2021-02"转换为月份的每天日期，其中前后都有空的内容（如1号是周三，则日、一、二为空)
			 * @param {Object} yearMonth
			 */
			getDate(yearMonth) {
				let time = yearMonth.split('-')
				// console.log("getDate")
				// console.log(yearMonth)
				// console.log(time)
				return [...Array(new Date(`${time[0]}-${time[1]}`).getDay())].map(i => ({
					day: ''
				})).concat([...Array([4, 6, 9, 11].includes(time[1] * 1) ? 30 : (time[1] != 2 ? 31 : (time[0] % 4 == 0 ? 29 : 28)))
					.keys()
				].map(i => ({
					// date: i + 1
					day: i+1,
					date: yearMonth + "-" + ((i+1) < 10 ? "0"+(i+1) : (i+1))
				})))
			},
			// format(e) {
			// 	console.log("format")
			// 	console.log(e)
			// 	let time = new Date(new Date(this.startYear).setMonth(this.startMonth + e))
			// 	return `${time.getFullYear()}-${(time.getMonth()<9 && '0')+(time.getMonth()+1)}`
			// }
		},
		computed: {
			currentTime() {
				// return this.format(this.current)
				// return "hello";

				var yearMonth = new Date(this.yearMonthStrList[this.current]);
				var tmpYear = yearMonth.getFullYear();
				var tmpMonth = yearMonth.getMonth() + 1;
				return tmpYear + "年" + tmpMonth + "月";
			}
		}
	}
</script>

<style lang="scss" scoped>


	.imt-calendar {
		/*width: 700rpx; 修改为使用flex居中*/
		display: flex;
		justify-content: center;
		background: #fff;
		border-radius: 10rpx;
		text-align: center;
		color: #333;
		/*background: #AAAAAA;*/
	}

	.icon-wrap{
		/*display: inline-block;*/
		width: 48rpx;
		height:48rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

	}

	.calendar-month-wrapper {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding-bottom: 16rpx;
		border-bottom: 2rpx solid #e5e5e5;
		margin-left: 16rpx;
	}

	.calendar-month {
		font-size: 36rpx;
		line-height: 1.5;
		color: #424242;
		font-weight: 500;
		margin: 0 8rpx;
		/*line-height: 60rpx;*/
	}

	.calendar-week-wrapper {
		display: flex;
		justify-content: flex-start;
		padding: 16rpx 0 16rpx 0;
	}

	.calendar-week {
		/*flex: 1;*/
		font-size:28rpx;
		width: 60rpx;
		/*height: 60rpx;*/
		flex-grow:0;
		flex-shrink: 0;
		margin: 0rpx 20rpx;
		/*line-height: 80rpx;*/
	}

	.calendar-date-swiper {
		/*height: 400upx;*/
		/*min-height: 400rpx;*/
		/*padding-bottom: 1px;*/
		min-height: 400rpx;
		width: 100%;
	}

	.calendar-date-wrapper {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		/*width: 700rpx;*/
		/*margin: auto;*/
	}

	.calendar-date {
		flex-grow:0;
		flex-shrink: 0;
		width: 60rpx;
		height: 60rpx;
		font-size: 32rpx;
		line-height: 60rpx;
		border-radius: 50%;
		color:#909399;
		margin: 0rpx 20rpx;
		/*display: flex;*/
		/*flex-direction: column;*/
		/*justify-content: center;*/
		/*align-items: center;*/
		.dot{
			position: relative;
			top: -38rpx;
			display: inline-block;
			width: 10rpx;
			height: 10rpx;
			background-color: #2979FF;
			border-radius: 5rpx;
		}

	}
</style>
