// pages/wechat/wechat.js
var app = getApp()
var globalData = getApp().globalData
var user_type='1';
var program_code;
var sc_no='';
var check='';
Page({
  data: {
    userinfo: [],
    userInfo: [],
    intelno: [],
    userLogin: [],
    array: [],
    arr: [],
    key: [],
    aNo: "",
    showLoading: false,
    showView: true,
    showView2: true,
    showView3: true,
    Business: '有线数字基本包套餐',
    addr: '请选中您的地址',
    id: 1,
    id1: 1,
    id2: 1,
    id4:1,
    month: 12,
    aNo: '请选择您的智能卡号',
    name: '***',
    msg: [],
    flag:true,
    flag1: true,
    flag2: true,
    flag3: true,
    tcNo:'',
    checkView:'',
    add_style:'none',
    customer_style:'none',
    account_type:'none',
    pay_type1:'none',
    pay_type2: 'none',
    pay_type: 'none',
    pay_business: 'none',
    wire:'none',
    wireless:'none',
    kuandai:'none',
    sel_one:'none',
    selected1:1,
    selected2: 1,
    selected3: 2,
    selected4: 1,
    aa:'数字电视基本包套餐',
    bb:'广电宽带20M包月续费套餐',
    cc:'无线数字电视基本包套餐',
    scNo:'',
  },
  
  onShow: function (options) {
    app.Wxlogin();
    // this.checkBind();
  },

  //检查用戶是否已經綁定智能卡號
  checkBind: function () {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      showLoading: true
    })
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function () {
    //   // console.log(app.globalData)
    //   var that = this;
    //   });
    var key = wx.getStorageSync("rdkey");
    if (key && typeof key == 'string') {
      wx.request({
        url: 'https://wttest.96066.com/app/index.php?m=boss&c=api&a=checkBind',
        data: {
          "rdkey": wx.getStorageSync('rdkey'),
          "small": "small"
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          check = res.data.code;
          that.setData({
            showLoading: false,
            checkView: check
          })
          console.log(res.data.code);
          if (res.data.code == 1){
          } else if (res.data.code == 2){
            that.setData({
              add_style: 'none',
              customer_style: 'none',
              account_type: 'none',
              pay_type: 'none',
              pay_business: 'none',
            })
          } else {
            wx.showModal({
              content: '系统错误',
            })
            that.setData({
              showLoading: false
            })
          }
          console.log(res);
          //把用户信息这个数组存到stora中
          var stora = res.data.userinfo;
          var tcno = stora.terminal_no[0];
          //将用户信息写入缓存中
          wx.setStorage({
            key: "userinfo",
            data: res.data.userinfo == "" ? 'null' : res.data.userinfo,
          })
          //处理二维数组
          var array = [];
          //   for (var  x in stora)
          //   {
          //    var infos= JSON.parse(stora[x]['infos']);
          //    console.log(infos);
          //    array[x]['sc_no'] = infos['sc_no'];
          //     array[x]['name'] = stora[x]['contact_person'];
          //     array[x]['sm_name'] = infos.sm_name;
          //     array[x]['address'] = infos.address;
          //   }
          array = stora['sc_no'][0];
          that.setData({
            userinfo: res.data.userinfo,//用户信息
            userInfo: array,//转换后的用户信息
            tcNo: stora.terminal_no[0]
          })
        },
        fail: function (res) {
          // fail
          that.setData({
            showLoading: false
          })
          console.log(1);
        },
        complete: function (res) {
          that.setData({
            showLoading: false
          })
          // complete
          console.log(res);
        }
      })
    }
  },

  onReady: function () {
    // 页面渲染完成
  },
  
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  
  onLoad: function () {
    // 页面显示
  },
  //显示智能卡号下拉菜单
  showCountno: function () {
    var sv3 = this.data.showView3
    if (sv3) {
      this.checkBind();
    }
    this.setData({
      showView3: (!sv3),
    })
  },

  //重新输入智能卡号
  no:function(){
    this.setData({
      flag:true
    })
  },

  //失焦获取智能卡号并对智能卡好的合理性进行判断
  getAc_no:function(e){
    sc_no=e.detail.value;
    if (sc_no==''){
      wx.showModal({
        title: '智能卡错误',
        content: '卡号不能为空',
      })
    } else{
      console.log('智能卡号为：' + sc_no);
      this.setData({
        scNo: sc_no,
        // flag: "false"
      })}
  },
  //改变智能卡号
  numSelect: function (e) {
    //获取选中的智能卡号
    if (e.target.dataset.me!=undefined)
    sc_no = e.target.dataset.me;
    var that=this;
    wx.request({
      url: 'https://wttest.96066.com/app/index.php?m=boss&c=api&a=getBookNo',
      data: {
        "rdkey": wx.getStorageSync('rdkey'),
        "small": "small",
        "sc_no": sc_no
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res);
        console.log(333);
        if(res.data.code==1){
          var bookNo = res.data.userinfo.book_no;
          that.setData({
            add_style:'flex',
            customer_style:'flex',
            account_type:'flex',
            pay_business:'flex'
          })
          wx.setStorage({
            key: "userinfo",
            data: res.data.userinfo == "" ? 'null' : res.data.userinfo,
          })
          bookNo=bookNo.split('')[0];
          if (bookNo == '0' || bookNo =='1') {//手册号首位为0,1则表示是有线和宽带
            that.sel_wire();
            that.setData({
              pay_type1: 'flex',
              pay_type2: 'flex',
              pay_type: 'none',
              wire: 'flex'
            })
          } else if (bookNo == '2' || bookNo == '3') {//手册号首位为2,3则表示是无线
            that.sel_wireless();
            that.setData({
              pay_type1: 'none',
              pay_type2: 'none',
              pay_type: 'flex',
              wireless: 'flex'
            })
          }
        }else{
          wx.showModal({
            title: '错误提示',
            content: res.data.msg,
          })
        } 
        },
      fail:function(res){
      }

      })

    var userinfo = wx.getStorageSync('userinfo');
    //改变前端显示
    if(check==2){
      this.setData({
        name: userinfo.contact_person,
        addr: userinfo.address_name,
        aNo: sc_no,
        // msg: userMsg,
        id: sc_no,//改变选中颜色
      })
    }else{
      this.setData({
        name: userinfo.contact_person,
        addr: userinfo.address_name,
        aNo: sc_no,
        // msg: userMsg,
        showView3: (!this.data.showView3), //收起下拉列表
        id: sc_no,//改变选中颜色
      })
    }
    //将选中的地址、智能卡号、客户名称存入到缓存
    wx.setStorage({
      key: 'orderPay',
      data: [this.data.aNo, this.data.addr, this.data.name],
    });
    
  },
  mySelect: function (e) {
    //获取选中的地址
    // console.log(e);
    // var addrs = e.target.dataset.me;
    //改变前端显示
    this.setData({
      name: userinfo.contact_person,
      addr: userinfo.address_name,
      // msg: userMsg,
     // showView3: (!this.data.showView3), //收起下拉列表
      id: sc_no,//改变选中颜色
      // addr: addrs,
      showView: (!this.data.showView), //收起下拉列表
      id: e.target.id,//改变选中颜色
    })
  },

  //显示当前账户下拉菜单
  showSelected: function () {
    this.setData({
      showView: (!this.data.showView),
    })
  },

  //显示缴费业务下拉菜单
  showBusiness: function () {
    this.setData({
      showView2: (!this.data.showView2)
    })
  },
  //选择缴费类型
  sel_wire:function(){
    user_type='1';
    this.setmeal();
    this.setData({
      selected1:2,
      selected2: 1,
      wire:'flex',
      kuandai:'none',
      wireless: 'none'
    })
  },

  sel_kd: function () {
    user_type = '2';
    this.setmonth();
    this.setData({
      selected1: 1,
      selected2: 2,
      wire: 'none',
      kuandai: 'flex',
      wireless: 'none'
    })
  },

  sel_wireless:function(){
    user_type = '1';
    this.setwireless();
    this.setData({
      selected1: 1,
      selected2: 2,
      wire: 'none',
      kuandai: 'none',
      wireless:'flex'
    })
  },

  //选择缴费业务
  wire:function(){
      this.setData({
        flag1: false
      })
  },

  kuandai: function () {
    this.setData({
      flag2: false
    })
  },

  wireless:function(){
    this.setData({
      flag3: false
    })
  },

  setmeal:function(){
    program_code ='TC000007';
    this.setData({
      selected3:2,
      selected4: 1,
      flag1: true,
      aa:'数字电视基本包套餐'
    })
  }, 

  unset: function () {
    program_code = 'TC000008';
    this.setData({
      selected3: 1,
      selected4: 2,
      flag1: true,
      aa: '数字电视基本包'
    })
  }, 

  setyear: function () {
    program_code = 'TC000006';
    this.setData({
      selected3: 2,
      selected4: 1,
      flag2: true,
      bb: '广电宽带20M包年续费套餐'
    })
  },

  setmonth: function () {
    program_code = 'TC000005';
    this.setData({
      selected3: 1,
      selected4: 2,
      flag2: true,
      bb: '广电宽带20M包月续费套餐'
    })
  }, 
    
  setwireless:function(){
    program_code = 'TC000009';
    this.setData({
      flag3: true,
      cc: '无线数字电视基本包套餐'
    })
  },

  //改变缴费业务
  business: function (e) {
    this.setData({
      Business: e.target.dataset.me,
      id1: e.target.id
    })
  },

  //选中时长
  timeSeleced: function () {
    var arr = ['3', '6', '12', '24'];
    var that = this;
    var n;
    wx.showActionSheet({
      itemList: arr,
      success: function (res) {
        var n = arr[res.tapIndex];
        that.setData({
          month: n
        })
      },
    })
  },
  
  //点击下一步，给提示，确认订单的信息
  gopay:function(){
    var that=this;
    var orderMsg = wx.getStorageSync('orderPay');
    that.setData({
       flag:false
    })
    //将缴费业务存入缓存
    //首先进行判断 选择有线 并是 基本包套餐的情况
    if ((that.data.selected1 == 2 && that.data.selected3 == 2) || (that.data.selected1 == 2 && that.data.selected4 == 2)) {
      //有线
      wx.setStorage({
        key: 'business',
        data: this.data.aa,
      });
    } else if ((that.data.selected2 == 2 && that.data.selected3 == 2) || (that.data.selected2 == 2 && that.data.selected4 == 2)) {
      //宽带
      wx.setStorage({
        key: 'business',
        data: this.data.bb,
      });
    } else {
      //无线的情况下
    }
  },
  //重新选择，返回到当前页面
  back:function(){
     wx.navigateBack();
     var that = this;
     that.setData({
       flag: true
     })
  },

  //下订单接口，生成订单
  product: function () {
    this.setData({
      flag: true
    })
    var that = this;
    var msg = wx.getStorageSync('userinfo');
    console.log(program_code + '|' + user_type);
    console.log(6666666);
    wx.request({
      url: 'https://wttest.96066.com/app/index.php?m=order&c=api&a=family_ck_to_wx_pay',
      data: {
        "rdkey": wx.getStorageSync('rdkey'),
        "terminal_no": msg.book_no,
        "month": that.data.month,
        "program_code": program_code ,
        "user_type": user_type,
        "route_type": 0
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res);
        if(res.data.code==0){
           wx.showModal({
             title: res.data.msg,
           })
        }else{
          wx.navigateTo({
            url: '/pages/pay/pay?month=' + that.data.month + '&total=' + res.data.totalp + '&id=' + res.data.id,
          })
        }
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  }
})