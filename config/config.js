const CONFIG = {
    //生产环境配置
    production: {
		debug: true,  //调试信息
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'https://cps.hxq123456.com',  // 后台接口请求地址
        hostUrl: 'http://cps.hxq123456.com',        // H5地址(前端运行地址)
        websocketUrl: '',        // websocket服务端地址
        weixinAppId: '' ,// 微信公众号appid
        agreement: 'https://cpms-api.jianyb.com/api/v2/h5/help/agreement',
		privacy: 'https://cpms-api.jianyb.com/api/v2/h5/help/privacy',
		h5DebugUid: 120, //100011 哈皮人 5 100040
    },
  //   //测试环境配置
  //   development: {
		// debug: false,  //调试信息
  //       assetsPath: '/static', // 静态资源路径
  //       baseUrl: 'https://cpms-test-api.jianyb.com',  // 后台接口请求地址
  //       hostUrl: 'http://localhost:8080',        // H5地址(前端运行地址)
  //       websocketUrl: '',        // websocket服务端地址
  //       weixinAppId: '' ,// 微信公众号appid
  //       agreement: 'https://cpms-test-api.jianyb.com/api/v2/h5/help/agreement',
  //       privacy: 'https://cpms-test-api.jianyb.com/api/v2/h5/help/privacy',
  		// h5DebugUid:187,
  //   }

};
export default CONFIG["production"];
// export default CONFIG[process.env.NODE_ENV];
