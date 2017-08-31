var util = require('../../utils/util.js')
var app = getApp();
var program_id;
var tc_type;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    proList: [],
    month: 6,
    showLoading: true,
    flag:false,
    flag1: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this;
    //调用应用实例的方法获取全局数据
    console.log(option);
    that.setData({
      program_id: option.id,
      showLoading: false
    })
    program_id = option.id;
    var user_id = 54;
    wx.request({
      url: 'https://wttest.96066.com/app/index.php?m=program&c=api&a=program_dt&program_id=' + program_id + '&userid=' + user_id,
      data: {
      },
      method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        tc_type = res.data.program_dt.category;
        console.log(res);
        console.log(666);
        that.setData({
          proList: res.data.program_dt,
        })
      },
      fail: function (res) {
        // fail
        console.log(res);
      },
      complete: function (res) {
        // complete
      }
    })
  },
  checkBind: function () {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      showLoading: true
    })
  },
  //生成订单
  gopay: function () {
     var that = this;
     wx.request({
       url: 'https://wttest.96066.com/app/index.php?m=boss&c=api&a=checkBind',
       data: {
         "rdkey": wx.getStorageSync('rdkey'),
         "small": "small"
       },
       method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       success: function (res) {
         console.log(res+'----------------------');
         if (res.data.code == 1) {
           wx.navigateTo({
             url: '/pages/pay2/pay2?month=' + that.data.month + '&program_id=' + program_id+'&type='+tc_type,
           })
         }else{
            that.setData({
                flag1:false
            })
          }
        }
       })
      },
  product:function(){
    this.setData({
      flag1: true
    })
    wx.navigateBack();
    // wx.navigateTo({
    //   url: '/pages/my/my',
    // })
  },

  back:function(){
    this.setData({
      flag1:true
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  //增加订购月份
  plus: function () {
    var months = this.data.month;
    this.setData({
      month: months + 1
    })
  },
  //减少订购月份
  sub: function () {
    var months = this.data.month;
    if (months > 1) {//当等于一个月的时候就不能减了
      this.setData({
        month: months - 1
      })
    }
  },

  monthValue: function (e) {
    this.setData({
      month: e.detail.value
    })
  },
})