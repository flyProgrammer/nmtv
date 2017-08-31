//logs.js
var util = require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    proList: [],
    showLoading: true,
    showView: false,
    re: [],
  },
  onReady: function () {
  },
  onLoad: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    wx.request({
      url: 'https://wttest.96066.com/app/index.php?m=program&c=api&a=small_program_list',
      data: {
      },
      method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        that.setData({
          showLoading: false
        })
        console.log(res.data.program_list);
        console.log(111);
        that.setData({
          proList: res.data.program_list,
        })
      },
      fail: function (res) {
        // fail
        that.setData({
          showLoading: false,
          showView: true,
        })
        console.log(1);
      },
      complete: function (res) {
        // complete
        that.setData({
          showLoading: false,
          showView: true,
        })
        console.log(res);
      }
    })
  },
  abc: function (idx) {
    var that = this;
    that.setData({
      re: that.data.proList[idx]
    });
  },
  onShow: function () {
    console.log("页面显示状态执行该函数");
  },
  onHide: function () {
    console.log("页面后台运行状态执行该函数");
  },
  onReachBottom: function () {
    console.log('页面上拉触底事件函数');
  },
  onShareAppMessage: function () {
    console.log('点击分享按钮的时候触发该函数');
  }
})

