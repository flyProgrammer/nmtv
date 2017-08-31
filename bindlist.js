var app = getApp();
var id;
var new_add= true;
Page({
  data: {
    adarr: [],
    flag: "false",
    aNo: "",
    showView: true,
    re: [],
    array: [],
    idx: 0,
    ide: '',
    sel: 1,
    new_add:'',
    add_image:'/utils/images/pl.png'
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://wttest.96066.com/app/index.php?m=user&c=api&a=bind_list',
      data: {
        "account_no": this.data.aNo,
        "rdkey": wx.getStorageSync('rdkey'),
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res);
        console.log(11111);
        if(res.data.code==1){
          new_add=false,
          that.setData({
            adarr: res.data.bind_list,
            new_add: 'color:#999',
            add_image: '/utils/images/p2.png'
          })
        }
      }
    })
  },

  show: function () {
    if(!new_add){
      return;
    }
    this.setData({ flag: "" });
    console.log();
  },

  cancel: function () {
    this.setData({ flag: "false" });
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
        if (res.data.code == 0) {
          wx.showModal({
            content: res.data.msg
          })
          var binduser = res.data;
          console.log(binduser);
          // 如果代码执行到这里表示返回值正确
          // 存入缓存,由于小程序缓存会被覆盖，所以，需要先获取原来的缓存
          // 获取原来的缓存
          that.setData({
            flag: "false"
          })
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
          //写入缓存
          wx.setStorage({
            key: 'userinfo',
            data: userinfo,
          })
        }
        wx.navigateBack()
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

  //对选中状态下的地址进行高亮
  choseTxtColor: function (e) {
    console.log(e);
    console.log(555);
    var id = e.currentTarget.dataset.id;
    var that = this;
    that.setData({
      idx: id,
    });

    var is_se = 0;

    wx.showModal({
      title: '选中该地址作为缴费地址',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://wttest.96066.com/app/index.php?m=user&c=api&a=select_bind',
            data: {
              "id": id,
              "rdkey": wx.getStorageSync('rdkey'),
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            success: function (res) {
              console.log(res);
              //判断是否绑定成功
              if (res.data.code == 1) {
                  that.onLoad();
                 // var is_se=1; 
                wx.request({
                  url: 'https://wttest.96066.com/app/index.php?m=user&c=api&a=bind_list',
                  data: {
                    "id": id,
                    "rdkey": wx.getStorageSync('rdkey'),
                  },
                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  success: function (res) {
                    console.log(res);
                    console.log(123456);
                   if(res.data.array.is_select == 1){
                    // that.setData({ //更新绑定列表
                    //   adarr: res.data.bind_list
                    // })
               
                  //   if (is_select==1){
                  //   wx.setStorage({
                  //     key: 'huancun',
                  //     data: res.data.bind_list,
                  //   })
                  //   console.log('huancun');
                  //   console.log(2356);
                  // }
                  // }
                  }
                }
              })
            }
            }
           })
        } else if (res.cancel) {
        }
      }
     })
  },

  //进行信息删除的操作时的高亮以及删除操作的进行
  deleteMsg: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    that.setData({
      ide: id,
    });
    wx.showModal({
      title: '是否确认删除',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://wttest.96066.com/app/index.php?m=boss&c=api&a=deleteBindUser',
            data: {
              "id": that.data.ide,
              "rdkey": wx.getStorageSync('rdkey'),
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            success: function (res) {
              console.log(res);
              console.log(789789);
              if (res.data.code == 0) {
                wx.showModal({
                  title: res.data.msg,
                })
              }
              that.onLoad();
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
}) 