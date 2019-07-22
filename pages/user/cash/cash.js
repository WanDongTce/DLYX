// pages/user/cash/cash.js
var network = require("../../../utils/network.js");
var app = getApp();
var page = 1;
var hasmore = null;
Page({
  data: {
    list:'',
    availableprice: '',
    cardnum: '',
  },
  onLoad: function (options) {

  },
  onShow: function () {
    var that=this;
    network.tokenExp(function () {
      that.getCard();
      that.getList(false)
    });
    
  },
  getList: function (contaFlag){
    var that=this;
    network.POST({
      url: 'v15/be-cash/show-cash',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
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
            availableprice: res.data.data[0].availableprice
          });
          hasmore = res.data.data.hasmore

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
          image: '../../../images/error.png',
          duration: 1000
        })
      }
    }
  },
  onUnload: function () {
    page = 1;   
    hasmore = null;    
  },
  getCard:function(){
    var that = this;
    network.POST({
      url: 'v15/bank-card/index',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            cardnum: res.data.data[0].list.length           
          });
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/error.png',
            duration: 1000
          });
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          image: '../../images/error.png',
          duration: 1000
        })
      }
    });
  },
  tz_cash: function () {
    console.log(app.userInfo.is_paypwd)
    var that=this;
    if (that.data.cardnum==0) {
      wx.showModal({
        title: '提示',
        content: '未绑定银行卡！',
        confirmText: '前往设置',
        confirmColor: '#ED1B1A',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/user/inforModify/addbankcard/addbankcard',
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
          
        }
      })
    }
    else if (app.userInfo.is_paypwd == 2) {
      wx.showModal({
        title: '提示',
        content: '设置提现密码可有效保护您的财产安全，请设置提现密码！',
        confirmText: '前往设置',
        confirmColor: '#ED1B1A',
        
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/user/inforModify/txPassword/txPassword',
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
          
        }
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/user/cash/applyCash/applyCash?price=' + that.data.availableprice,
      })
    }
    
  },
  tz_detail: function (e) {
    wx.navigateTo({
      url: '/pages/user/cash/cashDetail/cashDetail?cashid=' + e.currentTarget.dataset.cashid,
    })
  },

})