//app.js
App({
  onLaunch: function () {
    //验证用户登录，未登录去登录
var that=this;
    // wx.checkSession({
    //   success: function (res) {
    //     //session 未过期，并且在本生命周期一直有效
    //    console.log(wx.getStorageSync('rdkey'))
    //    if (!wx.getStorageSync('rdkey')){
    //      that.Wxlogin();
    //    }
    //   },
    //   fail: function () {
    //     //登录态过期
    //     //重新登录
    //     that.Wxlogin();
    //   }
    // })

  },
  //登录方法
  Wxlogin:function(){
    console.log("这里是第" + this.globalData.num+1 +"次");
    wx.login({
      success: function (recode) {
        if (recode.code) {
          var code = recode.code;
          
          //获取用户信息
          wx.getUserInfo({
            success: function (res) {
              //把加密字符串传入服务端注册登录
              var warning = {
                '41001': 'encodingAesKey 非法',
                '41003': 'aes 解密失败',
                '41004': '解密后得到的buffer非法',
                '41005': 'base64加密失败',
                '41016': 'base64解密失败',
                '41002': 'iv参数错误',
                '200': '登录成功',
                '102': '登录失败',
                '103': 'encryptedData参数空',
                '104': 'sessionKey参数空',
                '105': 'iv参数空',
                '108': 'code无效',
              };
              wx.request({
                // url: 'https://wttest.96066.com/app/index.php?m=wx&c=api&a=smallLogin&s=a',
                url: 'https://wttest.96066.com/app/index.php?m=wx&c=api&a=smallLogin',
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  encryptedData: res.encryptedData,
                  // rdkey: wx.getStorageSync('rdkey'),
                  iv: res.iv,
                  code:code,
                },
                
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                // header: {}, // 设置请求的 header
                success: function (success) {
                  // success
                  console.log(success.data);
                  if (success.data>0) {
                    var code = parseInt(success.data);
                    var message = warning[code];
                    wx.showModal({ content: message });
                  } else {
                    //写入缓存
                    wx.setStorage({
                      key: "rdkey",
                      data: success.data
                    })
                    // wx.showModal({ content: "登录成功" });
                  }
                },
                fail: function (res) {
                  // fail
                  console.log(res);
                },
              })

            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
//获取用户信息
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getUserInfo({//获取用户信息
        success: function (res) {
          that.globalData.userInfo = res
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      });
      //将用户信息写入缓存中
      // wx.setStorage({
      //   key: "userinfo",
      //   data: this.globalData.userInfo
      // })

    }
    //获取经纬度
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.globalData.location = res

        var latitude = res.latitude//纬度
        var longitude = res.longitude//经度
        var speed = res.speed//速度，浮点数，单位m/s
        var accuracy = res.accuracy//位置的精确度
        // 使用微信内置地图查看位置
        // wx.openLocation({
        //   latitude: latitude,
        //   longitude: longitude,
        //   scale: 28
        // })


      }

    })
  },

  globalData: {
    userInfo: null,
    openid: null,
    location: null,
    num:0,
  },


})