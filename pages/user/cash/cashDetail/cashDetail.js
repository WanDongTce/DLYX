var network = require("../../../../utils/network.js");
var app = getApp();
Page({
  data: {
    cashid:'',
    list: ''
  },
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      cashid: options.cashid
    })
    var that=this;
    network.tokenExp(function () {
      that.getList();
    });
    
  },
  getList: function () {
    var that = this;
    network.POST({
      url: 'v15/be-cash/cash-detail',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "id": that.data.cashid,
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            list:res.data.data[0].item
          })
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
  onShow: function () {

  },

})