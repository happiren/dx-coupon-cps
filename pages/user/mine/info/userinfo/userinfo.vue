<template>
	<view>
		<view class="dx-flex-center" v-if="loading">
			<u-loading :show="true" mode="flower" size="50"></u-loading>
		</view>
		<view v-else="loading">
			<u-cell-group :border="false">
				<u-cell-item icon="account" title="头像" :border-top="false" @click="changeAvatar()">
					<u-avatar :src="userInfo.avatar"></u-avatar>
				</u-cell-item>
				<u-cell-item icon="grid" title="昵称" :value="userInfo.nickname" :border-bottom="true" @click="modifyNickname()"></u-cell-item>
				<u-cell-item icon="man" title="性别" :value="userInfo.sexStr" :border-bottom="true" @click="modifySex()"></u-cell-item>
				<u-cell-item icon="account-fill" title="民族" :value="userInfo.nation || ''" :border-bottom="true" @click="modifyNation()"></u-cell-item>
				<u-cell-item icon="calendar" title="出生日期" :value="userInfo.birth" :border-bottom="true" @click="modifyBirth()"></u-cell-item>
				<u-cell-item icon="account" title="工种" :value="userInfo.worktypeName || ''" :border-bottom="true" @click="modifyWorktype()"></u-cell-item>
			</u-cell-group>
			<u-gap height="16" bg-color="#F8F8F8"></u-gap>
			<u-cell-group :border="false">
				<u-cell-item icon="phone" title="联系手机号" :value="userInfo.mobile || ''" :border-bottom="true" @click="modifyMobile()"></u-cell-item>
				<u-cell-item icon="chat" title="微信号" :value="userInfo.wechat || ''" :border-bottom="true" @click="modifyWechat()"></u-cell-item>
				<u-cell-item icon="weixin-fill" title="微信二维码" :border-top="false" @click="modifyWechatPic()">
					<u-icon height="54" img-mode="heightFix" :name="userInfo.wechat_pic || 'weixin'"></u-icon>
				</u-cell-item>
				<u-cell-item icon="map" title="地址" :value="userInfo.addressStr" :border-bottom="true" @click="modifyAddress()"></u-cell-item>
			</u-cell-group>
			<u-gap height="16" bg-color="#F8F8F8"></u-gap>
			<u-cell-group :border="false">
				<u-cell-item icon="bell" title="健康状况" :value="userInfo.healthStr" :border-bottom="true" @click="modifyHealth()"></u-cell-item>
				<u-cell-item icon="tags" title="文化程度" :value="userInfo.degreeStr" :border-bottom="true" @click="modifyDegree()"></u-cell-item>
				<u-cell-item icon="question-circle" title="婚姻状况" :value="userInfo.maritalStr" :border-bottom="true" @click="modifyMarital()"></u-cell-item>
				<u-cell-item icon="integral" title="政治面貌" :value="userInfo.politicyStr" :border-bottom="true" @click="modifyPolitics()"></u-cell-item>
				<u-cell-item icon="hourglass" title="工作年限" :value="userInfo.workYearStr" :border-bottom="true" @click="modifyWorkYears()"></u-cell-item>
			</u-cell-group>
			<u-gap height="64" bg-color="#F8F8F8"></u-gap>

		</view>

		<dx-modal v-model="showModal" :title="modalTitle" :show-cancel-button="true" @confirm="modalConfirm()">
			<view class="slot-content" >
				<u-input  v-model="modalContent" input-align="center"></u-input>
			</view>
		</dx-modal>

		<dx-select v-model="selectDialog" :list="selectList"   @confirm="selectConfirm"></dx-select>

		<u-picker v-model="selectTimeDialog" mode="time" :params="timeParams" :default-time="defaultBirth" @confirm="birthConfirm"></u-picker>

		<dx-select v-model="showWorktypeSelect" mode="mutil-column-auto" :list="worktypeList" @confirm="worktypeConfirm"></dx-select>

		<u-picker v-model="selectAddressDialog" mode="region"   @confirm="addressConfirm"></u-picker>
	</view>
</template>

