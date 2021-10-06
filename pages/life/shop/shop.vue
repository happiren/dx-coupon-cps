<template>
  <view>
    <view v-if="loading">

    </view>
    <view v-else="loading" class="shop">
      <view v-if="showCollectMiniappTips" class="collect-tips" @click="disableShowCollectMiniapp()">
        <view class="triangle"></view>
        <view class="wrap">
          <view>
            <text>添加到我的小程序，每天领红包</text>
          </view>
          <view style="margin-left: 16rpx;">
            <u-icon name="close" size="22"></u-icon>
          </view>
        </view>
      </view>
      <view class="info animated fadeIn faster">
        <view class="left">
          <view class="title">{{ shopInfo.shopName }}</view>
          <view class="rate-cate">
            <u-rate :count="5" v-model="shopInfo.shopPower / 10" :disabled="true"></u-rate>

            <text class="power">{{ shopInfo.shopPower ? shopInfo.shopPower / 10 : 0 }}</text>
            <view class="cate-name">{{ shopInfo.cateName }}</view>
          </view>
          <view class="address">{{ shopInfo.address }}</view>
          <view class="time">营业时间：{{ shopInfo.bizHourDesc }}</view>
          <view class="sale">
            <!-- <uni-icons type="flag-filled" size="16" color="#e62828"></uni-icons> -->
			<u-icon v-if="shopInfo.gradeIcon" :name="shopInfo.gradeIcon" style="margin-right: 8rpx;" size=28></u-icon>
			<u-tag v-if="shopInfo.isMustEat" text="必吃榜" size="mini" mode="light" style="margin-right: 8rpx;" shape="circle" color="#FF536F" bg-color="#F4F4F4" border-color="#F4F4F4"/>

            <!-- <text class="icon-font iconfont-fire"></text> -->
  <!--          <view class="info">人均消费 {{  Math.floor(item.shopInfo.pricePerson / 100) }} 元</view>-->
            <text v-if="shopInfo.pricePerson > 0" class="count">人均消费 {{ Math.floor(shopInfo.pricePerson / 100)}}</text>
          </view>
        </view>
        <image class="right" :src="dealBaseInfo.defaultPic"></image>
      </view>
      <view class="how animated fadeIn faster">
        <view class="title">省钱步骤</view>
        <view class="items">
          <view class="item">
            <view class="icon">
              <image
                class="icon-image"
                src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5421f5a2-25ab-411d-b114-90177d80d0eb/7ddba667-acac-4725-aa2a-fd76603f0dbe.png"
              ></image>
            </view>
            <view class="label">
              <view>点击领券</view>
              <view>用券下单</view>
            </view>
          </view>
          <image
            class="icon-dot-arrow"
            mode="widthFix"
            src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5421f5a2-25ab-411d-b114-90177d80d0eb/158c53f7-ac1e-4cff-9eb7-8404f6e751c3.png"
          ></image>
          <view class="item">
            <view class="icon">
              <image
                class="icon-image"
                src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5421f5a2-25ab-411d-b114-90177d80d0eb/3773676f-acf6-4d95-bb46-8eb910f4281a.png"
              ></image>
            </view>
            <view class="label">
              <view>到店消费</view>
              <view>享优惠</view>
            </view>
          </view>
          <!-- <image
            class="icon-dot-arrow"
            mode="widthFix"
            src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5421f5a2-25ab-411d-b114-90177d80d0eb/158c53f7-ac1e-4cff-9eb7-8404f6e751c3.png"
          ></image>
          <view class="item">
            <view class="icon">
              <image
                class="icon-image"
                src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5421f5a2-25ab-411d-b114-90177d80d0eb/0f04c25c-8b45-46b3-aa71-c8d69bdf0625.png"
              ></image>
            </view>
            <view class="label">
              <view>24小时内同步订单</view>
              <view>返现到账</view>
            </view>
          </view> -->
        </view>
      </view>
      <view class="list animated fadeIn faster">
        <view class="header">
          <view class="icon">惠</view>
          <view class="title">优惠列表</view>
        </view>
        <product-list ref="productList" :list="shopList" :appId="miniAppId"></product-list>
      </view>
    </view>
  </view>
</template>

<script>
  import auth from '@/common/auth.js'
  import log from '@/common/log-util.js'
  import utils from '@/common/utils.js'
  import api from '@/common/api-util.js'
import productList from "@/components/product-list/product-list";

