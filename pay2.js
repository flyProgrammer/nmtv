var program_id='';
var month;
var par_sc_no='';
var order_id='';
Page({
  data: {
    userinfo: [],
    userInfo: [],
    month: '',
    aNo: '请选择您的智能卡号',
    name: '',
    addr: '',
    showView3: true,
    orderid:'',
    tctype:''
  },
  onLoad: function (res) {
    console.log(res);
    console.log()
    var that = this;
    program_id = res.program_id;
    month=res.month;
    that.setData({
      month: month,
      tctype: res.type
    })
    var key = wx.getStorageSync("rdkey");
    wx.request({
      url: 'https://wttest.96066.com/app/index.php?m=boss&c=api&a=checkBind',
      data: {
        "rdkey": wx.getStorageSync('rdkey'),
        "small": "small"
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res);
        console.log(258);
        that.setData({
          addr: res.data.userinfo.address_name,
          name: res.data.userinfo.contact_person,
          userInfo: res.data.userinfo.sc_no[0]
        })
        wx.setStorage({
          key: 'userinfo',
          data: res.data.userinfo,
        })
      },
      fail: function (res) {
        // fail
        console.log(1);
      },
      complete: function (res) {
        // complete
        console.log(1);
      }
    })
  },
  //显示智能卡号下拉菜单
  showCountno: function () {
    this.setData({
      showView3: (!this.data.showView3),
    })
  },
  //改变智能卡号
  numSelect: function (e) {
    //获取选中的智能卡号
    var sc_no = e.target.dataset.me;
    par_sc_no = sc_no;
    var userinfo = wx.getStorageSync('userinfo');

    //改变前端显示
    this.setData({
      name: userinfo.contact_person,
      addr: userinfo.address_name,
      aNo: sc_no,
      // msg: userMsg,
      showView3: (!this.data.showView3), //收起下拉列表
      id: sc_no,//改变选中颜色
    })
  },
  //提交并结算
  create_order:function(){
    var that = this;
    wx.request({
      url: 'https://wttest.96066.com/app/index.php?m=boss&c=api&a=generate_order',
      data: {
        "rdkey": wx.getStorageSync('rdkey'),
        "program_id": program_id,
        'total':month,
        'sc_no': par_sc_no
      },
      method: 'GET',
      dataType: '',
      success: function (res) {
        if (res.data.code == 1) {
          order_id = res.data.order_id;
          that.submit();
        }else{
          wx.showModal({
            title:'提示',
            content: res.data.msg
          });
        }
      }
    })
  },

  submit: function () {
    var that = this;
    wx.request({
      url: 'https://wttest.96066.com/app/index.php?m=pay&c=api&a=SmallPayOrder',
      // url: 'http://localhost/Wxpay/example/jsapi.php',
      data: {
        "rdkey": wx.getStorageSync('rdkey'),
        "order_id": order_id
      },
      method: 'GET',
      dataType: '',
      success: function (res) {
        console.log(res);
        console.log(525252);
        if(res.data.code==0){
          console.log(res);return;
          wx.showModal({
            title: res.data.msg
          })
          return;
        }
        var msg=res.data.pay_key;
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
          },
          fail: function (res) {
            console.log("出现签名错误，可能是由于加密的key出现问题")
            console.log(32323232);
          },
          complete: function (res) { }
        })
      }
    })
  },

  //将选中的地址、智能卡号、客户名称存入到缓存
  //   wx.setStorage({
  //     key: 'orderPay',
  //     data: [this.data.aNo, this.data.addr, this.data.name],
  //   })
  // },

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