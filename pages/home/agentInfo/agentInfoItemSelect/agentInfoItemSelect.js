var network = require("../../../../utils/network.js");
var app = getApp();
Page({
  data: {
    nextname:'',
    nexttotal: '',
    xyjmtotal: '',
  },
  onLoad: function (options) {
    var that = this;
    network.tokenExp(function () {
      that.getNext()
      that.getXmjm()
    });
    
  },
  getNext: function () {
    var that = this;
    network.POST({
      url: 'v15/agent/next-area',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            nextname: res.data.data[0].item.ptype,
            nexttotal: res.data.data[0].item.pcount,
          })
        } else {

          wx.showToast({
            title: res.data.message,
            image: '../../../../images/error.png',
            duration: 1000
          });

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
  getXmjm: function () {
    var that = this;
    network.POST({
      url: 'v15/agent/fifty-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": 1,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            xyjmtotal: res.data.data[0].count,
          })
        } else {

          wx.showToast({
            title: res.data.message,
            image: '../../../../images/error.png',
            duration: 1000
          });

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
  tz_qyxj: function () {
    var that = this;
    if (that.data.nexttotal == 0) {
      wx.showToast({
        title: '暂无数据',
        image: '../../../../images/error.png',
        duration: 1000
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/home/agentInfo/agentInfoQyxj/agentInfoQyxj',
      })
    }

  },
  tz_xyjm:function(){
    var that = this;
    if (that.data.xyjmtotal == 0) {
      wx.showToast({
        title: '暂无数据',
        image: '../../../../images/error.png',
        duration: 1000
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/home/agentInfo/agentInfoXyjm/agentInfoXyjm',
      })
    }
    
  }

})