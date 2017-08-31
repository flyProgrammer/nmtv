//var util = require('../../utils/util.js')
var app = getApp();
var globalData = getApp().globalData
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    orderList: [],
    status: "未支付"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (parm) {
      //that.data.userInfo = app.globalData.openid
    })
    //获取全局变量，并复制给当前脚本变量userinfo
    var rdkey = wx.getStorageSync('rdkey');
    wx.request({
      url: 'https://wttest.96066.com/app/index.php?m=order&c=api&a=order_list',
      data: {
        "rdkey": rdkey,
        "small": "small"
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT

      success: function (res) {
        // success
        console.log(res);
        that.setData({
          orderList: res.data.order_list
        })
      },
      fail: function (res) {
        // fail
        // console.log(res)
      },
      complete: function (res) {
        // complete
        // console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


})