<script>
	import auth from '@/common/auth.js'
	import log from '@/common/log-util.js'
	import utils from '@/common/utils.js'
	import api from '@/common/api-util.js'
	import userinfoConf from "@/common/userinfo-config.js";
	import ErrorCode from '@/api/error-code.js'
	import UInput from "../../../../../uview-ui/components/u-input/u-input";
	import UImage from "../../../../../uview-ui/components/u-image/u-image";
	import UPicker from "../../../../../uview-ui/components/u-picker/u-picker";
	export default {
		components: {UPicker, UImage, UInput},
		data() {
			return {
				loading: true,
				selectTimeDialog:false,
				selectAddressDialog: false,
				showWorktypeSelect:false,
				userInfo: null,
				showModal: false,
				modalTitle:"hello",
				modalContent: "",
				modalType: 1,
				type:0,
				selectDialog:false,
				selectList:[],
				defaultBirth:"1990-06-06",
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				sexList: userinfoConf.sexList,
				degreeList: userinfoConf.degreeList,
				healthList: userinfoConf.healthList,
				workYearList: userinfoConf.workYearList,
				worktypeList:[],
				politicList: userinfoConf.politicList,
				nationList: userinfoConf.nationList,
				maritalList: userinfoConf.maritalList,
			 }
		},
		onLoad(){
			this.loading = true;
			api.user.userDetailInfo().then(res => {
				if (res.code == api.SUCCESS) {
					this.userInfo = this.formatUserInfo(res.data);
					this.loading = false;
					if (this.userInfo.worktype_id > 0) {
						//回调赋值
						api.projectWorktype.getWorktypeInfo(this.userInfo.worktype_id).then(r => {
							if (r.code == api.SUCCESS) {
								this.userInfo.worktypeName = r.data.name;
								log.debug(r.data.name)
								log.debug(this.userInfo)
							}
						})
					}
					this.$store.commit('userInfo', res.data);
				}
			})

			// auth.getUserInfo().then(info => {
			// 	this.userInfo = this.formatUserInfo(info);
			// 	this.loading = false;
			// 	if (this.userInfo.worktype_id > 0) {
			// 		//回调赋值
			// 		api.getWorktypeInfo(this.userInfo.worktype_id).then(res => {
			// 			if (res.code == api.SUCCESS) {
			//
			// 				this.userInfo.worktypeName = res.data.name;
			// 				log.debug(res.data.name)
			// 				log.debug(this.userInfo)
			// 			}
			// 		})
			// 	}
			// });
		},
		methods: {
			searchLabelByKey(list, key) {
				for(var i=0; i<list.length; i++) {
					if (list[i].value == key) {
						return list[i].label;
					}
				}
				return "";
			},
			formatUserInfo(userInfo){
				userInfo.sexStr = this.searchLabelByKey(this.sexList, userInfo.sex);
				userInfo.healthStr = this.searchLabelByKey(this.healthList, userInfo.health);
				userInfo.degreeStr = this.searchLabelByKey(this.degreeList, userInfo.degree);
				userInfo.maritalStr = this.searchLabelByKey(this.maritalList, userInfo.marital);
				userInfo.politicyStr = this.searchLabelByKey(this.politicList, userInfo.politics);
				userInfo.workYearStr = this.searchLabelByKey(this.workYearList, userInfo.working_years);
				userInfo.birth = utils.formatDate(userInfo.birth);
				userInfo.worktypeName = "";
				if (userInfo.province) {
					userInfo.addressStr = "";
					if (userInfo.province) {
						userInfo.addressStr = userInfo.addressStr + userInfo.province;
					}
					if (userInfo.city) {
						userInfo.addressStr = userInfo.addressStr + " " + userInfo.city;
					}
					if (userInfo.area) {
						userInfo.addressStr = userInfo.addressStr + " " + userInfo.area;
					}
					// if (userInfo.location) {
					// 	userInfo.addressStr = userInfo.addressStr + " " + userInfo.location;
					// }
				}

				return userInfo;
			},
			modalConfirm(){
				api.user.modifyUserStrInfo(this.type, this.modalContent).then(res => {
					if (res.code == api.SUCCESS) {
						this.userInfo = res.data;
						auth.updateLocalUserInfo(this.userInfo);
						this.userInfo = this.formatUserInfo(this.userInfo);
					} else {
						utils.toast(api.getErrorMessage(res.code));
					}
				})
			},
			addressConfirm(e){
				log.debug("addressConfirm");
				log.debug(e)
				api.user.modifyUserAddress(e.province.label, e.city.label, e.area.label, "").then(res => {
					if (res.code == api.SUCCESS) {
						if (res.code == api.SUCCESS) {
							this.userInfo = res.data;
							auth.updateLocalUserInfo(this.userInfo);
							this.userInfo = this.formatUserInfo(this.userInfo);
						} else {
							utils.toast(api.getErrorMessage(res.code));
						}
					}
				})
			},
			modifySex(){
				this.selectDialog = true;
				this.type = 1;
				this.selectList = this.sexList;
			},
			modifyBirth(){
				this.selectTimeDialog = true;
				var birth = utils.formatDate(this.userInfo.birth);
				if (birth) {
					this.defaultBirth = birth;
				} else {
					this.defaultBirth = "1980-06-06";
				}
			},
			modifyAddress(){
				this.selectAddressDialog = true;
				log.debug(this.addressList)
			},
			changeAvatar() {
				var that = this;
				uni.chooseImage({ // 从本地相册选择图片或使用相机拍照。
					count: 1,//默认选择1张图片
					sizeType: ['compressed'],//original 原图，compressed 压缩图，默认二者都有
					success:  (res)=> {
						console.log(res.tempFilePaths[0]);//成功则返回图片的本地文件路径列表 tempFilePaths
						api.user.changeUserAvatar(res.tempFilePaths[0]).then(function(res) {
							if (res.code == api.SUCCESS) {
								that.userInfo = res.data;
								auth.updateLocalUserInfo(that.userInfo);
								that.userInfo = that.formatUserInfo(that.userInfo);
							} else {
								utils.toast(api.getErrorMessage(res.code));
							}
						})
					}
				});
			},
			modifyWechatPic(){
				var that = this;
				uni.chooseImage({ // 从本地相册选择图片或使用相机拍照。
					count: 1,//默认选择1张图片
					sizeType: ['compressed'],//original 原图，compressed 压缩图，默认二者都有
					success:  (res)=> {
						console.log(res.tempFilePaths[0]);//成功则返回图片的本地文件路径列表 tempFilePaths
						api.user.changeUserWechatQrcode(res.tempFilePaths[0]).then(function(res) {
							if (res.code == api.SUCCESS) {
								that.userInfo = res.data;
								auth.updateLocalUserInfo(that.userInfo);
								that.userInfo = that.formatUserInfo(that.userInfo);
								log.debug("wechat qrcode");
								log.debug(that.userInfo);
							} else {
								utils.toast(api.getErrorMessage(res.code));
							}
						})
					}
				});
			},
			birthConfirm(e){
				var birth = e.year+"-"+e.month+"-" + e.day;
				api.user.modifyUserStrInfo(6, birth).then(res => {
					if (res.code == api.SUCCESS) {
						this.userInfo = res.data;
						auth.updateLocalUserInfo(this.userInfo);
						this.userInfo = this.formatUserInfo(this.userInfo);
					} else {
						utils.toast(api.getErrorMessage(res.code));
					}
				})
			},

			modifyNickname(){
				this.showModal = true;
				this.modalTitle = "修改昵称";
				this.modalContent = this.userInfo.nickname;
				this.type = 12;
			},
			modifyMobile(){
				this.showModal = true;
				this.modalTitle = "联系手机号";
				this.modalContent = this.userInfo.mobile;
				this.type = 3;
			},
			modifyWechat(){
				this.showModal = true;
				this.modalTitle = "联系微信号";
				this.modalContent = this.userInfo.wechat;
				this.type = 4;
			},

			modifyDegree(){
				this.selectDialog = true;
				this.type = 11;
				this.selectList = this.degreeList;
			},
			modifyNation(){
				this.selectDialog = true;
				this.type = 7;
				this.selectList = this.nationList;
			},
			modifyHealth(){
				this.selectDialog = true;
				this.type = 10;
				this.selectList = this.healthList;
			},
			modifyWorkYears(){
				this.selectDialog = true;
				this.type = 8;
				this.selectList = this.workYearList;
			},
			modifyPolitics(){
				this.selectDialog = true;
				this.type = 9;
				this.selectList = this.politicList;
			},
			modifyMarital(){
				this.selectDialog = true;
				this.type = 15;
				this.selectList = this.maritalList;
			},
			modifyWorktype(){
				this.type = 14;
				utils.showLoading("数据加载中...");
				api.projectWorktype.getDefaultWorkTypes().then(res => {
					if(res.code == api.SUCCESS) {
						this.worktypeList = [];
						for (var i=0; i<res.data.length; i++) {
							var cat = {};
							var item = res.data[i];
							cat.label = item.name;
							cat.value = item.id;
							var children = [];
							for (var j=0; j<item.worktypes.length; j++) {
								children.push({
									label: item.worktypes[j].name,
									value: item.worktypes[j].id
								})
							}
							cat.children = children;
							this.worktypeList.push(cat);
						}
						utils.hideLoading();
						this.showWorktypeSelect = true;
					}
				})
			},
			worktypeConfirm(e){
				log.debug("worktypeConfirm");
				log.debug(e);

				api.user.modifyUserIntInfo(this.type, e[1].value).then(res => {
					if (res.code == api.SUCCESS) {
						this.userInfo = res.data;
						auth.updateLocalUserInfo(this.userInfo);
						this.userInfo = this.formatUserInfo(this.userInfo);
						this.userInfo.worktypeName = e[1].label;
					} else {
						utils.toast(api.getErrorMessage(res.code));
					}
				})
			},
			selectConfirm(e) {
				if (this.type == 7){
					api.user.modifyUserStrInfo(this.type, e[0].label).then(res => {
						if (res.code == api.SUCCESS) {
							this.userInfo = res.data;
							auth.updateLocalUserInfo(this.userInfo);
							this.userInfo = this.formatUserInfo(this.userInfo);
						} else {
							utils.toast(api.getErrorMessage(res.code));
						}
					})
				} else {
					api.user.modifyUserIntInfo(this.type, e[0].value).then(res => {
						if (res.code == api.SUCCESS) {
							this.userInfo = res.data;
							auth.updateLocalUserInfo(this.userInfo);
							this.userInfo = this.formatUserInfo(this.userInfo);
						} else {
							utils.toast(api.getErrorMessage(res.code));
						}
					})
				}

			}
		}
	}
</script>

<style>
	.slot-content{
		padding: 48rpx;
	}
</style>
