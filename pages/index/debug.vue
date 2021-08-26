<template>

    <view>
		<view>
			<view>蓝牙测试</view>
			<u-button type="primary" size="mini" shape="circle" @click="startBluetoothDeviceDiscovery">开始蓝牙搜索</u-button>
			<u-button type="primary" size="mini" shape="circle" @click="stopBluetoothDevicesDiscovery">停止蓝牙搜索</u-button>
			<u-button type="primary" size="mini" shape="circle" @click="broadcastBluetooth">转换为设备</u-button>
			<view>搜索设备</view>
			<view v-for="(item, index) in devicesList" :key="index">
			    advUuid:<text>{{item.advertisServiceUUIDs.length > 0 ? item.advertisServiceUUIDs[0] : ""}}</text>
			    name:<text>{{item.name}}</text>
			    localName:<text>{{item.localName}}</text>
			</view>
		</view>
		<view>
		    <view>人脸识别demo
		    </view>
		    <u-button type="primary" size="default" shape="circle" @click="getFirstPhoto()">身份证照片</u-button>
		    <u-button type="primary" size="default" shape="circle" @click="getSecondPhoto()">正常生活照</u-button>
		    <u-button type="primary" size="default" shape="circle" @click="validate()">人脸识别</u-button>
			<view>
				<text>识别得分：</text>
				<text>{{faceScore}}</text>
			</view>

		</view>

		<view>
			<u-button type="primary" size="default" shape="circle" @click="getWifiInfo()">获取wifi信息</u-button>
		</view>
<!--		<ly-tree-->
<!--				v-if="isReady"-->
<!--				:props="props"-->
<!--				show-radio-->
<!--				node-key="id"-->
<!--				:load="loadNode"-->
<!--				lazy-->
<!--		/>-->
    </view>


</template>

