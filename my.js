//index.js
//获取应用实例
var app = getApp()
var globalData = getApp().globalData
var QQMapWX = require('../../utils/js/qqmap-wx-jssdk.js');
var qqmapsdk;
var sc_width;
var bind_id;
Page({
  data: {
    imgUrls: [
      {
        link: '/pages/index/index',
        url: '/utils/images/banner/banner1.jpg'
      }, {
        link: '/pages/logs/logs',
        url: '/utils/images/banner/banner2.jpg'
      }, {
        link: '/pages/test/test',
        url: '/utils/images/banner/banner3.jpg'
      }, {
        link: '/pages/test/test',
        url: '/utils/images/banner/banner4.jpg'
      }
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    userInfo: {},
    location: {},
    showView: false,
    selectPerson: true,
    user: [],
    transuser: [],
    flag:true,
    animationDataLeft: {},
    animationDataRight: {},
    right_border:'block',
    bottom_border:'none',
    scWidth:'',
    heart:'90px',
    ava_left:'50px',
    cust_name:'***'
  },
  onShareAppMessage: function () {
    return {
      title: '广电小程序个人中心',
      desc: '广电小程序个人中心!',
      path: '/page/my?id=123'
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    showView: (options.showView == "true" ? true : false)
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        sc_width = res.windowWidth;
        that.setData({
          scWidth: sc_width,
        })
      }
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({//将数据从逻辑层发送到视图层
        userInfo: userInfo.userInfo,
      })
      console.log(userInfo);//微信个人中心的相关信息
    })
    wx.request({
      url: 'https://wttest.96066.com/app/index.php?m=boss&c=api&a=checkBind',
      data: {
        "rdkey": wx.getStorageSync('rdkey'),
        "small": "small"
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        if (res.data.code == 1) {
          that.gobind();
          bind_id = res.data.id;
          that.setData({
            right_border:'none',
            heart:'105px',
            ava_left:(sc_width/2-45)+'px',
            bottom_border:'block',
            cust_name: res.data.userinfo.contact_person
          })
        } 
      }
      })

    console.log(globalData.location);
    //获取上个页面存到缓存里的数据
    var huancun = wx.getStorageSync('orderPay');
    console.log(huancun);
    console.log(454545);
    //将值在前端显示
    that.setData({
      msg: huancun
    })
    
    
    //根据坐标获取位置信息
    qqmapsdk = new QQMapWX({
      key: 'JW6BZ-6Z5K3-WQE3R-3LCTW-Q2QM6-BZB2D'
    });

    // 调用接口
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: globalData.location.latitude,
        longitude: globalData.location.longitude
      },
      success: function (res) {
        if (res.status == 0) {
          console.log(res.result.ad_info.city);

          that.setData({//将数据从逻辑层发送到视图层
            city: res.result.ad_info.city,
          })
        }
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  onShow: function (options){
    
  },
  // 点击查看客户信息详情
  enlarge:function(){
      this.setData({
        flag: "" 
      })
  },

  cancel:function(){
    this.setData({
      flag: "false" 
    })
  },
  //弹出绑定
  show: function () {
    this.setData({ flag: "" });
    console.log();
  },
  //取消
  no: function () {
    this.setData({
      flag: "false"
    })
  },

  // 对输入的智能卡号进行判断
  accountInput: function (e) {
    console.log(e);
    console.log(222222222);
    var aNos = e.detail.value;
    console.log(aNos);
    var that = this;
    //要求所输入的智能卡号的长度必须大于11位并且小于16位
    if (aNos.length < 11 || aNos.length > 16) {
      wx.showModal({
        content: "温馨提示：11位的为宽带账号，16位的为智能卡号，请确认您所输入的账号是否有误"
      })
      return false;
    } else {
      console.log('智能卡号为：' + aNos);
      that.setData({
        aNo: aNos,
        // flag: "false"
      })
    }
  },

  receive: function (e) {
    var that = this;
    console.log(e);
    console.log(5656565);
    //调用应用实例的方法获取全局数据
    wx.request({
      url: 'https://wttest.96066.com/app/index.php?m=boss&c=api&a=bindUser',
      data: {
        "account_no": that.data.aNo,
        "rdkey": wx.getStorageSync('rdkey'),
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        // success

        //判断返回值
        if (res.data.code == 1) {
          bind_id = res.data.id;
          that.no();
          that.setData({
            cust_name: res.data.user_info.name
          });
          that.gobind();
          var binduser = res.data;
          console.log(binduser);
          // 如果代码执行到这里表示返回值正确
          // 存入缓存,由于小程序缓存会被覆盖，所以，需要先获取原来的缓存
          // 获取原来的缓存
          
          
          wx.getStorage({
            key: 'userinfo',
            success: function (res) {
              var user = res.data;
              // console.log(789);
            },
          })
          //合并数组
          var userinfo = user.concat(binduser);
          console.log(userinfo);
          console.log(789);
          //写入缓存
          wx.setStorage({
            key: 'userinfo',
            data: userinfo,
          })
        }else{
          wx.showModal({
            title: '绑定失败',
            content: res.data.msg,
          })
        };

      },
      //立即绑定后将请求接口
      fail: function (res) {
        //系统错误，显示错误给用户
        console.log(res);
        return false;
      },
      complete: function (res) {
        //系统错误，显示错误给用户
        console.log(res);
        return false;
      }
    })
  },
  gobind:function(){
    var that=this;
    //-------------------------左边右滑
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    that.animation = animation
    animation.translateX(sc_width / 2 - 45 - 50 + 'px').step()

    that.setData({
      animationDataLeft: animation.export()
    })
    //-------------------------右边左滑
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    that.animation = animation

    animation.translateX(-(sc_width / 2 - 45 - 50) + 'px').step()

    that.setData({
      animationDataRight: animation.export()
    })
    setTimeout(function () {
      that.setData({
        right_border: 'none',
        bottom_border: 'block'
      })
    }.bind(that), 1100)
    //-------------------------下滑
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    that.animation = animation

    animation.translateY('15px').step()

    that.setData({
      animationDataDown: animation.export(),
    })
  },
  

  bindlist: function (e) {
    wx.navigateTo({
      url: '../bindlist/bindlist',
    })
  },
  unbind: function (e) {
    var that=this;
    wx.request({
      url: 'https://wttest.96066.com/app/index.php?m=user&c=api&a=un_bind',
      data: {
        "id": bind_id,
        "rdkey": wx.getStorageSync('rdkey'),
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        // success

        //判断返回值
        if (res.data.code == 1) {
          that.setData({
            right_border: 'block',
            bottom_border: 'none'
          })

          //-------------------------左边右滑
          var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
          })

          that.animation = animation
          animation.translateX(-(sc_width / 2 - 45 - 50) +65 +'px').step()

          that.setData({
            animationDataLeft: animation.export()
          })
          //-------------------------右边左滑
          var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
          })

          that.animation = animation

          animation.translateX((sc_width / 2 - 45 - 50) -65+ 'px').step()

          that.setData({
            animationDataRight: animation.export()
          })
          // setTimeout(function () {
          //   
          // }.bind(that), 1100)
          //-------------------------下滑
          var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
          })
          that.animation = animation

          animation.translateY('-15px').step()

          that.setData({
            animationDataDown: animation.export(),
          })
        }else{
          wx.showModal({
            title: '解绑错误',
            content: res.data.msg,
          })
        }
      }})
  },

  // }
})
