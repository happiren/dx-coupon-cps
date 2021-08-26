<template>
	<view>
		<dx-poster ref="hchPoster" @cancel="handleCancel" :posterData.sync="posterData" @previewImage='previewImage' />

		<view @click="handleShowPoster">生成海报</view>
	</view>
</template>

<script>
	import auth from '@/common/auth.js'
	import utils from '@/common/utils.js'
	import api from '@/common/api-util.js'
	import log from '@/common/log-util.js'

	export default {
		data() {
			return {
				posterData: {
					"poster": {
						//根据屏幕大小自动生成海报背景大小
						"url": "https://dianxiang.oss-cn-hangzhou.aliyuncs.com/cps/uploads/image/background.jpg",//图片地址
						"r": 10, //圆角半径
						"w": 280, //海报宽度
						"h": 440, //海报高度
						"p": 0 //海报内边距padding
					},
					"mainImg": {
						// 海报主商品图
						"url": "",//图片地址
						"r": 10, //圆角半径
						"w": 40, //宽度
						"h": 40 //高度
					},
					"title": {
						//商品标题
						"text": "",//文本
						"fontSize": 16, //字体大小
						"color": "#000", //颜色
						"lineHeight": 25, //行高
						"mt": 20 //margin-top
					},
					"codeImg": {
						//小程序码
						"url": "https://dianxiang.oss-cn-hangzhou.aliyuncs.com/cps/uploads/image/1629704166.png",//图片地址
						"w": 80, //宽度
						"h": 80, //高度
						"mt": 300, //margin-top
						"r": 0 //圆角半径
					},
					"tips": [
						// 提示信息
						// {
						// 	"text": "记忆之王",//文本
						// 	"fontSize": 14,//字体大小
						// 	"color": "#2f1709",//字体颜色
						// 	"align": "center",//对齐方式
						// 	"lineHeight": 25,//行高
						// 	"mt": 20//margin-top
						// },
					]
				},
				qrcode: "www.happiren.com",
				background: "https://dianxiang.oss-cn-hangzhou.aliyuncs.com/background.jpg",
			}
		},
		onLoad(options){

		},
		methods: {
			handleShowPoster() {
				this.$refs.hchPoster.posterShow();
				this.deliveryFlag = false
			},

			handleCancel(e){
				log.debug("handleCancel", e)
			},

			previewImage(e){
				log.debug("previewImage", e)
			},

		}
	}
</script>

<style>

</style>