<script>
	import gps from '@/common/GPSUtils.js'
    import auth from '@/common/auth.js'
    import utils from '@/common/utils.js'
    import commonFun from '@/common/common-func.js'
    import api from '@/common/api-util.js'
    import log from '@/common/log-util.js'
    import UImage from "../../uview-ui/components/u-image/u-image";
    import UGap from "../../uview-ui/components/u-gap/u-gap";

    import aes from '@/common/aes.js'
    import UButton from "../../uview-ui/components/u-button/u-button";
	// import LyTree from '@/components/ly-tree/ly-tree.vue'
    export default {
        components: {UButton, UGap, UImage},
        data() {
            return {
				loading:true,
                noMoreFlag: false,
                devicesList:[],
                firstPhotoBase64: null,
                secondPhotoBase64: null,
				faceScore: 0,
				isReady: false,
				props: {
					label: 'name',
					children: 'zones',
					 isLeaf: 'leaf'
				},
				projectId:1408485730287649,
            }
        },
        onLoad() {

        	//树形结构
			this.isReady = true;



			// wx.startWifi({
			// 	success(res){
			// 		console.log("wifi start success", res);
			// 	},fail(res){
			// 		console.log("wifi start fail", res);
			// 	}
			// });

			
			uni.login({
				provider: "weixin",
				success: (res => {
					let code = res.code;
					
					//暂时不做调整
					api.user.code2unionid(code).then(res => {
						log.debug(res);
						if (res.code == api.SUCCESS) {
							utils.toast(JSON.stringify(res.data));
						}
					})
				}),
				fail: (res) => {
					// utils.hideLoading("加载中...");
					utils.toast("微信登录失败");
				}
			});


			var distance1 = gps.getDistance(117.59602466, 24.1068298, 117.59457,24.107807);
			var distance2 = gps.getDistance(117.59602466, 24.1068298, 117.59339,24.106382);
			log.debug("gps1", distance1)
			log.debug("gps2", distance2)

            var word = "hello";

            var sec = aes.decrypt("5A08E46E22801006ADBC02D509AA13DE")
            log.debug("sec", sec);

            uni.openBluetoothAdapter({
				mode: "central", //主机模式
                success: res => {
                    log.debug("初始化蓝牙模块成功")
					utils.toast("初始化蓝牙模块成功")

                },
                fail: err => {

                    log.debug(`初始化蓝牙模块失败` + JSON.stringify(err))
                },
            });
        },
        onShow(){

        },
        methods: {
			/*
             * @description 懒加载函数，每次展开节点时自动调用这个函数
             * @method loadNode
             * @param {Object} node 节点对象，可以打印一下里面具体有什么参数
             * @param {Function} resolve 一个回调函数，执行resolve([...])将节点数据回调给树组件处理
            */
			loadNode(node, resolve) {
				console.log(('node节点参数', node));

				// 因为这个函数是在Vue实例以外的地方调用，如果函数内部需要用到this，需要改成_self
				// _self.isReady; 这里用_self而不是this


				// 通常，我们需要这样去调用一个请求，并把结果通过resolve回调
				// 开发者可以按照以下的请求方式去做请求并返回数据
				// uni.request({
				//     url: 'https://www.example.com/request', //仅为示例，并非真实接口地址。
				//     data: {
				//         id: node.data.id
				//     },
				//     success: (res) => {
				// 		resolve(res.data) // 假设这里的res.data是[]数据
				//     }
				// });
				log.debug("nodee", node)
				api.dept.getChildDept(this.projectId, node.key || 0).then(res => {
					if (res.code == api.SUCCESS) {
						let depts = [];
						res.data.forEach(item => {
							let dept = {};
							dept.id = item.id;
							dept.name = item.name;
							if (item.sub_dept_num > 0) {
								// dept.isLeaf = false
							} else {
								dept.leaf = true
							}
							log.debug(dept)
							depts.push(dept)
						})
						resolve(depts)
					} else {
						resolve([])
					}

				})

				// 这里只是为了模拟数据，这个条件是用来判断当数的层级是第一层，也就是根节点，则返回根节点数据
				// if (node.level === 0) {
				// 	api.dept.getChildDept(_self.projectId, node.id).then(res => {
				// 		resolve(res.data)
				// 	})
				// 	// setTimeout(() => {
				// 	// 	resolve([{
				// 	// 		id: '1',
				// 	// 		name: 'region'
				// 	// 	}]);
				// 	// }, 1000);
				// } else {
				// 	if (node.level > 1) return resolve([]);
				//
				// 	setTimeout(() => {
				// 		const data = [{
				// 			id: '2',
				// 			name: 'leaf',
				// 			leaf: true
				// 		}, {
				// 			id: '3',
				// 			name: 'zone'
				// 		}];
				//
				// 		resolve(data);
				// 	}, 500);
				// }
			},

			getWifiInfo(){
				console.log("getWifiInfo");
				wx.getConnectedWifi({
					success(res) {
						console.log("wifi info", res);

					},
					fail(res) {
						console.log("wifi info fail", res);
					},
					complete(res) {
						console.log("wifi info complete", res);
					}
				})
			},
            getFirstPhoto(){
                let that = this;
                uni.chooseImage({
                    count: 1, //默认9
                    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album'], //从相册选择
                    success: function(res) {
                        console.log(res)
                        uni.getFileSystemManager().readFile({
                            filePath: res.tempFilePaths[0],
                            encoding: 'base64',
                            success: response => {
                                that.firstPhotoBase64 = response.data;
                                let base64 = 'data:image/png;base64,' + response.data
                                console.log(base64)
                            }
                        })
                    }
                });
            },
            getSecondPhoto(){
                let that = this;
                uni.chooseImage({
                    count: 1, //默认9
                    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album'], //从相册选择
                    success: function(res) {
                        console.log(res)
                        uni.getFileSystemManager().readFile({
                            filePath: res.tempFilePaths[0],
                            encoding: 'base64',
                            success: response => {
                                that.secondPhotoBase64 = response.data;
                                let base64 = 'data:image/png;base64,' + response.data
                                console.log(base64)
                            }
                        })
                    }
                });
            },
            validate(){
				let that = this;
				that.faceScore = 0;
                uni.request({
                    url:"https://aip.baidubce.com/rest/2.0/face/v3/match?access_token=24.8558c614dfe6326f35a76c6e6cd22cb5.2592000.1622081877.282335-24073830",
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
					method: "POST",
                    data:[
                        {
                            "image":that.firstPhotoBase64,
                            "image_type": "BASE64",
                            "face_type": "IDCARD",
							"quality_control": "NONE",
                            "liveness_control": "NONE",
                        },
                        {
                            "image":that.secondPhotoBase64,
                            "image_type": "BASE64",
							"face_type": "LIVE",
                            "quality_control": "LOW",
                            "liveness_control": "LOW",
                        }
                    ],
                    fail(res){
                    	utils.toast("实名认证请求失败");
                        console.log("validate fail")
                    },
                    success(r) {
						var res = r.data;
						console.log("face validate res", res)
						if (res.error_code == 0) {
							that.faceScore = res.result.score;
						} else {
							utils.toast("人脸识别请求失败")
						}
                    }
                })
            },

            async onShareAppMessage(res) {
                log.debug("onShareAppMessage")
                log.debug(res)
				let coverImage = await api.common.miniappShareCover();
				log.debug("coverImage", coverImage);

                return {
                    title: "快来和我一起玩转携筑",
                    path: "pages/common/article/article" ,
                    // imageUrl: code.code
                }
            },

			ab2hex(buffer) {
			  var hexArr = Array.prototype.map.call(
				new Uint8Array(buffer),
				function(bit) {
				  return ('00' + bit.toString(16)).slice(-2)
				}
			  )
			  return hexArr.join('');
			},
            //1.搜索周边设备
            startBluetoothDeviceDiscovery() {

                uni.showLoading({
                    title: '蓝牙搜索中'
                })
                let self = this;
                self.devicesList = [];
                setTimeout(() => {
                    uni.startBluetoothDevicesDiscovery({
                        success: res => {
                            uni.onBluetoothDeviceFound(devices => {
                                // console.log("发现设备: " + JSON.stringify(devices));
								// console.log("发现设备: ",devices);

                                let obj = devices.devices[0];
                                devices.devices.forEach(item => {
									console.log("发现蓝牙设备: ", item);
									console.log("发现蓝牙广播UUID: ", item.advertisServiceUUIDs); //通过该uuid来进行打卡，使用最后的48bit数据进行区分
									console.log("发现设备 广播数据: " + self.ab2hex(item.advertisData));
								})
                                //obj不重复,就添加到devicesList中,
                                if (!self.devicesList.some(item => {
                                    return item.deviceId === obj.deviceId

                                })) {
                                    self.devicesList.push(obj)
                                }
                                // log.debug("devicelist", self.devicesList)
                            });
                        },
                        fail: err => {
                            uni.hideLoading();
                            log.debug(`搜索设备失败` + JSON.stringify(err))
                            utils.toast(`搜索设备失败` + JSON.stringify(err));
                        }
                    })
                }, 200)
            },
            //2.停止搜索蓝牙设备
            async stopBluetoothDevicesDiscovery() {
				uni.hideLoading();
				uni.stopBluetoothDevicesDiscovery({
					success (res) {
						console.log("关闭蓝牙搜索成功", res)
					}
				})

            },
            //广播蓝牙
            async broadcastBluetooth(){
				console.log("broadcastBluetooth");
				uni.openBluetoothAdapter({
					mode: "peripheral", //主机模式
					success: res3 => {
						utils.toast("初始化蓝牙模块成功")
						wx.createBLEPeripheralServer({
							success: (res) => {
								console.info('createBLEPeripheralServer successed', res);
								let server = res.server;
								console.log(server);
								let uuid1 = '0000af8e-i98iiiiiiiiiiiiiiiiiiii-00805f9b3666';
								let uuid2 = '5E8757A4-354F-4996-B9EF-1FC7BA006A6D';
								//['0000aabb-0000-1000-8000-00805f9b34fb', '00009523-0000-1000-8000-00805f9b34fb'] //ok
								// ['5E8757A4-354F-4996-B9EF-1FC7BA006A6D'] //ok
								let buff = [0x01, 0x02, 0x03, 0x04];
								let serviceUuids = [
									'000018F0-0000-1000-8000-123456789012',
									'5E8757A4-354F-4996-B9EF-1FC7BA006A6D',

								]; // ok

								server.startAdvertising({
									advertiseRequest: {
										connectable: false,
										serviceUuids: serviceUuids,
										powerLevel: "high",
										deviceName: "携筑",
										manufacturerData: [{
											manufacturerId: 0x01AC,
											manufacturerSpecificData: buff
										}]
									},
									success(res){
										utils.toast("广播成功")
									},
									fail(res1){
										utils.toast("广播失败")
										console.log("广播失败", res1)
									}
								})
							},
							fail(res){
								console.log("创建蓝牙外设失败", res)
								utils.toast("创建蓝牙外设失败")
							},
							complete(res) {
								console.log("创建蓝牙外完成", res)
							}
						});
					},
					fail: err => {

						log.debug(`初始化蓝牙模块失败` + JSON.stringify(err))
					},
				});

            },


        }
    }
</script>

<style>




</style>
