var network = require("../../../../utils/network.js");
var md5 = require("../../../../utils/md5.js")
var app = getApp();
Page({
  data: {
    array: [],    
    index: 0,
    arraynew: [],
    fenleilist: '',
    feileiid: '',
    price:1000,

    isFocus: true,
    wallets_password_flag: false//密码输入遮罩
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,     
    })    
    for (var i = 0; i < this.data.arraynew.length; i++) {
      if (i == this.data.index) {
        this.setData({
          feileiid: this.data.arraynew[i]
        })
      }
    }
    console.log(this.data.feileiid)
  },
  //输入金额事件
  txje: function (e) {
    var txje_show = e.detail.value
    //输入格式（小数点后1位）
    txje_show = txje_show.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符     
    txje_show = txje_show.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的     
    txje_show = txje_show.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    txje_show = txje_show.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');//只能输入一个小数     
    if (txje_show.indexOf(".") < 0 && txje_show != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额    
      txje_show = parseFloat(txje_show);
      this.setData({
        txje: txje_show
      })
    }
    this.setData({
      txje: txje_show
    })
  },
  //点击提交
  submit: function (e) {
    console.log(this.data.feileiid)
    
    
      var that = this;
      //console.log(e.target.dataset.txtype)
     //提交 
      

    

  },
  allcash:function(){
    var that=this;
    that.setData({
      txje:that.data.price
    })
  },
  getAddrList: function () {
    var that = this;
    network.POST({
      url: 'v15/bank-card/index',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
         

          var array = [];
          var arraynew = [];
          for (var i = 0; i < res.data.data[0].list.length; i++) {
            array.push(
              res.data.data[0].list[i].bank_belong 
              +'（'
              + res.data.data[0].list[i].bank_number.substr(res.data.data[0].list[i].bank_number.length - 4)
              +'）'
              +' '
              + res.data.data[0].list[i].bank_username              
            )
            arraynew.push(
              res.data.data[0].list[i].id
            )
          }
          // console.log(array)
          // console.log(arraynew)
          that.setData({
            fenleilist: res.data.data[0].list,
            array: array,
            arraynew: arraynew,
            feileiid: arraynew[0]
          })
          // console.log(arraynew[0])    

        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../../../images/error.png',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          image: '../../../../images/error.png',
          duration: 1000
        })
      }
    });

  },
  onLoad: function (options) {
    var that = this;
    // console.log(options)
    that.setData({
      price: options.price
    })
    
  },
  onShow: function (options) {
    var that = this;
    network.tokenExp(function () {
      that.getAddrList()
    });
    
  },
  //忘记密码
  newforgetp: function () {
    wx.navigateTo({
      url: '/pages/user/inforModify/txPassword/txPassword',
    })
  },
  set_wallets_password(e) {//获取钱包密码
    this.setData({
      wallets_password: e.detail.value
    });
    //console.log(this.data.wallets_password)
    if (this.data.wallets_password.length == 6) {
      var that=this;
      //密码长度6位时，自动验证钱包支付结果
      network.POST({
        url: 'v15/be-cash/apply-cash',
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "id": that.data.feileiid,
          "price": that.data.txje,
          "password": md5.hexMD5(that.data.wallets_password),
        },
        success: function (res) {
          // console.log(res);
          wx.hideLoading();
          if (res.data.code == 200) {
            wx.navigateBack({

            })
          } else {           
            wx.showModal({
              title: '提示',
              content: res.data.message,
              confirmColor: '#ED1B1A',
              success: function (res) {                
              }
            })
            
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showToast({
            title: '服务器异常',
            image: '../../../../images/error.png',
            duration: 1000
          })
        }
      });
    }
  },
  set_Focus() {//聚焦input
    //console.log('isFocus', this.data.isFocus)
    this.setData({
      isFocus: true
    })
  },
  set_notFocus() {//失去焦点
    this.setData({
      isFocus: false
    })
  },
  close_wallets_password() {//关闭钱包输入密码遮罩
    this.setData({
      isFocus: false,//失去焦点
      wallets_password_flag: false,
      wallets_password: '',
    })
  },
  pay: function (e) {

    var regtxje = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
    if (this.data.txje == '') {
      wx.showModal({
        title: '提示',
        content: '请输入提现金额',
      })
    }
    else if (!regtxje.test(this.data.txje)) {
      wx.showModal({
        title: '提示',
        content: '提现金额不合法',
      })
    }
    else if (Number(this.data.txje) > Number(this.data.price)) {
      wx.showModal({
        title: '提示',
        content: '提现金额应不得大于可提现金额',
      })
    }
    else if ((Number(this.data.txje)) < 0) {
      wx.showModal({
        title: '提示',
        content: '提现金额不得少于0元',
      })
    }
    else {
      var that = this;
      //console.log(e.target.dataset.txtype)
      that.setData({
        wallets_password_flag: true,
        isFocus: true,
        txtype: e.target.dataset.txtype,
      })
    }

  }
})