export default {
  components: {
    productList,
  },
  data() {
    return {
      loading: false,
      showCollectMiniappTips: false,
      miniAppId: "",
      shopInfo:{},
      dealDetail:{},
      dealBaseInfo:{},
      shopList:{},
    };
  },
  computed: {

  },
  components: {
    productList,
  },
  onLoad: function (option) {
    const { shopId } = option;
    this.getShopDetail(shopId);
    this.checkShowCollectMiniapp();
  },
  onShow(){
    this.checkShowCollectMiniapp();
  },
  methods: {
    checkShowCollectMiniapp(){
      let scene = 0;
      //#ifdef MP-WEIXIN
      scene = wx.getLaunchOptionsSync().scene;
      //#endif
      log.debug("scene", scene)
      if ((scene == 1011 || scene == 1048 || scene == 1047) && utils.getStorageSync("disableShowMiniAppTips") != '1') {
        this.showCollectMiniappTips = true;
      }
    },
    async getShopDetail(shopId) {
      this.loading = true;
      utils.showLoading("加载优惠中");
      api.mt.miniAppId().then(res => {
        if (res.code == api.SUCCESS) {
          this.miniAppId = res.data;
        }
      })
      api.mt.dealsSearch({'shopIds':shopId}).then(res => {
        utils.hideLoading();
        if (res.code == api.SUCCESS) {
          this.shopList = res.data.records;
          if (this.shopList.length > 0) {
            let shop = this.shopList[0]
            this.shopInfo = shop.shopInfo;
            this.dealDetail = shop.dealDetail;
            this.dealBaseInfo = shop.dealBaseInfo;
          }
        }
        this.loading = false;
      })


    },
    disableShowCollectMiniapp(){
      this.showCollectMiniappTips = false;
      utils.setStorageSync("disableShowMiniAppTips", "1");
    },
    onShareAppMessage(res) {
      return {
        title: `大众点评优惠券限时抢！${this.shopInfo.shopName}`,
        imageUrl: this.dealBaseInfo.defaultPic
      };
    },
    onShareTimeline(res) {
      return {
        title: `大众点评优惠券限时抢！${this.shopInfo.shopName}`,
        imageUrl: this.dealBaseInfo.defaultPic
      };
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
}

.collect-tips{
  z-index: 11002;
  position: absolute;
  right: 20rpx;
  top: 0rpx;
  .triangle{
    position: relative;
    z-index: 11002;
    width: 0;
    height: 0;
    right: 100rpx;
    border-right: 12rpx solid transparent;
    border-bottom: 20rpx solid #000;
    border-left: 12rpx solid transparent;
    margin-left: auto;
    margin-right: 13rpx;
  }
  .wrap{
    position: relative;
    right: 20rpx;
    padding: 10rpx 26rpx;
    border-radius:26rpx;
    font-size: 22rpx;
    background: #000;
    color: #FFF;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-between;

  }
}

.shop {
  padding: 16rpx;

  .info {
    justify-content: space-between;
    padding: 24rpx 24rpx;
    background-color: #fff;

    .left {
      width: 450rpx;

      title {
        font-size: 30rpx;
        font-weight: 700;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .rate-cate {
        margin-top: 16rpx;

        .at-rate__icon--half .at-rate__left,
        .at-rate__icon--on {
          color: #fc5500;
        }

        .power {
          color: #fc5500;
          margin-right: 45rpx;
          font-size: 30rpx;
          line-height: 30rpx;
        }

        .cate-name {
          width: 139rpx;
          height: 35rpx;
          color: #999;
          font-size: 24rpx;
          line-height: 35rpx;
          border-radius: 4rpx;
          text-align: center;
          background: #f6f6f6;
        }
      }

      .address {
        margin-top: 16rpx;
        font-size: 26rpx;
        color: #666;
      }
	  .time {
	    margin-top: 8rpx;
	    font-size: 24rpx;
	    color: #909399;
	  }

      .sale,
      .sale .icon-font {
        display: flex;
        align-items: center;
      }

      .sale {
        margin-top: 12rpx;

        .icon-font {
          color: #333333;
          font-size: 36rpx;
          height: 36rpx;
          justify-content: center;
          margin-right: 10rpx;
        }

        .count {
          font-size: 26rpx;
          color: #606266;
          font-weight: 400;
          height: 26rpx;
          line-height: 26rpx;
        }
      }
    }

    .right {
      width: 200rpx;
      height: 150rpx;
      border-radius: 10rpx;
    }
  }

  .info,
  .info .left .rate-cate {
    display: flex;
    align-items: center;
  }

  .how {
    margin-top: 17rpx;
    border-radius: 10rpx;
    animation-delay: 0.15s;
    background-color: #fff;
    padding: 20rpx 20rpx 30rpx;

    .title {
      font-size: 30rpx;
      line-height: 30rpx;
      font-weight: 600;
      color: #333;
    }

    .items {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 30rpx;

      .icon-font {
        color: #fc5500;
        font-size: 36rpx;
      }

      .item {
        display: flex;
        align-items: center;
        flex-direction: column;
        text-align: center;

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          width: 70rpx;
          height: 70rpx;
          border-radius: 35rpx;
        }

        .label {
          font-size: 22rpx;
          margin-top: 15rpx;
          height: 60rpx;
        }
      }
    }

    .icon-image {
      width: 70rpx;
      height: 70rpx;
    }

    .icon-dot-arrow {
      width: 40rpx;
    }
  }

  .list {
    .header {
      display: flex;
      align-items: center;
      height: 74rpx;
      padding: 0 4rpx;

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        width: 30rpx;
        height: 30rpx;
        font-size: 22rpx;
        line-height: 22rpx;
        margin-right: 8rpx;
        border-radius: 4rpx;
        background: #f95f04;

        image {
          width: 70rpx;
          height: 70rpx;
        }
      }

      .title {
        font-size: 30rpx;
        line-height: 30rpx;
        font-weight: 600;
        color: #333;
      }
    }
  }
}
</style>
