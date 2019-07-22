// pages/news/news.js
var network = require("../../utils/network.js");
var app = getApp();
var page = 1;
var hasmore = null;
Page({
  data: {
    showEmpty: false,
    list: '',
  },
  onLoad: function (options) {
    this.empty = this.selectComponent("#empty");
    
  },
  onShow: function () {
    var that = this;
    network.tokenExp(function () {
      that.getList(false)
    });
  },
  getList: function (contaFlag) {
    var that = this;
    network.POST({
      url: 'v14/news/list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "newstype": 2,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {

          var a = res.data.data[0].list;
          if (contaFlag) {
            a = that.data.list.concat(a);
          }
          that.setData({
            list: a,
            showEmpty: a.length == 0 ? true : false
          });
          hasmore = res.data.data[0].hasmore

        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../../images/error.png',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          image: '../../../images/error.png',
          duration: 1000
        })
      }
    });
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.list.length > 0) {
      if (hasmore) {
        page++;
        that.getList(true);
      } else {
        wx.showToast({
          title: '没有更多了',
          image: '../../images/error.png',
          duration: 1000
        })
      }
    }
  },
  onUnload: function () {
    page = 1;
    hasmore = '';
    this.setData({
      showEmpty: false
    });
  },
  //跳转到新闻
  tz_webview: function (e) {
    // var newssrc = e.currentTarget.dataset.src;
    // if (newssrc.indexOf("?") != -1) {
    //   newssrc = newssrc.split("?")[0];

    // }
    // wx.navigateTo({
    //   url: '/pages/webView/webView?newssrc=' + newssrc + '&newsid=' + e.currentTarget.dataset.newsid,
    // })
    wx.navigateTo({
      url: '/pages/news/newsDetail/newsDetail?id=' + e.currentTarget.dataset.newsid
    })
  },
})