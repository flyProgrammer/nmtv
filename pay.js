// pages/pay/pay.js
Page({
  show: function () {
    wx.showToast({
      title: '尚在开发中，敬请期待',
      icon: 'loading',
      duration: 2000
    })
  },
  data: {
    userinfo: [],
    userInfo: [],
    month: 3,
    msg: [],
    aNo: '',
    name: '',
    addr: '',
    orderid: '',
    bs:'',
  },
  onLoad: function (res) {
    var that = this;
    console.log(res);
    var orderid = res.id;
    that.setData({
      orderid: res.id
    })
    // 页面初始化 res为页面跳转所带来的参数
    var op = wx.getStorageSync('orderPay');
    var bs = wx.getStorageSync('business');
    that.setData({
      aNo: op[0],
      addr: op[1],
      name: op[2],
      bs:bs,
    })
    //调用应用实例的方法获取全局数据
    that.setData({
      month: res.month,
    })
    var month = res.month;
  },
  //提交并结算
  submit: function () {
    var that = this;
    wx.request({
      url: 'https://wttest.96066.com/app/index.php?m=pay&c=api&a=SmallPayOrderFamily',
      // url: 'http://localhost/Wxpay/example/jsapi.php',
      data: {
        "rdkey": wx.getStorageSync('rdkey'),
        "order_id": that.data.orderid
      },
      method: 'GET',
      dataType: '',
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
        var msg = res.data.pay_key;
        console.log(msg+'-------------------------');
        var time = (msg.timeStamp).toString();
        console.log(time);
        console.log(112233);
        
          wx.requestPayment({
            timeStamp: time, 
            nonceStr: msg.nonceStr, 
            signType: 'MD5',
            package: msg.package,
            paySign: msg.paySign,
            success: function (res) { 
              console.log(6666666666)
            } ,
            fail: function (res) {
              console.log("出现签名错误，可能是由于加密的key出现问题")
              console.log(32323232);
            },
            complete: function (res) { }
          })
        }else{
          wx.showModal({
            title: '',
            content: res.data.msg,
          })
        }
      }
    })
  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})